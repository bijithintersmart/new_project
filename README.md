# New Project

## Project Overview

This is a Node.js application built with Express.js, Sequelize (ORM for PostgreSQL), and other libraries to provide user authentication, PDF generation, and file upload functionalities.

## Features

- User Registration and Authentication (JWT)
- User Profile Management
- PDF Generation from user data, raw data, or HTML content
- Image Uploads for user profiles
- Email notifications (welcome email)

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user.
  - Request Body: `name`, `email`, `password`, `image` (multipart/form-data)
- `POST /api/auth/login`: Log in a user.
  - Request Body: `email`, `password`
- `PUT /api/auth/update`: Update user profile (requires authentication).
  - Request Body: `name`, `image` (multipart/form-data)

### PDF Generation (requires authentication)

- `GET /api/pdf/generate`: Generate a PDF of the authenticated user's profile.
- `POST /api/pdf/generate-from-data`: Generate a PDF from provided title and content.
  - Request Body: `title`, `content`
- `POST /api/pdf/generate-from-html`: Generate a PDF from HTML content.
  - Request Body: `htmlContent`

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL
- Git

### Installation

1. **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd new_project
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

``` env
PORT=3000
JWT_SECRET=your_jwt_secret_key
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_DIALECT=postgres
EMAIL=your_email@gmail.com
PASSWORD=your_email_app_password # For Gmail, use an App Password
```

**Note on `EMAIL` and `PASSWORD`**: If you are using Gmail, you will need to generate an App Password. Go to your Google Account -> Security -> App passwords.

### Running the Application

1. **Start the application in development mode (with nodemon):**

    ```bash
    npm run dev
    ```

2. **Start the application in production mode:**

    ```bash
    npm start
    ```

The server will typically run on `http://localhost:3000` (or the `PORT` you specified in `.env`).

## Database Setup (PostgreSQL)

### Installing PostgreSQL on Mac (using Homebrew)

1. **Install Homebrew** (if you don't have it):

    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

2. **Install PostgreSQL:**

    ```bash
    brew install postgresql
    ```

### Starting/Stopping PostgreSQL Service

- **Start PostgreSQL:**

    ```bash
    brew services start postgresql
    ```

- **Stop PostgreSQL:**

    ```bash
    brew services stop postgresql
    ```

- **Restart PostgreSQL:**

    ```bash
    brew services restart postgresql
    ```

### Creating a Database and User

1. **Access the PostgreSQL prompt:**

    ```bash
    psql postgres
    ```

2. **Create a new user (replace `your_database_user` and `your_database_password`):**

    ```sql
    CREATE USER your_database_user WITH PASSWORD 'your_database_password';
    ```

3. **Create a new database (replace `your_database_name`):**

    ```sql
    CREATE DATABASE your_database_name;
    ```

4. **Grant all privileges on the database to the user:**

    ```sql
    GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_database_user;
    ```

5. **Exit the PostgreSQL prompt:**

    ```sql
    \q
    ```

### Connecting with PG Admin

1. **Download and install PG Admin:** Visit [pgAdmin website](https://www.pgadmin.org/download/) and download the installer for macOS.

2. **Open pgAdmin** and right-click on "Servers" in the left sidebar. Select "Register" -> "Server...".

3. **In the "General" tab:**
    - Name: `My Local PostgreSQL` (or any descriptive name)

4. **In the "Connection" tab:**
    - Host name/address: `localhost`
    - Port: `5432` (default)
    - Maintenance database: `postgres` (or your database name)
    - Username: `your_database_user` (the one you created)
    - Password: `your_database_password` (the one you created)
    - Save password: (Optional, but recommended for convenience)

5. **Click "Save"**. You should now be connected to your PostgreSQL server.

### Running Sequelize Migrations

After setting up your database and `.env` file, run the migrations to create the necessary tables:

```bash
npx sequelize-cli db:migrate
```

## Optimizations Made

- **Authentication Controller (`authController.js`)**:
  - Removed inefficient `allUsers` queries during registration and login.
  - Corrected password comparison logic in login.
  - Switched to asynchronous file reading for welcome email template.
  - Removed duplicate `verifyToken` function (now handled by middleware).
- **PDF Controller (`pdfController.js`)**:
  - Ensured `puppeteer.launch()` uses `headless: 'new'` for better performance.
  - Implemented `try...finally` block to guarantee `browser.close()` is called.
- **Upload Middleware (`uploadMiddleware.js`)**:
  - Added file type validation (JPEG, PNG, GIF only) and a 5MB size limit for uploads.
- **Mail Client Utility (`mailClient.js`)**:
  - Refactored to create a single, reusable Nodemailer transporter instance, avoiding redundant creation on each email send.
  - Removed `nodemailer.createTestAccount()` and `dotenv.config()` from this file.
