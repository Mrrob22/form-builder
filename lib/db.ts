import mongoose from 'mongoose';

let cached = (global as any).mongoose as {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};
if (!cached) cached = (global as any).mongoose = { conn: null, promise: null };

export async function dbConnect() {
    if (cached.conn) return cached.conn;

    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');

    if (!cached.promise) {
        cached.promise = mongoose.connect(uri).then((m) => m);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
