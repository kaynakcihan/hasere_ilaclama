const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const updatedCode = code.replace(
  /(\/\/ İlaç kütüphanesi ve aylık rapor tetikleyicisi\s*useEffect\(\(\) => \{\s*if \(token\) \{\s*fetchEk1Products\(\);)/,
  "$1\n      fetchPests();"
);

if (code !== updatedCode) {
    fs.writeFileSync('frontend/src/App.jsx', updatedCode, 'utf8');
    console.log('Successfully added fetchPests() to the global useEffect.');
} else {
    console.log('Could not find the target string. Aborting.');
}
