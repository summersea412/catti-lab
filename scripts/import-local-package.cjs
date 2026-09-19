const fs=require('fs');
const root='D:/codex/2026-09-19/referenced-chatgpt-conversation-this-is-an/catti_real_papers';
const files=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
const manifest=fs.readFileSync(`${root}/manifest.csv`,'utf8').split(/\r?\n/).slice(1).map(line=>{const cols=[...line.matchAll(/"([^"]*)"/g)].map(m=>m[1]);return {filename:cols[4],source:cols[6],sourceType:cols[7]};});
const strip=s=>s.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&ldquo;|&rdquo;|&quot;/gi,'"').replace(/&amp;/gi,'&').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/\s+/g,' ').trim();
const rows=files.map(filename=>{
 const html=fs.readFileSync(`${root}/${filename}`,'utf8');
 const title=strip((html.match(/<title>([\s\S]*?)<\/title>/i)||[])[1]||filename);
 const year=(filename.match(/(20\d\d)/)||title.match(/(20\d\d)/)||[])[1]||'unknown';
 const direction=/英译汉/.test(title)||/10955810|10955822|10955862|10994492/.test(filename)?'en-zh':/汉译英|中译英/.test(title)||/10705120|10955811|10955820|10955864|10994493|10994495/.test(filename)?'zh-en':'unknown';
 const paras=[...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m=>m[1]);
 const heads=[];paras.forEach((p,i)=>{const m=strip(p).match(/passage\s*(one|two|1|2)/i);if(m)heads.push({i,n:m[1].toLowerCase()==='one'||m[1]==='1'?1:2});});
 const entries=[];
 for(let j=0;j<heads.length;j++){
  const h=heads[j],next=heads[j+1]?.i??paras.length;
  const source=paras.slice(h.i+1,next).map(strip).filter(t=>t&&t.length>20&&!/相关推荐|上一篇|下一篇|版权所有/.test(t)).join('\n\n');
  if(source.length>30){const meta=manifest.find(x=>x.filename===filename)||{};entries.push({id:`package-${year}-${filename.replace(/\W/g,'-')}-${h.n}`,year,session:title.match(/(上半年|下半年|6月|5月|11月)/)?.[1]||'未标场次',paperType:/综合/.test(title)?'comprehensive':'practical',direction,passageIndex:h.n,sourceText:source,referenceAnswer:null,sourceLabel:'机构公开网页正文',sourceUrls:meta.source?[meta.source]:[],sourceType:'institution',completeness:'partial',variants:[],topic:title,contentVersion:'package-import-2026-09-19',trainable:true});}
 }
 return {filename,title,year,direction,entries};
});
fs.writeFileSync('src/features/questionBank/packageRecoveredPassages.js','// Generated from supplied local HTML files; no network fetch or synthetic text.\nexport const PACKAGE_FILES='+JSON.stringify(rows,null,2)+';\nexport const PACKAGE_RECOVERED_PASSAGES=PACKAGE_FILES.flatMap(x=>x.entries);\n');
console.log(JSON.stringify(rows.map(x=>({file:x.filename,year:x.year,direction:x.direction,entries:x.entries.length,chars:x.entries.reduce((n,e)=>n+e.sourceText.length,0)})),null,2));
