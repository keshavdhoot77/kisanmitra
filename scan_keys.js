const fs = require('fs');
const path = require('path');

const en = JSON.parse(fs.readFileSync('public/locales/en/translation.json', 'utf8'));

function getVal(obj, keyPath) {
  const parts = keyPath.split('.');
  let curr = obj;
  for (const p of parts) {
    if (curr && typeof curr === 'object' && p in curr) {
      curr = curr[p];
    } else {
      return undefined;
    }
  }
  return curr;
}

function scanDir(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(scanDir(full));
    } else if (full.endsWith('.jsx') || full.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

const files = scanDir('src');
const missing = [];
const regex = /t\(\s*['"]([^'"]+)['"](?:\s*,\s*['"]([^'"]*)['"])?/g;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const defaultVal = match[2];
    const val = getVal(en, key);
    if (val === undefined && defaultVal === undefined) {
      missing.push({ file, key });
    }
  }
}

console.log('COUNT:', missing.length);
console.log(JSON.stringify(missing, null, 2));
