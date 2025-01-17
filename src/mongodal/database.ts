import { MongoClient, Db } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const connStr = process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/learning_platform';
const dbName = process.env.DB_NAME || 'learning_platform';

let db: Db | null = null;

export const getMongoDBInstance = async (): Promise<any> => {
  let conn;
  try {

    if (!db) {

      const client = new MongoClient(connStr);
      conn = await client.connect();

      if (conn) {

        let db = conn.db(dbName);
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        console.log('✅ MongoDB client is connected');
        return db;
      }
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
};