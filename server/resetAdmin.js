// node resetAdmin.js — resets admin password to Admin@123
if (typeof globalThis.crypto === 'undefined') globalThis.crypto = require('crypto').webcrypto;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const tls = require('tls');
dotenv.config({ path: path.join(__dirname, '.env') });
const _tlsConnect = tls.connect;
tls.connect = function (o, ...r) { if (o && typeof o === 'object') { delete o.autoSelectFamily; o.family = 4; } return _tlsConnect.call(this, o, ...r); };

const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const existing = await Admin.findOne({ email: 'admin@solvedfinancial.com' });
  if (existing) {
    existing.password = 'Admin@123';
    await existing.save(); // pre-save hook re-hashes
    console.log('✅ Password reset to Admin@123 for admin@solvedfinancial.com');
  } else {
    await Admin.create({ name: 'Admin', email: 'admin@solvedfinancial.com', password: 'Admin@123' });
    console.log('✅ Admin created: admin@solvedfinancial.com / Admin@123');
  }
  await mongoose.disconnect();
}).catch(e => { console.error(e.message); process.exit(1); });
