const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SITE = 'https://kychelp.github.io';
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data.json'), 'utf8'));
const usedSlugs = new Set();
for (const row of data) {
  const base = String(row.id || 'resource');
  let slug = base, suffix = 2;
  while (usedSlugs.has(slug)) slug = `${base}-${suffix++}`;
  usedSlugs.add(slug);
  row.seoSlug = slug;
}
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[ch]));

function page(row) {
  const url = `${SITE}/resources/${encodeURIComponent(row.seoSlug)}/`;
  const image = row.image ? `${SITE}/assets/images/${encodeURIComponent(row.image)}` : '';
  const description = row.excerpt || `${row.country} · ${row.documentType}：${row.title}。查看 Filzra 资源介绍。`;
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: row.title, description, mainEntityOfPage: url,
    ...(image ? { image } : {})
  };
  const nav = `<div class="topbar"><div class="wrap"><span>全球文件模板资源库</span><span>静态浏览版 · 购买与注册使用 Filzra 官方站</span></div></div><header class="header"><div class="wrap nav"><a class="logo" href="/#/">Filzra</a><nav class="menu"><a href="/#/">首页</a><a href="/#/resources">资源库</a><a href="/#/directory">分类目录</a><a href="/#/tools">免费工具</a><a href="/#/services">服务</a><a href="/#/vip">VIP</a></nav><div class="actions"><a class="btn" href="https://www.filzra.com/wp-login.php">登录</a><a class="btn primary" href="https://www.filzra.com/wp-login.php?action=register">注册</a></div></div></header>`;
  const body = `${nav}<main class="page wrap"><div class="crumb"><a href="/#/resources">资源库</a> / ${esc(row.title)}</div><div class="detail"><div class="detail-img">${image ? `<img src="${image}" alt="${esc(row.title)}">` : ''}</div><div><div class="tag">${esc(row.country)} · ${esc(row.documentType)}</div><h1>${esc(row.title)}</h1><p class="muted">${esc(description)}</p><div class="notice">下载、购买、注册和登录请前往 Filzra 官方站完成。</div><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px"><a class="btn primary" href="https://www.filzra.com/resources/${encodeURIComponent(row.id)}">前往官方资源页</a><a class="btn" href="https://www.filzra.com/wp-login.php">登录 / 注册</a><a class="btn gold" href="https://www.filzra.com/vip/">升级 VIP</a></div></div></div></main>`;
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="index,follow"><title>${esc(row.title)} · Filzra资源库</title><meta name="description" content="${esc(description.slice(0, 300))}"><link rel="canonical" href="${url}"><meta property="og:type" content="article"><meta property="og:title" content="${esc(row.title)}"><meta property="og:description" content="${esc(description.slice(0, 300))}">${image ? `<meta property="og:image" content="${image}">` : ''}<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}"><link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script></head><body><div id="app">${body}<footer class="footer"><div class="wrap"><small>© 2026 Filzra Resource · 静态浏览版 · 购买和注册请前往 www.filzra.com</small></div></footer></div><script src="/app.js" defer></script></body></html>`;
}

let generated = 0;
for (const row of data) {
  const dir = path.join(ROOT, 'resources', row.seoSlug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(row));
  generated++;
}

const urls = [`${SITE}/`, ...data.map(row => `${SITE}/resources/${encodeURIComponent(row.seoSlug)}/`)];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${esc(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(ROOT, 'data.json'), JSON.stringify(data));
console.log(JSON.stringify({ generatedPages: generated, sitemapUrls: urls.length, sitemap: 'sitemap.xml', robots: 'robots.txt' }));
