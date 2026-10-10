# Login Authentication System

**Track:** Web Development | **Level 2 — Task 4** | Oasis Infobyte SIP  
**Author:** VAISHNAVI MAHADEV HONGAL

A full-stack authentication system with registration, login, a protected dashboard, and logout.

## Features

- Registration with email and password
- Password validation: minimum 8 characters and at least 1 number
- Duplicate email detection
- Secure login with a generic error message
- Protected dashboard for authenticated users
- Logout that destroys the session
- Password hashing with bcrypt
- Login rate limiting
- Remember me option
- Show/hide password
- Responsive design

## Tech Stack

Node.js, Express, SQLite, bcrypt, express-session, Helmet, express-rate-limit, HTML, CSS, and JavaScript.

## How to Run

1. Install Node.js.
2. Open a terminal in the project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file using `.env.example` and set your own session secret.
5. Start the application:

   ```bash
   npm start
   ```

6. Open http://localhost:3000 in your browser.

## Project Structure

- `server.js` — Server setup and protected routes
- `db.js` — Database operations
- `routes/auth.js` — Authentication routes
- `middleware/requireAuth.js` — Authentication protection
- `public/` — Login, registration, CSS, and JavaScript files
- `views/dashboard.html` — Dashboard page
- `screenshots/` — Project screenshots

## Security

- Passwords are hashed with bcrypt.
- Parameterized SQL queries help prevent SQL injection.
- Sessions use HTTP-only cookies.
- Helmet adds security-related HTTP headers.
- Login attempts are rate limited.
- Email addresses are unique in the database.

## Screenshots

Add your actual project screenshots to the `screenshots/` folder and link them here once their filenames are confirmed.

## Author

VAISHNAVI MAHADEV HONGAL