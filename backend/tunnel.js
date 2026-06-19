const localtunnel = require('localtunnel');
const fs = require('fs');

(async () => {
  const tunnel = await localtunnel({ port: 5000 });
  console.log('Tunnel started at', tunnel.url);
  fs.writeFileSync('url.txt', tunnel.url, 'utf8');

  tunnel.on('close', () => {
    console.log('Tunnel closed');
  });
})();
