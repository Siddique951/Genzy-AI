# ⚡ Fullstack AI SaaS Platform (PERN Stack)

This is a fullstack **AI SaaS platform** built using the **PERN stack (PostgreSQL, Express, React, Node.js)** with **subscription-based billing**.  
Users can sign up, manage their profile, and access multiple AI tools like **article generator, blog title generator, image generator, background remover, object remover, and resume analyzer** based on their plan.

---

## 🌐 Live Demo

🔗 Website: https://genzy-ai.vercel.app
🔗 GitHub Repo: https://github.com/Siddique951/Genzy-AI

---

## ✨ Features

- 👤 **Authentication & User Management** with Clerk (sign up, login, profile)
- 💳 **Subscription Billing** for premium AI tools (Stripe or similar)
- 🧠 Multiple **AI tools**:
  - ✍️ Article Generator  
  - 📰 Blog Title Generator  
  - 🖼️ Image Generator  
  - 🧹 Background Remover  
  - 🎯 Object Remover  
  - 📄 Resume Analyzer  
- 🗄️ **PostgreSQL (Neon)** for storing users, subscriptions & usage data
- ☁️ **Cloudinary** (or similar) for fast and optimized image handling
- ⚙️ Role-based access to features (free vs premium users)
- 📊 Dashboard-style responsive UI

---

## 🛠 Tech Stack

### Frontend
- React.js (Vite)
- React Router
- Tailwind CSS 
- Context / state management

### Backend
- Node.js
- Express.js
- REST APIs
- OpenAI API integration 

### Database & Auth
- PostgreSQL (Neon or hosted Postgres)
- Prisma 
- Clerk

### Other Services
- Cloudinary (image storage & optimization)
- Stripe (subscription billing)
- Vercel 

---

## 📂 Project Structure

```bash
GENZYAI/
│
├── client/         # React frontend
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── main.jsx
│
└── server/         # Node backend
    ├── configs/
    ├── controllers/
    ├── middlewares/
    ├── routes/
    ├── db.js
    └── server.js


# Clone the repository
```bash
git clone https://github.com/Siddique951/Genzy-AI.git
cd Genzy-AI

# Install frontend dependencies
cd client
npm install
npm run dev

# Install backend dependencies
cd server
npm install
npm start

## 🏆 Achievements

- Built and deployed a full PERN SaaS application independently
- Integrated 6+ AI tools using OpenAI API
- Reduced image upload time by 25% using Cloudinary optimization
- Implemented secure subscription billing (Stripe + Clerk)
- Designed dashboard-style UI with responsive layout

