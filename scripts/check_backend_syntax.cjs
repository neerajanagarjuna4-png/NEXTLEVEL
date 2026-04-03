#!/usr/bin/env node
const fs = require('fs');
const vm = require('vm');
const paths = ['backend/server.js', 'backend/routes', 'backend/controllers'];
let ok = true;
for (const p of paths) {
  try {
    const stat = fs.statSync(p);
    if (stat.isFile()) {
      const code = fs.readFileSync(p, 'utf8');
      new vm.Script(code);
      console.log(p, 'OK');
    } else if (stat.isDirectory()) {
      const files = fs.readdirSync(p).filter(f => f.endsWith('.js'));
      for (const f of files) {
        const fp = p + '/' + f;
        try {
          const code = fs.readFileSync(fp, 'utf8');
          new vm.Script(code);
          console.log(fp, 'OK');
        } catch (e) {
          console.error(fp, 'ERR', e.message);
          ok = false;
        }
      }
    }
  } catch (err) {
    console.error('Missing', p, err.message);
    ok = false;
  }
}
process.exit(ok ? 0 : 2);
