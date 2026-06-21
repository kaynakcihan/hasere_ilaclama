const fs = require('fs');
let code = fs.readFileSync('backend/database.js', 'utf8');

code = code.replace(
    "    return d.users[i];\n  ,",
    "    return d.users[i];\n  },"
);

fs.writeFileSync('backend/database.js', code, 'utf8');
console.log('Fixed syntax error in database.js');
