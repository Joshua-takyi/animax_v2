import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for the search results returned by Google Search API
interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

// Interface for the cached query documents
interface QueryProps extends Document {
  query: string; // The search query string
  results: SearchResult[]; // The cached search results
  lastUpdated: Date; // When this cache was last updated
}

const SearchResultSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  snippet: {
    type: String,
    required: true,
  },
});

const QuerySchema = new Schema<QueryProps>(
  {
    query: {
      type: String,
      required: true,
      unique: true, // Ensure we don't have duplicate queries
      index: true, // Index for faster lookups
    },
    results: {
      type: [SearchResultSchema],
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create the model, ensuring we don't recreate it if it already exists
const Query: Model<QueryProps> =
  mongoose.models.Query || mongoose.model<QueryProps>('Query', QuerySchema);

export default Query;
export type { QueryProps, SearchResult };
