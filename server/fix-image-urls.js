/**
 * One-time migration: replace Figma API image URLs in MongoDB with permanent S3 URLs.
 * Run once: node fix-image-urls.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const BASE = 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website';

// ── S3 URL maps ────────────────────────────────────────────────────────────────

const SERVICE_IMAGES = {
  'cfo-strategic-advisory':           `${BASE}/service-cfo-advisory.png`,
  'cfo-advisory':                     `${BASE}/service-cfo-advisory.png`,
  'finance-setup-structuring':        `${BASE}/service-finance-setup.png`,
  'accounting-compliance':            `${BASE}/service-accounting.png`,
  'accounting-financial-administration': `${BASE}/service-accounting.png`,
  'audit-assurance':                  `${BASE}/service-audit-assurance.png`,
  'company-incorporation':            `${BASE}/service-company-incorporation.png`,
  'cross-border-advisory':            `${BASE}/service-cross-border-advisory.png`,
  'cross-border-international-advisory': `${BASE}/service-cross-border-advisory.png`,
  'operations-performance-advisory':  `${BASE}/service-operations-advisory.png`,
};

const ARTICLE_IMAGES = {
  'navigating-cross-border-tax-structures': `${BASE}/insight-article-1.png`,
  'cfo-role-scale-ups':                     `${BASE}/insight-article-2.png`,
  'cyprus-holding-structures':              `${BASE}/insight-article-3.png`,
  'financial-readiness-series-a':           `${BASE}/insight-article-4.png`,
  'netherlands-holding-gateway':            `${BASE}/insight-article-5.png`,
  'greece-non-dom-regime':                  `${BASE}/insight-article-6.png`,
  'transfer-pricing-european-smes':         `${BASE}/insight-article-1.png`,
  'fintech-licensing-eu-landscape':         `${BASE}/insight-article-2.png`,
};

const INDUSTRY_IMAGES = {
  'financial-services-banking':   `${BASE}/industry-financial-services.png`,
  'financial-services':           `${BASE}/industry-financial-services.png`,
  'investment-management':        `${BASE}/industry-investment-management.png`,
  'technology-fintech':           `${BASE}/industry-technology-fintech.png`,
  'real-estate-property':         `${BASE}/industry-real-estate.png`,
  'real-estate':                  `${BASE}/industry-real-estate.png`,
  'shipping-maritime':            `${BASE}/industry-shipping-maritime.png`,
};

const CASE_STUDY_IMAGES_BY_ORDER = {
  1: `${BASE}/case-study-asset-manager.png`,
  2: `${BASE}/case-study-fintech-licensing.png`,
  3: `${BASE}/case-study-shipping-restructure.png`,
  4: `${BASE}/case-study-investment-bank.png`,
};

const JURISDICTION_IMAGES = {
  cyprus: {
    flagUrl:   `${BASE}/jurisdiction-cyprus-photo.png`,
    heroImage: `${BASE}/jurisdiction-detail-photo-1.png`,
  },
  netherlands: {
    flagUrl:   `${BASE}/jurisdiction-netherlands-photo.png`,
    heroImage: `${BASE}/jurisdiction-detail-photo-2.png`,
  },
  greece: {
    flagUrl:   `${BASE}/jurisdiction-greece-photo.png`,
    heroImage: `${BASE}/jurisdiction-detail-photo-3.png`,
  },
};

// Team: use team-photo-1.png until the correct photo is uploaded
const TEAM_IMAGE = `${BASE}/team-photo-1.png`;

// ── Helpers ────────────────────────────────────────────────────────────────────

function isBroken(url) {
  if (!url) return false;
  return url.includes('figma.com') || url.includes('localhost') || url.startsWith('/uploads/');
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB\n');

  const db = mongoose.connection.db;
  let fixed = 0;

  // ── Services ────────────────────────────────────────────────────────────────
  const services = await db.collection('services').find({}).toArray();
  for (const s of services) {
    if (!isBroken(s.image)) continue;
    const url = SERVICE_IMAGES[s.slug] || null;
    if (!url) { console.log(`  ⚠ No S3 mapping for service slug: ${s.slug}`); continue; }
    await db.collection('services').updateOne({ _id: s._id }, { $set: { image: url } });
    console.log(`  ✔ Service: ${s.title} → ${url.split('/').pop()}`);
    fixed++;
  }

  // ── Articles ────────────────────────────────────────────────────────────────
  const articles = await db.collection('articles').find({}).toArray();
  for (const a of articles) {
    if (!isBroken(a.image)) continue;
    const url = ARTICLE_IMAGES[a.slug] || null;
    if (!url) { console.log(`  ⚠ No S3 mapping for article slug: ${a.slug}`); continue; }
    await db.collection('articles').updateOne({ _id: a._id }, { $set: { image: url } });
    console.log(`  ✔ Article: ${a.slug} → ${url.split('/').pop()}`);
    fixed++;
  }

  // ── Industries ──────────────────────────────────────────────────────────────
  const industries = await db.collection('industries').find({}).toArray();
  for (const ind of industries) {
    if (!isBroken(ind.image)) continue;
    const key = ind.slug || slugify(ind.title || '');
    const url = INDUSTRY_IMAGES[key] || null;
    if (!url) { console.log(`  ⚠ No S3 mapping for industry: ${key}`); continue; }
    await db.collection('industries').updateOne({ _id: ind._id }, { $set: { image: url } });
    console.log(`  ✔ Industry: ${ind.title} → ${url.split('/').pop()}`);
    fixed++;
  }

  // ── Case Studies ─────────────────────────────────────────────────────────────
  const caseStudies = await db.collection('casestudies').find({}).sort({ order: 1 }).toArray();
  let csIndex = 1;
  for (const cs of caseStudies) {
    if (!isBroken(cs.image)) { csIndex++; continue; }
    const url = CASE_STUDY_IMAGES_BY_ORDER[cs.order || csIndex] || CASE_STUDY_IMAGES_BY_ORDER[csIndex] || null;
    if (!url) { console.log(`  ⚠ No S3 mapping for case study order ${cs.order}`); csIndex++; continue; }
    await db.collection('casestudies').updateOne({ _id: cs._id }, { $set: { image: url } });
    console.log(`  ✔ Case Study: ${cs.title?.slice(0, 40)} → ${url.split('/').pop()}`);
    fixed++;
    csIndex++;
  }

  // ── Jurisdictions ────────────────────────────────────────────────────────────
  const jurisdictions = await db.collection('jurisdictions').find({}).toArray();
  for (const j of jurisdictions) {
    const mapping = JURISDICTION_IMAGES[j.slug];
    if (!mapping) { console.log(`  ⚠ No S3 mapping for jurisdiction: ${j.slug}`); continue; }
    const updates = {};
    if (isBroken(j.flagUrl))   { updates.flagUrl   = mapping.flagUrl;   }
    if (isBroken(j.heroImage)) { updates.heroImage  = mapping.heroImage; }
    if (Object.keys(updates).length === 0) continue;
    await db.collection('jurisdictions').updateOne({ _id: j._id }, { $set: updates });
    console.log(`  ✔ Jurisdiction: ${j.country} → flagUrl=${mapping.flagUrl.split('/').pop()}, heroImage=${mapping.heroImage.split('/').pop()}`);
    fixed++;
  }

  // ── Team Members ─────────────────────────────────────────────────────────────
  const team = await db.collection('teammembers').find({}).toArray();
  for (const t of team) {
    if (!isBroken(t.image)) continue;
    await db.collection('teammembers').updateOne({ _id: t._id }, { $set: { image: TEAM_IMAGE } });
    console.log(`  ✔ Team: ${t.name} → ${TEAM_IMAGE.split('/').pop()}`);
    fixed++;
  }

  console.log(`\n✅ Done — fixed ${fixed} image URL(s).`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
