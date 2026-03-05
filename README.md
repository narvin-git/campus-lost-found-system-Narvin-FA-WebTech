# Campus Lost & Found Management System

A web application that allows users to report and track lost and found items on campus.

## Features
- Report lost items
- Report found items
- View lost items
- View found items
- View item details
- Update item status (Claimed / Resolved)
- Delete reports
- 404 page

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MySQL

## Security
- Helmet (security headers + CSP)
- Rate limiting (express-rate-limit)
- Input validation + sanitization
- SQL injection prevention (parameterized queries)
- XSS prevention (escapeHtml)

## Run Locally
1. Install dependencies:
   npm install
2. Create `.env` using `.env.example`
3. Start server:
   npm run dev
4. Open:
   http://localhost:3000