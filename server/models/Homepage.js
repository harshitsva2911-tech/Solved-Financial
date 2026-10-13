const mongoose = require('mongoose');

const HomepageSchema = new mongoose.Schema({
  hero: {
    headline: { type: String, required: true, default: 'Personal financial expertise. Clearer business decisions.' },
    text: { type: String, required: true, default: 'Boutique accounting, CFO and M&A advisory for businesses in Cyprus and the Netherlands. We combine personal attention with structured digital processes to keep your finances organised and help you plan ahead.' },
    primaryButton: { label: String, link: String },
    secondaryButton: { label: String, link: String }
  },
  countryCards: {
    cyprus: {
      title: { type: String, default: 'Cyprus' },
      text: { type: String, default: 'Digital accounting (Accounting, VAT,), company support and M&A advisory, with easy document submission, client invoicing and organised communication.' },
      buttonLabel: { type: String, default: 'Explore Cyprus Services' },
      link: { type: String, default: '/jurisdictions/cyprus' }
    },
    netherlands: {
      title: { type: String, default: 'Netherlands' },
      text: { type: String, default: 'CFO (including setting up finance departments...) and M&A advisory for entrepreneurs and growing businesses, with reporting and processes that support better decisions.' },
      buttonLabel: { type: String, default: 'Explore Netherlands Services' },
      link: { type: String, default: '/jurisdictions/netherlands' }
    }
  },
  boutiqueSection: {
    text: { type: String, default: 'A closer working relationship. Our accounting and client-support team takes time to understand your business and priorities...' }
  },
  digitalExperience: {
    text: { type: String, default: 'Modern processes for digital businesses.' }
  },
  cfoMaSection: {
    text: { type: String, default: 'Strategic CFO & M&A Advisory.' }
  },
  closingInvitation: {
    text: { type: String, default: 'Tell us about your business. We will help you identify the right support.' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Homepage', HomepageSchema);
