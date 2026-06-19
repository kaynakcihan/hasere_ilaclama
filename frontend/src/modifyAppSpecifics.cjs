const fs = require('fs');
let code = fs.readFileSync('App.jsx', 'utf8');

const oldCheck = "if (!formData.unvan || !formData.konum || !formData.telefon) {\n      setError('İşletme Unvanı, Konum (İl/İlçe) ve Telefon Numarası zorunlu alanlardır.');\n      return;\n    }";

const newCheck = if (!formData.unvan) {
      setError('Lütfen müşteri/işletme unvanını giriniz.');
      return;
    }
    if (!formData.konum) {
      setError('Lütfen il/ilçe (konum) bilgisini giriniz.');
      return;
    }
    if (!formData.telefon) {
      setError('Lütfen telefon numarasını giriniz.');
      return;
    };

code = code.replaceAll(oldCheck, newCheck);

fs.writeFileSync('App.jsx', code);
console.log('Done App.jsx!');
