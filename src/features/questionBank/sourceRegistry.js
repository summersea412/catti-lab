import {PDF_SLOT_CORRECTIONS} from './pdfSlotCorrections.js';
import { PRACTICAL_PAGE_INDEX } from './publicSourceSeeds.js';
import { TCM_TEXT, TCM_REFERENCE, FOOD_TEXT, PUBLIC_VOCAB_ITEM } from './publicTrainingContent.js';
import { RECOVERED_PRACTICAL_PASSAGES } from './recoveredPracticalPassages.js';
import { PACKAGE_RECOVERED_PASSAGES } from './packageRecoveredPassages.js';
import { PACKAGE_PDF_RECOVERED_PASSAGES } from './packagePdfRecoveredPassages.js';

export const RESEARCH_DATE = '2026-09-18';
const EDU = 'https://demo.ltpower.net/web/hydxswyy/news/';
const PDF = EDU+'garbage/video/20230405%2F143358.pdf';
const EARLY = 'https://www.scribd.com/document/600772000/全国翻译资格考试catti历年二级笔译真题-笔译实务';
const CATALOG = 'https://easterneast.com/product/65e62ef8f0f22465e2ccccf4/';
const NOTE = {educational:'公开教学资料整理',institution:'机构整理 · 非官方原卷',recollection:'考生回忆整理 · 非官方原卷',catalogue:'出版目录索引 · 暂无站内正文',reprint:'公开转载整理 · 非官方原卷',sample:'公开样题转载 · 来源待进一步核验'};
const bodyKey=text=>String(text||'').normalize('NFKC').replace(/\s+/g,' ').trim().toLowerCase();
const records = new Map();
function index(year,month,subject,url,kind='educational',evidence='',extra={}) {
  const id='catti2-'+year+'-'+month;
  if(!records.has(id))records.set(id,{id,year:String(year),session:month==='sample'?'样题（非考试场次）':month+'月',month,exam:'CATTI',level:2,language:'en',sources:[],subjects:{},materials:[]});
  const r=records.get(id);
  const observation={url,kind,note:NOTE[kind],subject,evidence:evidence||`${year}年${month}月英语二级笔译${subject==='practical'?'实务':'综合能力'}，页面标题明确标注`,checkedAt:RESEARCH_DATE,...extra};
  if(!r.sources.some(s=>s.url===url&&s.subject===subject))r.sources.push(observation);
  r.subjects[subject]??={status:'indexed',structure:subject==='practical'?(Number(year)<2005?'历史必译 / 选译结构，未按四篇重排':'英译汉 / 汉译英，具体篇目待逐篇恢复'):'历史结构尚未逐题恢复',sections:[]};
  return r;
}
for(const p of PRACTICAL_PAGE_INDEX)index(p.year,p.month,'practical',p.url);
// Titles observed in the public index even when opening their body timed out.
for(const [year,month,page] of [[2003,'12','1965/3.html'],[2007,'05','1965/3.html'],[2008,'05','1965/3.html'],[2014,'05','1965/2.html'],[2016,'11','1965.html'],[2021,'06','1965.html']])index(year,month,'practical',EDU+page,'educational','目录明确列出该场次；正文打开超时，未推定篇目数',{access:'index-only'});
index(2005,'05','practical',EARLY,'reprint','公开目录列出2005年5月二级笔译实务；只引用目录，不绕过付费下载');
for(const [year,month] of [[2009,'11'],[2012,'11']])index(year,month,'practical','https://max.book118.com/html/2024/0902/6112242132010215.shtm','reprint','公开目录明确列出该场次；仅索引，未访问付费正文');
index(2021,'11','practical',CATALOG,'catalogue','华研外语公开目录明确列出2021年11月实务，不把所附综合模拟卷当真题');

const comp = [[2003,'12','show-5742.html'],[2004,'05','1966.html'],[2004,'11','1966.html'],[2005,'05','1966.html'],[2006,'05','1966.html'],[2007,'11','show-5766.html'],[2008,'11','show-5769.html'],[2009,'05','1966.html'],[2010,'11','show-5762.html'],[2011,'05','1966.html'],[2016,'05','show-5759.html'],[2017,'05','1966/2.html'],[2018,'05','show-5754.html'],[2018,'11','show-5752.html'],[2019,'06','show-5751.html'],[2019,'11','show-5749.html']];
for(const [year,month,page] of comp)index(year,month,'comprehensive',EDU+page,'educational','公开二级笔译综合目录 / 专页明确标注；模拟题未收为真题');
for(const year of [2016,2017])index(year,'11','comprehensive',PDF,'reprint','PDF目录为11月；教学网站单篇标题误写12月。保留冲突，不新增12月考试场次',{access:'public-index',dateDiscrepancy:'单篇标题12月与合集11月不一致'});
index(2010,'sample','comprehensive',PDF,'sample','PDF目录明确标注2010新样题，不计入历年考试场次数');
records.get('catti2-2003-12').subjects.comprehensive.structure='公开版本包含摘要写作等历史题型；保留原结构，非当前选择题制';
for(const id of ['catti2-2018-11','catti2-2019-06','catti2-2019-11']){
  records.get(id).subjects.comprehensive.structure='部分考后回忆 / 题源材料，不是完整试卷';
  records.get(id).subjects.comprehensive.sections=['词汇语法','阅读','完形'].filter(x=>id!=='catti2-2018-11'||x!=='完形');
}
const S={
 hjEn1:'https://m.hujiang.com/en_fanyi/p1279534/',hjEn2:'https://www.hjenglish.com/new/p1279535/',hjZh1:'https://www.hjenglish.com/new/p1279536/',hjZh2:'https://www.hjenglish.com/new/p1279537/',
 xdf18:'https://mtoutiao.xdf.cn/kyfy/201907/10955820.html',
 latest:'https://www.listentoworld.com.cn/blog/catti-2026-6',
 kaosee25:'https://www.kaosee.cn/index.php/home/news/article/id/9667.html',
 teacher24:'https://www.9kd.com/note/8952022',
 mti23:'https://m.mtipass.com/nd.jsp?id=13452',
 hq:'https://m.hqwx.com/ziliao/class_catti/7365/18571/',
};
function material(year,month,subject,section,number,title,url,kind='institution',extra={}){
 const r=index(year,month,subject,url,kind);
 const id=r.id+'-'+section+'-'+number;
 let p=r.materials.find(x=>x.id===id);
 if(!p){p={id,paperId:r.id,year:r.year,session:r.session,subject,section,direction:subject==='practical'?section:null,number,title,topic:title,sourceNote:NOTE[kind],sourceKind:kind,variants:[]};r.materials.push(p)}
 p.variants.push({id:id+'-v'+(p.variants.length+1),title,sourceURLs:[url],sourceText:'',referenceTranslation:'',completeness:'index',reason:'已定位公开来源；正文尚未导入',...extra});
 return p;
}
material(2018,'11','practical','en-zh',1,'手机依恋与心理安全感',S.hjEn1);
material(2018,'11','practical','en-zh',2,'贸易保护与配额',S.hjEn2,'institution',{reason:'公开版本首段存在省略及主题跳跃，保留索引，不把残文当完整训练'});
material(2018,'11','practical','zh-en',1,'中医药与中华文明',S.hjZh1,'institution',{sourceText:TCM_TEXT,referenceTranslation:TCM_REFERENCE,completeness:'complete',rights:'government-document-extract',reason:'按公开整理节选；与新东方同场次版本主题不同',referenceNote:'题源白皮书公开英文译文（按节选对齐），非考试官方答案',sourceURLs:[S.hjZh1,'https://m.hujiang.com/en_festival/p1279536/','https://www.xinhuanet.com/politics/2016-12/06/c_1120064848.htm','https://english.www.gov.cn/archive/white_paper/2016/12/06/content_281475509333700.htm']});
material(2018,'11','practical','zh-en',1,'网络民意与公共沟通',S.xdf18,'institution',{reason:'同一场次位置出现不同主题；保留公开归属差异，尚未恢复此版本正文'});
material(2018,'11','practical','zh-en',2,'农业合作与粮食安全',S.hjZh2,'institution',{sourceText:FOOD_TEXT,completeness:'complete',rights:'government-speech-extract',reason:'按公开整理节选；与新东方同场次版本主题不同',sourceURLs:[S.hjZh2,'https://www.mfa.gov.cn/ziliao_674904/zt_674979/ywzt_675099/2014zt_675101/lkqcf_675191/zxxxs_675193/201410/t20141016_9282951.shtml']});
material(2018,'11','practical','zh-en',2,'中国消费市场与汽车市场',S.xdf18,'institution',{reason:'同一场次位置出现不同主题；保留公开归属差异，尚未恢复此版本正文'});
for(const [year,month,url,kind,titles] of [
 [2026,'06',S.latest,'recollection',['德国经济与衰退风险','误译及其历史影响','人工智能的数据、算法与算力','性别平等与妇女发展']],
 [2025,'06',S.kaosee25,'institution',['科学奖项与创新激励','语言相对论','海南消博会与开放合作','废旧家电回收']],
 [2024,'10',S.teacher24,'institution',['抵押贷款利率','体育竞技与竞争','预防未成年人犯罪','人与自然']],
 [2023,'11',S.mti23,'institution',['性别平等','气候工程','大熊猫野化放归','污染防治与生态文明']],
 [2020,'11',S.hq,'institution',['世界经济发展','社交媒体虚假消息','抗击新冠疫情','生猪保价稳供']],
 ])titles.forEach((title,i)=>material(year,month,'practical',i<2?'en-zh':'zh-en',i%2+1,title,url,kind,{reason:year===2024?'公开页面只有节选译文，尚无完整正文':year===2023?'公开整理有星号替换；保留版本，未补造缺词':'篇目已定位；正文未导入，未将索引计为训练内容'}));
for(const [section,num,title] of [['en-zh',1,'劳动力利用不足与经济增长'],['en-zh',2,'隐喻'],['zh-en',1,'国产肺炎球菌疫苗']])material(2021,'06','practical',section,num,title,S.hq);
for(const [section,num,title] of [['en-zh',1,'美国失业与劳动力参与'],['en-zh',2,'疫情对交通的影响与合作'],['zh-en',1,'职业教育']])material(2022,'11','practical',section,num,title,EDU+'show-5603.html','educational');
for(const [section,num,title] of [['en-zh',1,'知识产权与体育'],['en-zh',2,'教科文组织与共同生活']])material(2022,'06','practical',section,num,title,EDU+'show-5602.html','educational');
material(2010,'11','comprehensive','vocabulary-grammar',1,'词汇选择 · 互联网访问',EDU+'show-5762.html','educational',{...PUBLIC_VOCAB_ITEM,completeness:'complete',rights:'short-quotation',reason:'原卷第1题及四个选项；答案来自同页答案表',referenceNote:'公开教学资料所附答案，非官方核验答案'});
records.get('catti2-2010-11').subjects.comprehensive.structure='词汇语法60题 / 阅读30题 / 完形20空；本地只导入第1题，其他内容保留来源链接';

index(2025,'06','comprehensive','https://www.sohu.com/a/906752936_121124020','recollection','译国译民教师及学员回忆：二笔综合仅答案图片预览，完整内容需另行领取。没有题干，不计为可训练题目',{access:'public-preview'});
records.get('catti2-2025-06').subjects.comprehensive.structure='回忆版综合答案预览；缺少对应题干及选项，暂不计题数';
// Round B.2 recovered bodies. The registry keeps the original source label and
// URL; these are public compilations, not official answer keys.
for(const item of RECOVERED_PRACTICAL_PASSAGES){
  const r=records.get(item.paperId); if(!r) continue;
  const id=`${item.paperId}-${item.section}-${item.number}`;
  let p=r.materials.find(x=>x.id===id);
  if(!p){p={id,paperId:r.id,year:r.year,session:r.session,subject:'practical',section:item.section,direction:item.section,number:item.number,title:item.title,topic:item.topic,sourceNote:item.sourceLabel,sourceKind:'institution',variants:[]};r.materials.push(p)}
  const variantId=`${id}-recovered-v1`;
  if(!p.variants.some(v=>v.id===variantId))p.variants.push({id:variantId,title:item.title,sourceURLs:item.sourceUrls,sourceText:item.sourceText,referenceTranslation:item.referenceAnswer,referenceAnswer:item.referenceAnswer,referenceSource:'既有参考译文 · 来源待核验',sourceLabel:'既有整理文本 · 含删改待核验',contentVersion:item.contentVersion,completeness:'partial',textCompleteness:'partial',rights:'public-compilation',trainable:true,reason:'既有恢复文本含删节，按部分正文展示，未确认完整性'});
}
// Short verbatim fragments observed during the previous public-source research.
// Missing text stays absent; neither fragment is a complete passage.
for(const [paperId,section,number,text,url,state] of [
 ['catti2-2022-06','en-zh',1,'The World Intellectual Property Organization is the global forum for intellectual property policy, services, information and cooperation.',EDU+'show-5602.html','fragment'],
 ['catti2-2023-11','en-zh',1,'Gender equality is not only a fundamental human right, but a necessary foundation for a peaceful, prosperous and sustainable world.',S.mti23,'recalled'],
]){
 const p=records.get(paperId).materials.find(p=>p.section===section&&p.number===number);
 p.variants[0]={...p.variants[0],sourceText:text,completeness:state,textCompleteness:state,sourceURLs:[url],reason:'此前公开资料研究中取得的原文片段，后续正文待补',contentVersion:'public-fragments-2026-09-19'};
}
// Local supplied package import. These bodies are deliberately marked partial:
// the importer preserves the text found in each file without claiming that a
// web compilation is a complete official paper.
const packageMonth=value=>value==='上半年'?'05':value==='下半年'?'11':value==='6月'?'06':value==='5月'?'05':value==='11月'?'11':'05';
for(const item of PACKAGE_RECOVERED_PASSAGES){
 if(!/^\d{4}$/.test(String(item.year))||!item.sourceText?.trim()||!['zh-en','en-zh'].includes(item.direction))continue;
 const r=index(item.year,packageMonth(item.session),'practical',item.sourceUrls[0]||'https://local.catti-lab.invalid/package','institution','本地资料包正文导入，状态按文件正文标记');
 const id=`${r.id}-package-${item.direction}-${item.passageIndex}`;
 let p=r.materials.find(x=>x.id===id);
 if(!p){p={id,paperId:r.id,year:r.year,session:r.session,subject:'practical',section:item.direction,direction:item.direction,number:item.passageIndex,title:item.topic,topic:item.topic,sourceNote:item.sourceLabel,sourceKind:item.sourceType,variants:[]};r.materials.push(p)}
 const variantId=`${id}-${item.id}`;
 if(!p.variants.some(v=>v.id===variantId))p.variants.push({...item,id:variantId,sourceURLs:item.sourceUrls,referenceTranslation:null,completeness:item.completeness,textCompleteness:item.completeness,rights:'local-supplied-package',trainable:true,reason:'本地资料包实际正文，完整性待进一步核对'});
}
// Bodies recovered from the user-supplied PDF package. PDF extraction keeps
// page provenance and deliberately marks these as partial/recalled until a
// later editorial pass confirms completeness. They remain user-visible and
// trainable whenever a real body was recovered.
for(const item of PACKAGE_PDF_RECOVERED_PASSAGES){
 if(!item.sourceText?.trim())continue;
 const r=index(item.year, item.session==='11月'?'11':item.session==='6月'?'06':'05', item.paperType==='comprehensive'?'comprehensive':'practical', item.sourceUrls[0], item.sourceType==='recollection'?'recollection':'institution', '本地资料包 PDF 正文提取，保留页码与原始来源');
 const section=item.paperType==='comprehensive'?'reading':item.direction;
 const id=`${r.id}-pdf-${item.id}`;
 let p=r.materials.find(x=>x.id===id);
 if(!p){p={id,paperId:r.id,year:r.year,session:r.session,subject:item.paperType,section,direction:item.paperType==='practical'?item.direction:null,number:item.passageIndex,title:item.title,topic:item.topic,sourceNote:item.sourceLabel,sourceKind:item.sourceType,variants:[]};r.materials.push(p)}
 const variantId=`${id}-v1`;
 if(!p.variants.some(v=>v.id===variantId))p.variants.push({...item,id:variantId,sourceURLs:item.sourceUrls,referenceTranslation:item.referenceAnswer||null,referenceAnswer:item.referenceAnswer||null,sourceLabel:item.sourceLabel,sourceType:item.sourceType,completeness:item.completeness,textCompleteness:item.textCompleteness,trainable:true,rights:'local-supplied-pdf',reason:'PDF 文本层提取；未补写无法辨认内容'});
}
// Content-level deduplication across the supplied files and previous registry
// entries. Exact reprints become variants/source URLs; different wording stays
// visible as a separate public version.
const seenBodies=new Map();
for(const r of records.values()) for(const p of [...r.materials]){
 const v=p.variants.find(x=>bodyKey(x.sourceText));
 const key=v&&bodyKey(v.sourceText); if(!key)continue;
 const prior=seenBodies.get(key);
 if(prior&&prior.material!==p){
  prior.material.variants.push(...p.variants.map(x=>({...x,id:`${x.id}-merged`})));
  r.materials=r.materials.filter(x=>x!==p);
 }else seenBodies.set(key,{record:r,material:p});
}
// Repair only positively matched local headings/registry topics. Keep original IDs
// and raw imported files so previous session snapshots remain meaningful.
export const SLOT_MAPPING_REPAIRS=[];
for(const r of [...records.values()])for(const p of [...r.materials]){
 const variant=p.variants.find(v=>PDF_SLOT_CORRECTIONS[v.id?.replace(/^.*?-pdf-(pdf-)/,'$1').replace(/-v1$/,'')]);
 const rawId=variant?.id?.replace(/^.*?-pdf-(pdf-)/,'$1').replace(/-v1$/,'');
 const correction=PDF_SLOT_CORRECTIONS[rawId];if(!correction)continue;
 const target=records.get('catti2-'+p.year+'-'+correction.month);if(!target)continue;
 if(target!==r){r.materials=r.materials.filter(m=>m!==p);target.materials.push(p);for(const source of r.sources)if(!target.sources.some(s=>s.url===source.url&&s.subject===source.subject))target.sources.push(source);target.subjects[p.subject]??=r.subjects[p.subject]}
 SLOT_MAPPING_REPAIRS.push({importId:rawId,from:r.id,to:target.id,oldNumber:p.number,newNumber:correction.number,topic:correction.topic});
 p.paperId=target.id;p.session=target.session;p.number=correction.number;p.topic=correction.topic;p.title=correction.topic;
 for(const v of p.variants){v.title=correction.topic;v.mappingNote='本地PDF标题与既有场次主题交叉对应；原导入ID保留'}
 const pending=target.materials.filter(m=>m!==p&&m.direction===p.direction&&m.number===p.number&&!m.variants.some(v=>bodyKey(v.sourceText))&&m.title===correction.topic);
 for(const m of pending){p.registryAliases=[...(p.registryAliases||[]),m.id];p.variants.push(...m.variants);target.materials=target.materials.filter(x=>x!==m)}
}

export const PAST_PAPER_SOURCE_REGISTRY=[...records.values()].sort((a,b)=>b.year.localeCompare(a.year)||b.month.localeCompare(a.month));
export const REGISTRY_YEARS=[...new Set(PAST_PAPER_SOURCE_REGISTRY.map(x=>x.year))];
export const RESEARCH_LEADS=[
 {url:'https://m.koolearn.com/english/20221114/852432.html',note:'标题2023实务，发表于2022；不能据此认定2023考试。'},
 {url:'https://m.koolearn.com/english/20221215/854129.html',note:'标题2023综合，发表于2022；完形题考试年份待辨认。'},
 {url:EDU+'show-5758.html',note:'标题2016年12月，合集2016年11月，场次标注冲突。'},
 {url:'https://www.scribd.com/document/851605337/二笔综合早',note:'综合公开目录可交叉核对；未下载受限文件。'},
];
export {NOTE as SOURCE_NOTES};
