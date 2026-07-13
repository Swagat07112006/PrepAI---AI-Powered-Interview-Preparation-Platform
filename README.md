# PrepAI — AI-Powered Interview Preparation Platform

PrepAI is a premium, developer-focused interview preparation workspace designed to streamline technical interview prep. Built with a unified obsidian-charcoal and vibrant amber-gold visual design, PrepAI facilitates DSA tracking, note-taking, spaced repetition card review, and dynamic mock evaluations in a single unified dashboard.

---

## ✨ Features

- **Personalized Workspace**: Get a bird's-eye view of your interview prep. Includes daily goal tracking, activity timelines, and overall progress analytics.
- **Sleek Interface Customization**: Centered search index pill with quick keyboard focus shortcuts (`⌘K` / `Ctrl+K`), custom "+ Create" fast action triggers, and a clean right-aligned User Profile metadata utility.
- **Questions & Platforms Hub**: Build, catalog, and filter coding questions dynamically. Utilizes case-insensitive query processing against custom platform tags for highly granular filters.
- **Spaced Repetition Cards (Revisions)**: Daily revision scheduling lists that keep your technical knowledge fresh, complete with instant clearable states.
- **Developer Markdown Notes**: A structured note-taking text workspace for compiling custom algorithm reviews and interview feedback reports.
- **SMTP Feedback Integration**: Integrated local-logged SMTP feedback system for bug reporting and assistance popovers.
- **Interactive Profile Configuration**: Select and update high-res avatar presets, college demographics, graduation dates, and split skills tags.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS (Custom Amber/Gold Color Maps)
- **Utilities**: Radix UI (Dropdowns, Sheets, Dialogs, Popovers), Framer Motion, Lucide Icons, Sonner Toasts

### Backend
- **Server**: Node.js & Express
- **Database**: MongoDB & Mongoose
- **Security**: JWT & bcryptjs password hashing
- **Mailers**: Nodemailer (SMTP logging)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or above)
- MongoDB running locally or a MongoDB Atlas URI connection

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Swagat07112006/PrepAI---AI-Powered-Interview-Preparation-Platform.git
   cd PrepAI---AI-Powered-Interview-Preparation-Platform
   ```

2. **Configure Environment Variables**:

   - Create a `.env` file in the `server` directory:
     ```env
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/prepai
     JWT_SECRET=your_jwt_secret_key_here
     SMTP_HOST=smtp.mailtrap.io
     SMTP_PORT=2525
     SMTP_USER=your_smtp_username
     SMTP_PASS=your_smtp_password
     SMTP_FROM=noreply@prepai.dev
     ```

3. **Install Dependencies & Start the Backend Server**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

4. **Install Dependencies & Launch the Client Workspace**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` to access PrepAI.

---

## 📦 Project Structure

```text
PrepAI/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── app/            # App routes & entry logic
│   │   ├── components/     # UI elements & custom layouts
│   │   ├── context/        # Context states (Authentication)
│   │   ├── pages/          # Layout view surfaces
│   │   └── index.css       # Core stylesheets & tokens
│   └── tailwind.config.js  # Color tokens & config settings
│
└── server/                 # Backend Node/Express API
    ├── src/
    │   ├── controllers/    # Route handler controllers
    │   ├── middleware/     # JWT authentication middlewares
    │   ├── models/         # Database models (User, Question, Note)
    │   └── routes/         # Express API routes
    └── app.js              # Server entry point
```

---

## 🔒 License

This project is licensed under the MIT License. Feel free to use and adapt it as needed!
