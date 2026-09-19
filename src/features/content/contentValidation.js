import {DIFFICULTY_TIERS,CONTENT_STATUSES,validateDifficultyEvidence,TRANSLATION_EVIDENCE_FIELDS} from './contentDifficulty.js';
import {duplicateWarnings,textHash,normalizedText} from './contentRegistry.js';
export const words=s=>(String(s||'').match(/[A-Za-z]+(?:['’'-][A-Za-z]+)*/g)||[]).length;
export const characters=s=>(String(s||'').match(/\p{Script=Han}/gu)||[]).length;
export const contentType=x=>x.contentType||x.questionType||x.type;
export const fingerprint=x=>textHash(JSON.stringify([x.id,x.contentType,x.direction,x.difficultyTier,x.difficultyEvidence,x.sourceText,x.prompt,x.referenceAnswer,x.options,x.answer,x.explanation,x.questions,x.blanks,x.contentVersion]),false);
export function language(s){const en=words(s),zh=characters(s);return zh>en*1.5?'zh':en>zh*2?'en':'mixed'}
export function checkContent(item={},pool=[]){
 if(!item||typeof item!=='object'||Array.isArray(item))return {valid:false,issues:[{stage:'schema',reason:'content must be an object'}],warnings:[]};
 const issues=[],warnings=[],kind=contentType(item),source=typeof(item.sourceText||item.prompt)==='string'?(item.sourceText||item.prompt):'';
 const fail=(stage,reason)=>issues.push({stage,reason});
 if(typeof item.id!=='string'||!item.id.trim()||!source.trim()||!['sentence','paragraph','exam-passage','vocabulary','grammar','reading','cloze'].includes(kind))fail('schema','id, source or contentType invalid');
 if(!['zh-en','en-zh'].includes(item.direction)||!CONTENT_STATUSES.includes(item.contentStatus))fail('schema','direction or contentStatus invalid');
 if(!item.contentVersion||!item.source||!item.sourceType||!item.generatedBy||!item.verificationStatus)fail('schema','missing provenance');
 if(!DIFFICULTY_TIERS.includes(item.difficultyTier))fail('difficulty','uncalibrated tier');
 if(item.difficultyTier!=='foundation'&&!validateDifficultyEvidence(item.difficultyEvidence))fail('difficulty','six distinct content-specific evidence fields required');
 if(kind==='exam-passage'&&item.difficultyTier==='foundation')fail('difficulty','exam passage cannot be foundation');
 if(['sentence','paragraph','exam-passage'].includes(kind)&&item.difficultyTier!=='foundation'&&!TRANSLATION_EVIDENCE_FIELDS.every(k=>typeof item.difficultyEvidence?.[k]==='string'&&item.difficultyEvidence[k].length>=10))fail('difficulty','translation requires all ten editorial evidence dimensions');
 const length=item.direction==='zh-en'?characters(source):words(source);
 if(kind==='sentence'&&(length<60||length>120))fail('length','sentence out of range: '+length);
 if(kind==='paragraph'&&(length<250||length>400))fail('length','paragraph out of range: '+length);
 if(kind==='exam-passage'){const range=item.direction==='zh-en'?[280,350]:[400,500];if(length<range[0]||length>range[1])fail('length','exam passage out of training range: '+length)}
 if(['sentence','paragraph','exam-passage'].includes(kind)){
  const ref=typeof(item.referenceAnswer||item.referenceTranslation)==='string'?(item.referenceAnswer||item.referenceTranslation):'';
  if(item.referenceAnswer&&item.referenceTranslation&&item.referenceAnswer!==item.referenceTranslation)fail('reference','reference aliases disagree');
  if(!ref.trim())fail('reference','empty reference');
  if(normalizedText(source)===normalizedText(ref))fail('reference','source equals reference');
  if(/this (paragraph|passage|text) (discusses|explains|is about)|in summary|placeholder|\.\.\.|…/i.test(ref))fail('reference','summary or placeholder');
  if(language(source)!==(item.direction==='zh-en'?'zh':'en')||language(ref)!==(item.direction==='zh-en'?'en':'zh'))fail('reference','language/direction mismatch');
  const digits=s=>(s.match(/\d+(?:[.,]\d+)*/g)||[]).sort().join('|');
  if(digits(source)!==digits(ref))fail('reference','numeric tokens differ; manual reconciliation required');
 }
 const qs=kind==='reading'?item.questions:kind==='cloze'?item.blanks:['grammar','vocabulary'].includes(kind)?[item]:[];
 if(!Array.isArray(qs)||(['reading','cloze'].includes(kind)&&qs.length<5))fail('answer','missing passage questions');
 for(const q of Array.isArray(qs)?qs:[]){if(!q?.id||!q.prompt||!Array.isArray(q.options)||q.options.length!==4||!q.options.every(o=>typeof o==='string'&&o.trim())||new Set(q.options.map(normalizedText)).size!==4||!q.options.includes(q.answer)||typeof q.explanation!=='string'||!q.explanation.trim())fail('answer','invalid objective item '+q?.id)}
 if(Array.isArray(qs)&&new Set(qs.map(q=>q?.id)).size!==qs.length)fail('answer','duplicate child question IDs');
 if(kind==='reading'&&Array.isArray(qs)){
  if(words(source)<300&&item.difficultyTier!=='foundation')fail('length','standard reading must be at least 300 words');
  const demand=(qs||[]).filter(q=>['inference','attitude','argument'].includes(q.questionKind)).length/(qs?.length||1);
  if(item.difficultyTier!=='foundation'&&demand<.4)fail('difficulty','reading inference/attitude/argument ratio below 40%');
  if(new Set((qs||[]).map(q=>q.questionKind)).size<3)fail('answer','insufficient reading question diversity');
 }
 if(kind==='cloze'&&Array.isArray(qs)){
  const markers=[...source.matchAll(/\((\d+)\)\s*___/g)].map(m=>Number(m[1]));
  if(markers.length!==(qs||[]).length||markers.some((v,i)=>v!==i+1)||markers.length<10)fail('answer','cloze markers must match every numbered blank');
  if(words(source)<180)fail('length','cloze passage too short');
 }
 for(const hit of pool.filter(x=>x.id!==item.id).flatMap(x=>duplicateWarnings([x,item])))fail('duplicate',hit.type+' '+hit.ids.join(','));
 if(pool.some(x=>x.id===item.id))fail('schema','duplicate ID');
 if(['sentence','paragraph','exam-passage'].includes(kind)&&pool.some(x=>x.id!==item.id&&normalizedText(x.referenceAnswer||'')===normalizedText(item.referenceAnswer||'')))fail('reference','duplicate reference');
 warnings.push('Automated checks cannot certify semantic completeness or a unique best answer; editorial review required.');
 return {valid:issues.length===0,issues,warnings,fingerprint:fingerprint(item)};
}
export function reviewValid(item){const r=item.qualityReview;return Boolean(r?.reviewer&&r.notes&&r.version===item.contentVersion&&r.fingerprint===fingerprint(item)&&['semantic','answer','reference','difficulty','diversity'].every(k=>r.checks?.[k]===true))}
export function validateGeneratedContent(item,pool=[]){const r=checkContent(item,pool);if(item?.contentStatus!=='draft'){r.issues.push({stage:'schema',reason:'generated content must start in draft'});r.valid=false}return r}
export function markValidated(item,pool=[]){const result=validateGeneratedContent(item,pool);if(!result.valid)throw new Error(JSON.stringify(result.issues));return {...item,contentStatus:'validated'}}
export function recordReview(item,review){if(item.contentStatus!=='validated'||review?.fingerprint!==fingerprint(item))throw new Error('Validated content and a current review fingerprint required');const next={...item,contentStatus:'reviewed',qualityReview:review,reviewedBy:review.reviewer};if(!reviewValid(next))throw new Error('Complete editorial review required');return next}
export function publishContent(item,pool=[]){if(item.contentStatus!=='reviewed'||!reviewValid(item))throw new Error('Reviewed state and current editorial sign-off required');const result=checkContent(item,pool);if(!result.valid)throw new Error(JSON.stringify(result.issues));return {...item,contentStatus:'published'}}
export const contentLifecycle=()=>[...CONTENT_STATUSES];
export function checkFullPractice(set,passages){const errors=[];if(set.sourceType!=='simulated'||set.verificationStatus==='verified')errors.push('simulated provenance required');const ids=Object.values(set.directions||{}).flat();if(ids.length!==4||new Set(ids).size!==4)errors.push('four distinct passages required');const totals={};for(const direction of ['zh-en','en-zh']){const part=set.directions?.[direction]||[];if(part.length!==2)errors.push('two passages required for '+direction);totals[direction]=0;for(const id of part){const p=passages.find(x=>x.id===id);if(!p||p.contentStatus!=='published'||p.direction!==direction||contentType(p)!=='exam-passage'){errors.push('invalid passage '+id);continue}totals[direction]+=direction==='zh-en'?characters(p.sourceText):words(p.sourceText)}const [min,max]=direction==='zh-en'?[550,650]:[850,950];if(totals[direction]<min||totals[direction]>max)errors.push('total length outside training range '+direction)}return {valid:!errors.length,errors,totals}}


export const isPublishedContent=item=>item.contentStatus==='published'&&reviewValid(item)&&checkContent(item).valid;
export function rejectContent(item,reason){if(!reason?.trim())throw new Error('Rejection reason required');return {...item,contentStatus:'rejected',rejectionReason:reason};}
export function reviseContent(item,changes){return {...item,...changes,id:item.id,contentVersion:item.contentVersion+1,contentStatus:'draft',qualityReview:null,reviewedBy:null};}
