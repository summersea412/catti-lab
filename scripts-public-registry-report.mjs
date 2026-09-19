import fs from 'node:fs';
import {PAST_PAPER_SOURCE_REGISTRY as records,RESEARCH_LEADS,RESEARCH_DATE} from './src/features/questionBank/sourceRegistry.js';
import {registryStats,isTrainable,validateSourceRegistry} from './src/features/questionBank/sourceRegistryService.js';
const stats=registryStats();
const byYear=Array.from({length:24},(_,i)=>String(2003+i)).map(year=>{const r=records.filter(x=>x.year===year);return {year,sessions:r.filter(x=>x.month!=='sample').map(x=>x.month),practicalIndexes:r.filter(x=>x.subjects.practical).length,comprehensiveIndexes:r.filter(x=>x.subjects.comprehensive&&x.month!=='sample').length,trainable:r.flatMap(x=>x.materials).filter(p=>p.variants.some(isTrainable)).length}});
fs.mkdirSync('docs/round-b1',{recursive:true});
fs.writeFileSync('docs/round-b1/registry-audit.json',JSON.stringify({researchDate:RESEARCH_DATE,valid:validateSourceRegistry(),stats,byYear,unresolvedLeads:RESEARCH_LEADS,records:records.map(r=>({...r,materials:r.materials.map(p=>({...p,variants:p.variants.map(({sourceText,referenceTranslation,...v})=>({...v,sourceCharacters:sourceText.length,hasReference:Boolean(referenceTranslation)}))}))}))},null,2));
const report=[
'# CATTI Lab V2 — Round B.1 公开历年资料库',
'',
'研究日期：'+RESEARCH_DATE+'。范围：CATTI 英语二级笔译，2003–2026。',
'',
'## 结果与口径',
'',
'已建立公开资料索引及独立的站内训练入口。**索引覆盖不等于正文恢复：本轮只有2篇实务正文和1道综合题可直接训练；不是42套可练试卷。** 未因非官方性质排除公开回忆材料。',
'',
'| 指标 | 数量 |', '|---|---:|',
...Object.entries({'覆盖年份':stats.years,'覆盖考试场次（不含样题）':stats.sessions,'科目索引（含样题）':stats.subjectIndexes,'已辨认实务篇目位置':stats.practicalPassages,'其中英译汉索引':stats.enZh,'其中汉译英索引':stats.zhEn,'本地实务完整正文':stats.trainablePassages,'本地综合题':stats.comprehensiveItems,'词汇语法 items':stats.vocabularyGrammar,'阅读 items':stats.reading,'完形 items':stats.cloze,'已定位四个篇目位置的场次（不是已恢复整套）':stats.identifiedFourSlots,'完整恢复、可整套训练的实务场次':stats.completePracticalSessions,'部分恢复实务场次':stats.partialPracticalSessions,'实务正文有参考译文':stats.withReference,'实务正文仅原文':stats.sourceOnly,'综合题有答案':stats.comprehensiveWithAnswer,'考生/网友回忆篇目或题目':stats.candidateOrOnline,'机构整理篇目或题目':stats.institutional,'公开教学资料篇目或题目':stats.educational,'已核实官方试卷/官方样题篇目':stats.official,'公开样题转载索引（未确认官方身份）':stats.sampleIndexes,'存在版本/归属差异的篇目位置':stats.versionDifferences,'仅索引、不可站内训练的考试场次':stats.registryOnly,'另计仅索引样题':stats.registryOnlySamples,'已辨认但未导入正文的篇目/题目':stats.registryOnlyMaterials}).map(([k,v])=>'| '+k+' | '+v+' |'),
'',
'来源性质的篇目计数以去重后的32个实务位置 + 1道综合题为单位，不以URL数量冒充题量。原文有参考/仅原文只计算本地实务正文，不把目录或缺失正文算作“只有原文”。',
'',
'## 逐年覆盖与缺口', '', '| 年份 | 已找到场次（月） | 实务索引 | 综合考试索引 | 本地可练篇/题 |','|---|---|---:|---:|---:|',
...byYear.map(r=>'| '+[r.year,r.sessions.join(' / '),r.practicalIndexes,r.comprehensiveIndexes,r.trainable].join(' | ')+' |'),
'',
'表中0表示本轮未定位或未导入，不代表该年未举行考试。2003、2004的实务保留历史必译/选译说明；2003综合资料含摘要写作，未强行转换为当前选择题制。2018、2019综合回忆来源分别记录词汇、阅读、完形范围；只有题源或主题时不虚增题目数。2025综合仅获得回忆答案预览，未把答案图片当成完整试卷。2020–2024及2026综合仍有明显索引缺口。',
'',
'## 来源冲突与保留规则',
'',
'- 2018.11 汉译英第1、2篇：沪江为中医药/粮食安全，新东方为网络民意/消费市场。两组归属都保留在variants中；这是主题级归属冲突，不只标点差异。站内训练明确标示采用的公开版本，不宣称已确定原卷。',
'- 2016、2017综合：合集目录写11月，教学单篇标题存在12月写法。保留来源冲突，不据此创建额外12月考试。',
'- 新东方若干标题含2023的页面发表于2022：保存为未定年份线索，不计作已确认2023场次。',
'- 同一位置的转载链接合并；正文及参考文本完全相同的版本由mergeVariants合并来源URL，文本不同则保留。元数据为空的版本不能因为空字符串相等而被合并。',
'- 不收录口译、三级、其他语种及模拟题作为英语二级笔译真题。只有目录时保留目录证据，不按每场4篇推算收录量。',
'',
'## 正文与训练',
'',
'- 两篇可练实务采用公开整理所载的政府白皮书/公开政策讲话节选，并链接对应题源。中医药参考来自白皮书公开英文版本，按所选节选对齐，明确非考试官方答案；粮食安全未补造参考。',
'- 综合导入2010.11公开教学版本第1题（题干、四个选项和所附答案），保留原题编号。没有人为补出其余109题。',
'- 公开可访问不等于已取得大篇幅复制入库的依据。机构译文、商业媒体文章和受限PDF保留索引与来源；未批量转载其全文，也未绕过下载/登录限制。',
'- 站内训练支持输入、查看参考、提交并持久化到既有catti.trainingSessions；无参考显示“暂无人工参考译文”。快照含版本稳定ID、原文、当前版本参考、作答、方向、场次、科目、开始/提交时间及用时。',
'- 四个位置正文均可用且没有未决版本归属冲突时才显示整套训练入口。当前没有满足条件的整套，未伪造补齐、未自动进入模拟考试。',
'',
'## 验证',
'',
'- node tests/publicArchive.mjs：数据证据结构、唯一ID、组合筛选、清除筛选、转载去重、差异版本、缺参考可训练、跨题快照、隔离存储测试通过。',
'- node tests/publicArchive.browser.mjs：独立Chrome隐私上下文，真实鼠标点击与中文/英文输入；组合筛选、版本切换、两篇实务提交、综合作答、刷新持久化、390px无横溢出通过，runtime error 0。结果见browser-qa.json。未触碰用户浏览器localStorage。',
'- npm test：通过。npm run build：通过。',
'- 开发预览：http://127.0.0.1:5174/，从侧栏进入真题题库。原有服务器已在运行，确认服务的是当前v2新增registry文件。',
'- 未接AI，未修改首页或Desktop Pet，未Git commit。',
'',
'## 场次与科目来源清单',
'',
...records.flatMap(r=>['### '+r.year+'.'+r.month,...Object.entries(r.subjects).flatMap(([subject,info])=>['','**'+(subject==='practical'?'笔译实务':'笔译综合能力')+'** — '+info.structure,...r.sources.filter(s=>s.subject===subject).map(s=>'- ['+s.note+']('+s.url+')：'+s.evidence)]),'']),
'## 待辨认线索', '',...RESEARCH_LEADS.map(x=>'- ['+x.note+']('+x.url+')'),
];
fs.writeFileSync('docs/round-b1/Round-B.1-Report.md',report.join('\n'));
console.log(JSON.stringify(stats,null,2));
