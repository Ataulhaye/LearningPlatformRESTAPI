import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { User } from '../models/userModel';
import { Request, Response } from 'express';
import { register } from '../controllers/authController';

const loadMockData = async () => {
  try {
    // Read CSV file
    console.log('📖 Reading CSV file...');

      const allData = await readCSVData();

      for (const userData of allData) {
        const request = {body: userData} as Request;
        const res = {
          status: (statusCode: number) => ({
            json: (responseBody: any) => {
              console.log(`Response status: ${statusCode}`, responseBody);
            }
          })
        } as Response;
        await register(request, res);
      }
      console.log('✅ Mock data inserted into database');
  } catch (error) {
    console.error('❌ Error loading mock data:', error);
  }
}

const readCSVData = (): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    let allData: User[] = [];
    fs.createReadStream(path.join(__dirname, '../../Mock_Data.csv'))
      .pipe(csv({
        headers: ['name', 'email', 'password', 'role'],
        skipLines: 1 // Skip the header row
      }))
      .on('data', (data: User) => {
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