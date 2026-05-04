/**
 * migrate-images.js
 * Downloads all hardcoded Figma MCP asset URLs used in client/src,
 * uploads them to S3 under website/ prefix with semantic names,
 * then replaces every occurrence in client/src source files.
 *
 * Run from server/ directory: node scripts/migrate-images.js
 */

require('dotenv').config();
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const AWS_REGION = (process.env.AWS_REGION || '').trim();
const AWS_BUCKET = (process.env.AWS_S3_BUCKET_NAME || '').trim();

if (!AWS_REGION || !AWS_BUCKET) {
  console.error('Missing AWS_REGION or AWS_S3_BUCKET_NAME in environment. Check .env file.');
  process.exit(1);
}

const s3Client = new S3Client({
  region: AWS_REGION,
  endpoint: `https://s3.${AWS_REGION}.amazonaws.com`,
  forcePathStyle: true,
  credentials: {
    accessKeyId: (process.env.AWS_ACCESS_KEY_ID || '').trim(),
    secretAccessKey: (process.env.AWS_SECRET_ACCESS_KEY || '').trim(),
  },
});

async function uploadToS3(key, buffer, contentType) {
  const params = { Bucket: AWS_BUCKET, Key: key, Body: buffer, ContentType: contentType };
  try {
    await s3Client.send(new PutObjectCommand({ ...params, ACL: 'public-read' }));
  } catch (err) {
    if (err.Code === 'AccessControlListNotSupported' || err.name === 'AccessControlListNotSupported') {
      await s3Client.send(new PutObjectCommand(params));
    } else {
      throw err;
    }
  }
  return `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

// ─── UUID → semantic filename mapping ────────────────────────────────────────
const ASSETS = [
  // Hero backgrounds
  { id: 'a7b22855-27e1-40fe-bf65-701d6ed9f423', name: 'hero-home' },
  { id: '0bdc64fb-c454-4e4f-9eda-20f6487dc2c3', name: 'hero-about' },
  { id: '22ee5cfe-e49a-4a80-a24c-a90129fc998e', name: 'hero-contact' },
  { id: 'dcd6c064-dd6a-4323-b7dc-2ce35c3f210d', name: 'hero-experience' },
  { id: '394503d2-84ea-431f-8b1a-8897d509b507', name: 'hero-industries' },
  { id: '93599998-8187-41ce-b463-71a7eb28aa18', name: 'hero-insights' },
  { id: 'afaa9639-8239-4ff7-b618-8f26a5cc58de', name: 'hero-jurisdictions' },
  { id: 'b71d94ae-7262-4927-8e26-9e460f315ff3', name: 'hero-services' },
  // Common UI
  { id: 'c0d141dd-0980-4a68-bdde-6037715094ff', name: 'footer-cta-bg' },
  // Team photos (About)
  { id: '37fa88fd-b879-44fa-8bb6-efef5879c7db', name: 'team-photo-1' },
  { id: '451cb826-3d2d-4486-9c64-6d8a2d8229d4', name: 'team-photo-2' },
  { id: 'cf009be8-0e75-451e-ad08-530200244b29', name: 'team-photo-3' },
  // Services
  { id: 'a8f71cd2-5946-4c94-a815-1b5bca2c12ad', name: 'service-cfo-advisory' },
  { id: 'eb427811-735f-45b6-97e1-344e8a5f4cd1', name: 'service-finance-setup' },
  { id: '733abf8a-fad7-4d79-9c7a-0e9eeb7e806c', name: 'service-accounting' },
  { id: '849ddde9-0afc-4412-9b5b-c05bc718a19b', name: 'service-operations-advisory' },
  { id: '8ca3e77d-1fa8-49af-8a8d-2e8ab15b3a3a', name: 'service-company-incorporation' },
  { id: 'f749ae56-2209-450a-bb63-a89f11268cba', name: 'service-audit-assurance' },
  { id: '060ca6a8-dc5f-4df1-8916-d4c4f5d37c98', name: 'service-cross-border-advisory' },
  // Industries
  { id: '4c20d896-610c-4514-9914-f67d18e5ca29', name: 'industry-financial-services' },
  { id: '4d6ebfa2-0fb8-4732-baaa-2a0456144677', name: 'industry-investment-management' },
  { id: '42358b8d-4420-47ab-b380-76a8d0c8aa46', name: 'industry-technology-fintech' },
  { id: '511802bf-703f-4fb1-94f4-cb3c25b004b2', name: 'industry-real-estate' },
  { id: 'e48d200d-9bf7-4b9e-905d-a402a6711795', name: 'industry-shipping-maritime' },
  // Jurisdictions
  { id: 'f0489053-8e02-4c15-8922-ce5f45efb882', name: 'jurisdiction-cyprus-photo' },
  { id: '91c26ec4-adc4-494d-a295-e086b62c21e6', name: 'jurisdiction-netherlands-photo' },
  { id: 'a05c1fb1-3d2f-43f5-8b1b-dc664dd33f60', name: 'jurisdiction-greece-photo' },
  { id: '054bdc3d-2f42-4812-a78d-cba568e34419', name: 'jurisdiction-detail-photo-1' },
  { id: '324bd48e-b95a-4fb6-8d31-2f5dd99a254b', name: 'jurisdiction-detail-photo-2' },
  { id: '52452a28-b309-478c-82ff-9af8074ad68a', name: 'jurisdiction-detail-photo-3' },
  // Case studies (Experience)
  { id: '18976f01-a671-4601-92b7-3ad6b427e17c', name: 'case-study-asset-manager' },
  { id: '4a97ff9b-f97d-4b46-ab20-9af0efa130ee', name: 'case-study-fintech-licensing' },
  { id: '979533b3-e5e4-411f-94a6-ae0a2cf06006', name: 'case-study-shipping-restructure' },
  { id: 'c8526372-9326-46ab-9994-6c062d980025', name: 'case-study-investment-bank' },
  // Insights / articles
  { id: '003b3fa5-5220-4d99-9dc6-fb83f3ee5372', name: 'insight-article-1' },
  { id: 'e936f564-e5c8-4375-a7ba-d3d67ab26c41', name: 'insight-article-2' },
  { id: '2072c4ec-da89-4ab9-97d9-3caeed6f8cb5', name: 'insight-article-3' },
  { id: 'cca84feb-e1b1-4be1-9d22-e94c9dd732ad', name: 'insight-article-4' },
  { id: 'd5fdd197-8070-4407-b6cc-44f9128d0557', name: 'insight-article-5' },
  { id: 'fe51bd3d-0959-4f62-bee1-e3fc7d7bb672', name: 'insight-article-6' },
  // World map (Wikimedia)
  {
    id: null,
    name: 'world-map',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/2560px-World_map_-_low_resolution.svg.png',
  },
];

function figmaUrl(id) {
  return `https://www.figma.com/api/mcp/asset/${id}`;
}

// ─── HTTP fetch with redirect following ──────────────────────────────────────
function fetchBuffer(url, redirectsLeft = 10) {
  return new Promise((resolve, reject) => {
    if (redirectsLeft === 0) return reject(new Error('Too many redirects: ' + url));
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; image-migrator/1.0)',
        Accept: 'image/*,*/*',
      },
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchBuffer(res.headers.location, redirectsLeft - 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const contentType = res.headers['content-type'] || 'image/jpeg';
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType }));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout: ' + url)); });
  });
}

function extFromContentType(ct) {
  if (ct.includes('png')) return '.png';
  if (ct.includes('gif')) return '.gif';
  if (ct.includes('webp')) return '.webp';
  if (ct.includes('svg')) return '.svg';
  return '.jpg';
}

// ─── Source file replacement ──────────────────────────────────────────────────
const CLIENT_SRC = path.resolve(__dirname, '../../client/src');

function getAllSourceFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getAllSourceFiles(full));
    else if (/\.(jsx?|tsx?|js|ts)$/.test(entry.name)) results.push(full);
  }
  return results;
}

function replaceInFiles(mapping) {
  const files = getAllSourceFiles(CLIENT_SRC);
  let totalReplacements = 0;
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    for (const [oldUrl, newUrl] of Object.entries(mapping)) {
      if (content.includes(oldUrl)) {
        content = content.split(oldUrl).join(newUrl);
        changed = true;
        totalReplacements++;
      }
    }
    if (changed) fs.writeFileSync(file, content, 'utf8');
  }
  return totalReplacements;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n📦 Starting image migration — ${ASSETS.length} assets\n`);

  const mapping = {}; // oldUrl → newS3Url
  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (const asset of ASSETS) {
    const sourceUrl = asset.url || figmaUrl(asset.id);
    process.stdout.write(`  ↓ ${asset.name} ... `);

    try {
      const { buffer, contentType } = await fetchBuffer(sourceUrl);
      const ext = extFromContentType(contentType);
      const filename = `${asset.name}${ext}`;

      // Use a fixed S3 key with semantic name (not timestamp-random) so re-runs are idempotent-ish
      const key = `website/${filename}`;

      const s3Url = await uploadToS3(key, buffer, contentType);
      mapping[sourceUrl] = s3Url;
      results.push({ name: asset.name, sourceUrl, s3Url, size: buffer.length });
      successCount++;
      console.log(`✓ ${(buffer.length / 1024).toFixed(0)} KB → ${s3Url}`);
    } catch (err) {
      failCount++;
      results.push({ name: asset.name, sourceUrl, error: err.message });
      console.log(`✗ FAILED: ${err.message}`);
    }

    // Brief pause to avoid hammering Figma CDN
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n🔄 Replacing URLs in client/src source files...`);
  const replacements = replaceInFiles(mapping);
  console.log(`   ${replacements} file(s) updated`);

  // Save mapping JSON
  const mappingPath = path.join(__dirname, 'image-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify({ generated: new Date().toISOString(), mapping, results }, null, 2));
  console.log(`\n💾 Mapping saved to scripts/image-mapping.json`);

  // Update PROGRESS.md
  const progressPath = path.resolve(__dirname, '../../../PROGRESS.md');
  if (fs.existsSync(progressPath)) {
    const progressContent = fs.readFileSync(progressPath, 'utf8');
    const timestamp = new Date().toISOString().slice(0, 10);
    const entry = `\n## Image Migration to S3 — ${timestamp}\n\n` +
      `- **${successCount}/${ASSETS.length}** Figma/external assets migrated to S3\n` +
      `- ${failCount > 0 ? `**${failCount} failed** (see image-mapping.json)` : 'All assets migrated successfully'}\n` +
      `- ${replacements} source file URL replacement(s) applied in \`client/src\`\n` +
      `- All images now served from \`https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/\`\n` +
      `- Mapping: \`server/scripts/image-mapping.json\`\n`;
    fs.writeFileSync(progressPath, progressContent + entry, 'utf8');
    console.log('📝 PROGRESS.md updated');
  }

  console.log(`\n✅ Done — ${successCount} succeeded, ${failCount} failed\n`);
}

main().catch((err) => { console.error(err); process.exit(1); });
