const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

const r = '\ufffd';

const fixes = {
  ['p' + r]: 'px',
  ['fle' + r]: 'flex',
  ['id' + r]: 'idx',
  ['minma' + r]: 'minmax',
  ['bo' + r]: 'box',
  ['ma' + r]: 'max',
  ['te' + r + 't']: 'text',
  ['fi' + r + 'ed']: 'fixed',
  ['ne' + r + 't']: 'next',
  ['conte' + r + 't']: 'context'
};

for (const [k, v] of Object.entries(fixes)) {
  content = content.replace(new RegExp(k, 'g'), v);
}

// Ensure the specific login text fix
content = content.replace(/Sisteme ilk giri\ufffdş/g, 'Sisteme ilk giriş');
content = content.replace(/Y\ufffdNET\ufffdC\ufffd/g, 'YÖNETİCİ');

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed css props and others.');
