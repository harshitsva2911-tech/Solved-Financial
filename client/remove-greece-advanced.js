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

// 1. Jurisdictions.jsx
replaceInFile('pages/Jurisdictions.jsx', [
  { search: /\s*\{\s*country:\s*'Greece',\s*slug:\s*'greece',[\s\S]*?\},/g, replace: '' },
  { search: /\s*greece:\s*'https:\/\/imperial-ventures[^']*',/g, replace: '' }
]);

// 2. JurisdictionDetail.jsx
replaceInFile('pages/JurisdictionDetail.jsx', [
  { search: /\s*greece:\s*\{[\s\S]*?\},/g, replace: '' }, // remove the greece object in JURISDICTION_DATA
  { search: /\s*greece:\s*'https:\/\/imperial[^']*',/g, replace: '' }, // remove the greece image
  { search: /\s*const isGreece = slug === 'greece' \|\| resolvedFlagCode === 'gr';/g, replace: '' },
  { search: /\s*\{\/\*\s*2\.\s*Greece partner firm banner[\s\S]*?\}\s*\)/g, replace: '' }, // remove the isGreece block
  { search: /\s*\{isGreece\s*&&\s*partnerFirm\s*&&[\s\S]*?\)\}/g, replace: '' }
]);

// 3. insightsData.js
replaceInFile('data/insightsData.js', [
  { search: /\s*\{\s*slug:\s*'greece-non-dom-regime',[\s\S]*?\}\s*\},/g, replace: '' }
]);

// 4. InternationalPresence.jsx
replaceInFile('components/home/InternationalPresence.jsx', [
  { search: /\s*\{\s*slug:\s*'greece',\s*country:\s*'Greece',[\s\S]*?\},/g, replace: '' }
]);

console.log('Advanced frontend Greece removal script completed.');
