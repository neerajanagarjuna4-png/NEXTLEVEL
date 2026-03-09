# NEXT_LEVEL – Personal Guidance by Bhima Sankar Sir

A full-stack GATE mentorship platform helping aspirants achieve AIR under 10 through daily monitoring, structured study plans, and expert mentorship by **Mr. Bhima Sankar Sir** (M.Tech – IIT Kharagpur, PhD – IIIT Hyderabad).

## Features

- **Student Registration** with branch selection (ECE / EE / CSE) and pending-approval workflow
- **Mentor Dashboard** to approve/reject students, with at-risk student detection
- **Student Dashboard** with:
  - GATE 2027 Countdown (target: Feb 15, 2027)
  - Daily motivation quotes (23 exact quotes from Bhima Sankar Sir)
  - Preparation tracker (daily/weekly/monthly study hour targets)
  - Working hours tracker (auto-calculated from daily reports)
  - Complete syllabus checklists for ECE/EE/CSE (subjects → topics with checkboxes)
  - Daily task checklist with custom tasks
  - Daily study report form (study hours, PYQs, mood, accuracy, etc.)
  - Reward system (badges for 7/14/30 day streaks)
  - Progress visualization charts
  - Leaderboard
- **Mentor Profile Page** with exact qualifications, quotes, community links, and mock tests
- Mobile responsive, modern UI

## Tech Stack

- **Frontend:** React + Vite, Recharts (charts)
- **Backend:** Node.js + Express, MongoDB (Mongoose), JWT, Nodemailer
- **Styling:** Vanilla CSS with CSS custom properties

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (for backend)

### Frontend Setup

```bash
cd NEXTLEVEL
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Backend Setup (Optional)

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/nextlevel
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
MENTOR_EMAIL=sankar.bhima@gmail.com
```

```bash
npm start
```

### Demo Credentials

- **Mentor Login:** `sankar.bhima@gmail.com` (any password)
- **Student Login:** Sign up first, then get approved by mentor

## Project Structure

```
├── SRC/
│   ├── components/
│   │   ├── dashboard/          # Dashboard widgets
│   │   │   ├── GATECountdown       # GATE 2027 countdown timer
│   │   │   ├── MotivationQuotes    # Random motivation quotes
│   │   │   ├── DailyTaskChecklist  # Daily tasks with checkboxes
│   │   │   ├── PreparationTracker  # Study targets (daily/weekly/monthly)
│   │   │   ├── WorkingHoursTracker # Study hours from reports
│   │   │   ├── DailyStudyReport    # Full study report form
│   │   │   ├── SyllabusChecklist   # Branch-specific syllabus
│   │   │   ├── ProgressVisualization # Charts
│   │   │   ├── RewardSystem        # Badges and streaks
│   │   │   └── Leaderboard         # Student rankings
│   │   └── mentor/
│   │       └── MentorProfile       # Sidebar mentor card
│   ├── data/
│   │   ├── platformData.js         # Quotes, mentor info, daily tasks
│   │   └── syllabus.js             # Complete ECE/EE/CSE syllabi
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── PendingApproval.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── MentorDashboard.jsx
│   │   └── MentorProfilePage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── services/        # Email service, syllabus data
│   └── server.js        # Express server (to be connected)
├── vite.config.js
└── package.json
```

## License

Private – NEXT_LEVEL by Bhima Sankar Sir
