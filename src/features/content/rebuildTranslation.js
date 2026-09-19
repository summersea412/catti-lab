import {REBUILD_DECISIONS} from './rebuildDecisions.js';
import {reviewedSeed} from './seedReview.js';
import {characters,words} from './contentValidation.js';
// Editorial judgments, not examiner certification. The comparison notes are kept in
// docs/training-rebuild; a changed source/reference invalidates the fixed review hash.
export function rebuildTranslation(row,index,kind){
 const [direction,topic,sourceText,referenceAnswer,challenge]=row;
 const decision=REBUILD_DECISIONS[`${kind}:${direction}:${topic}`];
 if(!decision)throw new Error('Unreviewed translation content: '+topic);
 const advanced=decision.tier==='catti-advanced';
 const difficultyEvidence={
 lexicalComplexity:`${topic}：术语需按其制度语境确定词义；${challenge}`,
 syntacticComplexity:`结构审读：${challenge}；限定成分不得游离于所修饰的命题。`,
 inferenceDemand:`译者必须保留而不能擅自加强的推论：${challenge}`,
 discourseComplexity:`${topic}的论证以区别概念而非罗列倡议展开；前提、结论和例外需分层。`,
 domainKnowledge:`${topic}：先辨认文中的权利、证据或计量对象，再选择正式对应术语。`,
 translationChallenges:`转换任务：${challenge}；逐句对照主体、时态和否定范围。`,
 benchmarkIds:direction==='zh-en'?['catti2-2022-11-zh-en-1','catti2-2018-05-package-zh-en-1']:['catti2-2022-11-en-zh-1','catti2-2018-05-package-en-zh-1'],
 comparison:advanced?`相对公开整理中的定义/政策并列，本题额外要求处理${challenge}；属编辑上的进阶判断，未做考生标定。`:`与公开整理的术语定义、限定范围和逻辑重组对照，本题挑战是${challenge}；没有仅凭字数定档。`,
 informationDensity:`${topic}同时约束判断对象、适用条件和后果，不能压缩成主题摘要。`,
 crossSentenceReference:kind==='sentence'?`单句内部回指：需把修饰语还原到${topic}的论证对象。`:`${topic}的后文承接前文提出的判断标准，不得把限定性的结论改为一般断言。`,
 logicalRelations:`本题主要逻辑：${challenge}`,
 register:`${topic}采用分析型正式文体；译文保持审慎判断，不添加宣传性形容词。`,
 transformationDemand:`跨语言转换：${challenge}；以意义单位重组而非逐词替换。`,
 mistranslationRisk:`重点防止：${challenge}中的概念混同、限定遗漏和因果倒置。`
 };
 return reviewedSeed({id:decision.id,type:kind==='sentence'?'sentence':'paragraph',contentType:kind,direction,topic,title:topic,sourceText,referenceAnswer,referenceTranslation:referenceAnswer,trainingLevel:kind==='exam-passage'?kind:'standard',difficulty:advanced?'进阶':'标准',difficultyLevel:advanced?'catti2_plus':'catti2',charCount:characters(sourceText),wordCount:words(sourceText),estimatedMinutes:kind==='sentence'?12:kind==='paragraph'?32:45,sourceType:kind==='exam-passage'?'simulated':'practice',reviewStatus:'reviewed',contentVersion:1,datasetVersion:3,hints:[challenge,'先标出限定、否定与指代，再核对全部信息单位。'],length:direction==='zh-en'?characters(sourceText):words(sourceText)},{tier:advanced?'catti-advanced':'catti-standard',evidence:difficultyEvidence,notes:`逐句双语审读：${challenge}。完整译文保持信息顺序与逻辑范围；非官方模拟。`});
}
