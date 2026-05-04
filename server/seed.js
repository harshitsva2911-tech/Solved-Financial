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
    { value: '123k+', label: 'Transactions Advised', description: 'Total financial transactions successfully advised across our global client base.', order: 1 },
    { value: '15+', label: 'Years of Experience', description: 'Over a decade of senior-level financial leadership and advisory expertise.', order: 2 },
    { value: '12+', label: 'Countries Served', description: 'Cross-border advisory spanning European and international jurisdictions.', order: 3 },
    { value: '98%', label: 'Client Retention Rate', description: 'Our long-term client relationships reflect the trust we build through results.', order: 4 },
  ]);

  // Services
  await Service.deleteMany();
  await Service.insertMany([
    { title: 'CFO & Strategic Advisory', slug: 'cfo-strategic-advisory', excerpt: 'Board-level financial leadership for ambitious enterprises.', description: 'Solved Financial Services provides CFO-level expertise to founders, management teams, and boards requiring senior financial leadership, strategic insight, and decision-making support. We act as your trusted financial co-pilot — bridging the gap between strategy and execution.', features: ['Strategic financial planning', 'Board-level reporting', 'Investor relations support', 'KPI frameworks & dashboards', 'Business model optimisation'], order: 1 },
    { title: 'Finance Setup & Structuring', slug: 'finance-setup-structuring', excerpt: 'Building scalable financial foundations for growing organisations.', description: 'We design and implement structured financial ecosystems that support sustainable growth. From establishing a new finance function to restructuring an existing one, we provide the framework for high-performance financial management.', features: ['Chart of accounts setup', 'Financial process design', 'Accounting system implementation', 'Reporting infrastructure', 'Financial controls framework'], order: 2 },
    { title: 'Accounting & Financial Administration', slug: 'accounting-financial-administration', excerpt: 'Structured, compliant, and transparent financial management.', description: 'Solved Financial Services delivers structured, compliant, and transparent financial administration tailored to the operational and regulatory needs of growing organisations. Our team handles the full spectrum of bookkeeping, reconciliations, payroll support, and financial reporting.', features: ['Bookkeeping & reconciliations', 'VAT filing & compliance', 'Financial statements preparation', 'Payroll administration support', 'Multi-currency accounting'], order: 3 },
    { title: 'Operations & Performance Advisory', slug: 'operations-performance-advisory', excerpt: 'Connecting financial insights to operational excellence.', description: 'We help leadership teams understand the financial drivers behind their operations. By linking financial data to operational KPIs, we support better decision-making and performance improvement across the business.', features: ['Cost optimisation strategies', 'Supply chain financial analysis', 'Performance management systems', 'Operational budgeting', 'Variance analysis & reporting'], order: 4 },
    { title: 'Company Incorporation', slug: 'company-incorporation', excerpt: 'End-to-end support for establishing legal entities in key jurisdictions.', description: 'Solved Financial Services supports entrepreneurs and businesses seeking to establish or restructure their legal presence in Cyprus, Netherlands, and Greece. We manage the full incorporation process, including nominee services, regulatory filings, and post-incorporation setup.', features: ['Jurisdiction selection advice', 'Full incorporation process', 'Nominee director services', 'Bank account opening support', 'Post-incorporation compliance'], order: 5 },
    { title: 'Audit & Assurance', slug: 'audit-assurance', excerpt: 'Independent financial verification for investor-grade confidence.', description: 'Through our network of partner firms in Cyprus, Netherlands, and Greece, Solved Financial Services coordinates audit and assurance engagements that meet local regulatory requirements and international standards, giving stakeholders the confidence they need.', features: ['Statutory audit coordination', 'Financial due diligence', 'Internal audit support', 'Regulatory compliance review', 'Audit readiness preparation'], order: 6 },
    { title: 'Cross-Border & International Advisory', slug: 'cross-border-international-advisory', excerpt: 'Navigating multi-jurisdictional financial complexity with expertise.', description: 'Solved Financial Services provides specialist advisory for businesses operating or expanding across borders. We help clients navigate the regulatory, structural, and financial complexities of international expansion, particularly within European jurisdictions.', features: ['Cross-border tax structuring', 'Transfer pricing advisory', 'International entity structuring', 'Regulatory mapping', 'Multi-jurisdiction compliance'], order: 7 },
  ]);

  // Jurisdictions
  await Jurisdiction.deleteMany();
  await Jurisdiction.insertMany([
    {
      country: 'Cyprus', slug: 'cyprus', order: 1,
      tagline: 'A strategic gateway for international business within the EU.',
      intro: 'Cyprus offers one of the most business-friendly regulatory environments in Europe, combining a competitive tax framework, strong legal infrastructure, and full EU membership. Solved Financial Services leverages deep local expertise to support businesses establishing or expanding their presence in Cyprus.',
      strategyPivot: {
        heading: 'Strategy Pivot',
        points: [
          { title: 'Low Corporate Tax', description: 'Cyprus maintains one of the lowest corporate tax rates in the EU at 12.5%, making it highly attractive for holding and trading structures.' },
          { title: 'EU Compliant', description: 'Full compliance with EU directives ensures access to European markets while maintaining a competitive regulatory environment.' }
        ]
      },
      services: [
        { title: 'Accounting & Financial Structuring', description: 'Comprehensive accounting services tailored to Cyprus-based entities, including statutory compliance and financial reporting.', features: ['Statutory financial statements', 'Regulatory filings', 'VAT compliance', 'Corporate tax returns'] },
        { title: 'Corporate & Financial Structuring', description: 'Strategic structuring of corporate entities to optimise tax efficiency and operational effectiveness within Cyprus.', features: ['Holding company structures', 'Tax planning', 'Shareholder agreements', 'Group structuring'] },
        { title: 'CFO & Board Advisory', description: 'Senior financial leadership and strategic advisory for Cyprus-registered entities and their global management teams.', features: ['Cyprus-specific regulatory guidance', 'Financial reporting oversight', 'Board-level presentations', 'Investor communication'] },
        { title: 'Company Incorporation', description: 'Full service company formation in Cyprus including nominee services, registered office, and compliance setup.', features: ['Company registration', 'Nominee directors', 'Registered office', 'Bank account support'] },
        { title: 'Audit & Assurance Services', description: 'Coordination of statutory audit requirements in accordance with Cyprus regulatory obligations through our local partner network.', features: ['Audit coordination', 'Financial due diligence', 'Regulatory compliance', 'Audit readiness'] }
      ]
    },
    {
      country: 'Netherlands', slug: 'netherlands', order: 2,
      tagline: 'Europe\'s leading gateway for international trade and finance.',
      intro: 'The Netherlands is renowned for its pro-business environment, sophisticated financial infrastructure, and strategic location at the heart of Europe. It remains the preferred jurisdiction for multinational headquarters, holding structures, and international trading companies.',
      strategyPivot: {
        heading: 'Strategy Pivot',
        points: [
          { title: 'International Hub', description: 'Amsterdam serves as a major European financial hub with excellent connectivity to global markets and a highly skilled workforce.' },
          { title: 'Advanced Tax Framework', description: 'The participation exemption, extensive treaty network, and ruling practice make the Netherlands a top choice for international structuring.' }
        ]
      },
      services: [
        { title: 'Accounting & Financial Administration', description: 'Full-cycle accounting and financial administration for Netherlands-based entities, ensuring Dutch GAAP compliance.', features: ['Dutch GAAP compliance', 'Annual accounts preparation', 'VAT declarations', 'Payroll administration'] },
        { title: 'Finance Setup & Structuring', description: 'Establishing robust financial frameworks for newly formed or expanding Netherlands entities.', features: ['Finance function setup', 'System implementation', 'Process documentation', 'Internal controls'] },
        { title: 'CFO & Strategic Advisory', description: 'Strategic financial guidance for businesses using the Netherlands as their European base of operations.', features: ['Holding structure advice', 'Group financial oversight', 'Reporting to international boards', 'Budget & forecast management'] },
        { title: 'Operations & Performance Advisory', description: 'Financial analysis and performance optimisation for Netherlands-based operational entities.', features: ['KPI development', 'Cost analysis', 'Operational efficiency', 'Management reporting'] },
        { title: 'Company Incorporation', description: 'Complete BV incorporation services in the Netherlands, including compliance setup and ongoing administration.', features: ['BV formation', 'UBO registration', 'KVK registration', 'Opening corporate accounts'] }
      ]
    },
    {
      country: 'Greece', slug: 'greece', order: 3,
      tagline: 'An emerging strategic hub with deep European roots.',
      intro: 'Greece presents a compelling opportunity for businesses seeking access to South-Eastern European markets. With a modernising regulatory environment, EU membership, and growing technology and shipping sectors, Greece is increasingly attractive for international investment.',
      partnerFirm: { name: 'Revival Consulting Services', description: 'Solved Financial Services operates in Greece through its strategic partnership with Revival Consulting Services, a leading Greek advisory firm with extensive expertise in local regulatory compliance, tax advisory, and business establishment services.' },
      strategyPivot: {
        heading: 'Strategy Pivot',
        points: [
          { title: 'Emerging Market', description: 'Greece\'s modernising economy and EU membership create attractive conditions for international investors and businesses expanding into South-Eastern Europe.' },
          { title: 'Strategic Location', description: 'Greece\'s position as a gateway to the Balkans, Eastern Mediterranean, and Middle East makes it strategically significant for trade and logistics businesses.' }
        ]
      },
      services: [
        { title: 'Accounting & Compliance Support', description: 'Full compliance accounting for Greek entities, ensuring alignment with Greek GAAP and tax regulations.', features: ['Greek GAAP compliance', 'Corporate tax returns', 'VAT management', 'Regulatory filings'] },
        { title: 'Corporate & Business Advisory', description: 'Strategic advisory for businesses establishing or growing their Greek presence, including sector-specific guidance.', features: ['Business setup advisory', 'Regulatory guidance', 'Strategic planning', 'Market entry support'] },
        { title: 'Financial & Strategic Advisory', description: 'Senior financial advisory services for Greek entities, covering financial structuring, planning, and investor relations.', features: ['Financial modelling', 'Investor presentations', 'Funding strategy', 'CFO-level guidance'] },
        { title: 'Audit & Assurance (via Partner Network)', description: 'Statutory audit coordination through Revival Consulting Services in compliance with Greek regulatory requirements.', features: ['Statutory audit', 'Financial due diligence', 'Internal controls review', 'Audit support'] }
      ]
    }
  ]);

  // Industries
  await Industry.deleteMany();
  await Industry.insertMany([
    { title: 'Startups & Scale-ups', description: 'Fast-growing companies that need financial structure, investor-ready reporting, and CFO-level strategic support without the cost of a full-time executive.', challenges: ['Rapid growth without financial infrastructure', 'Investor reporting requirements', 'Cash flow management'], support: ['Fractional CFO services', 'Investor-ready financial reporting', 'Growth financial modelling', 'Finance function buildout', 'KPI frameworks'], image: '', order: 1 },
    { title: 'International / Cross-border Businesses', description: 'Companies operating across multiple jurisdictions requiring coordinated financial management, multi-currency accounting, and cross-border structuring expertise.', challenges: ['Multi-jurisdiction compliance', 'Transfer pricing complexities', 'Currency risk management'], support: ['Cross-border advisory', 'Multi-currency accounting', 'International entity structuring', 'Regulatory mapping', 'Group consolidation'], image: '', order: 2 },
    { title: 'Trading, FMCG & Supply Chain Businesses', description: 'Businesses with complex supply chains and high transaction volumes requiring rigorous financial controls, margin analysis, and operational efficiency.', challenges: ['Thin margins requiring precise cost control', 'Complex inventory management', 'Cash conversion cycle optimisation'], support: ['Cost and margin analysis', 'Inventory accounting', 'Supply chain financial review', 'Working capital management', 'KPI tracking'], image: '', order: 3 },
    { title: 'Private Equity-backed & Growth Companies', description: 'Portfolio companies and PE-backed businesses requiring institutional-grade financial reporting, governance, and M&A support.', challenges: ['Institutional reporting standards', 'Board-level financial governance', 'M&A due diligence requirements'], support: ['Board-level financial reporting', 'M&A financial advisory', 'Governance frameworks', 'Investor relations', 'Exit preparation'], image: '', order: 4 },
    { title: 'SMEs & Family-owned Businesses', description: 'Established businesses seeking professional financial management, succession planning support, and structured growth strategies.', challenges: ['Professionalising financial management', 'Succession planning complexity', 'Growth funding requirements'], support: ['Financial professionalisation', 'Succession planning advisory', 'Access to funding support', 'Business performance improvement', 'Strategic financial planning'], image: '', order: 5 },
  ]);

  // Case Studies
  await CaseStudy.deleteMany();
  await CaseStudy.insertMany([
    { title: 'Finance Transformation in International Trading Group', subtitle: 'Rapidly growing EU trading business with multi-warehouse operations and complex international supply chain reporting.', situation: 'The client operated across three EU countries with no centralised financial reporting, inconsistent accounting practices, and limited visibility into profitability by product line.', approach: 'Established real-world data flows from the Product ERP, Assets, and Financial systems. Implemented standardised reporting with monthly management accounts delivered within 5 business days of month-end.', outcomes: ['Improved margin visibility and cost control', 'Consolidated multi-entity financial reporting', 'Streamlined month-end close process', 'Implemented performance dashboards for leadership'], image: '', order: 1 },
    { title: 'ERP Implementation & Finance Setup for Scale-up', subtitle: 'High-growth company transitioning from basic accounting to a structured finance function.', situation: 'A technology scale-up had outgrown its basic accounting setup and needed a professional finance function capable of supporting Series A investment requirements.', approach: 'Designed and implemented a full finance function including system selection, chart of accounts, financial controls, and investor reporting framework.', outcomes: ['Full financial statements aligned with investor expectations', 'Automated reporting reducing manual effort by 60%', 'Scalable finance infrastructure for further growth', 'Audit-ready financial records'], image: '', order: 2 },
    { title: 'Cross-border VAT & Structuring Optimisation', subtitle: 'European workshop with intra-EU VAT movement and non-compliant VAT treatment across EU jurisdictions.', situation: 'A manufacturing business with operations in Cyprus, Netherlands, and Greece had inconsistent VAT treatment leading to regulatory exposure and financial leakage.', approach: 'Conducted a full VAT compliance review, restructured the inter-company billing model, and implemented jurisdiction-specific compliance processes.', outcomes: ['Eliminated VAT compliance exposure', 'Improved cash flow through VAT reclaim optimisation', 'Standardised cross-border transaction documentation', 'Ongoing monitoring framework'], image: '', order: 3 },
    { title: 'Operational Cost & Margin Optimisation (Supply Chain)', subtitle: 'Business facing operational inefficiency between customer activity and operational suppliers and logistics costs.', situation: 'A logistics business was struggling with margin erosion due to uncontrolled supplier costs and poor visibility into per-route profitability.', approach: 'Identified key cost drivers, built a route-level profitability model, and restructured supplier terms with new performance metrics.', outcomes: ['Identified 18% cost reduction opportunity within supplier base', 'Implemented route-level P&L reporting', 'Reduced lost revenue from under-billing', 'Improved contract negotiation with financial data'], image: '', order: 4 },
  ]);

  // Settings
  await Setting.deleteMany();
  await Setting.insertMany([
    { key: 'address', value: '25 Griva Digeni Avenue, Limassol, Cyprus', group: 'contact' },
    { key: 'phone', value: '+357 25 123 456', group: 'contact' },
    { key: 'email', value: 'info@solvedfinancial.com', group: 'contact' },
    { key: 'linkedin', value: 'https://linkedin.com/company/solved-financial-services', group: 'social' },
    { key: 'twitter', value: 'https://twitter.com/solvedfinancial', group: 'social' },
    { key: 'instagram', value: 'https://instagram.com/solvedfinancial', group: 'social' },
    { key: 'heroTitle', value: 'Strategic Financial Leadership for Ambitious Enterprises', group: 'homepage' },
    { key: 'heroSubtitle', value: 'Board-level advisory, financial structuring, and international expansion services for scale-ups, start-ups, and established enterprises.', group: 'homepage' },
    { key: 'ctaTitle', value: 'Ready to Empower your vision?', group: 'homepage' },
  ]);

  console.log('Seed completed successfully!');
  process.exit();
};

seed().catch(err => { console.error(err); process.exit(1); });
