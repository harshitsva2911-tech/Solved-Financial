const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Jurisdiction = require('./models/Jurisdiction');

const checkDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const j = await Jurisdiction.find();
  console.log(j.map(x => x.slug));
  process.exit();
};

checkDB();
