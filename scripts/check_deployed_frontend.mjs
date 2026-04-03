#!/usr/bin/env node
import fs from 'fs/promises';

const urls = [
  'https://nextlevel-f2rx6y89a-nagarjunaneeraja4-7455s-projects.vercel.app',
  'https://nextlevel-f5lvt43mh-nagarjunaneeraja4-7455s-projects.vercel.app',
  'https://nextlevel-ricj9ry10-nagarjunaneeraja4-7455s-projects.vercel.app'
];

const emailPattern = /type\s*=\s*['"]email['"]|name\s*=\s*['"]email['"]|id\s*=\s*['"]email['"]|placeholder\s*=\s*['"]Email['"]/i;
const valueAttr = /value\s*=\s*['"]([^'"]*)['"]/i;
const scriptSrcRe = /<script[^>]*\ssrc=["']([^"']+)["'][^>]*>/gi;
const socketIndicators = ['/socket.io', 'wss://', 'io(', 'VITE_SOCKET', 'VITE_API_URL'];

async function fetchToFile(url, path) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    await fs.writeFile(path, text, 'utf8');
    return { status: res.status, text };
  } catch (err) {
    return { error: String(err) };
  }
}

function findScriptSrcs(html) {
  const list = [];
  let m;
  while ((m = scriptSrcRe.exec(html)) !== null) {
    list.push(m[1]);
  }
  return [...new Set(list)];
}

async function checkUrl(base) {
  const out = { url: base };
  const indexPath = `tmp_index_${encodeURIComponent(base)}.html`;
  const loginPath = `tmp_login_${encodeURIComponent(base)}.html`;
  const r1 = await fetchToFile(base, indexPath);
  out.status = r1.status || null;
  if (r1.error) { out.error = r1.error; return out; }
  const r2 = await fetchToFile(new URL('/login', base).toString(), loginPath);
  out.loginStatus = r2.status || null;
  // search login HTML for email input and value attributes
  const loginHtml = r2.text || '';
  out.loginHasEmailInput = emailPattern.test(loginHtml);
  out.loginHasValueAttr = valueAttr.test(loginHtml);

  // scan index html for scripts
  const indexHtml = r1.text || '';
  out.scriptSrcs = findScriptSrcs(indexHtml);
  out.assets = [];
  for (const s of out.scriptSrcs) {
    const scriptUrl = new URL(s, base).toString();
    const sfn = `tmp_asset_${encodeURIComponent(scriptUrl)}`;
    const assetRes = await fetchToFile(scriptUrl, sfn);
    const assetStatus = assetRes.status || null;
    const assetText = assetRes.text || '';
    const indicators = socketIndicators.filter(ind => assetText.includes(ind));
    out.assets.push({ url: scriptUrl, status: assetStatus, socketIndicators: indicators });
  }

  // also search index/login HTML for socket indicators
  out.htmlSocketIndicators = socketIndicators.filter(ind => indexHtml.includes(ind) || loginHtml.includes(ind));

  return out;
}

async function main() {
  const results = [];
  for (const u of urls) {
    try {
      const r = await checkUrl(u);
      results.push(r);
      console.log(JSON.stringify(r, null, 2));
    } catch (err) {
      console.error('check failed for', u, err);
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
