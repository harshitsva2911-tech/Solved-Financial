const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath, replacements) => {
  const fullPath = path.join(__dirname, 'src', filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;
  replacements.forEach(({ search, replace }) => {
    if (content.match(search)) {
      content = content.replace(search, replace);
      changed = true;
    }
  });
  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
};

// 1. Footer.jsx
replaceInFile('components/common/Footer.jsx', [
  { search: /\s*\{\s*label:\s*'Greece',\s*to:\s*'\/jurisdictions\/greece'\s*\},/g, replace: '' }
]);

// 2. InternationalPresence.jsx
replaceInFile('components/home/InternationalPresence.jsx', [
  { search: /\s*\{\s*slug:\s*'greece'[\s\S]*?\},/g, replace: '' }
]);

// 3. Contact.jsx
replaceInFile('pages/Contact.jsx', [
  { search: /\s*\{\s*code:\s*'\+30',\s*flag:\s*'[^']*',\s*name:\s*'Greece'\s*\},/g, replace: '' },
  { search: /\s*<option value="Greece">Greece<\/option>/g, replace: '' }
]);

// 4. Jurisdictions.jsx
replaceInFile('pages/Jurisdictions.jsx', [
  { search: /\s*\{\s*country:\s*'Greece'[\s\S]*?greece-photo\.png',\s*\},/g, replace: '' },
  { search: /,\s*greece:\s*'gr'/g, replace: '' }
]);

// 5. About.jsx
replaceInFile('pages/About.jsx', [
  { search: /Cyprus, the Netherlands, and Greece/g, replace: 'Cyprus and the Netherlands' }
]);

// 6. Services.jsx
replaceInFile('pages/Services.jsx', [
  { search: /Cyprus, Netherlands, and Greece/g, replace: 'Cyprus and the Netherlands' }
]);

// 7. Industries.jsx & Experience.jsx (Remove Greece from arrays if present)
replaceInFile('pages/Industries.jsx', [
  { search: /\s*country:\s*'Greece',/g, replace: '' }
]);
replaceInFile('pages/Experience.jsx', [
  { search: /\s*country:\s*'Greece',/g, replace: '' }
]);

// 8. data/insightsData.js
replaceInFile('data/insightsData.js', [
  { search: /Cyprus, the Netherlands, and Greece/g, replace: 'Cyprus and the Netherlands' }
]);

console.log('Frontend Greece removal script completed.');
