const fs = require('fs');
let c = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');
c = c.replace(/<option value="" Dixer \(Dinamik Açıklamalı\)">" Dixer \(Dinamik Açıklamalı\)<\/option>/g, '<option value="Diğer (Dinamik Açıklamalı)">Diğer (Dinamik Açıklamalı)</option>');
// Fix broken quotes dynamically
c = c.replace(/value="[^"]*" Di[^\(]*\(Dinamik Açıklamalı\)">/g, 'value="Diğer (Dinamik Açıklamalı)">');
fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', c, 'utf8');
