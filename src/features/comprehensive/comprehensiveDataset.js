import {isPublishedContent} from '../content/contentValidation.js';
import * as legacy from './legacyComprehensive.js';
import {REVIEWED_OBJECTIVES,REVIEWED_READING,REVIEWED_CLOZE} from './reviewedSeeds.js';
import {quarantine} from '../content/seedReview.js';
export const REJECTED_COMPREHENSIVE=[
...legacy.VOCABULARY_EXERCISES.map(x=>quarantine({...x,contentType:'vocabulary'},'脱离具体语境，重复词义模板，部分选项与正确答案近义，解析未排除干扰。')),
...legacy.GRAMMAR_EXERCISES.map(x=>quarantine({...x,contentType:'grammar'},'完整句没有作答空位，统一选项/答案与题干不对应。')),
...legacy.READING_PASSAGES.map(x=>quarantine({...x,contentType:'reading'},'主题替换模板，五类问题统一答案，指代题和态度题不成立。')),
...legacy.CLOZE_PASSAGES.map(x=>quarantine({...x,contentType:'cloze'},'正文没有空格，十空统一答案 evidence，不构成完形。'))];
export const ALL_COMPREHENSIVE_CONTENT=[...REJECTED_COMPREHENSIVE,...REVIEWED_OBJECTIVES,REVIEWED_READING,REVIEWED_CLOZE];
export const VOCABULARY_EXERCISES=REVIEWED_OBJECTIVES.filter(x=>isPublishedContent(x)&&x.questionType==='vocabulary');
export const GRAMMAR_EXERCISES=REVIEWED_OBJECTIVES.filter(x=>isPublishedContent(x)&&x.questionType==='grammar');
export const READING_PASSAGES=[REVIEWED_READING].filter(isPublishedContent);
export const CLOZE_PASSAGES=[REVIEWED_CLOZE].filter(isPublishedContent);
const child=(p,q)=>({...p,...q,contentType:p.contentType,passageId:p.id,referenceAnswer:q.answer});
export const READING_QUESTIONS=READING_PASSAGES.flatMap(p=>p.questions.map(q=>child(p,q)));
export const CLOZE_BLANKS=CLOZE_PASSAGES.flatMap(p=>p.blanks.map(q=>child(p,q)));
export const COMPREHENSIVE_EXERCISES=[...VOCABULARY_EXERCISES,...GRAMMAR_EXERCISES,...READING_QUESTIONS,...CLOZE_BLANKS];
export function validateComprehensiveDataset(items=COMPREHENSIVE_EXERCISES){return new Set(items.map(x=>x.id)).size===items.length&&items.every(x=>x.options.length===4&&new Set(x.options).size===4&&x.options.includes(x.answer)&&x.explanation&&x.contentStatus==='published')}

