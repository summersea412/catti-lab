import assert from 'node:assert/strict';
import {SENTENCE_EXERCISES,ALL_SENTENCE_EXERCISES} from '../src/features/exercises/sentenceDataset.js';
import {PARAGRAPH_EXERCISES,ALL_PARAGRAPH_EXERCISES} from '../src/features/questionBank/paragraphDataset.js';
import {EXAM_PASSAGES} from '../src/features/translation/examPassageDataset.js';
import {FULL_PRACTICE_SETS,fullPracticeQA} from '../src/features/translation/fullPracticeSets.js';
import {COMPREHENSIVE_SIMULATIONS} from '../src/features/simulation/comprehensiveSimulations.js';
import {SIMULATION_CONTENT} from '../src/features/simulation/simulationContent.js';
import {TRANSLATION_BENCHMARK} from '../src/features/content/translationBenchmark.js';
import {checkContent,isPublishedContent,characters,words} from '../src/features/content/contentValidation.js';
import {normalizeTrainingSession} from '../src/features/training/trainingSchema.js';
import {pastPaperRepository,trainingExercise} from '../src/features/questionBank/sourceRegistryService.js';
const dimensions=['lexicalComplexity','syntacticComplexity','informationDensity','discourseComplexity','crossSentenceReference','logicalRelations','domainKnowledge','register','transformationDemand','mistranslationRisk'];
for(const [pool,min,max,tmin,tmax] of [[SENTENCE_EXERCISES,60,120,8,15],[PARAGRAPH_EXERCISES,250,400,25,40],[EXAM_PASSAGES,null,null,40,55]]){
 assert.ok(pool.length);for(const p of pool){const length=p.direction==='zh-en'?characters(p.sourceText):words(p.sourceText),lo=min??(p.direction==='zh-en'?280:400),hi=max??(p.direction==='zh-en'?350:500);assert.ok(length>=lo&&length<=hi,p.id);assert.ok(p.estimatedMinutes>=tmin&&p.estimatedMinutes<=tmax);assert.ok(isPublishedContent(p),p.id);assert.ok(dimensions.every(k=>p.difficultyEvidence?.[k]?.length>10),p.id);assert.notEqual(p.sourceText,p.referenceAnswer)}
}
assert.equal([...ALL_SENTENCE_EXERCISES,...ALL_PARAGRAPH_EXERCISES].filter(x=>x.deprecated).length,64);
assert.equal(SENTENCE_EXERCISES.length,12);assert.equal(PARAGRAPH_EXERCISES.length,8);assert.equal(EXAM_PASSAGES.length,20);
assert.ok(!checkContent({...SENTENCE_EXERCISES[0],sourceText:'过短。'}).valid);
assert.ok(!checkContent({...PARAGRAPH_EXERCISES[0],sourceText:SENTENCE_EXERCISES[0].sourceText}).valid);
assert.ok(!checkContent({...EXAM_PASSAGES[0],difficultyTier:'foundation'}).valid);
assert.ok(fullPracticeQA().every(x=>x.valid));assert.equal(FULL_PRACTICE_SETS.length,5);assert.equal(FULL_PRACTICE_SETS.filter(x=>x.difficultyTier==='catti-standard').length,3);assert.equal(FULL_PRACTICE_SETS.filter(x=>x.difficultyTier==='catti-advanced').length,2);
assert.equal(TRANSLATION_BENCHMARK.length,6);assert.ok(TRANSLATION_BENCHMARK.every(x=>dimensions.every(k=>x.difficultyEvidence[k])&&x.sourceConfidence&&x.sourceUrls.length));
const used=new Set();for(const set of COMPREHENSIVE_SIMULATIONS){assert.equal(set.estimatedMinutes,120);let count=0;for(const section of set.sections){assert.ok(section.items.length);for(const p of section.items){for(const q of p.questions||p.blanks||[p]){assert.ok(!used.has(q.id),q.id);used.add(q.id);assert.ok(q.options.includes(q.answer));assert.ok(q.explanation);count++}}}assert.equal(count,35)}
assert.ok(SIMULATION_CONTENT.every(isPublishedContent));
const snapshot={exerciseId:'old-retired-id',sourceText:'Historical source',referenceAnswer:'Historical reference',userAnswer:'Historical answer',contentVersion:1,session:'2020.11'};assert.equal(normalizeTrainingSession(snapshot).sourceText,snapshot.sourceText);assert.equal(normalizeTrainingSession(snapshot).contentVersion,1);assert.equal(normalizeTrainingSession(snapshot).session,'2020.11');
const materials=pastPaperRepository.trainableMaterials();assert.equal(materials.length,pastPaperRepository.visibleStats().trainable);assert.ok(materials.every(p=>trainingExercise(p)?.sourceText));
console.log('Rebuild contracts: frozen ranges, paired pools, old snapshots, 5 practical sets, 3 non-overlapping comprehensive sets, benchmark evidence, source-of-truth counts PASS');
