 E-Commerce Dropshipping Platform

A modern dropshipping e-commerce platform with comprehensive product browsing and dynamic inventory management.

Features

- User authentication (login, registration)
- Product browsing by category
- Product detail pages
- Shopping cart functionality
- Order processing
- Supplier portal for adding products

 Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, 
- **Backend**: Express, Node.js
- **Database**: MongoDB,PostgreSQL
- **Authentication**: Passport.js, express-session

 MongoDB Setup

This application uses MongoDB as its database. Here's how to set it up:

 Local Development

1. Install MongoDB on your computer
   - [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Follow the installation instructions for your operating system

2. Create a `.env` file in the project root with:
   ```
   MONGODB_URI=mongodb://localhost:27017/your project
   ```

3. Run the MongoDB seed script to populate the database:
   ```
   npx tsx scripts/seed-mongodb.ts
   ``` 
USing PostgreSQL

Use PostgreSQL to update the profile with registered details
https://www.postgresql.org/download/

Using MongoDB  (Cloud)

1. Create a new database
2. Set up a database user and password
3. Get your connection string from MongoDB Atlas
4. Create a `.env` file in the project root with:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/dropmart?retryWrites=true&w=majority
   ```
   (Replace placeholders with your actual MongoDB Atlas credentials or connect it to a local MongoDB server)

5. Run the MongoDB seed script to populate the database:
   ```
   npx tsx scripts/seed-mongodb.ts
   ```

Running the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser to:
   ```
   http://localhost:5000
   ```

 Default Users

The seed script creates an admin user with:
- Username: `admin`
- Password: `admin123`

 Project Structure

- `/client`: React frontend application
- `/server`: Express backend API
- `/shared`: Shared types and schemas used by both frontend and backend
- `/scripts`: Database seed scripts and other utilities

## License

This project is licensed under the MIT License.
