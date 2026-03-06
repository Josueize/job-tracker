# JobTrackr — Job Application Tracker

A full-stack web application that helps job seekers stay organized during their job search. Track applications, manage statuses, get AI-powered resume feedback, and visualize your progress.

Live Demo: https://jobtrackr-app-mu.vercel.app
Repository: https://github.com/Josueize/job-tracker

## How to Run Locally

1. Clone the repository:
git clone https://github.com/Josueize/job-tracker.git
cd job-tracker

2. Set up the backend:
cd server
npm install

Create a .env file in the server folder:
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
CLAUDE_API_KEY=your_claude_api_key
PORT=5000

Start the backend:
node index.js

3. Set up the frontend:
cd client
npm install
npm start

The app will open at http://localhost:3000

## Features
- User authentication with JWT
- Kanban board for application tracking
- AI-powered resume feedback
- Dashboard with application trend charts
- Responsive design

## Author
Josue (Izehiuwa Igiebor Omogiate)
GitHub: https://github.com/Josueize
LinkedIn: https://www.linkedin.com/in/izehiuwa-igiebor-b9753919b/
