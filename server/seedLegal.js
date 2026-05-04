// node seedLegal.js  — seeds all 4 legal pages into the settings collection
if (typeof globalThis.crypto === 'undefined') globalThis.crypto = require('crypto').webcrypto;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const tls = require('tls');
dotenv.config({ path: path.join(__dirname, '.env') });
const _tlsConnect = tls.connect;
tls.connect = function (o, ...r) { if (o && typeof o === 'object') { delete o.autoSelectFamily; o.family = 4; } return _tlsConnect.call(this, o, ...r); };
const Setting = require('./models/Setting');

const LEGAL = {

legal_privacy_policy: `PRIVACY POLICY
Last updated: 1 May 2026

1. INTRODUCTION
Solved Financial Services ("we", "us", "our") is committed to protecting the privacy of individuals who visit our website and engage with our services. This Privacy Policy explains how we collect, use, store, and protect your personal data in accordance with the General Data Protection Regulation (GDPR) and applicable data protection laws.

2. DATA CONTROLLER
Solved Financial Services
25 Griva Digeni Avenue, Limassol, Cyprus
Email: info@solvedfinancial.com

3. INFORMATION WE COLLECT
We may collect the following categories of personal data:
- Contact details: full name, email address, telephone number, organisation name, and job title submitted through our contact form.
- Usage data: IP address, browser type, pages visited, and time spent on our website, collected automatically via analytics tools.
- Communications data: the content of inquiries and correspondence you send to us.

4. HOW WE USE YOUR INFORMATION
We process your personal data for the following purposes:
- To respond to your inquiries and provide the advisory services you have requested.
- To assess whether our services are appropriate for your requirements.
- To comply with our legal and regulatory obligations.
- To improve the performance and content of our website.
- To send you relevant updates or publications, where you have provided consent.

5. LEGAL BASIS FOR PROCESSING
We rely on the following legal bases under Article 6 GDPR:
- Contractual necessity: processing required to take steps prior to entering into a contract with you.
- Legitimate interests: improving our services and maintaining appropriate communication with prospective clients.
- Legal obligation: compliance with applicable laws and regulatory requirements.
- Consent: for any marketing communications, where explicitly provided.

6. DATA RETENTION
We retain personal data only for as long as necessary to fulfil the purposes for which it was collected, or as required by law. Contact inquiry data is retained for a period of three (3) years from the date of submission unless an ongoing engagement requires longer retention.

7. DATA SHARING
We do not sell or rent personal data to third parties. We may share data with:
- Professional advisers (lawyers, accountants, auditors) bound by confidentiality obligations.
- Technology service providers who process data on our behalf under data processing agreements.
- Competent regulatory authorities where required by law.

8. INTERNATIONAL TRANSFERS
Where data is transferred outside the European Economic Area (EEA), we ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission.

9. YOUR RIGHTS
Under GDPR, you have the right to:
- Access the personal data we hold about you.
- Rectify inaccurate or incomplete data.
- Erase your data ("right to be forgotten") where no legitimate purpose for retention exists.
- Restrict or object to processing.
- Data portability where processing is based on consent or contract.
- Withdraw consent at any time without affecting the lawfulness of prior processing.

To exercise any of these rights, please contact us at info@solvedfinancial.com.

10. COOKIES
We use cookies to analyse website traffic and improve user experience. Please refer to our Cookie Policy for full details.

11. CHANGES TO THIS POLICY
We may update this Privacy Policy from time to time. The current version will always be available on our website with the date of last update.

12. CONTACT
For any data protection queries, please contact: info@solvedfinancial.com`,

// ─────────────────────────────────────────────────────────────────────────────

legal_terms_of_service: `TERMS OF SERVICE
Last updated: 1 May 2026

1. INTRODUCTION
These Terms of Service govern your use of the Solved Financial Services website (solvedfinancial.com) and any information or materials provided through it. By accessing this website, you agree to be bound by these Terms. If you do not agree, please discontinue use of the website immediately.

2. ABOUT US
Solved Financial Services provides financial, corporate, and strategic advisory services across Cyprus, the Netherlands, and Greece. In Greece, services are provided in collaboration with our strategic partner, Revival Consulting Services.

3. WEBSITE USE
The content on this website is provided for general informational purposes only. It does not constitute financial, legal, tax, or investment advice and should not be relied upon as such. No client relationship is formed through use of this website alone.

4. INTELLECTUAL PROPERTY
All content on this website — including text, graphics, logos, images, and data — is the property of Solved Financial Services or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.

5. ACCURACY OF INFORMATION
While we endeavour to keep information on this website current and accurate, we make no warranties or representations as to its completeness, accuracy, or fitness for any particular purpose. Regulatory frameworks and tax laws change frequently; always seek professional advice before acting on any information found on this website.

6. THIRD-PARTY LINKS
Our website may contain links to third-party websites for informational purposes. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.

7. LIMITATION OF LIABILITY
To the fullest extent permitted by applicable law, Solved Financial Services shall not be liable for any direct, indirect, incidental, or consequential loss or damage arising from your use of this website or reliance on its contents.

8. PRIVACY
Your use of this website is also governed by our Privacy Policy and Cookie Policy, which are incorporated into these Terms by reference.

9. GOVERNING LAW
These Terms are governed by and construed in accordance with the laws of the Republic of Cyprus. Any dispute arising in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Cyprus.

10. CHANGES TO THESE TERMS
We reserve the right to amend these Terms at any time. Continued use of the website following any changes constitutes acceptance of the revised Terms.

11. CONTACT
For any queries regarding these Terms, please contact: info@solvedfinancial.com`,

// ─────────────────────────────────────────────────────────────────────────────

legal_cookie_policy: `COOKIE POLICY
Last updated: 1 May 2026

1. WHAT ARE COOKIES?
Cookies are small text files placed on your device when you visit a website. They are widely used to make websites function efficiently, to improve user experience, and to provide information to website operators.

2. HOW WE USE COOKIES
Solved Financial Services uses cookies on this website for the following purposes:

ESSENTIAL COOKIES
These cookies are strictly necessary for the website to function and cannot be disabled. They include cookies that enable navigation, access to secure areas, and basic site functionality. No personal data is collected through essential cookies.

ANALYTICS COOKIES
We use analytics cookies to understand how visitors interact with our website — for example, which pages are visited most frequently and how users navigate between pages. This helps us improve the website's structure and content. Analytics data is aggregated and anonymised.

PREFERENCE COOKIES
These cookies remember your preferences and settings (such as your selected country or language preference) so that your experience is personalised on return visits.

MARKETING COOKIES
We do not currently use marketing or advertising cookies on this website.

3. THIRD-PARTY COOKIES
Our website may include content or functionality from third-party services (such as embedded maps or analytics platforms) that may set their own cookies. We do not control these cookies and recommend reviewing the respective third-party privacy policies.

4. YOUR CHOICES
You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of this website.

Most browsers allow you to:
- View cookies that have been set and delete them individually.
- Block third-party cookies.
- Block cookies from specific websites.
- Block all cookies.
- Delete cookies when you close your browser.

For more information about managing cookies in your browser, visit: www.allaboutcookies.org

5. CONSENT
By continuing to use this website, you consent to our use of cookies as described in this policy. You may withdraw consent at any time by adjusting your browser settings or clearing your cookies.

6. CHANGES TO THIS POLICY
We may update this Cookie Policy from time to time in response to changes in technology, regulation, or our own data practices. Updates will be posted on this page with the revised date.

7. CONTACT
For any queries about our use of cookies, please contact: info@solvedfinancial.com`,

// ─────────────────────────────────────────────────────────────────────────────

legal_regulatory_disclosure: `REGULATORY DISCLOSURE
Last updated: 1 May 2026

1. NATURE OF SERVICES
Solved Financial Services provides financial, corporate, and strategic advisory services. We are not a licensed investment firm, bank, or regulated financial institution. We do not provide regulated investment advice, discretionary portfolio management, or financial intermediation services as defined under MiFID II or equivalent legislation.

2. NO INVESTMENT ADVICE
Nothing on this website or in any communication from Solved Financial Services constitutes investment advice, a recommendation to buy or sell any financial instrument, or a solicitation to enter into any investment transaction. All information is provided for general informational and advisory purposes only.

3. AUDIT AND ASSURANCE SERVICES
Audit and assurance services referenced on this website are not performed directly by Solved Financial Services. Where audit services are required, they are coordinated through regulated partner firms licensed to conduct statutory audit in accordance with the applicable laws of each jurisdiction (Cyprus, Netherlands, or Greece). Solved Financial Services acts in an advisory and coordination capacity only.

4. COMPANY INCORPORATION SERVICES
Company incorporation and corporate secretarial services described on this website are delivered through trusted legal and corporate service providers licensed in the relevant jurisdiction. Solved Financial Services acts as a strategic adviser and does not itself hold a corporate services licence.

5. GREECE — STRATEGIC PARTNERSHIP DISCLOSURE
In Greece, advisory and compliance services are delivered in collaboration with Revival Consulting Services, a Greek advisory firm with expertise in local regulatory compliance, tax advisory, and business establishment. Solved Financial Services coordinates and supports these engagements but does not operate as a directly licensed entity in Greece.

6. JURISDICTION-SPECIFIC REGULATORY INFORMATION
- Cyprus: Corporate and financial services in Cyprus are subject to regulation by the Cyprus Securities and Exchange Commission (CySEC), the Institute of Certified Public Accountants of Cyprus (ICPAC), and other competent authorities depending on the nature of services.
- Netherlands: Financial and corporate services in the Netherlands operate within a framework regulated by the Dutch Authority for the Financial Markets (AFM) and De Nederlandsche Bank (DNB).
- Greece: Services in Greece are subject to oversight by the Hellenic Capital Market Commission (HCMC) and the Institute of Certified Public Accountants of Greece (SOEL).

7. TAX ADVICE DISCLAIMER
Any tax-related content on this website represents general information only and does not constitute formal tax advice. Tax laws and regulations change frequently and vary by jurisdiction. You should always seek independent professional tax advice before making decisions with tax implications.

8. LIMITATION OF LIABILITY
Solved Financial Services makes no representation that the information on this website is appropriate or applicable in any particular jurisdiction. Users access this website at their own risk and are responsible for compliance with all applicable local laws.

9. CONTACT
For regulatory queries or to understand the nature of our services in a specific jurisdiction, please contact: info@solvedfinancial.com`,

};

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected.\n');
  for (const [key, value] of Object.entries(LEGAL)) {
    await Setting.findOneAndUpdate({ key }, { key, value }, { upsert: true, new: true });
    console.log(`✅ Seeded: ${key} (${value.length} chars)`);
  }
  await mongoose.disconnect();
  console.log('\nDone.');
}).catch(e => { console.error(e.message); process.exit(1); });
