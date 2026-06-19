const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

const fixes = {
  'eport': 'export',
  'eample': 'example',
  'epenses': 'expenses',
  'setEpenses': 'setExpenses',
  'selectedEpenseMonth': 'selectedExpenseMonth',
  'setSelectedEpenseMonth': 'setSelectedExpenseMonth',
  'searchEpenseQuery': 'searchExpenseQuery',
  'setSearchEpenseQuery': 'setSearchExpenseQuery',
  'showAddEpenseModal': 'showAddExpenseModal',
  'setShowAddEpenseModal': 'setShowAddExpenseModal',
  'newEpenseData': 'newExpenseData',
  'setNewEpenseData': 'setNewExpenseData',
  'eplanation': 'explanation',
  'Ecel': 'Excel',
  'eportToEcel': 'exportToExcel',
  'reportsToEport': 'reportsToExport',
  'netFormData': 'nextFormData',
  'fetchEpenses': 'fetchExpenses',
  'handleAddEpenseSubmit': 'handleAddExpenseSubmit',
  'handleDeleteEpense': 'handleDeleteExpense',
  'eportEpensesToEcel': 'exportExpensesToExcel',
  'epDate': 'expDate',
  'hasereTuruTet': 'hasereTuruText',
  'uygulamaYontemTet': 'uygulamaYontemText',
  'reportTet': 'reportText',
  'getContet': 'getContext',
  'fleShrink': 'flexShrink',
  'tetOverflow': 'textOverflow',
  'fleGrow': 'flexGrow',
  'fied': 'fixed',
  'tetarea': 'textarea',
  'tetAlignment': 'textAlignment',
  'filteredEpenses': 'filteredExpenses',
  'totalEpenseAmount': 'totalExpenseAmount',
  'toFied': 'toFixed',
  'refreshReportTet': 'refreshReportText',
  'tetTransform': 'textTransform',
  'tetDecoration': 'textDecoration',
  'tet': 'text',
  'maCount': 'maxCount',
  'fleDirection': 'flexDirection',
  'fleWrap': 'flexWrap',
  'tetAlign': 'textAlign',
  'maHeight': 'maxHeight',
  'boShadow': 'boxShadow',
  'tetAnchor': 'textAnchor',
  'maWidth': 'maxWidth',
  'rn:': 'Örn:',
  'SST': 'ÜST',
  'Srn': 'Ürün',
  'Sst': 'Üst',
  ' mr': 'Ömür',
  'Y NETC': 'YÖNETİCİ',
  'x': 'ş',
  'X': 'Ş',
  'BLEENLER': 'BİLEŞENLER',
  'IconFileTet': 'IconFileText',
  'IconEpenses': 'IconExpenses',
  'BLEEN': 'BİLEŞEN',
  'MTER': 'MÜŞTERİ',
  'ALIMA': 'ÇALIŞMA',
  'MTERLER': 'MÜŞTERİLER',
  'DANIMA': 'DANIŞMA'
};

const replacementChar = '\ufffd';

for (const [key, value] of Object.entries(fixes)) {
  const actualKey = key.replace(//g, replacementChar);
  content = content.replace(new RegExp(actualKey, 'g'), value);
}

// Write it back
fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed x replacements.');
