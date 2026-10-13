const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Jurisdiction = require('./models/Jurisdiction');
const Service = require('./models/Service');
const CaseStudy = require('./models/CaseStudy');
const Logo = require('./models/Logo');
const Setting = require('./models/Setting');
const Metric = require('./models/Metric');
const Article = require('./models/Article');

const cleanup = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for cleanup');

  // 1. Remove Greece Jurisdiction
  await Jurisdiction.deleteOne({ slug: 'greece' });
  console.log('Removed Greece jurisdiction');

  // 2. Remove Greece references from Services
  const services = await Service.find();
  for (const s of services) {
    let changed = false;
    if (s.excerpt && s.excerpt.includes('Greece')) {
      s.excerpt = s.excerpt.replace(/, and Greece|, Netherlands, and Greece| and Greece/g, '');
      changed = true;
    }
    if (s.description && s.description.includes('Greece')) {
      s.description = s.description.replace(/, and Greece|, Netherlands, and Greece| and Greece/g, '');
      changed = true;
    }
    if (s.description && s.description.includes('CySEC licensed advisory')) {
      s.description = s.description.replace('CySEC licensed advisory', '');
      changed = true;
    }
    if (s.description && s.description.includes('AFM & DNB regulated')) {
      s.description = s.description.replace('AFM & DNB regulated', '');
      changed = true;
    }
    if (changed) await s.save();
  }
  console.log('Cleaned Greece and fake authorisations from Services');

  // 3. Remove fake case studies
  await CaseStudy.deleteMany({
    title: { $in: [/fintech/i, /investment bank/i] }
  });
  console.log('Removed unverified case studies');

  // 4. Remove fake logos
  await Logo.deleteMany({
    name: { $in: [/Nexus Capital/i, /Meridian Group/i, /Atlas Ventures/i] }
  });
  console.log('Removed unverified logos');

  // 5. Remove fake metrics
  await Metric.deleteMany({
    value: { $in: [123, 15, 12, 98] } 
  });
  console.log('Removed unverified metrics');

  // 6. Update Cyprus Tax Rate
  const articles = await Article.find();
  for (const a of articles) {
    if (a.content && a.content.includes('12.5%')) {
      a.content = a.content.replace(/12\.5%/g, '15%');
      await a.save();
    }
  }
  
  const jurisdictions = await Jurisdiction.find();
  for (const j of jurisdictions) {
    let changed = false;
    if (j.intro && j.intro.includes('12.5%')) {
      j.intro = j.intro.replace(/12\.5%/g, '15%');
      changed = true;
    }
    
    if (j.strategyPivot && j.strategyPivot.points) {
      j.strategyPivot.points.forEach(p => {
        if (p.description.includes('12.5%')) {
          p.description = p.description.replace(/12\.5%/g, '15%');
          changed = true;
        }
      });
    }
    
    // 8. Fix "Strategy Pivot" headings
    if (j.strategyPivot && j.strategyPivot.heading === 'Strategy Pivot') {
      j.strategyPivot.heading = 'Strategic Advantages';
      changed = true;
    }
    
    if (changed) await j.save();
  }
  console.log('Updated Cyprus tax rate to 15% and fixed headings');

  // 7. Clean up Settings (GLOBAL HEADQUARTER, placeholder numbers)
  await Setting.deleteMany({
    value: { $regex: /GLOBAL HEADQUARTER|\+357 25 000 000/i }
  });
  console.log('Cleaned up unverified settings');

  console.log('Cleanup completed successfully!');
  process.exit();
};

cleanup().catch(err => { console.error(err); process.exit(1); });
