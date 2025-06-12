// FOR TESTING THE API ENDPOINT
import ConnectDb from "@/lib/connect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await ConnectDb();
    }
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection is not established.");
    }

    const { name, email } = await request.json();
    if (!name || !email) {
      return NextResponse.json({ message: "All fields are required" });
    }
    const users = {
      name,
      email,
    };

    const data = await db.collection("users").insertOne(users);
    return NextResponse.json({ message: "User created successfully", data });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
