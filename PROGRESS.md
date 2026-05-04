# Solved Financial Services — Project Progress

Last updated: 2026-05-01

---

## Project Overview

Full-stack financial advisory website with:
- **Client** — React 19 + Tailwind CSS (customer-facing website)
- **Admin** — React 19 + Tailwind CSS + React Quill (content management panel)
- **Server** — Node.js + Express 5 + MongoDB + Mongoose (REST API)

---

## Completion Status

### ✅ Backend Server — 100% Complete
- Express server with CORS, JWT auth, Nodemailer email
- 12 route handlers: auth, articles, contacts, services, team, case studies, industries, jurisdictions, logos, metrics, settings, uploads
- 11 Mongoose models with full schema definitions
- Multer v2 file upload + AWS S3 storage (bucket: imperial-ventures-assets, region: eu-north-1)
- Database seeding script (`seed.js`) with initial data
- Default admin: `admin@solvedfinancial.com` / `Admin@123`

### ✅ Admin Panel — 100% Complete
All 12 modules fully implemented:
- Login (JWT auth)
- Dashboard (stats + recent contacts)
- Articles (full CRUD, React Quill rich text editor)
- Contacts (status management: new/read/replied/archived)
- Services editor
- Team members management
- Case Studies manager
- Industries manager
- Jurisdictions editor (Cyprus, Netherlands, Greece)
- Metrics editor (homepage stat counters)
- Partner Logos (upload/manage)
- Settings (site config, contact info, social links)

### ✅ Client Website — 95% Complete

#### Pages
| Route | Page | Status |
|---|---|---|
| `/` | Home | ✅ Complete |
| `/about` | About Us | ✅ Complete |
| `/services` | Services | ✅ Complete |
| `/jurisdictions` | Jurisdictions | ✅ Complete |
| `/jurisdictions/:slug` | Jurisdiction Detail | ✅ Complete |
| `/insights` | Insights/Blog | ✅ Complete |
| `/insights/:slug` | Insight Detail | ✅ Complete |
| `/industries` | Industries | ✅ Complete |
| `/experience` | Experience/Case Studies | ✅ Complete |
| `/contact` | Contact | ✅ Complete |

#### Remaining
- [ ] **Logo** — `SolvedLogo.jsx` placeholder needs replacing with actual company logo SVG/PNG
- [x] **Images** — All 41 images migrated to S3 (2026-05-01). Permanent URLs — no expiry. See `server/scripts/image-mapping.json` for full mapping.

---

## Design System (Figma)

**Figma file:** `https://www.figma.com/design/8G4R81L0UfacP9H78aScoS/Solved-Financial-Services`

### Typography (matched 2026-04-29)
| Token | Font | Weight | Size | Usage |
|---|---|---|---|---|
| Title/H1 | Urbanist | SemiBold (600) | 61px | Hero headings, page titles |
| Title/H3 | Urbanist | SemiBold (600) | 39px | Section headings (FEATURED ARTICLES etc.) |
| Subtitle/Reg | Inter | Regular (400) | 25px | Hero subtitles, section descriptions |
| Subtitle/Semibold | Inter | SemiBold (600) | 25px | Card titles |
| SubtitleSM/Reg | Inter | Regular (400) | 20px | Secondary descriptions |
| Body/Med | Inter | Medium (500) | 16px | Nav links, buttons, body text |
| Caption/Med | Inter | Medium (500) | 13px | Footer labels |

**Font changes applied 2026-04-29:**
- `HeroSection.jsx` — changed `font-manrope` → `font-urbanist` on H1
- `SectionHeader.jsx` — added `font-urbanist` to all section H2 titles (cascades to all pages)
- `MetricsSection.jsx`, `FeaturedArticles.jsx`, `InternationalPresence.jsx`, `ServicesCarousel.jsx` — added `font-urbanist` to section H2
- `FooterCTA.jsx` — added `font-urbanist` to CTA heading
- `About.jsx` — added `font-urbanist` to split-section H2
- `Jurisdictions.jsx` — standardised `font-['Urbanist',sans-serif]` → `font-urbanist`
- `JurisdictionDetail.jsx` — added `font-urbanist` to strategy and service headings
- `Experience.jsx` — added `font-urbanist` to tagline H2
- `InsightDetail.jsx` — added `font-urbanist` to article H1
- `Industries.jsx` — added `font-urbanist` to industry H3
- `Services.jsx` — added `font-urbanist` to service title H2
- `Home.jsx` — added `font-urbanist` to section H2

### Colours
| Token | Hex |
|---|---|
| MidnightBlue (primary dark) | `#001B2F` |
| TradeGold (accent) | `#D4B684` |
| White | `#F5F7FA` |
| MidnightBlue-900 | `#000B14` |
| MidnightBlue-300 | `#546674` |

---

## Image Storage (AWS S3)

> ✅ All images migrated to S3 on 2026-05-01. Permanent URLs — no expiry.

**Bucket:** `imperial-ventures-assets` | **Region:** `eu-north-1` | **Prefix:** `website/`

| Asset | S3 Key |
|---|---|
| Hero — Home | `website/hero-home.png` |
| Hero — About | `website/hero-about.png` |
| Hero — Contact / Legal | `website/hero-contact.png` |
| Hero — Experience | `website/hero-experience.png` |
| Hero — Industries | `website/hero-industries.png` |
| Hero — Insights | `website/hero-insights.png` |
| Hero — Jurisdictions | `website/hero-jurisdictions.png` |
| Hero — Services | `website/hero-services.png` |
| Footer CTA background | `website/footer-cta-bg.png` |
| Team photo 1–3 | `website/team-photo-{1,2,3}.png` |
| Services (7 images) | `website/service-{cfo-advisory,finance-setup,accounting,operations-advisory,company-incorporation,audit-assurance,cross-border-advisory}.png` |
| Industries (5 images) | `website/industry-{financial-services,investment-management,technology-fintech,real-estate,shipping-maritime}.png` |
| Jurisdiction photos | `website/jurisdiction-{cyprus,netherlands,greece}-photo.png` |
| Jurisdiction detail photos | `website/jurisdiction-detail-photo-{1,2,3}.png` |
| Case studies (4 images) | `website/case-study-{asset-manager,fintech-licensing,shipping-restructure,investment-bank}.png` |
| Insight articles (6 images) | `website/insight-article-{1..6}.png` |
| World map | `website/world-map.svg` |

Full URL mapping: `server/scripts/image-mapping.json`

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, React Router v7, Tailwind CSS v3, Framer Motion |
| Admin | React 19, React Router v7, Tailwind CSS v3, React Quill |
| Backend | Node.js, Express 5, MongoDB, Mongoose v9 |
| Auth | JWT + bcryptjs |
| File uploads | Multer v2 + AWS S3 (`@aws-sdk/client-s3@3.400.0`) |
| Email | Nodemailer (Gmail SMTP) |
| Forms | React Hook Form + Yup |
| UI | Lucide Icons, Swiper.js |

---

## Environment Variables

### Server (`server/.env`)
```
MONGO_URI=
JWT_SECRET=
PORT=5000
EMAIL_USER=
EMAIL_PASS=
ADMIN_EMAIL=admin@solvedfinancial.com
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=imperial-ventures-assets
AWS_REGION=eu-north-1
CLIENT_URL=http://localhost:3000
```

### Client & Admin (`.env`)
```
REACT_APP_API_URL=http://localhost:5000
```

---

## Session Log

| Date | Work Done |
|---|---|
| 2026-04-29 | Project audit; matched all section heading fonts to Figma (Urbanist for H1/H2/H3, Inter for body); refreshed expired Figma image URLs; created PROGRESS.md |
| 2026-04-29 | Full image refresh — replaced all expired/broken Figma node-ID and UUID asset URLs across every client page and component (HeroSection, FooterCTA, About, Services, ServicesCarousel, FeaturedArticles, Insights, Contact, Experience, Industries, Jurisdictions, JurisdictionDetail, InternationalPresence, insightsData). All 35 image slots now use fresh 7-day UUIDs from Figma MCP. |
| 2026-05-01 | Removed in-memory Map cache from 9 route files (articles, industries, services, jurisdictions, logos, metrics, settings, team, caseStudies) — cache is broken in Vercel serverless (each invocation is isolated). Routes now query MongoDB directly. |
| 2026-05-01 | Fixed UTF-8 BOM corruption (â€" / â€¦ broken characters) across 6 client pages (Industries, About, Services, JurisdictionDetail, InsightDetail, Insights, Contact) — replaced byte sequences with proper HTML entities or ASCII. |
| 2026-05-01 | Switched file storage from Cloudinary to AWS S3 (`imperial-ventures-assets`, `eu-north-1`). Rewrote `server/middleware/upload.js` (memoryStorage + buffer upload), `server/utils/s3.js`, `server/routes/upload.js`, `server/routes/documents.js`. Pinned `@aws-sdk/client-s3@3.400.0` to avoid SDK hostname validation bug. |
| 2026-05-01 | Rewrote `admin/src/components/ImageUpload.jsx` — instant blob URL preview on file select, "Saved to S3" badge after upload completes. Preview no longer depends on S3 public access or CORS. |
| 2026-05-01 | Migrated all 41 website images (40 Figma MCP assets + 1 SVG world map) to S3 via `server/scripts/migrate-images.js`. All `figma.com/api/mcp/asset/*` URLs replaced with permanent S3 URLs across `client/src`. Full mapping at `server/scripts/image-mapping.json`. |
