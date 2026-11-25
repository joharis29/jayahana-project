const { spawn } = require('child_process');
const http = require('http');

console.log('Starting Next.js production server on port 3000...');
const nextProcess = spawn('npx', ['next', 'start', '-p', '3000'], {
  stdio: 'inherit',
  shell: true
});

nextProcess.on('exit', (code) => {
  console.log('Next.js process exited with code', code);
  process.exit(code || 0);
});

// Setup proxy on port 3001 forwarding to port 3000
setTimeout(() => {
  const proxy = http.createServer((req, res) => {
    const headers = { ...req.headers, host: 'localhost:3000' };
    const options = {
      hostname: '127.0.0.1',
      port: 3000,
      path: req.url,
      method: req.method,
      headers: headers
    };
    const connector = http.request(options, (pRes) => {
      res.writeHead(pRes.statusCode, pRes.headers);
      pRes.pipe(res, { end: true });
    });
    connector.on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end('Proxy connecting to Next.js on port 3000: ' + err.message);
    });
    req.pipe(connector, { end: true });
  });

  proxy.listen(3001, '0.0.0.0', () => {
    console.log('Proxy active on http://localhost:3001 -> forwarding to http://localhost:3000');
  });
}, 2500);
