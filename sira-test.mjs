import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ httpCredentials: { username: 'onur', password: 'Ld7-Sg3-Ox1-Yh4-panel' } });
const p = await ctx.newPage();
await p.goto('http://185.22.184.99/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1500);
const once = await p.evaluate(() => {
  const el = [...document.querySelectorAll('h3')].filter(e => e.className.includes('cardName'))[0];
  return el?.textContent?.trim();
});
console.log('ana sayfadaki ilk ürün (önce):', once);
await b.close();
