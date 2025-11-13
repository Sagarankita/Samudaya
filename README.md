 # Community Event Management UI

  This is a code bundle for Community Event Management UI called SAMUDAYA.


**Samudaya** is a full-stack platform for managing community events, volunteers, and announcements.  
It features a modern **React (Vite + TypeScript)** frontend and a **Flask + MongoDB Atlas** backend.

---

## 🚀 Tech Stack
- **Frontend:** React, Vite, TailwindCSS, TypeScript  
- **Backend:** Flask (Python)  
- **Database:** MongoDB Atlas  

---

## ⚙ Setup

### 🖥 Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate     # or source venv/bin/activate
pip install -r requirements.txt
echo MONGO_URI=your_mongo_uri > .env
python app.py
```

### 💻 Frontend
```bash
npm install
npm run dev
```

- **Frontend runs at:** [http://localhost:5173](http://localhost:5173)  
- **Backend runs at:** [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 📁 Project Structure
```
samudaya/
├── backend/   → Flask API & DB logic
└── src/       → React components & UI
```
