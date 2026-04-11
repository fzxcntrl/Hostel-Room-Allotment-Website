# HostelBloom – Full-Stack Hostel & Room Allotment Experience

HostelBloom is a human-centered hostel/room allotment prototype that blends an aesthetic, heavily animated React frontend with a pragmatic Express + Native MongoDB backend. It demonstrates the entire journey—from browsing curated rooms and authenticating, to booking, tracking history, and chatting with an intelligent AI concierge—while remaining lightweight enough for rapid demos or academic evaluations.

> **Why this project?** Manual allotment and outdated portals often feel transactional. HostelBloom treats campus living like a boutique stay: calm UI, transparent availability, instant confirmations, fluid page transitions, and an AI-driven concierge to help you out.

---

## 1. Repository structure
```text
Sem3project/
├── backend/                # Express REST API + Native MongoDB Driver
│   ├── src/config          # Database connector (Native MongoDB)
│   ├── src/controllers     # Auth, Room, Booking, Insight, and Chatbot logic
│   ├── src/routes          # Versioned API routes under /api
│   ├── src/middleware      # Error handlers & JWT security
│   └── src/utils           # Seed helpers & sample bootstrap data
├── frontend/               # React (Vite) single-page app
│   ├── src/animations      # PageWrapper (Framer Motion) & microInteractions (Anime.js)
│   ├── src/components      # Layout, Navbar, Chatbot, room cards, stats strip
│   ├── src/pages           # Home, Rooms, Book, Login, Register, About, Facilities, History
│   ├── src/context         # AuthContext for global session state
│   ├── src/services        # Axios instance with auth header injection
│   └── src/styles          # Global aesthetic theme (`index.css`)
└── README.md               # You are here – exhaustive documentation
```

---

## 2. Feature tour
- **Welcoming landing page** with smooth staggered animations, testimonials, and live expanding stats.
- **Room explorer** (`/rooms`) listing all rooms with imagery, capacity, amenities, and dynamic hover animations.
- **Booking workflow** (`/book`) where authenticated users select a room, choose dates, add preferences, and confirm instantly.
- **AI Concierge (Bloom)** – Powered by Groq AI and Llama 3 integrated tightly into the backend.
- **Auth flows** – secure login & registration with server-validation, hashed passwords (bcrypt), and stateless JWT issuance.
- **Booking history dashboard** (`/history`) showing past/future stays, statuses, and one-click cancellation.
- **Insight APIs** for admins, exposing totals, occupancy rate, and weekly activity.
- **Cinematic Transitions:** `<AnimatePresence>` from Framer Motion wraps every route, creating silky-smooth page navigations.
- **Micro-Interactions:** `Anime.js v4` natively triggers hover effects, input focus states, number counting, and submission UX.

---

## 3. Tech stack
| Layer      | Choice                    | Notes |
| ---------- | ------------------------- | ----- |
| Frontend   | React 18 + Vite           | Framer Motion, Anime.js v4, React Router, Axios, Lucide React Icons |
| Backend    | Node.js 18 + Express 5    | RESTful routes, express-validator, bcryptjs, jsonwebtoken |
| AI / SDK   | Groq API                  | `groq-sdk` powering the HostelBloom assistant via Llama 3 |
| Database   | MongoDB (Native Driver)   | `mongodb` package directly managing collections (No Mongoose overhead) |
| Tooling    | Nodemon, dotenv           | Hot reload backend, strict environment management |

---

## 4. Getting started locally
### 4.1 Prerequisites
- Node.js ≥ 18 and npm
- A MongoDB Cluster (MongoDB Atlas is highly recommended)
- A Groq API Key

### 4.2 Environment variables
#### Backend (`backend/.env`)
```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/hostelbloom
JWT_SECRET=super_secret_jwt_key_2026
GROQ_API_KEY=your_groq_api_key_here
```

#### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:3000/api
```
*(Adjust when deploying to point to your live backend `https://your-api.onrender.com/api`)*

### 4.3 Installation & run
```bash
# 1. Clone
git clone <repo-url> Sem3project
cd Sem3project

# 2. Backend
cd backend
npm install
npm run dev            # nodemon on http://localhost:3000

# 3. Frontend (new terminal)
cd ../frontend
npm install
npm run dev            # Vite on http://localhost:5173
```
The backend automatically connects to MongoDB. You can adjust the initialization script in `src/utils/seedDatabase.js` to pre-populate dummy rooms and the admin account on initial configuration.

---

## 5. Backend design
### 5.1 MongoDB Architecture
We rely entirely on the **Native MongoDB Node.js Driver** for extreme flexibility and speed, bypassing traditional ORM limits.
- **Collections:** `rooms`, `users`, `bookings`
- **Security:** Passwords hashed with `bcryptjs`. Endpoints protected with standard `Bearer` tokens validating JWTs using `jsonwebtoken`.

### 5.2 API surface (base `/api`)
| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/rooms` | All rooms |
| GET | `/rooms/available` | Only rooms with `status = Available` |
| POST | `/bookings` | Create booking, validates, auto-confirms + marks room booked |
| GET | `/bookings/user/:userId` | Bookings for a specific user |
| PATCH | `/bookings/:bookingId/cancel`| Cancel booking, release room back to `Available` |
| POST | `/auth/register` | Create account (hashed password) |
| POST | `/auth/login` | Verify credentials, respond with JWT |
| POST | `/chat` | Sends user query with message context to Groq SDK and returns text response |

---

## 6. Frontend architecture
- **Routing:** Handled locally by `react-router-dom`. Standard routes (`/`, `/rooms`, `/book`, `/login`, `/register`, etc.).
- **Animations:** 
  - `Framer Motion`: Used explicitly for `<AnimatePresence>` and `<PageWrapper>`. Eliminates all jerky URL-loads allowing a boutique Single Page App feeling.
  - `Anime.js`: Reusable physics-based micro-interactions exported from `/animations/microInteractions.js`.
- **State management:** `AuthContext` firmly manages the global context by storing the user JWT safely inside `localStorage`.

---

## 7. Deployment guide
### 7.1 Backend (Render)
1. Deploy `backend/` directory as a "Web Service" on Render.
2. Build command: `npm install`
3. Start command: `node src/server.js`
4. **CRITICAL:** Paste all `.env` variables inside Render's *Environment Variables* dashboard. 
5. Add `0.0.0.0/0` (Allow Access From Anywhere) inside your MongoDB Atlas Network Access rules.

### 7.2 Frontend (Vercel)
1. Deploy `frontend/` directory to Vercel as a Vite template.
2. In the Vercel *Environment Variables* dashboard, add `VITE_API_BASE_URL` pointing to your shiny new Render backend URL with `/api` appended (e.g. `https://your-api.onrender.com/api`).
3. Deploy!

---

## 8. Credits & License
Crafted with ❤️ for modern campus living and academic evaluations.
MIT License – reuse, remix, just retain attribution.
