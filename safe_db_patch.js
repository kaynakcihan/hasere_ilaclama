const fs = require('fs');

let dbCode = fs.readFileSync('backend/database.js', 'utf8');

if (!dbCode.includes('pests: [')) {
    dbCode = dbCode.replace(
        "appointments: [],",
        "appointments: [],\n  pests: [\n    { id: 1, name: 'Karınca', type: 'Yürüyen Haşere' },\n    { id: 2, name: 'Karafatma', type: 'Yürüyen Haşere' },\n    { id: 3, name: 'Hamam Böceği', type: 'Yürüyen Haşere' },\n    { id: 4, name: 'Fare', type: 'Kemirgen' },\n    { id: 5, name: 'Pire', type: 'Yürüyen Haşere' },\n    { id: 6, name: 'Tahta Kurusu', type: 'Yürüyen Haşere' },\n    { id: 7, name: 'Yılan', type: 'Sürüngen' },\n    { id: 8, name: 'Akrep', type: 'Yürüyen Haşere' }\n  ],"
    );
}

if (!dbCode.includes('updateEk1Product: async')) {
    dbCode = dbCode.replace(
        "deleteEk1Product: async (id) => {",
        "updateEk1Product: async (id, productData) => {\n    const d = await loadData();\n    if (!d.ek1_products) d.ek1_products = [];\n    const idx = d.ek1_products.findIndex(p => p.id === parseInt(id));\n    if (idx === -1) throw new Error('İlaç bulunamadı');\n    d.ek1_products[idx] = { ...d.ek1_products[idx], ...productData };\n    await saveData(d);\n    return d.ek1_products[idx];\n  },\n\n  deleteEk1Product: async (id) => {"
    );
}

if (!dbCode.includes('getAllPests: async')) {
    const pestMethods = `
  // === HAŞERE KÜTÜPHANESİ ===
  getAllPests: async () => {
    const d = await loadData();
    return d.pests || [];
  },
  addPest: async (name, type) => {
    const d = await loadData();
    if (!d.pests) d.pests = [];
    const newId = d.pests.length > 0 ? Math.max(...d.pests.map(p => p.id)) + 1 : 1;
    const p = { id: newId, name, type: type || '' };
    d.pests.push(p);
    await saveData(d);
    return p;
  },
  updatePest: async (id, name, type) => {
    const d = await loadData();
    if (!d.pests) d.pests = [];
    const idx = d.pests.findIndex(p => p.id === parseInt(id));
    if (idx === -1) throw new Error('Haşere bulunamadı');
    d.pests[idx].name = name;
    d.pests[idx].type = type || '';
    await saveData(d);
    return d.pests[idx];
  },
  deletePest: async (id) => {
    const d = await loadData();
    if (!d.pests) return false;
    const initialLen = d.pests.length;
    d.pests = d.pests.filter(p => p.id !== parseInt(id));
    if (d.pests.length < initialLen) {
      await saveData(d);
      return true;
    }
    return false;
  }
};
`;

    // carefully replace the final `};` with our methods + `};`
    const lines = dbCode.split('\n');
    let lastBraceIndex = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].trim() === '};') {
            lastBraceIndex = i;
            break;
        }
    }
    if (lastBraceIndex !== -1) {
        lines[lastBraceIndex] = pestMethods;
        dbCode = lines.join('\n');
    }
}

fs.writeFileSync('backend/database.js', dbCode, 'utf8');
console.log('Database safely patched');
