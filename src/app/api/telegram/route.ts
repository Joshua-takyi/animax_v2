import { NextResponse } from 'next/server';
import Query, { SearchResult } from '@/models/schema';
import mongoose from 'mongoose';
import ConnectDb from '@/lib/connect';

// Google Search API configuration
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX_ID = process.env.CSE_ID;

/**
 * Handles GET requests for search queries
 * First checks database cache, then falls back to Google Search API if needed
 */
export async function GET(req: Request) {
  try {
    // Extract the search query from URL parameters
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get('q');

    // Validate search query
    if (!searchQuery) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await ConnectDb();
    }
    // Use MongoDB aggregation pipeline for more powerful text matching
    const cachedResult = await Query.aggregate([
      // First stage: Text search on query field
      {
        $match: {
          $or: [
            { query: { $regex: new RegExp(searchQuery, 'i') } },
            // Also check for partial matches in result titles
            { 'results.title': { $regex: new RegExp(searchQuery, 'i') } },
          ],
        },
      },
      // Second stage: Add a score field based on match relevance
      {
        $addFields: {
          relevanceScore: {
            $cond: {
              if: { $eq: [{ $toLower: '$query' }, searchQuery.toLowerCase()] },
              then: 10, // Exact match gets highest score
              else: {
                $cond: {
                  if: {
                    $regexMatch: {
                      input: { $toLower: '$query' },
                      regex: new RegExp('^' + searchQuery.toLowerCase()),
                    },
                  },
                  then: 5, // Starts with query gets medium score
                  else: 1, // Partial match gets lowest score
                },
              },
            },
          },
        },
      },
      // Third stage: Sort by relevance score
      { $sort: { relevanceScore: -1 } },
      // Fourth stage: Limit to the most relevant result
      { $limit: 1 },
    ]).exec();

    // If we found a match in our database, return the cached results
    if (cachedResult && cachedResult.length > 0) {
      console.log('Cache hit! Returning results from database');
      return NextResponse.json({
        results: cachedResult[0].results,
        fromCache: true,
        query: cachedResult[0].query,
      });
    }

    // If we don't have cached results, call the Google Search API
    console.log('Cache miss! Fetching from Google Search API');

    // Verify API keys are available
    if (!GOOGLE_API_KEY || !GOOGLE_CX_ID) {
      return NextResponse.json({ error: 'Search API configuration is missing' }, { status: 500 });
    }

    // Call Google Custom Search API
    const googleSearchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX_ID}&q=${encodeURIComponent(
      searchQuery
    )}`;
    const response = await fetch(googleSearchUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch results from search API' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract and format search results
    const searchResults: SearchResult[] =
      data.items?.map((item: { title: string; link: string; snippet: string }) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      })) || [];

    // Store the results in our database for future use
    await Query.create({
      query: searchQuery,
      results: searchResults,
      lastUpdated: new Date(),
    });

    // Return the search results to the user
    return NextResponse.json({
      results: searchResults,
      fromCache: false,
      query: searchQuery,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
