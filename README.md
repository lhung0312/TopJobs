# TopJobs

## Introduction

TopJobs is a website application developed using NestJs framework for recruitment and job application management. It implements a stateless architecture and provides role-based access control for Admins, HRs, and candidates.

## Features

- **Authentication:** User authentication is implemented using JWT mechanism, with AccessToken and RefreshToken.
- **Authorization:** Admins, HRs, and candidates have specific roles and permissions to access relevant routes.
- **Date Validation:** Day.js is used to validate startDate and endDate for job postings.
- **File Upload:** Multer is utilized for file upload functionality.
- **Email Subscribers:** Subscribers can receive job notifications via email.

## Technologies Used

- **NestJs:** A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **MongoDB:** A NoSQL database for storing application data.
- **JWT (JSON Web Tokens):** A standard method for securely transmitting information between parties as a JSON object.
- **Day.js:** A minimalist JavaScript library that parses, validates, manipulates, and displays dates and times.
- **Multer:** A middleware for handling multipart/form-data, which is primarily used for uploading files.
- **Passport:** Authentication middleware for Node.js.

## System Requirements

- Operating System: Windows, macOS, Linux
- Node.js: >= 16.x
- MongoDB: >= 6.x

## Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/lhung0312/TopJobs.git
   ```
2. Navigate to the project directory:
   ```sh
   cd TopJobs
   ```
4. Install the necessary libraries:
   ```sh
   npm install
   ```
5. Set up environment variables:

    Create a .env file from the provided .env.example and update it with your configuration settings:
   ```sh
   PORT=3000
   MONGO_URL=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/
   
   # Access token for JWT
   SECRET_JWT_ACCESS=your_access_secret
   EXPIRE_JWT_ACCESS=1h
   
   # Refresh token for JWT
   SECRET_JWT_REFRESH=your_refresh_secret
   EXPIRE_JWT_REFRESH=7d
   
   # account Admin 
   EMAIL_ADMIN=admin@gmail.com
   ROLE_ADMIN=ADMIN
    
   # Initialize sample data on startup (true/false)
   SHOULD_INIT=true
   INIT_PASSWORD=your_init_password
   ```

## Usage
   
 1. Start the development server:

    ```sh
    npm run dev
    ```
 3. Open your browser and visit:
    http://localhost:3000
   
 ## Contact
 
   For any questions or suggestions, feel free to reach out via email: info.tuanhung@gmail.com
