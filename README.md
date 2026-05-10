Traveloop is a full‑stack travel planning application that lets users create multi‑city itineraries, add activities, track budgets, manage packing checklists, and share trips. Built with **React**, **Node.js**, **Express**, and **MySQL**.
## ✨ Features

- **User Authentication** – JWT‑based login / signup with role‑based access (user/admin)
- **Trip Management** – Create, edit, delete trips with custom dates and descriptions
- **Itinerary Builder** – Add multiple stops (cities) to a trip, each with its own date range
- **Activity Search & Selection** – Browse a catalog of activities by city, add them to any stop
- **Budget Breakdown** – Real‑time cost estimation for stays, meals, activities, and transport (visualised with Chart.js pie chart)
- **Packing Checklist** – Add, edit, and mark items as packed/unpacked
- **Trip Notes** – Keep free‑text notes per trip with timestamps
- **Public Shareable View** – Generate read‑only links to share itineraries
- **Admin Analytics** – Dashboard with user/trip statistics and popular cities (admin only)
- **Responsive UI** – Tailwind CSS ensures seamless experience on desktop and mobile

## 🛠️ Tech Stack

| Layer       | Technology                                                                 |
|-------------|----------------------------------------------------------------------------|
| Frontend    | React 18, React Router DOM, Axios, Chart.js, Tailwind CSS, Font Awesome    |
| Backend     | Node.js, Express, JSON Web Token, bcryptjs, dotenv                         |
| Database    | MySQL (with `mysql2` promise wrapper)                                      |
| Dev Tools   | Nodemon, Create React App   
## 📁 Project Structure
traveloop-fullstack/
├── backend/
│ ├── .env
│ ├── package.json
│ ├── server.js (modular route integration)
│ ├── db.js
│ ├── middleware/
│ │ └── auth.js
│ ├── routes/
│ │ ├── auth.js
│ │ ├── trips.js
│ │ ├── checklist.js
│ │ ├── notes.js
│ │ ├── cities.js
│ │ ├── activities.js
│ │ └── admin.js
│ └── schema.sql
└── frontend/
├── package.json
├── tailwind.config.js
├── public/
│ ├── index.html
│ └── favicon.ico
└── src/
├── index.js
├── index.css
├── App.js
├── api.js
└── components/
├── Auth.js
├── Dashboard.js
├── MyTrips.js
├── TripForm.js
├── TripManager.js
├── Profile.js
├── AdminPanel.js
└── Navbar.js
