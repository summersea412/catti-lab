import {toContentStatus} from './contentDifficulty.js';
export const normalizedText=(v='')=>String(v).normalize('NFKC').toLowerCase().replace(/[\p{P}\p{S}\s]/gu,'');
export function textHash(v='',normalize=true){let h=2166136261;for(const c of normalize?normalizedText(v):String(v)){h^=c.codePointAt(0);h=Math.imul(h,16777619)}return(h>>>0).toString(16)}
function shingles(v){const s=normalizedText(v).replace(/\d+/g,'#');return new Set(Array.from({length:Math.max(0,s.length-3)},(_,i)=>s.slice(i,i+4)))}
export function textSimilarity(a,b){const x=shingles(a),y=shingles(b);if(!x.size||!y.size)return normalizedText(a)===normalizedText(b)?1:0;let n=0;for(const v of x)if(y.has(v))n++;return 2*n/(x.size+y.size)}
export function duplicateWarnings(items=[]){const w=[];for(let i=0;i<items.length;i++)for(let j=0;j<i;j++){const a=items[i],b=items[j];if((a.contentType||a.questionType||a.type)!==(b.contentType||b.questionType||b.type))continue;const x=a.prompt||a.sourceText||a.content||'',y=b.prompt||b.sourceText||b.content||'';if(!x||!y)continue;if(normalizedText(x)===normalizedText(y))w.push({type:'exact',ids:[b.id,a.id]});else if(Math.min(x.length,y.length)>45&&textSimilarity(x,y)>=.8)w.push({type:'template-similarity',ids:[b.id,a.id],similarity:Number(textSimilarity(x,y).toFixed(3))});if(a.options?.length&&b.options?.length&&JSON.stringify(a.options)===JSON.stringify(b.options))w.push({type:'option-pattern',ids:[b.id,a.id]})}return w}
export const similarityWarnings=items=>duplicateWarnings(items).filter(x=>x.type!=='exact');
export const normalizeContentItem=item=>({...item,contentStatus:toContentStatus(item)});
export function buildContentRegistry(groups={}){const items=Object.values(groups).flat().map(normalizeContentItem);const by=f=>items.reduce((a,x)=>{const k=x[f]??'uncalibrated';a[k]=(a[k]||0)+1;return a},{});return {total:items.length,items,byType:by('contentType'),byDirection:by('direction'),byDifficulty:by('difficultyTier'),byContentStatus:by('contentStatus'),byReviewStatus:by('reviewStatus'),byTopic:by('topic'),bySourceType:by('sourceType'),byVerificationStatus:by('verificationStatus')}}
export const publishedContent=r=>(r?.items||[]).filter(x=>x.contentStatus==='published');
export const validateRegistry=r=>Boolean(r&&r.total===r.items.length&&new Set(r.items.map(x=>x.id)).size===r.total);

