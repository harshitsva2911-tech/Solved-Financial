// Run: node fixFields.js
// Patches existing DB records with correct field names (image, linkedin, suffix)

if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = require('crypto').webcrypto;
}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const tls = require('tls');

dotenv.config({ path: path.join(__dirname, '.env') });

const _tlsConnect = tls.connect;
tls.connect = function (options, ...rest) {
  if (options && typeof options === 'object') {
    delete options.autoSelectFamily;
    options.family = 4;
  }
  return _tlsConnect.call(this, options, ...rest);
};

const Service    = require('./models/Service');
const Metric     = require('./models/Metric');
const CaseStudy  = require('./models/CaseStudy');
const TeamMember = require('./models/TeamMember');
const Article    = require('./models/Article');

const SERVICE_IMAGES = {
  'cfo-strategic-advisory':             'https://www.figma.com/api/mcp/asset/a8f71cd2-5946-4c94-a815-1b5bca2c12ad',
  'finance-setup-structuring':          'https://www.figma.com/api/mcp/asset/eb427811-735f-45b6-97e1-344e8a5f4cd1',
  'accounting-financial-administration':'https://www.figma.com/api/mcp/asset/733abf8a-fad7-4d79-9c7a-0e9eeb7e806c',
  'operations-performance-advisory':    'https://www.figma.com/api/mcp/asset/849ddde9-0afc-4412-9b5b-c05bc718a19b',
  'company-incorporation':              'https://www.figma.com/api/mcp/asset/8ca3e77d-1fa8-49af-8a8d-2e8ab15b3a3a',
  'audit-assurance':                    'https://www.figma.com/api/mcp/asset/f749ae56-2209-450a-bb63-a89f11268cba',
  'cross-border-international-advisory':'https://www.figma.com/api/mcp/asset/060ca6a8-dc5f-4df1-8916-d4c4f5d37c98',
};

const CASE_STUDY_IMAGES = [
  { title: 'Regulatory Restructuring for a Pan-European Asset Manager', image: 'https://www.figma.com/api/mcp/asset/18976f01-a671-4601-92b7-3ad6b427e17c' },
  { title: 'Cross-Border Fintech Licensing Strategy',                  image: 'https://www.figma.com/api/mcp/asset/4a97ff9b-f97d-4b46-ab20-9af0efa130ee' },
  { title: 'Strategic Advisory for a Shipping Group Restructuring',    image: 'https://www.figma.com/api/mcp/asset/979533b3-e5e4-411f-94a6-ae0a2cf06006' },
  { title: 'Market Entry Advisory for a Global Investment Bank',       image: 'https://www.figma.com/api/mcp/asset/c8526372-9326-46ab-9994-6c062d980025' },
];

const ARTICLE_IMAGES = [
  { slugPrefix: 'navigating-cross-border-tax-structures', image: 'https://www.figma.com/api/mcp/asset/003b3fa5-5220-4d99-9dc6-fb83f3ee5372' },
  { slugPrefix: 'cfo-role-scale-ups',                     image: 'https://www.figma.com/api/mcp/asset/e936f564-e5c8-4375-a7ba-d3d67ab26c41' },
  { slugPrefix: 'cyprus-holding-structures',              image: 'https://www.figma.com/api/mcp/asset/2072c4ec-da89-4ab9-97d9-3caeed6f8cb5' },
  { slugPrefix: 'financial-readiness-series-a',           image: 'https://www.figma.com/api/mcp/asset/cca84feb-e1b1-4be1-9d22-e94c9dd732ad' },
  { slugPrefix: 'netherlands-holding-gateway',            image: 'https://www.figma.com/api/mcp/asset/d5fdd197-8070-4407-b6cc-44f9128d0557' },
  { slugPrefix: 'greece-non-dom-regime',                  image: 'https://www.figma.com/api/mcp/asset/fe51bd3d-0959-4f62-bee1-e3fc7d7bb672' },
  { slugPrefix: 'transfer-pricing-european-smes',         image: 'https://www.figma.com/api/mcp/asset/003b3fa5-5220-4d99-9dc6-fb83f3ee5372' },
  { slugPrefix: 'fintech-licensing-eu-landscape',         image: 'https://www.figma.com/api/mcp/asset/e936f564-e5c8-4375-a7ba-d3d67ab26c41' },
];

async function run() {
  console.log('Connecting...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected.\n');

  // Services
  for (const [slug, image] of Object.entries(SERVICE_IMAGES)) {
    const r = await Service.updateOne({ slug }, { $set: { image } });
    console.log(`Service ${slug}: matched=${r.matchedCount} modified=${r.modifiedCount}`);
  }

  // Case Studies
  for (const { title, image } of CASE_STUDY_IMAGES) {
    const r = await CaseStudy.updateOne({ title }, { $set: { image } });
    console.log(`CaseStudy "${title.slice(0, 40)}": matched=${r.matchedCount} modified=${r.modifiedCount}`);
  }

  // Articles
  for (const { slugPrefix, image } of ARTICLE_IMAGES) {
    const r = await Article.updateMany(
      { slug: { $regex: '^' + slugPrefix } },
      { $set: { image } }
    );
    console.log(`Article ${slugPrefix}: matched=${r.matchedCount} modified=${r.modifiedCount}`);
  }

  // Team
  const tr = await TeamMember.updateOne(
    { name: 'Alice Bradley' },
    { $set: { image: 'https://www.figma.com/api/mcp/asset/451cb826-3d2d-4486-9c64-6d8a2d8229d4', linkedin: 'https://linkedin.com' } }
  );
  console.log(`Team Alice Bradley: matched=${tr.matchedCount} modified=${tr.modifiedCount}`);

  // Metrics — drop and re-insert with numeric value + suffix
  await Metric.deleteMany({});
  await Metric.insertMany([
    { value: 123, suffix: 'k+', label: 'Transactions Advised', description: 'Across diverse industries and markets worldwide.', order: 1, active: true },
    { value: 15,  suffix: '+',  label: 'Years Experience',     description: 'Deep expertise built over decades of practice.', order: 2, active: true },
    { value: 12,  suffix: '+',  label: 'Countries Served',     description: 'A truly global footprint spanning multiple jurisdictions.', order: 3, active: true },
    { value: 98,  suffix: '%',  label: 'Client Retention',     description: 'Long-term partnerships driven by measurable results.', order: 4, active: true },
  ]);
  console.log('Metrics: re-inserted 4 with numeric values and suffix');

  await mongoose.disconnect();
  console.log('\nAll done.');
}

run().catch(e => { console.error(e.message); process.exit(1); });
