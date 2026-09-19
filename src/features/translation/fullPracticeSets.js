import {EXAM_PASSAGES} from './examPassageDataset.js';
import {checkFullPractice} from '../content/contentValidation.js';
const old=n=>'exam_reviewed_'+n;
const fresh=n=>'rebuild_exam_passage_'+n;
export const FULL_PRACTICE_SETS=[
 ['full_practice_reviewed_001','城市、科学与公共投资','catti-standard',[old('zh_en_001'),old('zh_en_002')],[old('en_zh_001'),old('en_zh_002')]],
 ['full_practice_reviewed_002','文化、供应链与长期保障','catti-standard',[old('zh_en_003'),old('zh_en_004')],[old('en_zh_003'),old('en_zh_004')]],
 ['full_practice_rebuild_003','藏品、贸易与公共证据','catti-standard',[fresh('zh_en_001'),fresh('zh_en_002')],[fresh('en_zh_001'),fresh('en_zh_002')]],
 ['full_practice_rebuild_004','文献、风险与制度边界','catti-advanced',[fresh('zh_en_003'),fresh('zh_en_004')],[fresh('en_zh_003'),fresh('en_zh_004')]],
 ['full_practice_rebuild_005','科研、物价与风险分配','catti-advanced',[fresh('zh_en_005'),fresh('zh_en_006')],[fresh('en_zh_005'),fresh('en_zh_006')]]
].map(([id,title,difficultyTier,zh,en],i)=>({id,title:`CATTI Lab 整套模拟 ${i+1} · ${title}`,difficultyTier,directions:{'zh-en':zh,'en-zh':en},contentType:'full-practice',sourceType:'simulated',source:'CATTI Lab original simulation',verificationStatus:'pending',contentStatus:'published',generatedBy:'internal-seed',reviewedBy:'agent-editorial-training-rebuild',contentVersion:1,estimatedMinutes:180,reviewNotes:'四篇独立材料；双向总负荷按当前产品规格校验，不是官方原卷。'}));
export const fullPracticeQA=()=>FULL_PRACTICE_SETS.map(x=>({id:x.id,...checkFullPractice(x,EXAM_PASSAGES)}));
