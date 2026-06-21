const fs = require('fs');

function applyPatch() {
  const dbPath = 'backend/database.js';
  let code = fs.readFileSync(dbPath, 'utf8');

  // 1. Update getAllEk1Products default values
  const defaultProdsTarget = "d.ek1_products = [\n        { id: 1, commercialName: 'K-Othrine JEL', licenseDate: '15.10.2015', licenseNo: '2015/124', method: 'Jel Noktalama', activeIngredient: 'Deltamethrin', antidote: 'Semptomatik Tedavi', defaultQuantity: '10 gr' },";
  const defaultProdsReplacement = "d.ek1_products = [\n        { id: 1, commercialName: 'K-Othrine JEL', licenseDate: '15.10.2015', licenseNo: '2015/124', method: 'Jel Noktalama', activeIngredient: 'Deltamethrin', antidote: 'Semptomatik Tedavi', defaultQuantity: '10 gr', stock: 0, unit: 'gr', criticalStock: 10 },";
  code = code.replace(defaultProdsTarget, defaultProdsReplacement);
  
  // Also update Maxforce Jel, etc.. actually just a regex to ensure they have the fields isn't needed if the user adds new ones. Let's not worry about the static array too much, it's just for empty DBs. But we should add it to addEk1Product

  // 2. addEk1Product
  const addProdTarget = "const p = {\n      id: newId,\n      commercialName: productData.commercialName,\n      licenseDate: productData.licenseDate || '',\n      licenseNo: productData.licenseNo || '',\n      method: productData.method || 'Jel Noktalama',\n      activeIngredient: productData.activeIngredient || '',\n      antidote: productData.antidote || 'Semptomatik Tedavi',\n      defaultQuantity: productData.defaultQuantity || '10 gr',\n      created_at: new Date().toISOString()\n    };";
  const addProdReplacement = "const p = {\n      id: newId,\n      commercialName: productData.commercialName,\n      licenseDate: productData.licenseDate || '',\n      licenseNo: productData.licenseNo || '',\n      method: productData.method || 'Jel Noktalama',\n      activeIngredient: productData.activeIngredient || '',\n      antidote: productData.antidote || 'Semptomatik Tedavi',\n      defaultQuantity: productData.defaultQuantity || '10 gr',\n      stock: Number(productData.stock) || 0,\n      unit: productData.unit || 'Birim',\n      criticalStock: Number(productData.criticalStock) || 10,\n      created_at: new Date().toISOString()\n    };";
  code = code.replace(addProdTarget, addProdReplacement);

  // 3. addEk1Document (deduct stock)
  const addDocTarget = "d.ek1_documents.push(doc);\n    \n    let appInfo = {};";
  const addDocReplacement = `d.ek1_documents.push(doc);
    
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
                // Kullanılan miktarı sayıya çevir ("150 ml" -> 150)
                const qtyStr = u.defaultQuantity || "0";
                const numMatch = qtyStr.match(/\\d+/);
                const usedAmount = numMatch ? parseFloat(numMatch[0]) : 0;
                
                if (usedAmount > 0) {
                  const product = d.ek1_products[productIndex];
                  product.stock = (product.stock || 0) - usedAmount;
                  
                  // Kritik stok kontrolü
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
  code = code.replace(addDocTarget, addDocReplacement);

  // 4. Adjust Product Stock
  const adjustStockTarget = "deleteEk1Product: async (id) => {\n    const d = await loadData();\n    if (!d.ek1_products) return false;\n    const initialLength = d.ek1_products.length;\n    d.ek1_products = d.ek1_products.filter(p => p.id !== parseInt(id));\n    await saveData(d);\n    return d.ek1_products.length < initialLength;\n  },";
  const adjustStockReplacement = `deleteEk1Product: async (id) => {
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
  code = code.replace(adjustStockTarget, adjustStockReplacement);

  fs.writeFileSync(dbPath, code, 'utf8');
  console.log('Database patched for stock tracking.');
}

applyPatch();
