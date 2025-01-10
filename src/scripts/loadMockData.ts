import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { IUserModel } from '../models/UserModel';
import { MongoClient } from 'mongodb';
import { all } from 'axios';

dotenv.config();

const loadMockData = async () => {
  let client: MongoClient | null = null;
  try {
    // Connect to database
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/learning_platform';
    client = new MongoClient(uri);
    await client.connect();
    const database = client.db('learning_platform');
    const collection = database.collection('test');

    console.log('✅ MongoDB client is connected');

    // Create unique indexes on name and email fields
    await collection.createIndex({ name: 1 }, { unique: true });
    await collection.createIndex({ email: 1 }, { unique: true });

    console.log('✅ Unique indexes created on name and email fields');

    // Read CSV file
    console.log('📖 Reading CSV file...');

      const allData = await readCSVData();

      await collection.insertMany(allData);

      console.log('✅ Mock data inserted into database');
  } catch (error) {
    console.error('❌ Error loading mock data:', error);
    if (client) {
      await client.close();
    }
  }
}

const readCSVData = (): Promise<IUserModel[]> => {
  return new Promise((resolve, reject) => {
    let allData: IUserModel[] = [];
    fs.createReadStream(path.join(__dirname, '../../Mock_Data.csv'))
      .pipe(csv({
        headers: ['name', 'email', 'password', 'role'],
        skipLines: 1 // Skip the header row
      }))
      .on('data', (data: IUserModel) => {
        if (data.name !== 'name') { // Additional check to ensure header isn't included
          console.log('📝 Processing row:', data);
          allData.push(data);
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        resolve(allData);
      })
      .on('error', (error) => {
        console.error('Error processing CSV file:', error);
        reject(error);
      });
  });
};

loadMockData().catch(console.dir);