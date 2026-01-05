# HostelBloom – Full-Stack Hostel & Room Allotment Experience

HostelBloom is a human-centered hostel/room allotment prototype that blends an aesthetic React frontend with a pragmatic Express + Sequelize backend. It demonstrates the entire journey—from browsing curated rooms, authenticating, booking, tracking history, to visualizing occupancy insights—while remaining lightweight enough for rapid demos or academic evaluations.

> **Why this project?** Manual allotment and outdated portals often feel transactional. HostelBloom treats campus living like a boutique stay: calm UI, transparent availability, instant confirmations, and actionable analytics for admins.

---

## 1. Repository structure
```
Sem3project/
├── backend/                # Express REST API + Sequelize ORM
│   ├── src/config          # Database connector (MySQL by default)
│   ├── src/models          # Room, User, Booking definitions + relations
│   ├── src/controllers     # Auth, Room, Booking, Insight logic
│   ├── src/routes          # Versioned API routes under /api
│   ├── src/middleware      # Error handler
│   └── src/utils           # Seed helpers & sample bootstrap data
├── frontend/               # React (Vite) single-page app
│   ├── src/components      # Layout, Navbar, cards, stats strip, timeline
│   ├── src/pages           # Home, Rooms, Book, Login, Register, About, Facilities, History
│   ├── src/context         # AuthContext for global session state
│   ├── src/services        # Axios instance with auth header injection
│   └── src/styles          # Global aesthetic theme
└── README.md               # You are here – exhaustive documentation
```

---

## 2. Feature tour
- **Welcoming landing page** with highlights, testimonials, and live stats pulled from `/api/insights/overview`.
- **Room explorer** (`/rooms`) listing all rooms with imagery, capacity, amenities and ratings.
- **Booking workflow** (`/book`) where authenticated users select a room, choose dates, add preferences, and confirm instantly.
- **Auth flows** – login & registration with validation, hashed passwords, and JWT issuance.
- **Booking history dashboard** (`/history`) showing past/future stays, statuses, and inline cancellation.
- **Facilities page** (`/facilities`) detailing communal spaces, rituals, and amenities.
- **About page** (`/about`) covering mission, values, timeline, and live stats.
- **Gallery** (`/gallery`) showcasing curated photography from suites, communal areas, and wellness spaces.
- **Policies** (`/policies`) summarizing quiet hours, sustainability, refunds, and security practices.
- **FAQ** (`/faq`) interactive accordion answering common student/parent questions.
- **Contact & concierge** (`/contact`) form + map so families can reach the team instantly.
- **Insight APIs** for admins, exposing totals, occupancy rate, and weekly activity.
- **Sample seeds** providing three stylized rooms and an admin user for immediate demos.

---

## 3. Tech stack
| Layer      | Choice                    | Notes |
| ---------- | ------------------------- | ----- |
| Frontend   | React 18 + Vite + Hooks   | React Router, Axios, custom CSS (Space Grotesk aesthetic) |
| Backend    | Node.js 18 + Express 5    | RESTful routes, express-validator, bcrypt, JWT |
| ORM        | Sequelize 6               | Models for `Room`, `User`, `Booking`, eager loading |
| Database   | MySQL / MariaDB (default) | Swap to Postgres/Supabase by changing Sequelize dialect + driver |
| Tooling    | Nodemon, dotenv           | Hot reload backend, env management |

---

## 4. Getting started locally
### 4.1 Prerequisites
- Node.js ≥ 18 and npm ≥ 9
- Running MySQL/MariaDB instance (local Docker, XAMPP, or hosted). For Supabase/Postgres use the same steps but update the dialect & driver (notes below).
- (Optional) Modern browser for the React UI

### 4.2 Environment variables
#### Backend (`backend/.env`)
```
PORT=5000
DB_NAME=hostel_db
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=127.0.0.1
DB_DIALECT=mysql          # Use 'postgres' for Supabase/Postgres
JWT_SECRET=replace_this_secret
JWT_EXPIRES_IN=2d
```
> **Supabase note:** Grab the connection string from the Supabase dashboard. Set `DB_DIALECT=postgres`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and ensure the port (often 6543 or 5432). Install `pg pg-hstore` and remove `mysql2` if you fully switch.

#### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:5000/api
```
Adjust when deploying (e.g., `https://your-backend.example.com/api`).

### 4.3 Installation & run
```bash
# 1. Clone
cd /path/to/workspace
git clone <repo-url> Sem3project
cd Sem3project

# 2. Backend
cd backend
cp .env.example .env   # edit credentials
npm install
npm run dev            # nodemon on http://localhost:5000

# 3. Frontend (new terminal)
cd ../frontend
cp .env.example .env
npm install
npm run dev -- --host  # Vite on http://localhost:5173
```
Sequelize will auto-sync tables on startup and seed:
- **Rooms:** Aurora 101, Lumen 202, Velvet 303 (with types, amenities, wing, floor, rating)
- **Admin user:** `admin@hostelify.com` / `Admin@123`

### 4.4 Testing the flow
1. Open `http://localhost:5173/`.
2. Browse rooms, note ratings and amenities.
3. Register a student account or reuse the admin.
4. Login and book via `/book` (select room + dates + notes).
5. Visit `/history` to review the booking; cancel to watch it revert to “Available”.
6. Check `/facilities` and `/about` for additional context.

---

## 5. Backend design
### 5.1 Sequelize models
| Model   | Key fields |
| ------- | ---------- |
| `Room`  | name, type, capacity, pricePerNight, status (`Available`, `Booked`, `Maintenance`), amenities (JSON), photoUrl, description, floor, wing, rating |
| `User`  | fullName, email (unique), password (bcrypt hash), role (`student`/`admin`) |
| `Booking` | checkIn, checkOut, guests, status (`Pending`, `Confirmed`, `Cancelled`), notes, FK `userId`, FK `roomId` |

Relations:
- `User.hasMany(Booking)` and `Room.hasMany(Booking)` with aliases for eager loading.

### 5.2 API surface (base `/api`)
| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/rooms` | All rooms, sorted by price |
| GET | `/rooms/available` | Only rooms with `status = Available` |
| POST | `/bookings` | Create booking – validates room availability, date order, capacity, auto-confirms + marks room booked |
| GET | `/bookings` | All bookings with room + user context (admin view) |
| GET | `/bookings/user/:userId` | Bookings for a specific user (used by history page) |
| PATCH | `/bookings/:bookingId/cancel` | Cancel booking, release room back to `Available` |
| POST | `/auth/register` | Create account (duplicate email guard) |
| POST | `/auth/login` | Verify credentials, respond with JWT + profile |
| GET | `/insights/overview` | Totals (rooms, availability, users, bookings) + occupancy rate |
| GET | `/insights/recent-bookings` | Week-to-date booking log (can power dashboards) |

Validation handled by `express-validator`. Errors return `{ errors: [...] }` arrays or `{ message }` strings. A global `errorHandler` ensures consistent JSON responses.

### 5.3 Switching to Supabase/Postgres
1. Install `npm install pg pg-hstore` inside `backend`.
2. Update `DB_DIALECT=postgres` in `.env`.
3. Set the  host, db name, user, password, and port.
4. Restart `npm run dev`. Sequelize will connect to the Postgres instance and create identical tables.

---

## 6. Frontend architecture
- **Routing:** React Router organizes `/`, `/rooms`, `/book`, `/login`, `/register`, `/about`, `/facilities`, `/history`, `/gallery`, `/policies`, `/faq`, `/contact`.
- **State management:** `AuthContext` stores user + token in `localStorage`, exposes `login`, `register`, `logout`, `isAuthenticated`, and `loading` flag.
- **API client:** `src/services/api.js` adds `Authorization: Bearer <token>` when present and targets `VITE_API_BASE_URL`.
- **Key components:**
  - `Layout` wraps Navbar + Footer.
  - `StatsStrip` fetches live occupancy numbers.
  - `RoomCard` displays imagery, amenities, rating, and selection CTA.
  - `StoryTimeline`, `Facilities` cards, testimonials for narrative depth.
- **Styling:** Single `global.css` employing CSS grids, fluid typography, badges per status, glassy navbar, responsive breakpoints.

---

## 7. Deployment guide
### 7.1 Backend (Render / Railway / Heroku)
1. Set environment variables per Section 4.2 in the hosting platform.
2. Ensure the database is reachable (MySQL, MariaDB, or Supabase). Allowlisted IP may be required.
3. Build steps: `npm install` then `npm run start` (runs `node src/server.js`).
4. On first boot the app syncs + seeds. Monitor logs for Sequelize output.
5. Configure CORS to permit your frontend domain (default `cors()` already allows all origins; tighten in production as needed).

### 7.2 Frontend (Vercel / Netlify)
1. Point the deployment to the `frontend` directory.
2. Set `VITE_API_BASE_URL` to the deployed backend URL.
3. Build command `npm run build`, output directory `dist`.
4. After deploy, verify API calls via browser devtools (should hit HTTPS backend).

---

## 8. Testing & manual QA
- **Auth:** Register, login, try invalid credentials to see validation errors.
- **Bookings:** Attempt to double-book the same room—second attempt should fail because status flips to `Booked`.
- **History:** Cancel a booking and confirm status badge turns red plus room reappears under available rooms.
- **Insights:** Hit `/api/insights/overview` in a REST client to confirm JSON payload (counts, occupancy).
- **Responsive UI:** Resize to mobile width—navbar collapses into hamburger, grids stack.

---

## 9. Extending the prototype
- Add role-based dashboards (JWT middleware + admin-only routes).
- Introduce waitlist logic (`status = Pending`) with approval flows.
- Connect to campus identity providers (OAuth/SAML) instead of local auth.
- Replace static facility/testimonial content with CMS-driven data.
- Integrate payments or security deposits before confirming bookings.

---

## 10. Credits & license
Crafted with ❤️ for Sem 3 project evaluations. MIT License – reuse, remix, just retain attribution.
