import assert from 'node:assert/strict';
import {PAST_PAPER_SOURCE_REGISTRY as registry} from '../src/features/questionBank/sourceRegistry.js';
import {bodyText,isTrainable,trainingExercise,sessionSnapshot,objectiveResult,visibleContentStats,validateSourceRegistry,fullSessionExercises} from '../src/features/questionBank/sourceRegistryService.js';
import {normalizeTrainingSession} from '../src/features/training/trainingSchema.js';
const material=registry.find(r=>r.id==='catti2-2010-11').materials[0];
// Isolated fixtures exercise absence of answers; never enter published content.
for(const state of ['complete','partial','fragment','recalled','uncertain']){
 const v={...material.variants[0],rights:undefined,completeness:state,answer:null,referenceTranslation:null};
 assert.equal(isTrainable(v),true);
 const exercise=trainingExercise(material,v);
 assert.equal(objectiveResult(exercise,'access').correct,null);
 assert.equal(objectiveResult(exercise,'access').label,'答案待补充');
 const snapshot=normalizeTrainingSession(sessionSnapshot(exercise,'access',new Date().toISOString()));
 assert.equal(snapshot.userAnswer,'access');
 assert.equal(snapshot.referenceAnswer,null);
 assert.deepEqual(JSON.parse(JSON.stringify(snapshot)),snapshot);
}
assert.equal(isTrainable({title:'只有标题',options:['A','B']}),false);
assert.equal(bodyText({sourceText:' ',questionText:'实际题干'}),'实际题干');
assert.equal(bodyText({passageText:'实际片段'}),'实际片段');
assert.equal(objectiveResult(material.variants[0],'access').correct,true);
assert.equal(objectiveResult(material.variants[0],'entrance').correct,false);
assert.equal(validateSourceRegistry(),true);
const absent=structuredClone(registry);absent.find(r=>r.id===material.paperId).materials[0].variants[0].answer=null;
assert.equal(validateSourceRegistry(absent),true);
assert.ok(registry.length>=43); // historical index plus locally recovered PDF sessions
const stats=visibleContentStats();
assert.equal(stats.total,39);assert.equal(stats.practical,37);assert.equal(stats.complete,2);
assert.equal(stats.partial,35);assert.equal(stats.recalled,1);assert.equal(stats.missingReference,33);
assert.equal(fullSessionExercises(registry.find(r=>r.id==='catti2-2022-11')).length,0);
console.log('Archive availability: all completeness states, missing answers/references, snapshots, counts and index preservation PASS');

