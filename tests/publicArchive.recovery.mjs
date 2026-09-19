import assert from 'node:assert/strict';
import { PAST_PAPER_SOURCE_REGISTRY } from '../src/features/questionBank/sourceRegistry.js';
import { normalizeRecoveredPassage, recoveryStats, trainingExercise, validateRecoveredPassage } from '../src/features/questionBank/sourceRegistryService.js';

const trainable=PAST_PAPER_SOURCE_REGISTRY.flatMap(r=>r.materials.filter(p=>p.subject==='practical').flatMap(p=>p.variants.map(v=>trainingExercise(p,v)).filter(Boolean)));
assert.ok(trainable.length>=5);
assert.ok(trainable.every(p=>p.sourceText && ['complete','partial','fragment','recalled','uncertain'].includes(p.textCompleteness)));
assert.ok(trainable.every(p=>p.paperId&&p.paperType==='practical'&&p.passageIndex&&p.sourceUrls?.length&&p.contentVersion));
assert.ok(trainable.every(p=>p.sourceText.trim()!==String(p.referenceAnswer||'').trim()));
const recovered=recoveryStats();
assert.equal(recovered.trainablePassages,7);
assert.equal(recovered.withReference,4);
console.log(JSON.stringify({trainablePassages:recovered.trainablePassages,withReference:recovered.withReference,sourceOnly:recovered.sourceOnly,complete:recovered.complete,years:recovered.years}));
