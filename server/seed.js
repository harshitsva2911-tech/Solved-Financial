const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Admin = require('./models/Admin');
const Metric = require('./models/Metric');
const Service = require('./models/Service');
const Jurisdiction = require('./models/Jurisdiction');
const Industry = require('./models/Industry');
const CaseStudy = require('./models/CaseStudy');
const Setting = require('./models/Setting');
const Article = require('./models/Article');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Admin
  const adminExists = await Admin.countDocuments();
  if (!adminExists) {
    await Admin.create({ name: 'Admin', email: 'admin@solvedfinancial.com', password: 'Admin@123' });
    console.log('Admin created: admin@solvedfinancial.com / Admin@123');
  }

  // Metrics
  await Metric.deleteMany();
  await Metric.insertMany([
    { value: 123, suffix: 'k+', label: 'Transactions Advised', description: 'Total financial transactions successfully advised across our global client base.', order: 1 },
    { value: 15, suffix: '+', label: 'Years of Experience', description: 'Over a decade of senior-level financial leadership and advisory expertise.', order: 2 },
    { value: 12, suffix: '+', label: 'Countries Served', description: 'Cross-border advisory spanning European and international jurisdictions.', order: 3 },
    { value: 98, suffix: '%', label: 'Client Retention Rate', description: 'Our long-term client relationships reflect the trust we build through results.', order: 4 },
  ]);

  // Services
  await Service.deleteMany();
  await Service.insertMany([
    { title: 'CFO & Strategic Advisory', slug: 'cfo-strategic-advisory', excerpt: 'Board-level financial leadership for ambitious enterprises.', description: 'Solved Financial Services provides CFO-level expertise to founders, management teams, and boards requiring senior financial leadership, strategic insight, and decision-making support. We act as your trusted financial co-pilot — bridging the gap between strategy and execution.', features: ['Strategic financial planning', 'Board-level reporting', 'Investor relations support', 'KPI frameworks & dashboards', 'Business model optimisation'], order: 1 },
    { title: 'Finance Setup & Structuring', slug: 'finance-setup-structuring', excerpt: 'Building scalable financial foundations for growing organisations.', description: 'We design and implement structured financial ecosystems that support sustainable growth. From establishing a new finance function to restructuring an existing one, we provide the framework for high-performance financial management.', features: ['Chart of accounts setup', 'Financial process design', 'Accounting system implementation', 'Reporting infrastructure', 'Financial controls framework'], order: 2 },
    { title: 'Accounting & Financial Administration', slug: 'accounting-financial-administration', excerpt: 'Structured, compliant, and transparent financial management.', description: 'Solved Financial Services delivers structured, compliant, and transparent financial administration tailored to the operational and regulatory needs of growing organisations. Our team handles the full spectrum of bookkeeping, reconciliations, payroll support, and financial reporting.', features: ['Bookkeeping & reconciliations', 'VAT filing & compliance', 'Financial statements preparation', 'Payroll administration support', 'Multi-currency accounting'], order: 3 },
    { title: 'Operations & Performance Advisory', slug: 'operations-performance-advisory', excerpt: 'Connecting financial insights to operational excellence.', description: 'We help leadership teams understand the financial drivers behind their operations. By linking financial data to operational KPIs, we support better decision-making and performance improvement across the business.', features: ['Cost optimisation strategies', 'Supply chain financial analysis', 'Performance management systems', 'Operational budgeting', 'Variance analysis & reporting'], order: 4 },
    { title: 'Company Incorporation', slug: 'company-incorporation', excerpt: 'End-to-end support for establishing legal entities in key jurisdictions.', description: 'Solved Financial Services supports entrepreneurs and businesses seeking to establish or restructure their legal presence in Cyprus and the Netherlands. We manage the full incorporation process, including nominee services, regulatory filings, and post-incorporation setup.', features: ['Jurisdiction selection advice', 'Full incorporation process', 'Nominee director services', 'Bank account opening support', 'Post-incorporation compliance'], order: 5 },
    { title: 'Audit & Assurance', slug: 'audit-assurance', excerpt: 'Independent financial verification for investor-grade confidence.', description: 'Through our network of partner firms in Cyprus and the Netherlands, Solved Financial Services coordinates audit and assurance engagements that meet local regulatory requirements and international standards, giving stakeholders the confidence they need.', features: ['Statutory audit coordination', 'Financial due diligence', 'Internal audit support', 'Regulatory compliance review', 'Audit readiness preparation'], order: 6 },
    { title: 'Cross-Border & International Advisory', slug: 'cross-border-international-advisory', excerpt: 'Navigating multi-jurisdictional financial complexity with expertise.', description: 'Solved Financial Services provides specialist advisory for businesses operating or expanding across borders. We help clients navigate the regulatory, structural, and financial complexities of international expansion, particularly within European jurisdictions.', features: ['Cross-border tax structuring', 'Transfer pricing advisory', 'International entity structuring', 'Regulatory mapping', 'Multi-jurisdiction compliance'], order: 7 },
  ]);

  // Jurisdictions
  await Jurisdiction.deleteMany();
  await Jurisdiction.insertMany([
    {
      country: 'Cyprus', slug: 'cyprus', order: 1,
      tagline: 'Modern accounting. Personal support. A clearer view of your Cyprus business.',
      intro: 'We support Cyprus companies with financial administration, practical business advice and a connected digital client experience. Submit documents, issue invoices and communicate with our team through the systems included in your agreed service package.',
      strategyPivot: {
        heading: 'Strategy Pivot',
        points: [
          { title: 'Competitive Corporate Tax', description: 'Cyprus maintains a highly competitive and EU-compliant corporate tax rate, making it attractive for holding and trading structures.' },
          { title: 'EU Compliant', description: 'Full compliance with EU directives ensures access to European markets while maintaining a competitive regulatory environment.' }
        ]
      },
      services: [
        { title: 'M&A Advisory', description: 'Acquisition searches, target screening, financial analysis, financial due diligence coordination and transaction support for Cyprus businesses and investors; scope each stage explicitly.', features: ['Acquisition searches', 'Target screening', 'Financial analysis', 'Transaction support'] },
        { title: 'Digital Accounting & VAT', description: 'Bookkeeping, transaction reviews, reconciliations, VAT support, missing-document follow-up and reporting records. Explain who delivers and files each element.', features: ['Bookkeeping', 'Transaction reviews', 'Reconciliations', 'VAT support'] },
        { title: 'Client Invoicing & Financial Visibility', description: 'Invoice software setup, company branding, client access, training and agreed reports. State reporting frequency and invoice features accurately.', features: ['Invoice software setup', 'Company branding', 'Client access', 'Agreed reports'] },
        { title: 'Company Formation & Ongoing Support', description: 'Coordinate formation, accounting setup, tax/VAT registration and the handover to ongoing support. Identify partner-led legal/corporate work.', features: ['Coordinate formation', 'Accounting setup', 'Tax/VAT registration', 'Ongoing support'] },
        { title: 'Fractional CFO & Business Advisory', description: 'Cash planning, budgets, profitability reviews, forecasts and regular management discussions.', features: ['Cash planning', 'Budgets', 'Profitability reviews', 'Forecasts'] },
        { title: 'Corporate Structuring & Specialist Coordination', description: 'Financial analysis and coordination with the relevant tax/legal specialists; describe eligibility review rather than blanket benefits.', features: ['Financial analysis', 'Specialist coordination', 'Eligibility review', 'Tax/legal alignment'] },
        { title: 'Audit Readiness & Partner Coordination', description: 'Organised year-end records, schedules and responses for the independent auditor.', features: ['Year-end records', 'Audit schedules', 'Independent auditor coordination', 'Responses'] }
      ]
    },
    {
      country: 'Netherlands', slug: 'netherlands', order: 2,
      tagline: 'Financial clarity for growing businesses in the Netherlands.',
      intro: 'From accounting and VAT to hands-on CFO support, Solved helps entrepreneurs build reliable finance processes, understand performance and plan their next stage of growth.',
      strategyPivot: {
        heading: 'Strategy Pivot',
        points: [
          { title: 'International Hub', description: 'Amsterdam serves as a major European financial hub with excellent connectivity to global markets and a highly skilled workforce.' },
          { title: 'Advanced Tax Framework', description: 'The participation exemption, extensive treaty network, and ruling practice make the Netherlands a top choice for international structuring.' }
        ]
      },
      services: [
        { title: 'Accounting & VAT', description: 'Bookkeeping, reconciliations, VAT returns and financial reporting within the contracted scope. Separate payroll and annual accounts if they are add-ons or partner-delivered.', features: ['Bookkeeping', 'Reconciliations', 'VAT returns', 'Financial reporting'] },
        { title: 'Fractional CFO', description: 'Rolling cash forecasts, budgets, management reporting, margins, board support and financial planning.', features: ['Cash forecasts', 'Budgets', 'Management reporting', 'Financial planning'] },
        { title: 'Finance Setup & Automation', description: 'Accounting systems, invoicing, expense workflows, month-end processes, controls and reporting tools.', features: ['Accounting systems', 'Expense workflows', 'Month-end processes', 'Reporting tools'] },
        { title: 'Growth & Performance Advisory', description: 'Unit economics, cost analysis, working capital, scenarios and decision support.', features: ['Unit economics', 'Cost analysis', 'Working capital', 'Decision support'] },
        { title: 'International Business Support', description: 'Financial oversight across entities and coordination with local tax/legal advisers. Include company setup only as a clearly scoped partner-assisted service.', features: ['Financial oversight', 'Local adviser coordination', 'Multi-entity support', 'Partner-assisted company setup'] },
        { title: 'M&A Advisory', description: 'Acquisition searches, target screening, financial analysis and transaction support for Dutch businesses and investors.', features: ['Acquisition searches', 'Target screening', 'Financial analysis', 'Transaction support'] }
      ]
    }
  ]);

  // Industries
  await Industry.deleteMany();
  await Industry.insertMany([
    { title: 'Technology & Software', description: 'Fast-growing software, SaaS, and technology companies requiring scalable financial structures and investor-ready reporting.', challenges: ['Rapid growth without financial infrastructure', 'Investor reporting requirements', 'SaaS metric tracking (ARR, Churn)'], support: ['Finance function buildout', 'Investor-ready financial reporting', 'KPI frameworks', 'Fractional CFO support'], image: '', order: 1 },
    { title: 'Ecommerce & Retail', description: 'Omnichannel and pure-play ecommerce businesses needing deep visibility into inventory, pricing, and working capital across multiple markets.', challenges: ['Complex inventory cash requirements', 'Understanding true margins after operational costs', 'Multi-market VAT and financial visibility'], support: ['Margin and inventory analysis', 'Working capital planning', 'Operational cost reviews', 'Multi-market financial visibility'], image: '', order: 2 },
    { title: 'Professional Services', description: 'Consultancies, agencies, and service firms looking to optimise project profitability, cash flow, and operational efficiency.', challenges: ['Project-level profitability tracking', 'Cash flow management with varying payment terms', 'Scaling team costs vs revenue'], support: ['Profitability analysis', 'Cash flow forecasting', 'Management reporting', 'Partner compensation structuring'], image: '', order: 3 },
    { title: 'Startups & Scale-ups', description: 'Early-stage and high-growth businesses that need financial structure, strategic funding support, and senior advisory without the cost of a full-time executive.', challenges: ['Securing and managing funding', 'Establishing basic financial controls', 'Scenario planning and runway management'], support: ['Fractional CFO services', 'Financial modelling', 'Growth advisory', 'Board support'], image: '', order: 4 },
    { title: 'Owner-managed International Businesses', description: 'Established international businesses seeking professional financial management, structured growth strategies, and cross-border oversight.', challenges: ['Professionalising financial management', 'Multi-entity oversight', 'Succession or exit planning'], support: ['Group reporting and consolidation', 'Financial professionalisation', 'Exit preparation', 'Strategic financial planning'], image: '', order: 5 }
  ]);

  // Case Studies
  await CaseStudy.deleteMany();
  await CaseStudy.insertMany([
    { title: 'Finance Transformation (Technology)', subtitle: 'Founder\'s prior career experience', situation: 'A fast-growing technology business required an overhaul of its basic accounting processes to support rapid expansion.', approach: 'Designed and implemented end-to-end accounting workflows, automated approvals, and a structured month-end close process.', outcomes: ['Reduced month-end close from 15 to 5 days', 'Implemented automated approval workflows', 'Delivered reliable, investor-ready management reporting'], image: '', order: 1 },
    { title: 'Ecommerce & Retail Operations', subtitle: 'Solved engagement', situation: 'An international ecommerce brand lacked visibility into true margins and suffered from working capital constraints tied to inventory.', approach: 'Analysed pricing structures, implemented inventory cash-requirement forecasting, and established multi-market financial visibility.', outcomes: ['Clarified true product margins across all markets', 'Optimised inventory purchasing cycles', 'Improved working capital and cash availability'], image: '', order: 2 },
    { title: 'Group Reporting & Consolidation', subtitle: 'Founder\'s prior career experience', situation: 'A complex multi-entity group required a unified reporting structure and better oversight across international operations.', approach: 'Built a consolidated reporting framework, aligning chart of accounts and establishing clear reporting lines.', outcomes: ['Delivered unified multi-entity oversight', 'Standardised reporting structures across jurisdictions', 'Enhanced board-level decision making'], image: '', order: 3 },
    { title: 'Cash-flow & Turnaround Work', subtitle: 'Solved engagement', situation: 'A business facing severe cash constraints needed immediate intervention to stabilize operations and rebuild stakeholder confidence.', approach: 'Implemented strict short-term cash planning, conducted deep performance reviews, and established transparent stakeholder reporting.', outcomes: ['Stabilised operational cash flow within 30 days', 'Identified and eliminated unprofitable operational costs', 'Restored stakeholder and creditor confidence'], image: '', order: 4 }
  ]);

  // Settings
  await Setting.deleteMany();
  await Setting.insertMany([
    { key: 'address', value: '25 Griva Digeni Avenue, Limassol, Cyprus', group: 'contact' },
    { key: 'phone', value: '+357 25 123 456', group: 'contact' },
    { key: 'email', value: 'info@solvedfinancial.com', group: 'contact' },
    { key: 'linkedin', value: 'https://linkedin.com/company/solved-financial-services', group: 'social' },
    { key: 'heroTitle', value: 'Strategic Financial Leadership for Ambitious Enterprises', group: 'homepage' },
    { key: 'heroSubtitle', value: 'Board-level advisory, financial structuring, and international expansion services for scale-ups, start-ups, and established enterprises.', group: 'homepage' },
    { key: 'ctaTitle', value: 'Ready to Empower your vision?', group: 'homepage' },
    { key: 'legalEntityCyprus', value: 'Solved Financial Services LTD', group: 'legal' },
    { key: 'legalEntityNetherlands', value: 'Solved Financial Services B.V.', group: 'legal' }
  ]);

  // Articles
  await Article.deleteMany();
  await Article.insertMany([
    { title: 'How to work with Solved’s digital accounting service', slug: 'how-to-work-digital-accounting-cyprus', excerpt: 'A guide to our digital accounting process in Cyprus.', content: '<p>A guide to our digital accounting process in Cyprus.</p>', category: 'Cyprus', published: true, publishedAt: new Date(), lastReviewedAt: new Date(), author: 'Chris Kyriakides', reviewer: 'Solved Financial Services' },
    { title: 'What to prepare when starting your company’s accounting', slug: 'what-to-prepare-starting-accounting-cyprus', excerpt: 'Essential preparations for Cyprus companies.', content: '<p>Essential preparations for Cyprus companies.</p>', category: 'Cyprus', published: true, publishedAt: new Date(), lastReviewedAt: new Date(), author: 'Chris Kyriakides', reviewer: 'Solved Financial Services' },
    { title: 'Building a reliable month-end process', slug: 'building-reliable-month-end-process-netherlands', excerpt: 'How to construct a month-end process for Dutch entities.', content: '<p>How to construct a month-end process for Dutch entities.</p>', category: 'Netherlands', published: true, publishedAt: new Date(), lastReviewedAt: new Date(), author: 'Chris Kyriakides', reviewer: 'Solved Financial Services' },
    { title: 'When your business needs fractional CFO support', slug: 'when-business-needs-fractional-cfo', excerpt: 'Recognising the signs that your business requires senior financial leadership.', content: '<p>Recognising the signs that your business requires senior financial leadership.</p>', category: 'CFO & Business Finance', published: true, publishedAt: new Date(), lastReviewedAt: new Date(), author: 'Chris Kyriakides', reviewer: 'Solved Financial Services' },
    { title: 'Why profit and cash flow can tell different stories', slug: 'profit-and-cash-flow-different-stories', excerpt: 'Understanding the gap between your P&L and bank balance.', content: '<p>Understanding the gap between your P&L and bank balance.</p>', category: 'CFO & Business Finance', published: true, publishedAt: new Date(), lastReviewedAt: new Date(), author: 'Chris Kyriakides', reviewer: 'Solved Financial Services' },
    { title: 'Understanding margins and inventory cash requirements', slug: 'ecommerce-margins-inventory-cash', excerpt: 'Key financial metrics for ecommerce businesses.', content: '<p>Key financial metrics for ecommerce businesses.</p>', category: 'CFO & Business Finance', published: true, publishedAt: new Date(), lastReviewedAt: new Date(), author: 'Chris Kyriakides', reviewer: 'Solved Financial Services' }
  ]);

  console.log('Seed completed successfully!');
  process.exit();
};

seed().catch(err => { console.error(err); process.exit(1); });
