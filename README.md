# Login Authentication System

**Track:** Web Development | **Task 4** | Oasis Infobyte SIP  
**Author:** VAISHNAVI MAHADEV HONGAL

A full-stack authentication system with registration, login, a protected dashboard and logout.

## Features

- Registration with email and password
- Password rules: minimum 8 characters and at least 1 number
- Duplicate email check with a clear error message
- Login with a generic error ("Invalid email or password.") that never reveals which field was wrong
- Protected dashboard: visiting `/dashboard` without a session redirects to the login page
- Logout button that destroys the session and redirects to login
- Passwords hashed with bcrypt, never stored in plain text
- Form validation on both pages (no empty submissions)
- Login rate limit: 5 failed attempts, then a 15 minute wait
- "Remember me" keeps the session for 7 days
- Show/hide password button
- Responsive design

## Tech stack

Node.js, Express, SQLite (better-sqlite3), bcrypt, express-session, helmet, express-rate-limit, HTML, CSS and JavaScript.

## How to run

1. Install Node.js (version 18 or higher).
2. Install the packages:

```bash
npm install
```

3. Copy `.env.example` to a new file named `.env` and set your own `SESSION_SECRET`.

4. Start the server:

```bash
npm start
```

5. Open http://localhost:3000

## Project structure

```text
server.js                  server setup, sessions, protected route
db.js                      SQLite database and queries
routes/auth.js             register, login, me, logout
middleware/requireAuth.js  blocks users who are not logged in
public/                    login and register pages, CSS, JavaScript
views/dashboard.html       protected page, served only after login
```

## Security notes

- Passwords are hashed with bcrypt before saving.
- SQL queries use placeholders, which protects against SQL injection.
- Sessions live on the server. The cookie is `httpOnly`, so page scripts cannot read it.
- Helmet adds secure HTTP headers.
- The login route is rate limited to slow down password guessing.
- The email column is `UNIQUE` in the database.
- For production you would also use HTTPS, a `secure` cookie, and a persistent session store.

## Screenshots

| Register | Login |
|---|---|
| ![Register](screenshots/register.png) | ![Login](screenshots/login.png) |

| Dashboard | Login error |
|---|---|
| ![Dashboard](screenshots/dashboard.png) | ![Error](screenshots/login-error.png) |