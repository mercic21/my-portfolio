import mongoose from "mongoose";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

// Reuse the connection across hot reloads and serverless invocations.
const globalForMongoose = globalThis as unknown as { mongooseCache?: Cache };
const cache: Cache = (globalForMongoose.mongooseCache ??= { conn: null, promise: null });

export async function connectDB() {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. Add it to .env.local.");

  cache.promise ??= mongoose.connect(uri, { bufferCommands: false });
  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
  return cache.conn;
}

/** Converts lean Mongoose documents into plain JSON (ObjectId/Date -> string, _id -> id). */
export function toPlain<T>(doc: unknown): T {
  return JSON.parse(
    JSON.stringify(doc, (key, value) => (key === "__v" ? undefined : value)),
    (key, value) => {
      if (value && typeof value === "object" && !Array.isArray(value) && "_id" in value) {
        const { _id, ...rest } = value;
        return { id: String(_id), ...rest };
      }
      return value;
    },
  ) as T;
}
