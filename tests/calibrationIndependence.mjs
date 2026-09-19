import assert from 'node:assert/strict'; import fs from 'node:fs';
import {CALIBRATION_BATCH} from '../src/features/content/calibrationBatch.js';
import {SENTENCE_EXERCISES} from '../src/features/exercises/sentenceDataset.js';
import {PARAGRAPH_EXERCISES} from '../src/features/questionBank/paragraphDataset.js';
import {EXAM_PASSAGES} from '../src/features/translation/examPassageDataset.js';
import {FULL_PRACTICE_SETS} from '../src/features/translation/fullPracticeSets.js';
import {PAST_PAPER_SOURCE_REGISTRY} from '../src/features/questionBank/sourceRegistry.js';
import {bodyText,isTrainable} from '../src/features/questionBank/sourceRegistryService.js';
import {characters,words} from '../src/features/content/contentValidation.js';
const norm=s=>String(s||'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');
const tokens=s=>String(s||'').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
const grams=(s,n=5)=>{const a=tokens(s),o=new Set();for(let i=0;i<=a.length-n;i++)o.add(a.slice(i,i+n).join(' '));return o};
const similarity=(a,b)=>{const A=grams(a),B=grams(b);if(!A.size||!B.size)return 0;let same=0;for(const x of A)if(B.has(x))same++;return same/Math.min(A.size,B.size)};
const sources=[...SENTENCE_EXERCISES,...PARAGRAPH_EXERCISES,...EXAM_PASSAGES,...Object.values(FULL_PRACTICE_SETS).flatMap(s=>Object.values(s.directions||{}).flat()).map(id=>EXAM_PASSAGES.find(p=>p.id===id)).filter(Boolean),...PAST_PAPER_SOURCE_REGISTRY.flatMap(r=>r.materials.flatMap(p=>p.variants.filter(isTrainable).map(v=>({sourceText:bodyText(v),id:p.id}))))];
const sourceTexts=sources.map(x=>({id:x.id,sourceText:x.sourceText}));
const pair=[];for(let i=0;i<CALIBRATION_BATCH.length;i++)for(let j=i+1;j<CALIBRATION_BATCH.length;j++){const a=CALIBRATION_BATCH[i],b=CALIBRATION_BATCH[j];const sim=similarity(a.sourceText,b.sourceText);if(norm(a.sourceText)===norm(b.sourceText)||sim>=.25)pair.push({a:a.id,b:b.id,similarity:Number(sim.toFixed(3))})}
const existing=[];for(const c of CALIBRATION_BATCH)for(const x of sourceTexts){const sim=similarity(c.sourceText,x.sourceText);if(norm(c.sourceText)===norm(x.sourceText)||sim>=.25)existing.push({calibration:c.id,existing:x.id,similarity:Number(sim.toFixed(3))})}
const overview=CALIBRATION_BATCH.map(s=>({id:s.id,kind:s.kind,direction:s.direction,topic:s.topic,length:s.direction==='zh-en'?characters(s.sourceText):words(s.sourceText),lengthGate:s.lengthGate}));
assert.equal(CALIBRATION_BATCH.length,8);assert.equal(pair.length,0);assert.equal(existing.length,0);assert.ok(CALIBRATION_BATCH.every(s=>s.lengthGate==='PASS'&&s.published===false&&s.humanDifficultyAcceptance==='pending'));fs.writeFileSync('docs/workspace-consolidation/calibration-independence.json',JSON.stringify({overview,pairwise:pair,existingDataset:existing,threshold:'5-word gram overlap < 0.25; exact normalized duplicate forbidden'},null,2));console.log(JSON.stringify({overview,pairwiseDuplicateCheck:'PASS',existingDatasetDuplicateCheck:'PASS',pairwise:pair,existing:existing},null,2));
