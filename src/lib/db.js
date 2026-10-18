import mongoose from "mongoose";

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("MONGODB_URI is not set. Add it to .env.local to enable orders, inquiries and the admin panel.");
    this.name = "DatabaseNotConfiguredError";
  }
}

export const isDbConfigured = () => Boolean(process.env.MONGODB_URI);

// Cache the connection across hot reloads and serverless invocations.
const cache = (globalThis._mongooseCache ||= { conn: null, promise: null });

export async function connectDB() {
  if (!isDbConfigured()) throw new DatabaseNotConfiguredError();
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false, serverSelectionTimeoutMS: 8000 });
  }
  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
  return cache.conn;
}
