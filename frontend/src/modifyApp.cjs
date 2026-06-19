const fs = require('fs');
let code = fs.readFileSync('App.jsx', 'utf8');

// 1. Initial state additions
code = code.replace(/vergi_no: '',/g, "vergi_no: '',\n      konum: '',");
code = code.replace(/vergi_no: customer.vergi_no \|\| '',/g, "vergi_no: customer.vergi_no || '',\n        konum: customer.konum || '',");

// 2. Add konum validation to handleAddCustomer and handleUpdateCustomer
code = code.replace(/if \(!formData\.unvan \|\| !vNo \|\| !formData\.telefon\) \{/g, 'if (!formData.unvan || !formData.konum || !formData.telefon) {');
code = code.replace(/İşletme Unvanı, Vergi\/TC No ve Telefon Numarası zorunlu alanlardır\./g, 'İşletme Unvanı, Konum (İl/İlçe) ve Telefon Numarası zorunlu alanlardır.');

// 3. Remove length validations
code = code.replace(/if \(vNo\.length !== 10 && vNo\.length !== 11\) \{[\s\S]*?return;\s*\}/g, '');

// 4. Update the Vergi No / TC No labels to remove required star
code = code.replace(/<label className="input-label">Vergi No \/ TC No \*<\/label>/g, '<label className="input-label">Vergi No / TC No</label>');

// 5. Remove required from Vergi No inputs
code = code.replace(/type="text" \s*required\s*className="form-input" \s*(placeholder="10 Haneli Vergi No veya 11 Haneli TC"|value=\{formData\.vergi_no\})/g, 'type="text" \n                  className="form-input" \n                  $1');

// 6. Insert new Konum input after Adres (which is a textarea)
const konumInput = `
              <div className="input-group">
                <label className="input-label">Konum (İl / İlçe) *</label>
                <input 
                  type="text" 
                  required
                  className="form-input" 
                  placeholder="Örn: Edremit / Balıkesir"
                  value={formData.konum}
                  onChange={(e) => setFormData({ ...formData, konum: e.target.value })}
                />
              </div>
`;

// Insert after Adres input block
code = code.replace(/(<label className="input-label">Açık Adres \*<\/label>[\s\S]*?<\/div>)/g, '$1' + konumInput);

fs.writeFileSync('App.jsx', code);
console.log('Done!');
