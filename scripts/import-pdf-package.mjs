import fs from 'node:fs';
const pages=JSON.parse(fs.readFileSync('docs/pdf-extracted-pages.json','utf8'));
const manifest=fs.readFileSync('D:/codex/2026-09-19/referenced-chatgpt-conversation-this-is-an/catti_real_papers/manifest.csv','utf8').trim().split(/\r?\n/).slice(1).map(line=>{const a=[...line.matchAll(/"([^"]*)"/g)].map(x=>x[1]);return {year:a[0],session:a[1],subject:a[2],direction:a[3],filename:a[4],source:a[6],nature:a[7],completeness:a[8]};});
const clean=t=>String(t||'').replace(/咨询热线：.*?侵权必究/g,' ').replace(/环球网校公众号|环球网校移动课堂 APP|微信扫码刷题|微信扫码刷题 免费约直播领资料|扫码关注报考资讯公众号|扫码关注老师公众号|Read more|首页 考研.*?英语/g,' ').replace(/\s+/g,' ').trim();
const dir=v=>v.includes('汉译英')?'zh-en':v.includes('英译汉')?'en-zh':null;
const out=[]; const pdfReport=[];
for(const m of manifest.filter(x=>x.filename.endsWith('.pdf'))){
 const f=pages.find(x=>x.file===m.filename); const text=clean(f?.pages?.map(p=>p.text).join(' ')||'');
 const year=m.year; const month=m.session.includes('下半年')||m.session.includes('11月')?'11':m.session.includes('上半年')||m.session.includes('5月')?'05':m.session.includes('6月')?'06':'05';
 const isComp=m.subject.includes('综合');
 let parts=[];
 const re=/(英译汉|汉译英)[\s-]*(?:\(?(\d)\)?|第(一|二)篇)?/g; let matches=[...text.matchAll(re)];
 if(!isComp && matches.length>1){ for(let i=0;i<matches.length;i++){const st=matches[i].index+(matches[i][0].length);const en=i+1<matches.length?matches[i+1].index:text.length; const body=text.slice(st,en).trim(); if(body.length>180)parts.push({direction:matches[i][1]==='英译汉'?'en-zh':'zh-en',index:Number(matches[i][2]||({'一':1,'二':2}[matches[i][3]]||i+1)),body});}}
 if(!parts.length){parts=[{direction:dir(m.filename)|| (m.direction.includes('英译汉')?'en-zh':m.direction.includes('汉译英')?'zh-en':null),index:1,body:text}];}
 const seen=new Set(); const records=[];
 for(const p of parts){ if(!p.body||p.body.length<80)continue; const id='pdf-'+year+'-'+month+'-'+m.filename.replace(/[^a-zA-Z0-9]+/g,'-').toLowerCase()+'-'+(p.direction||'mixed')+'-'+p.index; if(seen.has(id))continue; seen.add(id); const completeness=m.completeness.includes('部分')?'partial':/回忆/.test(m.nature)?'recalled':'partial'; const title=(m.filename.replace(/\.pdf+$/i,'').replace(/^\d+_/,'').replace(/[-_]/g,' ')).slice(0,100); records.push({id,paperId:`catti2-${year}-${month}`,year,session:month==='05'?'5月':month==='11'?'11月':'6月',paperType:isComp?'comprehensive':'practical',direction:p.direction||'unknown',passageIndex:p.index,title,topic:title,sourceText:p.body,referenceAnswer:null,referenceTranslation:null,sourceLabel:`PDF资料包 · ${m.nature} · ${completeness==='partial'?'部分恢复':'考生回忆'}`,sourceUrls:[m.source],sourceType:/考生|回忆/.test(m.nature)?'recollection':'institution',completeness,textCompleteness:completeness,trainable:Boolean(p.body),contentVersion:'pdf-recovery-2026-09-19',pageNumbers:f.pages.map(x=>x.page),extractionMethod:'pdfjs text layer',uncertainSegments:[]});}
 out.push(...records); pdfReport.push({filename:m.filename,year,session:m.session||'未标注',type:m.subject,pdfType:'text',pages:f?.pages?.length||0,method:'pdfjs text layer',recovered:records.length,reference:records.filter(x=>x.referenceAnswer).length,status:records.length?'partial':'failed',failureReason:records.length?'':'no usable text'});
}
fs.writeFileSync('src/features/questionBank/packagePdfRecoveredPassages.js','// Generated from the supplied local PDF package using pdfjs text-layer extraction.\nexport const PACKAGE_PDF_RECOVERED_PASSAGES = '+JSON.stringify(out,null,2)+';\n');
fs.mkdirSync('docs/pdf-recovery',{recursive:true}); fs.writeFileSync('docs/pdf-recovery/report.json',JSON.stringify({files:pdfReport,records:out.length},null,2));
console.log(JSON.stringify({files:pdfReport.length,records:out.length,byDir:out.reduce((a,x)=>(a[x.direction]=(a[x.direction]||0)+1,a),{})},null,2));


