import {REBUILD_ZH} from './rebuildZh.js';
import {REBUILD_EN} from './rebuildEn.js';
import {rebuildTranslation} from '../content/rebuildTranslation.js';
import {isPublishedContent} from '../content/contentValidation.js';
import {REVIEWED_EXAM_PASSAGES} from './reviewedExamSeeds.js';
import {REJECTED_EXAM_TEMPLATES} from './rejectedExamTemplates.js';
import {quarantine} from '../content/seedReview.js';
import {checkContent} from '../content/contentValidation.js';
export const ALL_EXAM_PASSAGES=[...REJECTED_EXAM_TEMPLATES.map(x=>quarantine({...x,contentType:'exam-passage'},'循环模板，参考增译/漏译，英文长度不足考试级负荷。')),...REVIEWED_EXAM_PASSAGES.map(x=>({...x,estimatedMinutes:45})),...[...REBUILD_ZH.map(r=>['zh-en',...r]),...REBUILD_EN.map(r=>['en-zh',...r])].map((r,i)=>rebuildTranslation(r,i,'exam-passage'))];
export const EXAM_PASSAGES=ALL_EXAM_PASSAGES.filter(isPublishedContent);
export const validateExamPassages=(items=EXAM_PASSAGES)=>items.length>0&&items.every(x=>checkContent(x,items.filter(y=>y.id!==x.id)).valid);

