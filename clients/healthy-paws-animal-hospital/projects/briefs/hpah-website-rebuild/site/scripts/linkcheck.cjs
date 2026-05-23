const fs = require('fs'), path = require('path');
const dist = 'dist';
function htmlFiles(dir){let o=[];for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())o=o.concat(htmlFiles(p));else if(e.name.endsWith('.html'))o.push(p);}return o;}
const files = htmlFiles(dist);
function routeExists(p){
  let c = p.split('#')[0].split('?')[0];
  c = c.replace(/\/+$/,'');
  if(c==='') return fs.existsSync('dist/index.html');
  if(fs.existsSync('dist'+c+'/index.html')) return true;
  if(fs.existsSync('dist'+c+'.html')) return true;
  if(fs.existsSync('dist'+c)) return true; // file asset (pdf etc.)
  return false;
}
const broken = {};
for(const f of files){
  const html = fs.readFileSync(f,'utf8');
  const re = /href="(\/[^"]*)"/g; let m;
  const seen = new Set();
  while((m=re.exec(html))){
    let href = m[1];
    if(href.startsWith('/_astro')||href.startsWith('/#')||href==='/#main-content') continue;
    if(/\.(css|js|png|jpg|jpeg|webp|svg|ico|xml|txt|woff2?|pdf)$/i.test(href.split('?')[0])) continue;
    if(seen.has(href)) continue; seen.add(href);
    if(!routeExists(href)){
      const page = f.replace('dist','').replace(/\/index\.html$/,'/')||'/';
      (broken[href]=broken[href]||new Set()).add(page);
    }
  }
}
const keys = Object.keys(broken).sort();
if(!keys.length){ console.log('No broken internal links found across',files.length,'pages.'); }
else {
  console.log('BROKEN internal links across',files.length,'pages:\n');
  for(const k of keys){ console.log(`  ${k}\n     on: ${[...broken[k]].slice(0,8).join(', ')}${broken[k].size>8?' …(+'+(broken[k].size-8)+')':''}`); }
}
