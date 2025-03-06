import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cachedDb: Connection | null = null;

export default async function dbConnect() {
  if (cachedDb) {
    return cachedDb;
  }

  const db = await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000, // 30 seconds
  });

  cachedDb = db.connection;
  return db;
}
