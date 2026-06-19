const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

// Replace \d+pş with \d+px
content = content.replace(/(\d+)pş/g, '$1px');

// Replace known SVG and CSS properties
const fixes = {
  'viewBoş': 'viewBox',
  'cş=': 'cx=',
  'ş1=': 'x1=',
  'ş2=': 'x2=',
  'fleş': 'flex',
  'minmaş': 'minmax',
  'zIndeş': 'zIndex',
  'Maş': 'Max',
  'maş': 'max',
  'şmlns': 'xmlns',
  'şml=': 'xml=',
  'eşcel': 'excel',
  'idş': 'idx',
  'şls': 'xls',
  'exportEşpensesToExcel': 'exportExpensesToExcel',
  'expensesToEşport': 'expensesToExport',
  'eşp': 'exp',
  'ctş': 'ctx',
  'checkboş': 'checkbox',
  'IconFileTeşt': 'IconFileText',
  'position_ş': 'position_x'
};

for (const [k, v] of Object.entries(fixes)) {
  content = content.replace(new RegExp(k, 'g'), v);
}

// Special case: boş -> box EXCEPT empty string (boş) in Turkish.
// We only have viewBoş (fixed), checkboş (fixed), and maybe `boş` alone in CSS classes?
// Let's replace 'boş' with 'box' only if it's 'boş-shadow' or 'boşSizing' or 'boş' inside className
content = content.replace(/boşShadow/g, 'boxShadow');
content = content.replace(/boşSizing/g, 'boxSizing');

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed pş to px and other attributes.');
