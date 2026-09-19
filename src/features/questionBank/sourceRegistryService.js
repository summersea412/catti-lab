import { PAST_PAPER_SOURCE_REGISTRY } from './sourceRegistry.js';
const normalize = text => String(text || '').normalize('NFKC').replace(/\s+/g,' ').trim();
export const bodyText = variant => [variant?.sourceText,variant?.questionText,variant?.passageText].find(value=>typeof value==='string'&&value.trim())?.trim()||'';
export const isTrainable = variant => Boolean(bodyText(variant));
export const contentState = variant => ['complete','partial','fragment','recalled','uncertain'].includes(variant?.textCompleteness||variant?.completeness)?(variant.textCompleteness||variant.completeness):'uncertain';
export const contentLabels={complete:'完整整理',partial:'部分恢复',fragment:'残缺版本',recalled:'考生回忆',uncertain:'来源待核验'};
export function objectiveResult(exercise,answer){
 const known=exercise.options?.length>0&&exercise.answer!=null&&exercise.options.includes(exercise.answer);
 return {known:Boolean(known),correct:known?answer===exercise.answer:null,label:known?(answer===exercise.answer?'回答正确':'回答错误'):'答案待补充'};
}
export function visibleContentStats(data=PAST_PAPER_SOURCE_REGISTRY){
 const materials=data.flatMap(r=>r.materials),visible=materials.filter(p=>p.variants.some(isTrainable));
 const practical=visible.filter(p=>p.subject==='practical'),comp=visible.filter(p=>p.subject==='comprehensive');
 const complete=practical.filter(p=>p.variants.some(v=>isTrainable(v)&&contentState(v)==='complete')).length;
 const withAnswer=comp.filter(p=>p.variants.some(v=>isTrainable(v)&&objectiveResult(v,'').known)).length;
 return {total:visible.length,practical:practical.length,complete,partial:practical.length-complete,
 recalled:practical.filter(p=>p.sourceKind==='recollection'||p.variants.some(v=>isTrainable(v)&&contentState(v)==='recalled')).length,
 comprehensive:comp.length,withAnswer,missingAnswer:comp.length-withAnswer,
 missingReference:practical.filter(p=>!p.variants.some(v=>isTrainable(v)&&(v.referenceAnswer||v.referenceTranslation)?.trim())).length,
 trainable:visible.length,registryOnlyMaterials:materials.length-visible.length,
 registryOnlySubjects:data.reduce((n,r)=>n+Object.keys(r.subjects).filter(subject=>!r.materials.some(p=>p.subject===subject&&p.variants.some(isTrainable))).length,0)};
}
const words = text => String(text || '').trim().split(/\s+/).filter(Boolean).length;
// Single read model for every Past Paper surface. UI components should derive
// filters, counts and trainable materials from this repository rather than
// maintaining a second selector or hard-coded totals.
export const pastPaperRepository = {
 records: PAST_PAPER_SOURCE_REGISTRY,
 filter: (filters={}) => filterRegistry(PAST_PAPER_SOURCE_REGISTRY, filters),
 stats: () => registryStats(PAST_PAPER_SOURCE_REGISTRY),
 visibleStats: () => visibleContentStats(PAST_PAPER_SOURCE_REGISTRY),
 trainableMaterials: () => PAST_PAPER_SOURCE_REGISTRY.flatMap(record => record.materials.filter(material => material.variants.some(isTrainable))),
};
export function normalizeRecoveredPassage(material, variant=defaultVariant(material)) {
 if(!material||!variant)return null;
 const sourceText=bodyText(variant);
 const referenceAnswer=String(variant.referenceAnswer??variant.referenceTranslation??'').trim();
 return {
  id:`${material.id}@${variant.id}`, paperId:material.paperId, year:material.year, session:material.session,
  paperType:material.subject, direction:material.direction, passageIndex:Number(material.number),
  sourceText, referenceAnswer:referenceAnswer||null, referenceTranslation:referenceAnswer||null,
  referenceSource:variant.referenceSource||null, sourceLabel:variant.sourceLabel||material.sourceNote||null,
  sourceUrls:[...(variant.sourceURLs||[])], variants:material.variants||[],
  textCompleteness:contentState(variant), trainable:isTrainable(variant),
  wordCount:words(sourceText), charCount:[...sourceText].length, topic:material.topic||material.title,
  contentVersion:variant.contentVersion||'public-registry-2026-09-18', title:variant.title||material.title,
  sourceType:material.sourceKind, source:material.sourceNote
 };
}
export function validateRecoveredPassage(passage){
 if(!passage||!passage.id||!passage.paperId||!/^\d{4}$/.test(String(passage.year))||!['zh-en','en-zh'].includes(passage.direction))return false;
 if(!passage.sourceText||passage.textCompleteness!=='complete'||passage.trainable!==true)return false;
 if(passage.sourceText.trim()===String(passage.referenceAnswer||'').trim())return false;
 const source=passage.sourceText, reference=String(passage.referenceAnswer||'');
 const latin=s=>((s.match(/[A-Za-z]/g)||[]).length/Math.max(1,s.length));
 const han=s=>((s.match(/[\u3400-\u9fff]/g)||[]).length/Math.max(1,s.length));
 if(passage.direction==='zh-en' && !(han(source)>0.08 && latin(reference)>0.35))return false;
 if(passage.direction==='en-zh' && !(latin(source)>0.35 && han(reference)>0.08))return false;
 if(/^(this paragraph|this passage|this text) (discusses|explains|is about)|^in summary/i.test(reference.trim()))return false;
 if(!passage.sourceUrls?.length||!passage.sourceLabel||!passage.contentVersion)return false;
 return true;
}
// Exact reprints combine source URLs. Different text (including reference differences)
// remains a separate version. Metadata-only sources are never collapsed as equal text.
export function mergeVariants(variants) {
 const result=[];
 for(const v of variants){
  const same=v.sourceText?.trim()&&result.find(x=>normalize(x.sourceText)===normalize(v.sourceText)&&normalize(x.referenceTranslation)===normalize(v.referenceTranslation));
  if(same)same.sourceURLs=[...new Set([...same.sourceURLs,...v.sourceURLs])];else result.push({...v,sourceURLs:[...new Set(v.sourceURLs)]});
 }
 return result;
}
export function defaultVariant(material){return [...mergeVariants(material.variants)].sort((a,b)=>Number(isTrainable(b))-Number(isTrainable(a))||(b.sourceText?.length||0)-(a.sourceText?.length||0))[0]}
export function trainingExercise(material,variant=defaultVariant(material)){
 if(!isTrainable(variant))return null;
 const recovered=normalizeRecoveredPassage(material,variant);
 return {...material,...variant,...recovered,id:material.id+'@'+variant.id,canonicalId:material.id,variantId:variant.id,type:'past-paper',sourceType:material.sourceKind,source:material.sourceNote,verificationStatus:'pending',exerciseType:'past-paper'};
}
export function sessionSnapshot(exercise,answer,startedAt,submittedAt=new Date().toISOString()){
 if(!exercise?.sourceText||!String(answer).trim())throw new Error('请先作答');
 return {exerciseId:exercise.id,exerciseType:'past-paper',direction:exercise.direction,topic:exercise.topic||exercise.title,sourceText:exercise.sourceText,referenceAnswer:exercise.referenceAnswer??exercise.referenceTranslation??null,referenceSource:exercise.referenceSource||null,sourceLabel:exercise.sourceLabel||null,userAnswer:answer,startedAt,submittedAt,durationMs:Math.max(0,Date.parse(submittedAt)-Date.parse(startedAt)),status:'completed',sourceType:'past-paper',sourceOriginType:exercise.sourceKind,source:exercise.sourceNote+' · '+exercise.sourceURLs.join(' · '),year:exercise.year,paperId:exercise.paperId,passageIndex:exercise.passageIndex,examLevel:'2',paperType:exercise.subject,sectionType:exercise.section,questionType:exercise.subject==='practical'?'translation':exercise.section,trainingMode:'past-paper-practice',datasetVersion:'public-registry-2026-09-18'};
}
export function fullSessionExercises(record){
 const all=record.materials.filter(p=>p.subject==='practical');
 const slots=new Set(all.map(p=>p.section+'-'+p.number));
 if(['en-zh-1','en-zh-2','zh-en-1','zh-en-2'].some(s=>!slots.has(s)))return [];
 const exercises=all.map(p=>trainingExercise(p));
 // A disputed attribution does not silently become a supposedly complete paper.
 return exercises.length===4&&exercises.every(e=>e&&e.textCompleteness==='complete')&&all.every(p=>p.variants.length===1)?exercises:[];
}
export function filterRegistry(records,{year='all',month='all',subject='all',direction='all',query=''}={}){
 const q=query.trim().toLowerCase();
 return records.filter(r=>(year==='all'||r.year===year)&&(month==='all'||r.month===month)&&(subject==='all'||r.subjects[subject])).map(r=>{
  const materials=r.materials.filter(p=>(subject==='all'||p.subject===subject)&&(direction==='all'||p.direction===direction));
  return {...r,visibleMaterials:materials};
 }).filter(r=>(direction==='all'||r.visibleMaterials.length>0)&&(!q||[r.year,r.session,...r.sources.map(s=>s.note+' '+s.evidence),...r.visibleMaterials.flatMap(p=>[p.title,...p.variants.flatMap(v=>[v.title,v.sourceText])])].join(' ').toLowerCase().includes(q)));
}
export function registryStats(data=PAST_PAPER_SOURCE_REGISTRY){
 const materials=data.flatMap(r=>r.materials),practical=materials.filter(x=>x.subject==='practical'),comp=materials.filter(x=>x.subject==='comprehensive');
 const imported=materials.filter(p=>p.variants.some(isTrainable));
 const translated=imported.filter(p=>p.variants.some(v=>isTrainable(v)&&v.referenceTranslation?.trim()));
 const practicalImported=imported.filter(p=>p.subject==='practical');
 return {years:new Set(data.map(x=>x.year)).size,sessions:data.filter(r=>r.month!=='sample').length,subjectIndexes:data.reduce((n,r)=>n+Object.keys(r.subjects).length,0),
 practicalPassages:practical.length,enZh:practical.filter(p=>p.direction==='en-zh').length,zhEn:practical.filter(p=>p.direction==='zh-en').length,
 comprehensiveItems:comp.length,vocabularyGrammar:comp.filter(p=>p.section==='vocabulary-grammar').length,reading:comp.filter(p=>p.section==='reading').length,cloze:comp.filter(p=>p.section==='cloze').length,
 completePracticalSessions:data.filter(r=>fullSessionExercises(r).length===4).length,partialPracticalSessions:data.filter(r=>r.materials.some(p=>p.subject==='practical'&&p.variants.some(isTrainable))&&!fullSessionExercises(r).length).length,
 identifiedFourSlots:data.filter(r=>['en-zh-1','en-zh-2','zh-en-1','zh-en-2'].every(s=>r.materials.some(p=>p.subject==='practical'&&p.section+'-'+p.number===s))).length,
 trainablePassages:practicalImported.length,trainableItems:imported.length,withReference:practicalImported.filter(p=>p.variants.some(v=>isTrainable(v)&&v.referenceTranslation?.trim())).length,sourceOnly:practicalImported.filter(p=>!p.variants.some(v=>isTrainable(v)&&v.referenceTranslation?.trim())).length,comprehensiveWithAnswer:translated.filter(p=>p.subject==='comprehensive').length,
 candidateOrOnline:materials.filter(p=>p.sourceKind==='recollection').length,institutional:materials.filter(p=>p.sourceKind==='institution').length,educational:materials.filter(p=>p.sourceKind==='educational').length,official:0,sampleIndexes:data.filter(r=>r.month==='sample').length,
 versionDifferences:materials.filter(p=>mergeVariants(p.variants).length>1).length,registryOnly:data.filter(r=>r.month!=='sample'&&!r.materials.some(p=>p.variants.some(isTrainable))).length,registryOnlySamples:data.filter(r=>r.month==='sample'&&!r.materials.some(p=>p.variants.some(isTrainable))).length,registryOnlyMaterials:materials.length-imported.length};
}
export function recoveryStats(data=PAST_PAPER_SOURCE_REGISTRY){
 const exercises=data.flatMap(r=>r.materials.filter(p=>p.subject==='practical').map(p=>trainingExercise(p)).filter(Boolean));
 return {trainablePassages:exercises.length,withReference:exercises.filter(x=>x.referenceAnswer).length,sourceOnly:exercises.filter(x=>!x.referenceAnswer).length,complete:exercises.filter(validateRecoveredPassage).length,years:[...new Set(exercises.map(x=>x.year))].sort()};
}
export function validateSourceRegistry(data=PAST_PAPER_SOURCE_REGISTRY){
 if(!Array.isArray(data)||!data.length)return false;
 const ids=new Set(),variantIds=new Set();
 const unique=(id,set)=>typeof id==='string'&&id&&!set.has(id)&&Boolean(set.add(id));
 const urlOK=url=>{try{return ['https:','http:'].includes(new URL(url).protocol)}catch{return false}};
 return data.every(r=>unique(r.id,ids)&&/^\d{4}$/.test(r.year)&&/^(0[1-9]|1[0-2]|sample)$/.test(r.month)&&r.sources.length&&r.sources.every(s=>urlOK(s.url)&&s.evidence&&['practical','comprehensive'].includes(s.subject))&&Object.keys(r.subjects).every(s=>r.sources.some(x=>x.subject===s))&&r.materials.every(p=>unique(p.id,ids)&&p.paperId===r.id&&r.subjects[p.subject]&&(p.subject!=='practical'||['zh-en','en-zh'].includes(p.direction))&&p.variants.length&&p.variants.every(v=>unique(v.id,variantIds)&&v.sourceURLs.length&&v.sourceURLs.every(urlOK)&&(v.completeness!=='complete'||isTrainable(v))&&(!v.options||(v.options.length>=1&&(v.answer==null||v.options.includes(v.answer)))))));
}
export const registrySearch=(records,query='')=>filterRegistry(records,{query});

export function trainingLibraryView(filters={}){
 const rank=p=>Math.min(...p.variants.map(v=>isTrainable(v)?({complete:0,partial:1,fragment:2,recalled:3,uncertain:4}[contentState(v)]??4):5));
 return pastPaperRepository.filter(filters).map(r=>({...r,visibleMaterials:r.visibleMaterials.filter(p=>filters.availability==='all'||p.variants.some(isTrainable)).sort((a,b)=>rank(a)-rank(b))})).filter(r=>filters.availability==='all'||r.visibleMaterials.length).sort((a,b)=>Math.min(5,...a.visibleMaterials.map(rank))-Math.min(5,...b.visibleMaterials.map(rank))||b.year.localeCompare(a.year)||b.month.localeCompare(a.month));
}
