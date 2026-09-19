import assert from 'node:assert/strict';
import fs from 'node:fs';
const version=await(await fetch('http://127.0.0.1:9333/json/version')).json();
function connect(url){return new Promise((resolve,reject)=>{const ws=new WebSocket(url),pending=new Map(),events=[];let id=0;ws.onopen=()=>resolve({events,close:()=>ws.close(),send:(method,params={})=>new Promise((res,rej)=>{const n=++id;pending.set(n,{res,rej});ws.send(JSON.stringify({id:n,method,params}))})});ws.onerror=reject;ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p?.rej(new Error(m.error.message)):p?.res(m.result)}else events.push(m)}})}
const browser=await connect(version.webSocketDebuggerUrl);
const {browserContextId}=await browser.send('Target.createBrowserContext');
const {targetId}=await browser.send('Target.createTarget',{url:'about:blank',browserContextId});
const pages=await(await fetch('http://127.0.0.1:9333/json/list')).json();
const page=await connect(pages.find(p=>p.id===targetId).webSocketDebuggerUrl);
const wait=()=>new Promise(r=>setTimeout(r,180));
const evaluate=async expression=>{const r=await page.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const click=async expression=>{const rect=await evaluate(`(()=>{const el=${expression}; if(!el)throw Error('Element not found');el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);await page.send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...rect});await page.send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...rect});await wait()};
const button=text=>`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(text)})`;
const select=async(label,value)=>{await evaluate(`(()=>{const e=[...document.querySelectorAll('.archive-filters label')].find(l=>l.firstChild.textContent===${JSON.stringify(label)}).querySelector('select');e.value=${JSON.stringify(value)};e.dispatchEvent(new Event('change',{bubbles:true}));})()`);await wait()};
const results={};
try{
 await page.send('Runtime.enable');await page.send('Page.enable');await page.send('Page.navigate',{url:'http://127.0.0.1:5174/'});
 for(let i=0;i<80&&!await evaluate("document.querySelector('.sidebar')!==null");i++)await wait();
 // Existing app navigation is the actual sidebar button, not an invented route.
 const labels=await evaluate("[...document.querySelectorAll('button')].map(b=>b.textContent.trim())");
 const bank=labels.find(x=>/真题|题库/.test(x));assert.ok(bank);await click(button(bank));
 assert.ok(await evaluate("document.body.textContent.includes('英语二级笔译公开资料库')"));
 await select('年份','2025');await select('场次','06');await select('科目','practical');await select('方向','zh-en');
 await click("document.querySelector('.archive-search input')");await page.send('Input.insertText',{text:'消博会'});await wait();
 assert.equal(await evaluate("document.querySelectorAll('.archive-session').length"),1);results.combinedFiltering='PASS';
 await click(button('清除筛选'));assert.ok(await evaluate("document.querySelectorAll('.archive-session').length>20"));results.clearFilters='PASS';
 await select('年份','2018');await select('场次','11');await click("document.querySelector('.archive-session>summary')");
 const versionSelects=await evaluate("document.querySelectorAll('.archive-material select').length");assert.equal(versionSelects,2);
 const switchVersion=await evaluate("(()=>{const e=document.querySelector('.archive-material select');e.value=e.options[1].value;e.dispatchEvent(new Event('change',{bubbles:true}));return e.value})()");await wait();
 assert.ok(await evaluate("[...document.querySelectorAll('.archive-material')].find(e=>e.querySelector('select')).querySelector('button').disabled"));
 await evaluate("(()=>{const e=document.querySelector('.archive-material select');e.value=e.options[0].value;e.dispatchEvent(new Event('change',{bubbles:true}))})()");await wait();results.variants='PASS';
 for(let i=0;i<2;i++){
  await click(`[...document.querySelectorAll('.archive-material')].filter(el=>el.querySelector('select'))[${i}].querySelector('button')`);
  await click("document.querySelector('#public-paper-answer')");await page.send('Input.insertText',{text:'浏览器隔离测试 '+i+'\nTranslation answer '+i});await wait();
  assert.ok(await evaluate("document.querySelector('textarea').value.includes('Translation answer')"));
  await click(button('查看参考'));
  if(i===1)assert.ok(await evaluate("document.querySelector('.archive-reference').textContent.includes('暂无人工参考译文')"));
  await click(button('提交并保存记录'));assert.ok(await evaluate("document.body.textContent.includes('本次作答已保存')"));
  await click(button('返回历年资料库') .replace('"返回历年资料库"','"← 返回真题题库"'));
  await select('年份','2018');await select('场次','11');await click("document.querySelector('.archive-session>summary')");
 }
 const snapshots=await evaluate("JSON.parse(localStorage.getItem('catti.trainingSessions')||'[]')");assert.equal(snapshots.length,2);assert.notEqual(snapshots[0].sourceText,snapshots[1].sourceText);assert.ok(snapshots.every(s=>s.exerciseType==='past-paper'));results.practiceSnapshots='PASS';
 await select('年份','2010');await select('场次','11');await select('科目','comprehensive');await click("document.querySelector('.archive-session>summary')");await click(button('开始单篇训练'));await click("document.querySelector('input[type=radio]')");await click(button('提交并保存记录'));assert.ok(await evaluate("document.querySelector('.archive-reference').textContent.includes('access')"));results.comprehensivePractice='PASS';
 await page.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await wait();assert.ok(await evaluate("document.documentElement.scrollWidth<=window.innerWidth"));results.mobileOverflow='PASS';
 await page.send('Page.reload');await wait();await wait();assert.equal(await evaluate("JSON.parse(localStorage.getItem('catti.trainingSessions')).length"),3);results.persistence='PASS';
 const errors=page.events.filter(e=>e.method==='Runtime.exceptionThrown');assert.deepEqual(errors,[]);results.runtimeErrors=0;
 console.log(JSON.stringify(results,null,2));fs.mkdirSync('docs/round-b1',{recursive:true});fs.writeFileSync('docs/round-b1/browser-qa.json',JSON.stringify(results,null,2));
}finally{page.close();await browser.send('Target.disposeBrowserContext',{browserContextId});browser.close()}
