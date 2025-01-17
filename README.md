# Learning Platform API

A RESTful API built with Node.js, Express, TypeScript, and MongoDB for managing a learning platform. This API supports user authentication, role-based access (teachers/students), and user management.

## Features

- User authentication with JWT
- Role-based authorization (Teacher/Student)
- Secure password hashing
- MongoDB integration
- TypeScript for type safety
- Express middleware for authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm

## Setup

1. Clone the repository
2. Install dependencies: `npm install` or `yarn install`
3. Set up MongoDB connection:
   - Create a `.env` file in the root directory with the following variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secret key for JWT (can be any string)
4. Start the server: `npm start`

Development mode
npm run dev

Production mode
npm run build
npm start

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }
  ```README.md
- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
### Users
- `GET /api/users/me` - Get current user profile
- `GET /api/users` - Get all users (teachers only)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: JWT
- **Password Hashing**: bcrypt

## Project Structure

- `src/server.ts`: Main server file
- `src/routes/auth.ts`: Authentication routes
- `src/routes/users.ts`: User management routes
- `src/models/User.ts`: User model
- `src/middleware/auth.ts`: Authentication middleware

# How to generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"