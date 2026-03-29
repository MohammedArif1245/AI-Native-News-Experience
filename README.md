# AI-Native News Experience

An AI-powered news briefing application that provides personalized, structured news summaries tailored to different user types. Get clear insights on any news topic in under 60 seconds.

## Features

- **AI-Powered Briefings**: Enter any news topic and receive a comprehensive, structured briefing
- **Personalized Content**: Select your role (Student, Investor, or Founder) for tailored insights
- **Follow-up Q&A**: Ask clarifying questions about any briefing
- **Multi-Platform**: Available as both web and mobile applications
- **Responsive Design**: Beautiful UI with smooth animations
- **Deterministic UX**: Stable scroll behavior after generating briefings

## User Types

| Type | Focus |
|------|-------|
| **Student** | Simple language, educational value, context explanations |
| **Investor** | Financial impact, market implications, data-driven insights |
| **Founder** | Business opportunities, strategic insights, competitive analysis |

## Project Structure

```
AI-Native-News-Experience/
├── web/                    # Web application (React Router)
│   ├── src/
│   │   ├── app/           # Pages and API routes
│   │   │   ├── api/      # Backend API endpoints
│   │   │   │   ├── briefing/     # Briefing generation API
│   │   │   │   └── query/        # Q&A API
│   │   │   ├── page.jsx          # Main page
│   │   │   └── layout.jsx        # Layout
│   │   ├── components/   # UI components
│   │   │   ├── BriefingDisplay.jsx
│   │   │   ├── QnABox.jsx
│   │   │   └── UserTypeSelector.jsx
│   │   └── utils/        # Utility functions
│   ├── .env               # Environment variables (do not commit)
│   └── package.json
│
└── mobile/                # Mobile application (Expo/React Native)
    ├── src/
    │   ├── app/          # Expo Router screens
    │   ├── components/  # UI components
    │   └── utils/       # Utility functions
    ├── app.json
    └── package.json
```

## Tech Stack

### Web
- **Framework**: React Router v7
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Language**: TypeScript
- **AI**: Google Gemini 2.5 Flash (configurable)
- **Database**: Neon (serverless PostgreSQL)
- **Auth**: Auth.js

### Mobile
- **Framework**: Expo SDK 54
- **Language**: React Native
- **Routing**: Expo Router
- **State Management**: Zustand
- **Data Fetching**: TanStack Query

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun
- For mobile: Expo CLI

### Web Installation

```bash
cd web
npm install
```

### Running the Web App

```bash
cd web
npm run dev
```

The web app will be available at `http://localhost:4000`

### Mobile Installation

```bash
cd mobile
npm install
```

### Running the Mobile App

```bash
cd mobile
npx expo start
```

## Configuration

### Environment Variables

Create a `.env` file in the `web/` directory:

```env
# Required for AI integration (optional - app works with demo data)
NEXT_PUBLIC_CREATE_APP_URL=https://www.create.xyz

# Auth configuration (optional)
AUTH_SECRET=your-secret-key
DATABASE_URL=your-neon-database-url
```

**Note:** The app includes mock AI responses by default, so it works without external API configuration.

## API Endpoints

### POST /api/briefing
Generate an AI briefing for a news topic.

**Request Body:**
```json
{
  "topic": "Union Budget 2026",
  "userType": "student"
}
```

**Response:**
```json
{
  "summary": "3-4 sentence overview",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4"],
  "stakeholders": ["stakeholder 1", "stakeholder 2"],
  "impact": "impact description",
  "nextSteps": "what happens next",
  "topic": "topic name",
  "userType": "student"
}
```

### POST /api/query
Ask follow-up questions about a briefing.

**Request Body:**
```json
{
  "question": "What are the implications?",
  "context": { /* previous briefing object */ },
  "userType": "student"
}
```

## Features Breakdown

### Briefing Display
The application generates structured briefings with:
- **Summary**: Quick 3-4 sentence overview
- **Key Points**: 4 main takeaways
- **Stakeholders**: Who is affected
- **Impact**: Economic/business implications
- **Next Steps**: What to watch for

### Q&A System
After receiving a briefing, users can ask follow-up questions to dive deeper into specific aspects of the news topic.

### Demo Mode
The app works out-of-the-box with mock AI responses. To connect real AI:
1. Set up `NEXT_PUBLIC_CREATE_APP_URL` in `.env`
2. Configure your AI provider integration

## License

Private - All rights reserved

## Author

MohammedArif1245
