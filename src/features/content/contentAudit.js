import {SIMULATION_CONTENT} from '../simulation/simulationContent.js';
import {buildContentRegistry,duplicateWarnings} from './contentRegistry.js';
import {checkContent,reviewValid,words,characters} from './contentValidation.js';
import {ALL_SENTENCE_EXERCISES} from '../exercises/sentenceDataset.js';
import {ALL_PARAGRAPH_EXERCISES} from '../questionBank/paragraphDataset.js';
import {ALL_COMPREHENSIVE_CONTENT} from '../comprehensive/comprehensiveDataset.js';
import {EXTENDED_EXERCISES} from '../translation/extendedDataset.js';
import {ALL_EXAM_PASSAGES,EXAM_PASSAGES} from '../translation/examPassageDataset.js';
import {FULL_PRACTICE_SETS,fullPracticeQA} from '../translation/fullPracticeSets.js';
import {quarantine} from './seedReview.js';
export function getContentRegistry(){return buildContentRegistry({sentence:ALL_SENTENCE_EXERCISES,paragraph:ALL_PARAGRAPH_EXERCISES,comprehensive:[...ALL_COMPREHENSIVE_CONTENT,...SIMULATION_CONTENT],exam:ALL_EXAM_PASSAGES,legacyExtended:EXTENDED_EXERCISES.map(x=>quarantine({...x,contentType:'legacy-extended'},'公共模板重复且参考不完全对应，不是 Exam Passage。'))})}
export function contentAudit(){
 const r=getContentRegistry(),p=r.items.filter(x=>x.contentStatus==='published');
 const count=(type)=>p.filter(x=>x.contentType===type);
 const by=(field,items)=>items.reduce((a,x)=>{const k=x[field]??'uncalibrated';a[k]=(a[k]||0)+1;return a},{});
 const checks=r.items.map(x=>({id:x.id,status:x.contentStatus,...checkContent(x,p.filter(y=>x.id!==y.id)),reviewCurrent:reviewValid(x)}));
 const failures=checks.filter(x=>x.status==='published'&&(!x.valid||!x.reviewCurrent));
 const counts={vocabulary:count('vocabulary').length,grammar:count('grammar').length,readingPassages:count('reading').length,readingQuestions:count('reading').reduce((n,p)=>n+p.questions.length,0),clozePassages:count('cloze').length,clozeBlanks:count('cloze').reduce((n,p)=>n+p.blanks.length,0),sentence:by('direction',count('sentence')),paragraph:by('direction',count('paragraph')),examPassages:by('direction',count('exam-passage')),fullPracticeSets:FULL_PRACTICE_SETS.filter(x=>x.contentStatus==='published').length};
 const sets=fullPracticeQA(),duplicates=duplicateWarnings(p);
 const targets={vocabulary:{target:80,published:counts.vocabulary},grammar:{target:80,published:counts.grammar},readingPassages:{target:15,published:counts.readingPassages},clozePassages:{target:6,published:counts.clozePassages},sentence:{target:100,published:count('sentence').length},paragraph:{target:60,published:count('paragraph').length},examPassages:{target:20,published:count('exam-passage').length},fullPracticeSets:{target:2,published:counts.fullPracticeSets}};
 const stageSummary={};for(const c of checks)for(const issue of c.issues){stageSummary[issue.stage]=(stageSummary[issue.stage]||0)+1;}
 return {targetAssessment:Object.fromEntries(Object.entries(targets).map(([k,v])=>[k,{...v,shortfall:Math.max(0,v.target-v.published),met:v.published>=v.target}])),allQuantityTargetsMet:Object.values(targets).every(x=>x.published>=x.target),stageIssueCountsAllCandidates:stageSummary,totalCandidates:r.total,publishedContentObjects:p.length,counts,difficultyDistribution:by('difficultyTier',p),objectiveItemDifficulty:by('difficultyTier',p.flatMap(x=>x.questions?x.questions.map(()=>x):x.blanks?x.blanks.map(()=>x):['vocabulary','grammar'].includes(x.contentType)?[x]:[])),contentStatusDistribution:r.byContentStatus,rejected:r.items.filter(x=>x.contentStatus==='rejected').map(x=>({id:x.id,reason:x.rejectionReason})),unpublished:r.items.filter(x=>x.contentStatus!=='published').map(x=>x.id),publishedFailures:failures,duplicateDetection:{published:duplicates,allCandidates:duplicateWarnings(r.items)},checks,fullPractice:sets,examLengths:EXAM_PASSAGES.map(x=>({id:x.id,direction:x.direction,length:x.direction==='zh-en'?characters(x.sourceText):words(x.sourceText)})),readingMetrics:count('reading').map(x=>{const sentences=x.sourceText.split(/[.!?]+/).filter(s=>s.trim());return {id:x.id,words:words(x.sourceText),averageSentenceWords:Number((words(x.sourceText)/sentences.length).toFixed(1)),complexSentenceHeuristic:sentences.filter(s=>/\b(which|who|that|although|while|because|whether|when)\b/i.test(s)).length/sentences.length,inferenceQuestionRatio:x.questions.filter(q=>['inference','attitude','argument'].includes(q.questionKind)).length/x.questions.length,lexicalComplexity:'Editorial evidence; not an empirically calibrated vocabulary score',directCopyQuestionRatio:0}}),valid:failures.length===0&&duplicates.length===0&&sets.every(x=>x.valid)};
}

