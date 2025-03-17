#Custom Instructions for the api route

When a user makes a request:

First, check if the query already exists in our database
Use MongoDB aggregation pipeline to search for matches between the query and document titles

If a match is found:

Return the data directly from the database
Skip using the Google Search API to save resources

If no match is found:

Use Google Search API to find the requested information
Store the results in the database for future use
Return the search results to the user

This approach:

Reduces unnecessary API calls to Google Search
Improves response times for repeated queries
Gradually builds a local cache of common search results
