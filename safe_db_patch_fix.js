const fs = require('fs');

let dbCode = fs.readFileSync('backend/database.js', 'utf8');

const pestMethods = `
  , // ADDED COMMA HERE
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

dbCode = dbCode.replace(
    /  \/\/ === HAŞERE KÜTÜPHANESİ ===\r?\n  getAllPests: async \(\) => {[\s\S]*?};/,
    `};`
);

const lines = dbCode.split('\n');
let lastBraceIndex = -1;
for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() === '};') {
        lastBraceIndex = i;
        break;
    }
}
if (lastBraceIndex !== -1) {
    // wait, we need to replace `};` with `},` + pestMethods, or just remove the `};` and append `pestMethods` which ends in `};`.
    // Wait, the previous line before `};` doesn't have a comma.
    // If we replace `};` with pestMethods, pestMethods should start with `,`!
    lines[lastBraceIndex] = pestMethods;
    dbCode = lines.join('\n');
}

fs.writeFileSync('backend/database.js', dbCode, 'utf8');
console.log('Fixed DB syntax locally');
