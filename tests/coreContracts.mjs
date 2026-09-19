import assert from 'node:assert/strict';
import {SENTENCE_EXERCISES,ALL_SENTENCE_EXERCISES} from '../src/features/exercises/sentenceDataset.js';
import {PARAGRAPH_EXERCISES,ALL_PARAGRAPH_EXERCISES,validateParagraphDataset} from '../src/features/questionBank/paragraphDataset.js';
import {validatePastPapers} from '../src/features/questionBank/pastPaperDataset.js';
import {normalizeTrainingSession,calculateDurationMs} from '../src/features/training/trainingSchema.js';
import {filterExercises,canMove} from '../src/features/training/trainingSelectors.js';
import {validateExercise} from '../src/features/exercises/exerciseSchema.js';
import {COMPREHENSIVE_EXERCISES,validateComprehensiveDataset,READING_PASSAGES,CLOZE_PASSAGES} from '../src/features/comprehensive/comprehensiveDataset.js';
import {readStorage,writeStorage} from '../src/storage/storageAdapter.js';
// Quantity targets are reported as shortfalls; test quality and compatibility, never force filler.
for(const data of [SENTENCE_EXERCISES,PARAGRAPH_EXERCISES]){
 assert.ok(data.length>0);assert.equal(new Set(data.map(x=>x.id)).size,data.length);
 assert.ok(data.every(validateExercise));assert.ok(data.every(x=>x.contentStatus==='published'));
 for(const dir of ['zh-en','en-zh'])assert.ok(filterExercises(data,dir).length>0);
}
assert.ok(ALL_SENTENCE_EXERCISES.some(x=>x.contentStatus==='rejected'));
assert.ok(ALL_PARAGRAPH_EXERCISES.some(x=>x.contentStatus==='rejected'));
assert.ok(validateParagraphDataset());assert.ok(validatePastPapers());assert.ok(validateComprehensiveDataset());
for(const p of READING_PASSAGES)assert.equal(p.questions.length,5);
for(const p of CLOZE_PASSAGES)assert.equal(p.blanks.length,10);
for(const q of COMPREHENSIVE_EXERCISES)assert.ok(q.options.includes(q.answer));
const legacy=normalizeTrainingSession({source:'old',answer:'mine',reference:'ref'});
assert.equal(legacy.sourceText,'old');assert.equal(legacy.userAnswer,'mine');assert.equal(legacy.referenceAnswer,'ref');
assert.equal(normalizeTrainingSession({trainingMode:'comprehensive-practice'}).trainingMode,'comprehensive-practice');
assert.equal(calculateDurationMs('2026-01-01T00:00:00Z','2026-01-01T00:01:30Z'),90000);
assert.equal(canMove(0,24,-1),false);assert.equal(canMove(0,24,1),true);assert.equal(canMove(23,24,1),false);
const map=new Map(),fake={getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
writeStorage('test',{ok:true},fake);assert.deepEqual(readStorage('test',null,fake),{ok:true});
console.log('Core contracts and legacy storage compatibility passed');
await import('./contentEngine.mjs');

