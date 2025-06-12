import { NextResponse } from 'next/server';
import Query, { SearchResult } from '@/models/schema';
import mongoose from 'mongoose';
import ConnectDb from '@/lib/connect';

// Google Search API configuration
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX_ID = process.env.CSE_ID;

// Type definitions for Google Search API response
interface GoogleSearchItem {
  title: string;
  link: string;
  snippet: string;
}

interface GoogleSearchResponse {
  items?: GoogleSearchItem[];
}

// Timeout configuration for external API calls (8 seconds to leave buffer for other operations)
const API_TIMEOUT = 8000;

/**
 * Creates a promise that rejects after the specified timeout
 * @param ms - Timeout in milliseconds
 * @returns Promise that rejects with timeout error
 */
function createTimeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), ms);
  });
}

/**
 * Performs a fast database lookup for cached search results
 * Uses simple indexed query instead of complex aggregation for better performance
 * @param searchQuery - The search query to look for
 * @returns Promise resolving to cached result or null
 */
async function findCachedResult(searchQuery: string) {
  try {
    // First try exact match (fastest lookup using index)
    let cachedResult = await Query.findOne({ 
      query: { $regex: new RegExp(`^${searchQuery}$`, 'i') } 
    }).lean().exec();
    
    if (cachedResult) {
      return cachedResult;
    }
    
    // If no exact match, try partial match with limit to prevent slow queries
    cachedResult = await Query.findOne({ 
      query: { $regex: new RegExp(searchQuery, 'i') } 
    })
    .sort({ lastUpdated: -1 }) // Get most recent match
    .lean() // Return plain JS object for better performance
    .exec();
    
    return cachedResult;
  } catch (error) {
    console.error('Database lookup error:', error);
    return null; // Return null on error to proceed with API call
  }
}

/**
 * Stores search results in database asynchronously (non-blocking)
 * @param searchQuery - The search query
 * @param searchResults - The results to cache
 */
async function storeResultsAsync(searchQuery: string, searchResults: SearchResult[]) {
  try {
    // Use upsert to handle potential race conditions in production
    await Query.findOneAndUpdate(
      { query: searchQuery },
      { 
        query: searchQuery,
        results: searchResults,
        lastUpdated: new Date(),
      },
      { 
        upsert: true, // Create if doesn't exist
        new: true,
        lean: true, // Better performance
      }
    );
    console.log('Results cached successfully for query:', searchQuery);
  } catch (error) {
    // Don't throw error - caching failure shouldn't break the response
    console.error('Failed to cache results:', error);
  }
}

/**
 * Handles GET requests for search queries
 * Optimized for production performance with timeout handling and non-blocking operations
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

    // Connect to MongoDB with timeout handling
    if (mongoose.connection.readyState !== 1) {
      try {
        await Promise.race([
          ConnectDb(),
          createTimeoutPromise(2000) // 2 second timeout for DB connection
        ]);
      } catch (error) {
        console.error('Database connection timeout:', error);
        // If DB connection fails, proceed without cache (graceful degradation)
      }
    }

    // Check for cached results with fast lookup
    let cachedResult = null;
    if (mongoose.connection.readyState === 1) {
      cachedResult = await Promise.race([
        findCachedResult(searchQuery),
        createTimeoutPromise(1000) // 1 second timeout for cache lookup
      ]).catch((error) => {
        console.error('Cache lookup timeout:', error);
        return null; // Proceed without cache on timeout
      });
    }

    // If we found a match in our database, return the cached results immediately
    if (cachedResult && cachedResult.results && cachedResult.results.length > 0) {
      console.log('Cache hit! Returning results from database for query:', searchQuery);
      return NextResponse.json({
        results: cachedResult.results,
        fromCache: true,
        query: cachedResult.query,
      });
    }

    // If we don't have cached results, call the Google Search API with timeout
    console.log('Cache miss! Fetching from Google Search API for query:', searchQuery);

    // Verify API keys are available
    if (!GOOGLE_API_KEY || !GOOGLE_CX_ID) {
      console.error('Missing API configuration');
      return NextResponse.json({ 
        error: 'Search service temporarily unavailable',
        results: [], // Return empty results instead of error
        fromCache: false,
        query: searchQuery 
      }, { status: 200 }); // Return 200 with empty results for better UX
    }

    // Construct Google Search API URL with site-specific search for Telegram
    const googleSearchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX_ID}&q=${encodeURIComponent(
      searchQuery + ' site:t.me'
    )}&num=10`; // Limit to 10 results for faster response

    // Make API call with timeout handling
    const response = await Promise.race([
      fetch(googleSearchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AnimaxSearchBot/1.0'
        }
      }),
      createTimeoutPromise(API_TIMEOUT)
    ]);

    if (!response.ok) {
      console.error(`Google API error: ${response.status} - ${response.statusText}`);
      
      // Handle rate limiting gracefully
      if (response.status === 429) {
        return NextResponse.json({
          results: [],
          fromCache: false,
          query: searchQuery,
          error: 'Daily search limit reached. Please try again later.'
        }, { status: 200 });
      }
      
      return NextResponse.json({
        results: [],
        fromCache: false,
        query: searchQuery,
        error: 'Search service temporarily unavailable'
      }, { status: 200 });
    }

    const data: GoogleSearchResponse = await response.json();

    // Extract and format search results with better error handling
    const searchResults: SearchResult[] = [];
    
    if (data.items && Array.isArray(data.items)) {
      data.items.forEach((item: GoogleSearchItem) => {
        // Validate each item has required properties
        if (item.title && item.link && typeof item.snippet === 'string') {
          searchResults.push({
            title: item.title,
            link: item.link,
            snippet: item.snippet,
          });
        }
      });
    }

    // Store results in database asynchronously (non-blocking)
    // This runs in the background and doesn't delay the response
    if (mongoose.connection.readyState === 1 && searchResults.length > 0) {
      // Fire and forget - don't await this operation
      storeResultsAsync(searchQuery, searchResults).catch((error) => {
        console.error('Background caching failed:', error);
      });
    }

    // Return the search results immediately without waiting for database write
    return NextResponse.json({
      results: searchResults,
      fromCache: false,
      query: searchQuery,
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    // Safely extract query from request URL for error responses
    let queryFromUrl = '';
    try {
      const url = new URL(req.url);
      queryFromUrl = url.searchParams.get('q') || '';
    } catch {
      // If URL parsing fails, use empty string
      queryFromUrl = '';
    }
    
    // Provide detailed error information for debugging while maintaining user-friendly messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    if (errorMessage.includes('timeout')) {
      return NextResponse.json({
        results: [],
        fromCache: false,
        query: queryFromUrl,
        error: 'Search request timed out. Please try again.'
      }, { status: 200 });
    }
    
    return NextResponse.json({
      results: [],
      fromCache: false,
      query: queryFromUrl,
      error: 'Search service temporarily unavailable'
    }, { status: 200 });
  }
}
