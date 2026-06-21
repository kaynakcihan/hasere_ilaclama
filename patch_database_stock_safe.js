const fs = require('fs');

const dbPath = 'backend/database.js';
let code = fs.readFileSync(dbPath, 'utf8');

// 1. Patch addEk1Product
code = code.replace(
  "defaultQuantity: productData.defaultQuantity || '10 gr',\n      created_at: new Date().toISOString()",
  "defaultQuantity: productData.defaultQuantity || '10 gr',\n      stock: Number(productData.stock) || 0,\n      unit: productData.unit || 'Birim',\n      criticalStock: Number(productData.criticalStock) || 10,\n      created_at: new Date().toISOString()"
);

// 2. Patch addEk1Document (just append the stock deduction logic before let appInfo = {};)
const logic = `
    // Stok Düşüm Algoritması
    if (doc.secili_urunler) {
      try {
        let urunler = doc.secili_urunler;
        if (typeof urunler === 'string') urunler = JSON.parse(urunler);
        if (Array.isArray(urunler) && d.ek1_products) {
          for (const u of urunler) {
            if (u.commercialName) {
              const productIndex = d.ek1_products.findIndex(p => p.commercialName === u.commercialName);
              if (productIndex !== -1) {
                const qtyStr = u.defaultQuantity || "0";
                const numMatch = qtyStr.match(/\\d+/);
                const usedAmount = numMatch ? parseFloat(numMatch[0]) : 0;
                
                if (usedAmount > 0) {
                  const product = d.ek1_products[productIndex];
                  product.stock = (product.stock || 0) - usedAmount;
                  
                  const crit = product.criticalStock || 10;
                  if (product.stock <= crit) {
                    await db.addNotification(
                      'Kritik Stok Uyarısı',
                      \`\${product.commercialName} stoku kritik seviyenin altina düştü! (Kalan: \${product.stock} \${product.unit || ''}). Lütfen sipariş veriniz.\`,
                      'warning'
                    );
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Stok dusum hatasi:', err);
      }
    }

    let appInfo = {};`;

code = code.replace("d.ek1_documents.push(doc);\n    \n    let appInfo = {};", "d.ek1_documents.push(doc);\n" + logic);

// 3. Patch deleteEk1Product to insert adjustProductStock right after it
const adjustLogic = `  deleteEk1Product: async (id) => {
    const d = await loadData();
    if (!d.ek1_products) return false;
    const initialLength = d.ek1_products.length;
    d.ek1_products = d.ek1_products.filter(p => p.id !== parseInt(id));
    await saveData(d);
    return d.ek1_products.length < initialLength;
  },

  adjustProductStock: async (id, amount) => {
    const d = await loadData();
    if (!d.ek1_products) return null;
    const idx = d.ek1_products.findIndex(p => p.id === parseInt(id));
    if (idx === -1) throw new Error('İlaç bulunamadı');
    
    d.ek1_products[idx].stock = (d.ek1_products[idx].stock || 0) + parseFloat(amount);
    
    const product = d.ek1_products[idx];
    const crit = product.criticalStock || 10;
    if (product.stock <= crit) {
      await db.addNotification(
        'Kritik Stok Uyarısı',
        \`\${product.commercialName} stoku kritik seviyenin altina düştü! (Kalan: \${product.stock} \${product.unit || ''}). Lütfen sipariş veriniz.\`,
        'warning'
      );
    }
    
    await saveData(d);
    return product;
  },`;

code = code.replace(/  deleteEk1Product: async \(id\) => \{[\s\S]*?return d.ek1_products.length < initialLength;\n  \},/, adjustLogic);

fs.writeFileSync('backend/database.tmp.js', code, 'utf8');
console.log('Test file generated successfully. Please check backend/database.tmp.js');
