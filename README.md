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
Directory structure:
└── sagarankita-samudaya/
    ├── README.md
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── backend/
    │   ├── app.py
    │   ├── requirements.txt
    │   └── seed_database.py
    └── src/
        ├── App.tsx
        ├── Attributions.md
        ├── main.tsx
        ├── server.js
        ├── components/
        │   ├── AdminLoginPage.tsx
        │   ├── AdminPanel.tsx
        │   ├── Announcements.tsx
        │   ├── AppSidebar.tsx
        │   ├── CalendarPage.tsx
        │   ├── Dashboard.tsx
        │   ├── EventCard.tsx
        │   ├── EventCreation.tsx
        │   ├── EventListing.tsx
        │   ├── Forum.tsx
        │   ├── LoginPage.tsx
        │   ├── StatsCard.tsx
        │   ├── UserProfile.tsx
        │   ├── VolunteerManagement.tsx
        │   ├── figma/
        │   │   └── ImageWithFallback.tsx
        │   └── ui/
        │       ├── accordion.tsx
        │       ├── alert-dialog.tsx
        │       ├── alert.tsx
        │       ├── aspect-ratio.tsx
        │       ├── avatar.tsx
        │       ├── badge.tsx
        │       ├── breadcrumb.tsx
        │       ├── button.tsx
        │       ├── calendar.tsx
        │       ├── card.tsx
        │       ├── carousel.tsx
        │       ├── chart.tsx
        │       ├── checkbox.tsx
        │       ├── collapsible.tsx
        │       ├── command.tsx
        │       ├── context-menu.tsx
        │       ├── dialog.tsx
        │       ├── drawer.tsx
        │       ├── dropdown-menu.tsx
        │       ├── form.tsx
        │       ├── hover-card.tsx
        │       ├── input-otp.tsx
        │       ├── input.tsx
        │       ├── label.tsx
        │       ├── menubar.tsx
        │       ├── navigation-menu.tsx
        │       ├── pagination.tsx
        │       ├── popover.tsx
        │       ├── progress.tsx
        │       ├── radio-group.tsx
        │       ├── resizable.tsx
        │       ├── scroll-area.tsx
        │       ├── select.tsx
        │       ├── separator.tsx
        │       ├── sheet.tsx
        │       ├── sidebar.tsx
        │       ├── skeleton.tsx
        │       ├── slider.tsx
        │       ├── sonner.tsx
        │       ├── switch.tsx
        │       ├── table.tsx
        │       ├── tabs.tsx
        │       ├── textarea.tsx
        │       ├── toggle-group.tsx
        │       ├── toggle.tsx
        │       ├── tooltip.tsx
        │       ├── use-mobile.ts
        │       └── utils.ts
        ├── guidelines/
        │   └── Guidelines.md
        ├── services/
        │   └── api.ts
        └── styles/
            └── globals.css
```
