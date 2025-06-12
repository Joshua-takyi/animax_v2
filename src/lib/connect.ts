import mongoose from "mongoose";

const ConnectDb = async () => {
  try {
    const uri: string = process.env.MONGODB_URI || "";
    if (!uri) {
      throw new Error("MongoDB URI is missing");
    }
    await mongoose.connect(uri);
    console.log("connected 🔥🔥");
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error: ", error.message);
    }
  }
};

export default ConnectDb;
