const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const target = `  // İlaç kütüphanesi ve aylık rapor tetikleyicisi
  useEffect(() => {
    if (token) {
      fetchEk1Products();
      fetchMonthlyReports();`;

const replacement = `  // İlaç kütüphanesi ve aylık rapor tetikleyicisi
  useEffect(() => {
    if (token) {
      fetchPests();
      fetchEk1Products();
      fetchMonthlyReports();`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('frontend/src/App.jsx', code, 'utf8');
    console.log('Successfully added fetchPests() to the global useEffect.');
} else {
    console.log('Could not find the target string. Aborting.');
}
