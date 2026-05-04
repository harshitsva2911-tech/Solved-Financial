# Solved Financial Services — Full Stack Web Application

## Project Structure

```
Solved Financial/
├── server/       → Node.js + Express + MongoDB backend (port 5000)
├── client/       → React customer-facing website (port 3000)
└── admin/        → React admin panel / CMS (port 3001)
```

---

## Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm v9+

---

## 1. Backend Setup (`/server`)

```bash
cd server
```

Edit `.env` and set your MongoDB URI and other values:
```
MONGO_URI=mongodb://localhost:27017/solved-financial
JWT_SECRET=your_super_secret_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLOUDINARY_CLOUD_NAME=...   (optional — for cloud image hosting)
```

Install & start:
```bash
npm install
npm run dev        # development (nodemon)
npm start          # production
```

Seed the database with initial data (run once):
```bash
node seed.js
```

This creates:
- Admin account: `admin@solvedfinancial.com` / `Admin@123`
- All services, jurisdictions, industries, case studies, metrics, and settings

---

## 2. Customer Website (`/client`)

```bash
cd client
npm install
npm start          # runs on http://localhost:3000
```

### Pages
| Route | Page |
|---|---|
| `/` | Home / Landing |
| `/about` | About Us |
| `/services` | Our Services (with anchor sections) |
| `/jurisdictions` | Jurisdictions listing |
| `/jurisdictions/cyprus` | Cyprus detail |
| `/jurisdictions/netherlands` | Netherlands detail |
| `/jurisdictions/greece` | Greece detail |
| `/insights` | Insights / Blog listing |
| `/insights/:slug` | Article detail |
| `/industries` | Industries |
| `/experience` | Experience / Case studies |
| `/contact` | Contact Us |

---

## 3. Admin Panel (`/admin`)

```bash
cd admin
npm install
npm start          # runs on http://localhost:3001
```

Login at `http://localhost:3001/login`
- Email: `admin@solvedfinancial.com`
- Password: `Admin@123`

### Admin Modules
| Module | What you can manage |
|---|---|
| Dashboard | Stats overview + recent contacts |
| Articles | Blog/Insights CRUD (rich text editor, categories, featured, publish) |
| Contact Submissions | View inquiries, update status, add notes |
| Services | Edit service descriptions, features, images, order |
| Team | Add/edit team members (About Us page) |
| Case Studies | Add/edit Experience page case studies |
| Industries | Manage industry sectors |
| Jurisdictions | Edit Cyprus/Netherlands/Greece content + services |
| Metrics | Edit homepage stat counters (123k+, 15+, etc.) |
| Partner Logos | Upload/manage logos in the "Trusted by" strip |
| Settings | Contact info, social links, homepage text |

---

## 4. Adding the Logo

When ready, replace the placeholder in:
- `client/src/components/common/Navbar.jsx` — replace the `<LionLogo />` SVG component with your actual logo
- `client/src/components/common/Footer.jsx` — same

Supported formats: **SVG** (preferred) or **PNG with transparent background**

---

## 5. Email Configuration

In `server/.env`, set Gmail credentials (use an App Password, not your regular password):
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
ADMIN_EMAIL=admin@solvedfinancial.com
```

Enable "Less secure apps" or generate an App Password at: Google Account → Security → App Passwords

---

## 6. Production Deployment

### Build frontend:
```bash
cd client && npm run build
cd admin && npm run build
```

### Serve with Express (optional):
Add this to `server/server.js` before the MongoDB connect:
```js
app.use('/admin', express.static(path.join(__dirname, '../admin/build')));
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Tailwind CSS v3, Framer Motion, Swiper.js |
| Admin | React 18, React Router v6, Tailwind CSS v3, React Quill (rich text) |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Email | Nodemailer (Gmail SMTP) |
| Uploads | Multer (local) |
