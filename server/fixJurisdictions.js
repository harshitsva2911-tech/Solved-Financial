// node fixJurisdictions.js
if (typeof globalThis.crypto === 'undefined') globalThis.crypto = require('crypto').webcrypto;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const tls = require('tls');
dotenv.config({ path: path.join(__dirname, '.env') });
const _tlsConnect = tls.connect;
tls.connect = function (o, ...r) { if (o && typeof o === 'object') { delete o.autoSelectFamily; o.family = 4; } return _tlsConnect.call(this, o, ...r); };

const Jurisdiction = require('./models/Jurisdiction');

const PATCHES = [
  { slug: 'cyprus',      flagCode: 'cy', flagUrl: 'https://www.figma.com/api/mcp/asset/f0489053-8e02-4c15-8922-ce5f45efb882', heroImage: 'https://www.figma.com/api/mcp/asset/054bdc3d-2f42-4812-a78d-cba568e34419' },
  { slug: 'netherlands', flagCode: 'nl', flagUrl: 'https://www.figma.com/api/mcp/asset/91c26ec4-adc4-494d-a295-e086b62c21e6', heroImage: 'https://www.figma.com/api/mcp/asset/324bd48e-b95a-4fb6-8d31-2f5dd99a254b' },
  { slug: 'greece',      flagCode: 'gr', flagUrl: 'https://www.figma.com/api/mcp/asset/a05c1fb1-3d2f-43f5-8b1b-dc664dd33f60', heroImage: 'https://www.figma.com/api/mcp/asset/52452a28-b309-478c-82ff-9af8074ad68a' },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected.\n');
  for (const { slug, flagCode, flagUrl, heroImage } of PATCHES) {
    const r = await Jurisdiction.updateOne({ slug }, { $set: { flagCode, flagUrl, heroImage } });
    console.log(`${slug}: matched=${r.matchedCount} modified=${r.modifiedCount}`);
  }
  await mongoose.disconnect();
  console.log('\nDone.');
}).catch(e => { console.error(e.message); process.exit(1); });
