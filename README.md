# MockMate 🎯

An AI-powered mock interview app I built to help me (and others) practice for placements. You upload your resume or pick a category and it gives you interview questions + AI feedback on your answers.

Built with React + Tailwind + Gemini API (Google's free AI).

## Why I made this

I kept bombing interviews because I wasn't practicing enough. Thought why not just build something to practice with instead of using those paid platforms. Added the resume upload feature so it asks questions actually relevant to what I've done.

## Features

- 5 question categories (Frontend, Backend, DSA, HR, Behavioral)
- Upload your resume → get personalised questions based on YOUR skills
- AI scores your answer on communication, technical depth and clarity
- Interview history saved in browser (localStorage, no backend needed)
- Dark mode

## Tech Stack

- React 18
- Tailwind CSS
- Vite
- Gemini API (gemini-2.5-flash)

## Setup

Clone the repo and run:

```bash
npm install
npm run dev
```

You'll need a Gemini API key. Create a `.env` file in the root:

```
VITE_GEMINI_API_KEY=your_key_here
```

Get a free key at [aistudio.google.com](https://aistudio.google.com)

For the AI feedback on answers you also need to run the local backend:

```bash
node backend-server.js
```

Then open `http://localhost:5173`

## Folder structure

```
src/
  components/   reusable stuff
  pages/        main pages (Dashboard, InterviewPractice, History, Resume)
  utils/        gemini api calls, localStorage helpers, pdf parser
```

## Known issues / TODO

- PDF parsing doesn't work on scanned resumes (only text-based PDFs)
- mobile layout is a bit off on really small screens
- maybe add more questions to the bank later
- would be cool to add speech-to-text for answers

## Screenshots

(will add later)
