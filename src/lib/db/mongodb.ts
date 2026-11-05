import mongoose from 'mongoose';

/**
 * Global interface augmentation for caching Mongoose connection across Vercel serverless functions.
 * In development, hot-module-reloading (HMR) can cause multiple connections without this global cache.
 * In production serverless lambdas, this preserves the connection across warm executions.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connect to MongoDB with connection reuse and serverless hardening.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;

  if (!uri) {
    throw new Error(
      'Please define MONGODB_URI or DATABASE_URL environment variable inside .env or .env.local'
    );
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: process.env.NODE_ENV !== 'production',
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ [MongoDB] Established new connection to Atlas cluster');
      }
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      console.error('❌ [MongoDB] Connection error:', err);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
