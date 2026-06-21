import re
import sys

with open('backend/database.js', 'r', encoding='utf-8') as f:
    code = f.read()

if 'pests: [' not in code:
    code = code.replace(
        'appointments: [],',
        "appointments: [],\n  pests: [\n    { id: 1, name: 'Karınca' },\n    { id: 2, name: 'Karafatma' },\n    { id: 3, name: 'Hamam Böceği' },\n    { id: 4, name: 'Fare' },\n    { id: 5, name: 'Pire' },\n    { id: 6, name: 'Tahta Kurusu' },\n    { id: 7, name: 'Yılan' },\n    { id: 8, name: 'Akrep' }\n  ],"
    )

if 'updateEk1Product:' not in code:
    code = code.replace(
        'deleteEk1Product: async (id) => {',
        "updateEk1Product: async (id, productData) => {\n    const d = await loadData();\n    if (!d.ek1_products) d.ek1_products = [];\n    const idx = d.ek1_products.findIndex(p => p.id === parseInt(id));\n    if (idx === -1) throw new Error('İlaç bulunamadı');\n    d.ek1_products[idx] = { ...d.ek1_products[idx], ...productData };\n    await saveData(d);\n    return d.ek1_products[idx];\n  },\n\n  deleteEk1Product: async (id) => {"
    )

if 'getAllPests:' not in code:
    code = re.sub(
        r'}(\s*};\s*console\.log\(\'Veritabani aktif\.\'\);)',
        r",\n\n  // === HAŞERE KÜTÜPHANESİ ===\n  getAllPests: async () => {\n    const d = await loadData();\n    return d.pests || [];\n  },\n  addPest: async (name) => {\n    const d = await loadData();\n    if (!d.pests) d.pests = [];\n    const newId = d.pests.length > 0 ? Math.max(...d.pests.map(p => p.id)) + 1 : 1;\n    const p = { id: newId, name };\n    d.pests.push(p);\n    await saveData(d);\n    return p;\n  },\n  updatePest: async (id, name) => {\n    const d = await loadData();\n    if (!d.pests) d.pests = [];\n    const idx = d.pests.findIndex(p => p.id === parseInt(id));\n    if (idx === -1) throw new Error('Haşere bulunamadı');\n    d.pests[idx].name = name;\n    await saveData(d);\n    return d.pests[idx];\n  },\n  deletePest: async (id) => {\n    const d = await loadData();\n    if (!d.pests) return false;\n    const initialLen = d.pests.length;\n    d.pests = d.pests.filter(p => p.id !== parseInt(id));\n    if (d.pests.length < initialLen) {\n      await saveData(d);\n      return true;\n    }\n    return false;\n  }\n\1",
        code
    )

with open('backend/database.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patch applied successfully")
