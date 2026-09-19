import {pastPaperRepository,defaultVariant,bodyText} from '../questionBank/sourceRegistryService.js';
import {characters,words} from './contentValidation.js';
// Existing recovered public materials only. No new web retrieval and no invented exam text.
// Comparative editorial anchors, not authenticated official paper boundaries.
const reviews=[
 ['catti2-2022-11-en-zh-1','labour force / discouraged workers / structural unemployment','that is 插入定义；because 从句界定统计偏差','年龄、劳动状态、申请资格和统计分母不能混淆','旧统计缺陷→新调查→参与率→失业分类','the rate / the latter part 回指各有范围','统计定义与政策解释之间不是直接因果','劳动经济学定义与测量口径','教材式概念解释，避免改成评论','名词定义需明确中心词；插入成分可拆句','原文对 participation rate 的解释本身有简化，不能替原文悄悄修正'],
 ['catti2-2022-11-en-zh-2','containment / supply chains / provisions / magnitude','of the magnitude we are experiencing 多层修饰','90 percent、一些国家、必须继续运作等限制','公共卫生冲击→运输停顿→必要流动→复苏原则','this crisis / it / the same order of magnitude 回指','限制接触与维持必要运输的让步张力','公共卫生与国际物流','国际组织正式论述语域','抽象名词转动词，保留并列行动项','sole weapon 是当时语境，不可增译为永久事实'],
 ['catti2-2022-11-zh-en-1','中职高职衔接／职教扶贫／高技能人才','是……也是……；但相对于……的转折范围','多年份、不同统计总体、就业率与人才占比','总论贡献→制度改革→天津西藏案例→不足','方案／首批学生／技能人才三个回指链','举例支持改革价值后转向地位不足','教育类型、层次和人才口径','政策说明正式语域，不额外夸大','长定语拆分；汉语并列转明确主语','599、95.17% 等数字核对；公开稿占比口径存在疑点'],
 ['catti2-2018-05-package-en-zh-1','cosmopolitan / grueling / vertiginous / symbiosis','who would otherwise have had little hope 反事实从句','游客规模、学习工时、角色与人物引语','旅游扩张→大学兴起→个人经历→供需→就业','here 指 Siem Reap；they 指在职学生','旅游与教育意外联动；无总规划并非无机制','柬埔寨城市旅游劳动市场','新闻叙事与引用交替','英语长修饰拆分；隐喻和口语引语自然转换','10,000客房和3.3m游客不可混；原始文章范围非官方边界'],
 ['catti2-2018-05-package-zh-en-1','共商共建共享／互联互通／薪火相传','面对多重状况的长状语；连续无主句','时间尺度、三洲、四类发展属性与多项结果','古代通路→当代情势→原则→网络→效果','精神／建设／项目主语不断切换','历史承接与行动愿景，避免已实现语气','国际合作倡议与区域联通','正式政策表述，避免机械四字格','补主语；分拆并列动词；隐喻换自然英语','不能遗漏自主／平衡等修饰；不是将倡议译成事实结果'],
 ['catti2-2018-05-package-zh-en-2','碳汇／温室气体浓度／栖息地','定义插入、据统计限定与多个行动主体','家庭平均、城市家庭、个人每年与公顷等单位','排放数据→碳汇定义→功能→项目→推广','这个数字 指家庭平均；企业是排放大户','减缓与吸收是机制，不是全部排放被抵消','森林碳储存与减排的区别','科普与政策说明混合','单位显化；汉语省略的主语与定语展开','数字为公开整理材料中的说法，不能当作当前科学建议']
];
export const TRANSLATION_BENCHMARK=reviews.map(([id,...notes])=>{
 const material=pastPaperRepository.trainableMaterials().find(x=>x.id===id);if(!material)throw Error('Missing benchmark '+id);
 const variant=defaultVariant(material);const sourceText=bodyText(variant).replace(/\n首页 考研[\s\S]*$/,'').trim();
 const sentences=sourceText.split(material.direction==='zh-en'?/[。！？]+/:/(?<=[.!?])\s+(?=[A-Z])/).filter(s=>s.trim());const measure=material.direction==='zh-en'?characters:words;
 return {id,year:material.year,direction:material.direction,sourceText,sourceUrls:variant.sourceURLs,sourceConfidence:'公开机构／考后整理，未核对官方原卷；仅作编辑比较锚点',boundaryConfidence:id.includes('2018')?'原始文章/公开整理边界，辅助 benchmark':'公开整理主体，考试边界未官方核验',length:measure(sourceText),sentenceCount:sentences.length,averageSentenceLength:Number((measure(sourceText)/sentences.length).toFixed(1)),maxSentenceLength:Math.max(...sentences.map(measure)),difficultyEvidence:Object.fromEntries(['lexicalComplexity','syntacticComplexity','informationDensity','discourseComplexity','crossSentenceReference','logicalRelations','domainKnowledge','register','transformationDemand','mistranslationRisk'].map((k,i)=>[k,notes[i]]))};
});
