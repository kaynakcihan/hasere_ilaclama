const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

const r = '\ufffd';

const replacements = {
  // Emojis and corrupted icons
  [`ş:${r}️`]: '📄',
  [`${r}:️`]: '📄', // just in case
  [`ş${r}${r}`]: '🏢',
  [`ş ${r}`]: '👷',
  [`şR${r}️`]: '🌧️',
  [`${r}:${r}`]: '🚗',
  [`${r}a ️`]: '⚖️',
  [`${r}"`]: '➕',
  [`${r} ${r}`]: '👤',
  [`${r}܎️`]: '☣️',
  [`ş:️`]: '📄',
  
  // Repeated letters with \ufffd before them
  [`${r}ş`]: 'ş',
  [`${r}!`]: 'Ç',
  [`${r} `]: 'Ö',
  [`${r}Ü`]: 'Ü',
  [`${r}ö`]: 'ö',
  [`${r}ç`]: 'ç',
  [`${r}ğ`]: 'ğ',
  [`${r}ı`]: 'ı',
  
  // Other specific words found in the snippet
  [`Di${r}er`]: 'Diğer',
  [`di${r}er`]: 'diğer',
  [`ba${r}arıyla`]: 'başarıyla',
  [`Ba${r}arıyla`]: 'Başarıyla',
  [`Y${r}NETİCİ`]: 'YÖNETİCİ',
  [`Y${r}NETİCİ`]: 'YÖNETİCİ',
  [`T${r}M`]: 'TÜM',
};

for (const [bad, good] of Object.entries(replacements)) {
  content = content.replace(new RegExp(bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), good);
}

// Any lingering \ufffd that we missed, just remove it or replace with empty space if it's safe?
// NO, let's just do these known mappings first.

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed emojis and repeated bad chars');
