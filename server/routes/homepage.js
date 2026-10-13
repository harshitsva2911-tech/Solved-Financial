const express = require('express');
const router = express.Router();
const Homepage = require('../models/Homepage');

// Get homepage data
router.get('/', async (req, res) => {
  try {
    let homepage = await Homepage.findOne();
    if (!homepage) {
      // Create default if none exists
      homepage = await Homepage.create({
        hero: {
          headline: 'Personal financial expertise. Clearer business decisions.',
          text: 'Boutique accounting, CFO and M&A advisory for businesses in Cyprus and the Netherlands. We combine personal attention with structured digital processes to keep your finances organised and help you plan ahead.',
          primaryButton: { label: 'Book an Introductory Call', link: '/contact' },
          secondaryButton: { label: 'Explore Services by Country', link: '#countries' }
        }
      });
    }
    res.json(homepage);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update homepage data (Admin only ideally, but keeping it open for now per structure)
router.put('/', async (req, res) => {
  try {
    let homepage = await Homepage.findOne();
    if (!homepage) {
      homepage = new Homepage();
    }
    
    // Update fields
    if (req.body.hero) homepage.hero = { ...homepage.hero, ...req.body.hero };
    if (req.body.countryCards) homepage.countryCards = { ...homepage.countryCards, ...req.body.countryCards };
    if (req.body.boutiqueSection) homepage.boutiqueSection = { ...homepage.boutiqueSection, ...req.body.boutiqueSection };
    if (req.body.digitalExperience) homepage.digitalExperience = { ...homepage.digitalExperience, ...req.body.digitalExperience };
    if (req.body.cfoMaSection) homepage.cfoMaSection = { ...homepage.cfoMaSection, ...req.body.cfoMaSection };
    if (req.body.closingInvitation) homepage.closingInvitation = { ...homepage.closingInvitation, ...req.body.closingInvitation };
    
    await homepage.save();
    res.json(homepage);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
