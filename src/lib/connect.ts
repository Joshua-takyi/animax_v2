import mongoose from "mongoose";

/**
 * Optimized database connection function with timeout and connection pooling settings
 * Designed to work efficiently in serverless environments like Vercel
 */
const ConnectDb = async () => {
  try {
    const uri: string = process.env.MONGODB_URI || "";
    if (!uri) {
      throw new Error("MongoDB URI is missing from environment variables");
    }

    // If already connected, reuse the existing connection
    if (mongoose.connection.readyState === 1) {
      console.log("Reusing existing database connection");
      return;
    }

    // If connection is connecting, wait for it to complete
    if (mongoose.connection.readyState === 2) {
      console.log("Database connection in progress, waiting...");
      await new Promise((resolve) => {
        mongoose.connection.once("connected", resolve);
      });
      return;
    }

    // Connect with optimized settings for production performance
    await mongoose.connect(uri, {
      // Connection timeout settings
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s default
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      connectTimeoutMS: 10000, // Give up initial connection after 10s

      // Connection pool settings for better performance
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain a minimum of 2 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30s of inactivity

      // Other optimization settings
      heartbeatFrequencyMS: 10000, // Check connection health every 10s
    });

    console.log("Database connected successfully 🔥🔥");

    // Handle connection events for better debugging
    mongoose.connection.on("error", (err) => {
      console.error("Database connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Database disconnected");
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database connection failed:", error.message);
      // Don't throw the error - let the application handle graceful degradation
    } else {
      console.error("Database connection failed with unknown error:", error);
    }
    throw error; // Re-throw for the caller to handle
  }
};

export default ConnectDb;
