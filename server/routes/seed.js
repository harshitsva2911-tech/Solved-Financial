const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Article = require('../models/Article');
const Service = require('../models/Service');
const Industry = require('../models/Industry');
const CaseStudy = require('../models/CaseStudy');
const Jurisdiction = require('../models/Jurisdiction');
const Metric = require('../models/Metric');
const TeamMember = require('../models/TeamMember');

// ─── Seed data ────────────────────────────────────────────────────────────────

const ARTICLES = [
  {
    slug: 'navigating-cross-border-tax-structures',
    title: 'Navigating Cross-Border Tax Structures in the Post-BEPS Era',
    excerpt: 'How multinational enterprises can build resilient, compliant tax structures in a rapidly evolving international regulatory landscape.',
    image: 'https://www.figma.com/api/mcp/asset/003b3fa5-5220-4d99-9dc6-fb83f3ee5372',
    publishedAt: new Date('2026-03-18'),
    category: 'Regulatory',
    author: 'Solved Financial Services',
    featured: true,
    published: true,
    content: `<p>The Base Erosion and Profit Shifting (BEPS) framework, developed by the OECD and G20, has fundamentally reshaped the way multinationals approach international tax planning. With Pillar One and Pillar Two now moving from concept to implementation across EU member states, the compliance burden — and the strategic stakes — have never been higher.</p><h2>What Has Changed Under BEPS 2.0</h2><p>The two-pillar solution introduced under BEPS 2.0 represents the most significant overhaul of international tax rules in a generation. Pillar One reapportions taxing rights to market jurisdictions for the largest multinationals, while Pillar Two introduces a global minimum corporate tax rate of 15% — the Qualified Domestic Minimum Top-Up Tax (QDMTT).</p><h2>Substance Over Form: The New Compliance Standard</h2><p>Tax authorities across the EU have significantly increased their focus on substance requirements. A company cannot simply be registered in a jurisdiction to benefit from its tax treaties or local rates — it must demonstrate genuine economic activity.</p><ul><li>Qualified staff with decision-making authority resident in the jurisdiction</li><li>Adequate physical premises proportionate to the business activities</li><li>Board meetings held locally with local directors participating meaningfully</li><li>Risk management functions actually performed in-country</li></ul><h2>Transfer Pricing in the Post-BEPS Environment</h2><p>Transfer pricing documentation requirements have tightened significantly. The three-tiered approach — master file, local file, and country-by-country report — applies to groups above the relevant thresholds in most EU jurisdictions.</p><blockquote>The arm's length principle remains the cornerstone of transfer pricing — but demonstrating compliance with it has become substantially more complex.</blockquote><h2>Strategic Recommendations</h2><ul><li><strong>Audit your existing structures</strong> against current substance requirements in each jurisdiction</li><li><strong>Model the Pillar Two impact</strong> on your effective tax rate and assess where top-up taxes may apply</li><li><strong>Update your transfer pricing documentation</strong> to reflect current benchmarks and revised OECD guidelines</li><li><strong>Engage local advisors</strong> who understand the practical enforcement approach of each tax authority</li></ul><h2>How Solved Financial Services Can Help</h2><p>Our teams across Cyprus, the Netherlands, and Greece work together to design and maintain tax-efficient structures that are fully compliant with post-BEPS requirements.</p>`,
  },
  {
    slug: 'cfo-role-scale-ups',
    title: 'The Evolving CFO Role in High-Growth Scale-Ups',
    excerpt: 'Why ambitious scale-ups need strategic financial leadership from day one — and how to structure it.',
    image: 'https://www.figma.com/api/mcp/asset/e936f564-e5c8-4375-a7ba-d3d67ab26c41',
    publishedAt: new Date('2026-03-16'),
    category: 'Strategy',
    author: 'Solved Financial Services',
    featured: true,
    published: true,
    content: `<p>For years, the CFO role in early-stage companies was largely administrative. That era is over. In a world where investors scrutinise unit economics from seed stage, strategic financial leadership has become a foundational requirement, not a nice-to-have.</p><h2>The Strategic CFO vs the Traditional CFO</h2><p>The traditional CFO was a backward-looking function: produce the accounts, file the returns, manage the audit. The strategic CFO operates as a true business partner to the CEO — shaping commercial decisions, modelling growth scenarios, managing investor relationships, and identifying structural risks before they materialise.</p><h2>When Should a Scale-Up Hire a CFO?</h2><ul><li>Revenue approaching €2–5 million, where financial complexity begins to outpace the founder's capacity</li><li>Preparation for a fundraising round requiring institutional-grade reporting and forecasting</li><li>International expansion introducing multi-jurisdictional tax and compliance obligations</li><li>Board or investor pressure for improved financial governance and reporting cadence</li></ul><h2>The Fractional CFO Model</h2><p>For many scale-ups, a full-time CFO hire at Series A is premature. The fractional CFO model has emerged as a compelling alternative: experienced financial leadership engaged on a part-time or project basis.</p><blockquote>A fractional CFO can provide 80% of the strategic value of a full-time hire at a fraction of the cost — and can be scaled up as the business grows.</blockquote><h2>Our Approach at Solved Financial Services</h2><p>We provide outsourced and fractional CFO services to ambitious businesses across Cyprus, the Netherlands, and Greece, helping founders make better decisions, raise capital more effectively, and build scalable financial infrastructure.</p>`,
  },
  {
    slug: 'cyprus-holding-structures',
    title: 'Cyprus Holding Structures: A Current Outlook',
    excerpt: 'Key regulatory and tax developments affecting Cyprus-based international holding companies.',
    image: 'https://www.figma.com/api/mcp/asset/2072c4ec-da89-4ab9-97d9-3caeed6f8cb5',
    publishedAt: new Date('2026-03-15'),
    category: 'Regulatory',
    author: 'Solved Financial Services',
    featured: true,
    published: true,
    content: `<p>Cyprus has long been one of Europe's most attractive jurisdictions for international holding structures. Its combination of a low 12.5% corporate tax rate, an extensive double tax treaty network, EU membership, and a sophisticated legal and professional services infrastructure has made it a first choice for businesses structuring cross-border investments.</p><h2>The Core Advantages Remain Compelling</h2><ul><li><strong>12.5% corporate income tax</strong> — one of the lowest rates in the EU</li><li><strong>Dividend exemption:</strong> Dividends received from subsidiaries are generally exempt from corporate tax</li><li><strong>Capital gains exemption:</strong> Gains on disposal of shares are exempt from tax</li><li><strong>IP Box regime:</strong> An 80% notional deduction on qualifying IP income, resulting in an effective rate of 2.5%</li><li><strong>60+ double tax treaties</strong> with major trading partners</li></ul><h2>Recent Regulatory Developments</h2><p>Cyprus has implemented a series of legislative changes in recent years, driven by EU directives and OECD recommendations. ATAD 1 and 2 Implementation has introduced controlled foreign company rules, interest limitation rules, and anti-hybrid rules.</p><blockquote>The days of purely tax-driven structuring are over. Substance, commercial rationale, and regulatory compliance must now be the foundation of any international holding arrangement.</blockquote><h2>Substance Requirements: What Regulators Expect</h2><ul><li>At least one local director (ideally the majority of the board)</li><li>Board meetings held in Cyprus with genuine decision-making</li><li>Management and control exercised from Cyprus</li><li>Adequate staffing and physical infrastructure proportionate to the company's activities</li></ul>`,
  },
  {
    slug: 'financial-readiness-series-a',
    title: 'Financial Readiness Before Your Series A Round',
    excerpt: 'The financial housekeeping, KPIs, and documentation investors will scrutinise before committing.',
    image: 'https://www.figma.com/api/mcp/asset/cca84feb-e1b1-4be1-9d22-e94c9dd732ad',
    publishedAt: new Date('2026-03-12'),
    category: 'Strategy',
    author: 'Solved Financial Services',
    featured: true,
    published: true,
    content: `<p>Raising a Series A round is a milestone moment for any startup. But the gap between a successful raise and a failed or delayed process often comes down to financial readiness — specifically, how well the business can demonstrate financial discipline, predictable performance, and a credible path to profitability.</p><h2>The Financial Model: Your Most Important Document</h2><ul><li>Monthly P&amp;L, cash flow, and balance sheet projections for at least 36 months</li><li>A clear revenue model showing how you acquire customers, at what cost, and with what retention profile</li><li>Gross margin analysis by product or revenue stream</li><li>Sensitivity analysis showing the business under base, upside, and downside scenarios</li></ul><h2>Unit Economics That Investors Scrutinise</h2><ul><li><strong>CAC (Customer Acquisition Cost):</strong> Total cost to acquire a single customer, broken down by channel</li><li><strong>LTV (Customer Lifetime Value):</strong> Expected revenue from a customer over the relationship</li><li><strong>LTV:CAC ratio:</strong> Typically expected to be at least 3:1 for a SaaS or recurring revenue business</li><li><strong>Net Revenue Retention (NRR):</strong> Revenue retained and expanded from existing customers</li></ul><blockquote>Investors at Series A are not just buying your past performance — they are buying your financial discipline and your ability to deploy capital efficiently.</blockquote><h2>Financial Housekeeping: What Must Be in Order</h2><ul><li>Statutory accounts for the past two to three years, ideally audited</li><li>Management accounts for the current year, updated to the most recent month</li><li>A clean cap table, documented in a recognised data room format</li><li>Up-to-date VAT, payroll tax, and corporate tax filings with no outstanding liabilities</li></ul>`,
  },
  {
    slug: 'netherlands-holding-gateway',
    title: "Why the Netherlands Remains Europe's Top Holding Gateway",
    excerpt: 'An in-depth look at participation exemption, treaty networks, and substance requirements.',
    image: 'https://www.figma.com/api/mcp/asset/d5fdd197-8070-4407-b6cc-44f9128d0557',
    publishedAt: new Date('2026-03-10'),
    category: 'Markets',
    author: 'Solved Financial Services',
    featured: true,
    published: true,
    content: `<p>The Netherlands has consistently ranked as one of Europe's most attractive jurisdictions for international holding structures. Its combination of the participation exemption, an unparalleled double tax treaty network, a predictable advance ruling system, and a highly sophisticated professional services infrastructure has made Amsterdam a preferred gateway for multinationals.</p><h2>The Participation Exemption: Europe's Most Generous</h2><p>The Dutch participation exemption (deelnemingsvrijstelling) is arguably the most comprehensive in Europe. Under this regime, dividends and capital gains arising from qualifying shareholdings of 5% or more are fully exempt from Dutch corporate income tax.</p><ul><li>The parent must hold at least 5% of the nominal share capital of the subsidiary</li><li>The subsidiary must not be held primarily as a portfolio investment</li><li>The subsidiary must be subject to a reasonable level of taxation in its home jurisdiction</li></ul><h2>Treaty Network: Unmatched in Scope</h2><p>The Netherlands maintains double tax treaties with over 90 countries — one of the most extensive networks in the world. These treaties often reduce or eliminate withholding taxes on dividends, interest, and royalties flowing through Dutch entities.</p><blockquote>For a multinational with subsidiaries across multiple continents, a Dutch holding company can significantly reduce the total tax friction on income repatriation.</blockquote><h2>Substance Requirements: The New Reality</h2><ul><li>At least half of the board members resident in the Netherlands</li><li>Decision-making taking place in the Netherlands</li><li>Local bank accounts and Dutch-registered offices</li><li>Payroll costs of at least €100,000 and office space costs of at least €24,000 per year</li></ul>`,
  },
  {
    slug: 'greece-non-dom-regime',
    title: "Greece's Non-Dom Tax Regime: What High-Net-Worth Individuals Need to Know",
    excerpt: 'A practical guide to the Greek non-domicile programme and its implications for international investors.',
    image: 'https://www.figma.com/api/mcp/asset/fe51bd3d-0959-4f62-bee1-e3fc7d7bb672',
    publishedAt: new Date('2026-03-08'),
    category: 'Regulatory',
    author: 'Solved Financial Services',
    featured: false,
    published: true,
    content: `<p>Since its introduction in 2020, Greece's non-domicile tax regime has attracted significant interest from high-net-worth individuals seeking a European base with a favourable tax framework. The programme offers a flat annual tax on foreign-source income in exchange for qualifying as a Greek tax resident.</p><h2>How the Greek Non-Dom Regime Works</h2><p>Under Article 5A of the Greek Income Tax Code, qualifying individuals can elect to pay a flat annual tax of €100,000 on all their foreign-source income, regardless of the amount. An individual with €5 million of foreign dividends, capital gains, or rental income would pay just €100,000 in Greek tax on that income — an effective rate of 2%.</p><h2>Eligibility Conditions</h2><ul><li>Not have been a Greek tax resident in at least 7 of the previous 8 tax years</li><li>Invest a minimum of €500,000 in Greek real estate, businesses, securities, or government bonds</li><li>Apply to the Greek tax authority and receive approval of their application</li></ul><blockquote>Greece's non-dom regime is particularly attractive for individuals relocating from high-tax jurisdictions who derive significant income from international investments.</blockquote><h2>Comparison With Other European Non-Dom Regimes</h2><ul><li><strong>Portugal's NHR:</strong> Subject to significant changes from 2024, with a new IFICI programme replacing the original scheme</li><li><strong>Italy's flat tax:</strong> Similar structure, but the flat tax is €200,000 per year — double the Greek amount</li><li><strong>Malta's HNWI regime:</strong> Complex application process with a minimum tax of €15,000 per year</li></ul>`,
  },
  {
    slug: 'transfer-pricing-european-smes',
    title: 'Transfer Pricing Essentials for European SMEs',
    excerpt: 'How smaller businesses can establish defensible transfer pricing policies without enterprise-level compliance costs.',
    image: 'https://www.figma.com/api/mcp/asset/003b3fa5-5220-4d99-9dc6-fb83f3ee5372',
    publishedAt: new Date('2026-03-05'),
    category: 'Strategy',
    author: 'Solved Financial Services',
    featured: false,
    published: true,
    content: `<p>Transfer pricing is often perceived as a concern exclusively for large multinationals. In reality, any business with related-party transactions across international borders faces transfer pricing obligations, and European SMEs are increasingly finding themselves subject to TP audits and adjustments.</p><h2>What Is Transfer Pricing and Why Does It Matter for SMEs?</h2><p>Transfer pricing refers to the prices charged between connected entities for goods, services, loans, or intellectual property licences. Tax authorities require these prices to reflect what unconnected parties would have agreed in comparable circumstances — the arm's length principle.</p><h2>Common Transfer Pricing Issues for SMEs</h2><ul><li><strong>Intercompany loans:</strong> Parent companies lending to subsidiaries at interest rates that do not reflect market rates</li><li><strong>Management fees:</strong> Group services companies charging subsidiaries for management services without adequate documentation</li><li><strong>IP licensing:</strong> Royalty rates for brand licences or software licences between group entities that are not benchmarked</li></ul><blockquote>The cost of a transfer pricing adjustment — including back taxes, interest, and penalties — typically far exceeds the cost of getting proper documentation in place at the outset.</blockquote><h2>A Pragmatic Approach for Smaller Businesses</h2><ul><li>Identifying and documenting all related-party transactions above a materiality threshold</li><li>Applying a consistent and defensible pricing methodology for each transaction type</li><li>Retaining basic benchmarking evidence</li><li>Reviewing and updating intercompany agreements annually</li></ul>`,
  },
  {
    slug: 'fintech-licensing-eu-landscape',
    title: 'The EU Fintech Licensing Landscape in 2026',
    excerpt: 'A comprehensive review of payment institution and e-money licensing options across key EU jurisdictions.',
    image: 'https://www.figma.com/api/mcp/asset/e936f564-e5c8-4375-a7ba-d3d67ab26c41',
    publishedAt: new Date('2026-03-01'),
    category: 'Technology',
    author: 'Solved Financial Services',
    featured: false,
    published: true,
    content: `<p>The European fintech regulatory landscape has undergone seismic change in recent years. The implementation of PSD2, the introduction of MiCA (Markets in Crypto-Assets Regulation), and the ongoing refinement of EMI and PI licensing frameworks across member states have created both new opportunities and significant compliance complexity.</p><h2>Key Licence Types: A Refresher</h2><ul><li><strong>Payment Institution (PI):</strong> Authorised to provide payment services including credit transfers, direct debits, card acquiring, money remittance, and payment initiation.</li><li><strong>Electronic Money Institution (EMI):</strong> Authorised to issue e-money in addition to the payment services available to a PI. More capital-intensive to obtain but provides broader functionality.</li></ul><h2>MiCA: The New Framework for Crypto-Asset Service Providers</h2><p>The Markets in Crypto-Assets Regulation, which came into force progressively from 2024, has introduced a new licensing category: the Crypto-Asset Service Provider (CASP). CASPs operating in the EU must now obtain authorisation from a competent national authority.</p><blockquote>MiCA has fundamentally changed the regulatory calculus for crypto businesses. Operating without a CASP licence is no longer a viable option for any business with EU customers.</blockquote><h2>Comparing Key Licensing Jurisdictions</h2><p><strong>Cyprus (CySEC):</strong> A popular choice for PI and CASP licences, with a regulator that has significant experience with international fintech applicants.</p><p><strong>Netherlands (DNB/AFM):</strong> A rigorous but respected regulatory environment. DNB is considered one of Europe's most thorough regulators.</p><h2>Practical Considerations for Applicants</h2><ul><li><strong>Capital requirements:</strong> Minimum initial capital for a PI ranges from €20,000 to €125,000; for an EMI, the minimum is €350,000</li><li><strong>AML/CFT framework:</strong> All applicants must demonstrate a robust anti-money laundering programme</li><li><strong>Substance:</strong> Regulators expect genuine local presence, including local management and operational staff</li></ul>`,
  },
];

const SERVICES = [
  { title: 'CFO & Strategic Advisory', slug: 'cfo-strategic-advisory', excerpt: 'Solved Financial Services provides CFO-level expertise to founders, management teams, and boards requiring senior financial leadership, strategic insight, and decision-making support.', description: 'Solved Financial Services provides CFO-level expertise to founders, management teams, and boards requiring senior financial leadership, strategic insight, and decision-making support. We act as your trusted financial co-pilot — bridging the gap between strategy and execution.', features: ['Strategic financial planning', 'Board-level reporting', 'Investor relations support', 'KPI frameworks & dashboards', 'Business model optimisation'], image: 'https://www.figma.com/api/mcp/asset/a8f71cd2-5946-4c94-a815-1b5bca2c12ad', order: 1, active: true },
  { title: 'Finance Setup & Structuring', slug: 'finance-setup-structuring', excerpt: 'We design and implement structured financial ecosystems that support sustainable growth. From establishing a new finance function to restructuring an existing one.', description: 'We design and implement structured financial ecosystems that support sustainable growth. From establishing a new finance function to restructuring an existing one, we provide the framework for high-performance financial management.', features: ['Chart of accounts setup', 'Financial process design', 'Accounting system implementation', 'Reporting infrastructure', 'Financial controls framework'], image: 'https://www.figma.com/api/mcp/asset/eb427811-735f-45b6-97e1-344e8a5f4cd1', order: 2, active: true },
  { title: 'Accounting & Financial Administration', slug: 'accounting-financial-administration', excerpt: 'Solved Financial Services delivers structured, compliant, and transparent financial administration tailored to the operational and regulatory needs of growing organisations.', description: 'Solved Financial Services delivers structured, compliant, and transparent financial administration tailored to the operational and regulatory needs of growing organisations. Our team handles the full spectrum of bookkeeping, reconciliations, payroll support, and financial reporting.', features: ['Bookkeeping & reconciliations', 'VAT filing & compliance', 'Financial statements preparation', 'Payroll administration support', 'Multi-currency accounting'], image: 'https://www.figma.com/api/mcp/asset/733abf8a-fad7-4d79-9c7a-0e9eeb7e806c', order: 3, active: true },
  { title: 'Operations & Performance Advisory', slug: 'operations-performance-advisory', excerpt: 'We help leadership teams understand the financial drivers behind their operations, linking financial data to operational KPIs to support better decision-making.', description: 'We help leadership teams understand the financial drivers behind their operations. By linking financial data to operational KPIs, we support better decision-making and performance improvement across the business.', features: ['Cost optimisation strategies', 'Supply chain financial analysis', 'Performance management systems', 'Operational budgeting', 'Variance analysis & reporting'], image: 'https://www.figma.com/api/mcp/asset/849ddde9-0afc-4412-9b5b-c05bc718a19b', order: 4, active: true },
  { title: 'Company Incorporation', slug: 'company-incorporation', excerpt: 'Solved Financial Services supports entrepreneurs and businesses seeking to establish or restructure their legal presence in Cyprus, Netherlands, and Greece.', description: 'Solved Financial Services supports entrepreneurs and businesses seeking to establish or restructure their legal presence in Cyprus, Netherlands, and Greece. We manage the full incorporation process, including nominee services, regulatory filings, and post-incorporation setup.', features: ['Jurisdiction selection advice', 'Full incorporation process', 'Nominee director services', 'Bank account opening support', 'Post-incorporation compliance'], image: 'https://www.figma.com/api/mcp/asset/8ca3e77d-1fa8-49af-8a8d-2e8ab15b3a3a', order: 5, active: true },
  { title: 'Audit & Assurance', slug: 'audit-assurance', excerpt: 'Through our network of partner firms in Cyprus, Netherlands, and Greece, Solved Financial Services coordinates audit and assurance engagements that meet local regulatory requirements.', description: 'Through our network of partner firms in Cyprus, Netherlands, and Greece, Solved Financial Services coordinates audit and assurance engagements that meet local regulatory requirements and international standards, giving stakeholders the confidence they need.', features: ['Statutory audit coordination', 'Financial due diligence', 'Internal audit support', 'Regulatory compliance review', 'Audit readiness preparation'], image: 'https://www.figma.com/api/mcp/asset/f749ae56-2209-450a-bb63-a89f11268cba', order: 6, active: true },
  { title: 'Cross-Border & International Advisory', slug: 'cross-border-international-advisory', excerpt: 'Solved Financial Services provides specialist advisory for businesses operating or expanding across borders, navigating regulatory, structural, and financial complexities.', description: 'Solved Financial Services provides specialist advisory for businesses operating or expanding across borders. We help clients navigate the regulatory, structural, and financial complexities of international expansion, particularly within European jurisdictions.', features: ['Cross-border tax structuring', 'Transfer pricing advisory', 'International entity structuring', 'Regulatory mapping', 'Multi-jurisdiction compliance'], image: 'https://www.figma.com/api/mcp/asset/060ca6a8-dc5f-4df1-8916-d4c4f5d37c98', order: 7, active: true },
];

const INDUSTRIES = [
  { title: 'Financial Services & Banking', description: 'We partner with banks, investment firms, and financial institutions navigating evolving regulatory frameworks across European jurisdictions. Our team provides end-to-end advisory on compliance architecture, licensing strategy, and capital structure optimization.', challenges: ['Complex cross-border regulatory compliance', 'Capital adequacy and liquidity requirements', 'AML/KYC framework implementation', 'Ongoing supervisory reporting obligations'], support: ['Regulatory licensing and authorisation', 'Compliance framework design and implementation', 'Ongoing regulatory monitoring and reporting', 'Board-level governance advisory'], image: 'https://www.figma.com/api/mcp/asset/4c20d896-610c-4514-9914-f67d18e5ca29', order: 1, active: true },
  { title: 'Investment Management', description: 'Asset managers, hedge funds, and family offices rely on our expertise to navigate fund structuring, investor relations, and cross-border investment strategies. We simplify complexity so you can focus on generating returns.', challenges: ['Fund structure selection and jurisdiction comparison', 'AIFMD and UCITS compliance requirements', 'Investor due diligence and onboarding', 'Tax-efficient cross-border structuring'], support: ['Fund formation and structuring advisory', 'Regulatory registration across jurisdictions', 'Investor relations and documentation', 'Performance and risk reporting frameworks'], image: 'https://www.figma.com/api/mcp/asset/4d6ebfa2-0fb8-4732-baaa-2a0456144677', order: 2, active: true },
  { title: 'Technology & Fintech', description: 'Fintech innovators and technology companies entering regulated financial markets require both regulatory expertise and commercial acumen. We bridge the gap between innovation and compliance.', challenges: ['Obtaining payment institution or e-money licences', 'PSD2 and open banking compliance', 'Data privacy and GDPR obligations', 'Navigating sandbox environments and fast-changing rules'], support: ['Fintech regulatory strategy and licensing', 'Product compliance review', 'Data protection framework design', 'Partnership and distribution structuring'], image: 'https://www.figma.com/api/mcp/asset/42358b8d-4420-47ab-b380-76a8d0c8aa46', order: 3, active: true },
  { title: 'Real Estate & Property', description: 'Institutional investors and developers operating across Europe need nuanced understanding of local property markets, tax regimes, and investment structures. We provide clarity on every dimension of cross-border real estate transactions.', challenges: ['Complex multi-jurisdiction transaction structures', 'Tax treatment and transfer pricing', 'Regulatory approvals and foreign ownership rules', 'Financing and capital stack optimisation'], support: ['Transaction structuring and due diligence', 'Tax-efficient ownership structures', 'Regulatory approvals management', 'Ongoing asset management advisory'], image: 'https://www.figma.com/api/mcp/asset/511802bf-703f-4fb1-94f4-cb3c25b004b2', order: 4, active: true },
  { title: 'Shipping & Maritime', description: "Cyprus and the Netherlands are among Europe's premier shipping jurisdictions. We advise shipping groups on flag registration, corporate structuring, tax optimisation, and regulatory compliance in these strategic hubs.", challenges: ['Flag state selection and registration complexity', 'Tonnage tax eligibility and optimisation', 'Crew management and employment compliance', 'Environmental and ESG reporting requirements'], support: ['Shipping company formation and structuring', 'Tonnage tax and fiscal advisory', 'Flag registration and management', 'Regulatory compliance monitoring'], image: 'https://www.figma.com/api/mcp/asset/e48d200d-9bf7-4b9e-905d-a402a6711795', order: 5, active: true },
];

const CASE_STUDIES = [
  { title: 'Regulatory Restructuring for a Pan-European Asset Manager', subtitle: 'Transforming compliance complexity into strategic advantage', situation: 'A mid-sized asset manager with AUM of €2.3bn faced increasingly fragmented regulatory obligations across three EU jurisdictions. Disparate compliance teams, duplicated processes, and escalating regulatory costs were impeding growth and attracting supervisory scrutiny.', approach: 'We conducted a full regulatory gap analysis and designed a unified compliance framework leveraging Cyprus as a passporting hub. By consolidating licensing under a single CySEC authorisation and implementing a shared-services compliance model, we reduced operational duplication while maintaining full local regulatory coverage.', outcomes: ['38% reduction in compliance operating costs within 12 months', 'Successful CySEC authorisation obtained within regulatory target timelines', 'Unified reporting framework reducing regulatory filings by 40%', 'Zero supervisory findings in subsequent examination cycle'], image: 'https://www.figma.com/api/mcp/asset/18976f01-a671-4601-92b7-3ad6b427e17c', order: 1, active: true },
  { title: 'Cross-Border Fintech Licensing Strategy', subtitle: 'Accelerating market entry across the Netherlands and Cyprus', situation: 'A UK-based fintech group sought to maintain EU market access following Brexit. With existing operations facing regulatory uncertainty and a product roadmap dependent on PSD2 compliance, the group needed a rapid, cost-effective EU regulatory footprint.', approach: 'We designed a dual-jurisdiction licensing strategy, establishing an Electronic Money Institution in the Netherlands for Northern European operations and a CIF authorisation in Cyprus for investment-related services. We managed the full licensing lifecycle, from regulatory business plan drafting to competent authority liaison.', outcomes: ['EMI licence obtained from DNB within 7 months', 'CIF authorisation from CySEC secured within 9 months', 'Full EU passporting operational across 22 member states', 'Post-Brexit revenue continuity achieved without client disruption'], image: 'https://www.figma.com/api/mcp/asset/4a97ff9b-f97d-4b46-ab20-9af0efa130ee', order: 2, active: true },
  { title: 'Strategic Advisory for a Shipping Group Restructuring', subtitle: 'Optimising corporate structure across maritime jurisdictions', situation: 'A Greek shipping family office with a fleet of 14 vessels sought to restructure its corporate holdings to optimise for tonnage tax treatment, estate planning, and third-party investor entry. The existing structure had grown organically and was tax-inefficient.', approach: 'Our team performed a comprehensive structural audit and redesigned the holding architecture using a Cyprus-based intermediate holding company, supported by a Limassol ship management entity. We coordinated with tax counsel across three jurisdictions to model and implement the optimal structure.', outcomes: ['Estimated annual tax savings of €1.8m through tonnage tax optimisation', 'Clear inheritance structure established for third-generation succession', 'New investor admitted with ring-fenced liability at vessel-level SPVs', 'Full regulatory compliance maintained throughout restructure'], image: 'https://www.figma.com/api/mcp/asset/979533b3-e5e4-411f-94a6-ae0a2cf06006', order: 3, active: true },
  { title: 'Market Entry Advisory for a Global Investment Bank', subtitle: 'Establishing a regulated EU presence in Southeast Europe', situation: 'A global investment bank with no direct EU presence required a regulated entity to access Hellenic capital markets and participate in Greek government bond auctions and privatisation advisory mandates.', approach: 'We identified Athens as the optimal jurisdiction and managed the HCMC authorisation process from inception. In parallel, we advised on local governance requirements, designed the organisational structure, and coordinated the recruitment of approved persons to satisfy supervisory requirements.', outcomes: ['HCMC authorisation obtained within target 11-month timeline', 'Successful participation in two sovereign bond issuances in year one', 'Three privatisation advisory mandates secured in first 18 months', 'Full MiFID II compliance framework operational at launch'], image: 'https://www.figma.com/api/mcp/asset/c8526372-9326-46ab-9994-6c062d980025', order: 4, active: true },
];

const JURISDICTIONS = [
  {
    country: 'Cyprus', slug: 'cyprus', flagCode: 'cy', flagUrl: 'https://www.figma.com/api/mcp/asset/f0489053-8e02-4c15-8922-ce5f45efb882', heroImage: 'https://www.figma.com/api/mcp/asset/054bdc3d-2f42-4812-a78d-cba568e34419',
    tagline: 'A strategic gateway for international business within the EU.',
    intro: 'Cyprus offers one of the most business-friendly regulatory environments in Europe, combining a competitive tax framework, strong legal infrastructure, and full EU membership. Solved Financial Services leverages deep local expertise to support businesses establishing or expanding their presence in Cyprus.',
    partnerFirm: null,
    strategyPivot: { heading: 'Strategy Pivot', points: [{ title: 'Low Corporate Tax', description: 'Cyprus maintains one of the lowest corporate tax rates in the EU at 12.5%, making it highly attractive for holding and trading structures.' }, { title: 'EU Compliant', description: 'Full compliance with EU directives ensures access to European markets while maintaining a competitive regulatory environment.' }] },
    services: [
      { title: 'Accounting & Financial Structuring', description: 'Comprehensive accounting services tailored to Cyprus-based entities, including statutory compliance and financial reporting.', features: ['Statutory financial statements', 'Regulatory filings', 'VAT compliance', 'Corporate tax returns'] },
      { title: 'Corporate & Financial Structuring', description: 'Strategic structuring of corporate entities to optimise tax efficiency and operational effectiveness within Cyprus.', features: ['Holding company structures', 'Tax planning', 'Shareholder agreements', 'Group structuring'] },
      { title: 'CFO & Board Advisory', description: 'Senior financial leadership and strategic advisory for Cyprus-registered entities and their global management teams.', features: ['Cyprus-specific regulatory guidance', 'Financial reporting oversight', 'Board-level presentations', 'Investor communication'] },
      { title: 'Company Incorporation', description: 'Full service company formation in Cyprus including nominee services, registered office, and compliance setup.', features: ['Company registration', 'Nominee directors', 'Registered office', 'Bank account support'] },
      { title: 'Audit & Assurance Services', description: 'Coordination of statutory audit requirements in accordance with Cyprus regulatory obligations through our local partner network.', features: ['Audit coordination', 'Financial due diligence', 'Regulatory compliance', 'Audit readiness'] },
    ],
    order: 1, active: true,
  },
  {
    country: 'Netherlands', slug: 'netherlands', flagCode: 'nl', flagUrl: 'https://www.figma.com/api/mcp/asset/91c26ec4-adc4-494d-a295-e086b62c21e6', heroImage: 'https://www.figma.com/api/mcp/asset/324bd48e-b95a-4fb6-8d31-2f5dd99a254b',
    tagline: "Europe's leading gateway for international trade and finance.",
    intro: 'The Netherlands is renowned for its pro-business environment, sophisticated financial infrastructure, and strategic location at the heart of Europe. It remains the preferred jurisdiction for multinational headquarters, holding structures, and international trading companies.',
    partnerFirm: null,
    strategyPivot: { heading: 'Strategy Pivot', points: [{ title: 'International Hub', description: 'Amsterdam serves as a major European financial hub with excellent connectivity to global markets and a highly skilled workforce.' }, { title: 'Advanced Tax Framework', description: 'The participation exemption, extensive treaty network, and ruling practice make the Netherlands a top choice for international structuring.' }] },
    services: [
      { title: 'Accounting & Financial Administration', description: 'Full-cycle accounting and financial administration for Netherlands-based entities, ensuring Dutch GAAP compliance.', features: ['Dutch GAAP compliance', 'Annual accounts preparation', 'VAT declarations', 'Payroll administration'] },
      { title: 'Finance Setup & Structuring', description: 'Establishing robust financial frameworks for newly formed or expanding Netherlands entities.', features: ['Finance function setup', 'System implementation', 'Process documentation', 'Internal controls'] },
      { title: 'CFO & Strategic Advisory', description: 'Strategic financial guidance for businesses using the Netherlands as their European base of operations.', features: ['Holding structure advice', 'Group financial oversight', 'Reporting to international boards', 'Budget & forecast management'] },
      { title: 'Operations & Performance Advisory', description: 'Financial analysis and performance optimisation for Netherlands-based operational entities.', features: ['KPI development', 'Cost analysis', 'Operational efficiency', 'Management reporting'] },
      { title: 'Company Incorporation', description: 'Complete BV incorporation services in the Netherlands, including compliance setup and ongoing administration.', features: ['BV formation', 'UBO registration', 'KVK registration', 'Opening corporate accounts'] },
    ],
    order: 2, active: true,
  },
  {
    country: 'Greece', slug: 'greece', flagCode: 'gr', flagUrl: 'https://www.figma.com/api/mcp/asset/a05c1fb1-3d2f-43f5-8b1b-dc664dd33f60', heroImage: 'https://www.figma.com/api/mcp/asset/52452a28-b309-478c-82ff-9af8074ad68a',
    tagline: 'An emerging strategic hub with deep European roots.',
    intro: 'Greece presents a compelling opportunity for businesses seeking access to South-Eastern European markets. With a modernising regulatory environment, EU membership, and growing technology and shipping sectors, Greece is increasingly attractive for international investment.',
    partnerFirm: { name: 'Revival Consulting Services', description: 'Solved Financial Services operates in Greece through its strategic partnership with Revival Consulting Services, a leading Greek advisory firm with extensive expertise in local regulatory compliance, tax advisory, and business establishment services.' },
    strategyPivot: { heading: 'Strategy Pivot', points: [{ title: 'Emerging Market', description: "Greece's modernising economy and EU membership create attractive conditions for international investors and businesses expanding into South-Eastern Europe." }, { title: 'Strategic Location', description: "Greece's position as a gateway to the Balkans, Eastern Mediterranean, and Middle East makes it strategically significant for trade and logistics businesses." }] },
    services: [
      { title: 'Accounting & Compliance Support', description: 'Full compliance accounting for Greek entities, ensuring alignment with Greek GAAP and tax regulations.', features: ['Greek GAAP compliance', 'Corporate tax returns', 'VAT management', 'Regulatory filings'] },
      { title: 'Corporate & Business Advisory', description: 'Strategic advisory for businesses establishing or growing their Greek presence, including sector-specific guidance.', features: ['Business setup advisory', 'Regulatory guidance', 'Strategic planning', 'Market entry support'] },
      { title: 'Financial & Strategic Advisory', description: 'Senior financial advisory services for Greek entities, covering financial structuring, planning, and investor relations.', features: ['Financial modelling', 'Investor presentations', 'Funding strategy', 'CFO-level guidance'] },
      { title: 'Audit & Assurance (via Partner Network)', description: 'Statutory audit coordination through Revival Consulting Services in compliance with Greek regulatory requirements.', features: ['Statutory audit', 'Financial due diligence', 'Internal controls review', 'Audit support'] },
    ],
    order: 3, active: true,
  },
];

const METRICS = [
  { value: 123, suffix: 'k+', label: 'Transactions Advised', description: 'Across diverse industries and markets worldwide.', order: 1, active: true },
  { value: 15, suffix: '+', label: 'Years Experience', description: 'Deep expertise built over decades of practice.', order: 2, active: true },
  { value: 12, suffix: '+', label: 'Countries Served', description: 'A truly global footprint spanning multiple jurisdictions.', order: 3, active: true },
  { value: 98, suffix: '%', label: 'Client Retention', description: 'Long-term partnerships driven by measurable results.', order: 4, active: true },
];

const TEAM = [
  { name: 'Alice Bradley', role: 'Founder & Managing Partner', bio: 'Alice brings over 20 years of senior financial leadership across European jurisdictions, guiding ambitious enterprises through growth, restructuring, and cross-border expansion.', image: 'https://www.figma.com/api/mcp/asset/451cb826-3d2d-4486-9c64-6d8a2d8229d4', linkedin: 'https://linkedin.com', order: 1, active: true },
];

// ─── Route ────────────────────────────────────────────────────────────────────

router.post('/', protect, async (req, res) => {
  try {
    const results = {};

    // Articles
    const existingArticles = await Article.countDocuments();
    if (existingArticles === 0) {
      await Article.insertMany(ARTICLES);
      results.articles = ARTICLES.length;
    } else {
      results.articles = `skipped (${existingArticles} already exist)`;
    }

    // Services
    const existingServices = await Service.countDocuments();
    if (existingServices === 0) {
      await Service.insertMany(SERVICES);
      results.services = SERVICES.length;
    } else {
      results.services = `skipped (${existingServices} already exist)`;
    }

    // Industries
    const existingIndustries = await Industry.countDocuments();
    if (existingIndustries === 0) {
      await Industry.insertMany(INDUSTRIES);
      results.industries = INDUSTRIES.length;
    } else {
      results.industries = `skipped (${existingIndustries} already exist)`;
    }

    // Case Studies
    const existingCaseStudies = await CaseStudy.countDocuments();
    if (existingCaseStudies === 0) {
      await CaseStudy.insertMany(CASE_STUDIES);
      results.caseStudies = CASE_STUDIES.length;
    } else {
      results.caseStudies = `skipped (${existingCaseStudies} already exist)`;
    }

    // Jurisdictions
    const existingJurisdictions = await Jurisdiction.countDocuments();
    if (existingJurisdictions === 0) {
      await Jurisdiction.insertMany(JURISDICTIONS);
      results.jurisdictions = JURISDICTIONS.length;
    } else {
      results.jurisdictions = `skipped (${existingJurisdictions} already exist)`;
    }

    // Metrics
    const existingMetrics = await Metric.countDocuments();
    if (existingMetrics === 0) {
      await Metric.insertMany(METRICS);
      results.metrics = METRICS.length;
    } else {
      results.metrics = `skipped (${existingMetrics} already exist)`;
    }

    // Team
    const existingTeam = await TeamMember.countDocuments();
    if (existingTeam === 0) {
      await TeamMember.insertMany(TEAM);
      results.team = TEAM.length;
    } else {
      results.team = `skipped (${existingTeam} already exist)`;
    }

    res.json({ message: 'Seed completed', results });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Force re-seed (clears all data first)
router.post('/force', protect, async (req, res) => {
  try {
    await Promise.all([
      Article.deleteMany({}),
      Service.deleteMany({}),
      Industry.deleteMany({}),
      CaseStudy.deleteMany({}),
      Jurisdiction.deleteMany({}),
      Metric.deleteMany({}),
      TeamMember.deleteMany({}),
    ]);

    await Promise.all([
      Article.insertMany(ARTICLES),
      Service.insertMany(SERVICES),
      Industry.insertMany(INDUSTRIES),
      CaseStudy.insertMany(CASE_STUDIES),
      Jurisdiction.insertMany(JURISDICTIONS),
      Metric.insertMany(METRICS),
      TeamMember.insertMany(TEAM),
    ]);

    res.json({
      message: 'Force seed completed — all existing data replaced',
      counts: {
        articles: ARTICLES.length,
        services: SERVICES.length,
        industries: INDUSTRIES.length,
        caseStudies: CASE_STUDIES.length,
        jurisdictions: JURISDICTIONS.length,
        metrics: METRICS.length,
        team: TEAM.length,
      },
    });
  } catch (err) {
    console.error('Force seed error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
