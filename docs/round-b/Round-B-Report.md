# CATTI Lab V2 Round B — Content Engine & Difficulty Calibration Report

日期：2026-09-18  
工作目录：D:\catti-study-assistant-v2  
Checkpoint：`c5a8244` — `feat: complete CATTI core experience rebuild`

**结论：内容引擎、发布门槛、QA、模拟篇章与组卷结构已实现；Seed Bank 总量及 20/60/20 难度分布尚未达标。不能将本报告理解为全部数量目标 PASS。** 按本轮第 34 条“质量优先，允许报告 published 数量不足”的要求，低质量内容保留为 rejected，不用于凑数。

## 1. Scope / checkpoint

Round A 当前状态已按要求创建 checkpoint，之后未再提交 Round B。没有修改首页、Sidebar、Analysis、Profile、TrainingSession、用户 localStorage 或 Desktop Pet。后者继续关闭。没有调用模型、要求 API key、增加后端或部署。

先前中断前的尝试新增了 36 篇替换主题的 Paragraph 和 20 篇循环模板 Exam Passage，并曾放宽校验。这些做法不符合本轮要求：本次将其全部隔离为 rejected，恢复标准英文段落最低 180 words 校验，移除根据索引升级难度、根据 approved 自动发布、自动补造 difficultyEvidence 的逻辑。没有把这些中间产物算作有效题库。

## 2. Published 数量与目标

| 内容 | Published | 目标 | 结果 |
|---|---:|---:|---|
| Vocabulary | 10 items | 80 | 缺 70 |
| Grammar | 10 items | 80 | 缺 70 |
| Reading | 1 passage / 5 questions | 至少 15 / 约 75 | 未达标 |
| Cloze | 1 passage / 10 blanks | 至少 6 / 60–72 | 未达标 |
| Sentence zh-en | 20 | 50 | 缺 30 |
| Sentence en-zh | 20 | 50 | 缺 30 |
| Paragraph zh-en | 12 | 30 | 缺 18 |
| Paragraph en-zh | 12 | 30 | 缺 18 |
| Exam Passage zh-en | 4 | 10 | 缺 6 |
| Exam Passage en-zh | 4 | 10 | 缺 6 |
| Full Practice | 2 sets | 2 | 达标 |

综合能力为 35 个可作答 item，而不是继续显示旧 295 道。Reading / Cloze 的正文对象与子题分别统计，不能相加后冒充独立篇章数。

内容注册表包含 427 个内容对象：94 published、333 rejected。Reading/Cloze 每篇作为一个生命周期对象，其题目继承该篇发布状态。2 套 Full Practice 是引用上述篇章的组卷对象，单独统计，不重复计入 94。

## 3. Difficulty Profile

实现位置：`src/features/content/difficultyProfile.js`、`contentDifficulty.js`。

- foundation：基本功或热身；允许低于二笔，不因篇幅或旧标签升级。
- catti-standard：具体语境中的词义、搭配、语域、复杂结构、推断和篇章逻辑；需六项可解释证据。
- catti-advanced：在标准档之上需要更密集的语义消歧、范围约束或跨段处理。此次没有为凑比例发布 advanced。

参考来源：[机构发布的英语笔译二级考试大纲条目](https://www.aticicg.org.cn/2023-12/25/content_42649423.html)。检索条目支持综合能力包含词汇语法、阅读、推理与释义等要求；本次正文抓取超时，不能声称核实了最新官方全部规则。具体长度门槛为本轮用户给定负荷所形成的 **CATTI Lab 内部设计**，不是官方单篇硬性要求。内容难度是 agent editorial review，不是官方认证或真实考生标定。

每个 standard 条目保存 lexicalComplexity / syntacticComplexity / inferenceDemand / discourseComplexity / domainKnowledge / translationChallenges。八篇考试篇章逐项说明特定词汇、条件、否定、指代和翻译风险，不再使用同一 generic hard 描述。

旧 difficultyLevel 仅为兼容字段；不能映射为合格新 tier。旧 approved 默认 draft，不自动进入发布池。

## 4. Difficulty distribution

内容对象：foundation 47，catti-standard 47，catti-advanced 0。  
综合能力可作答 item：foundation 3 / 35（8.6%），catti-standard 32 / 35（91.4%），catti-advanced 0。

**20% / 60% / 20% 未达标。** 当前不通过改标签凑比例。旧 Paragraph 已修复参考覆盖，但仍有共用的复盘/治理结尾，统一保守视为 foundation 篇章专项，不宣称考试级。

## 5. Lifecycle / review

`draft → validated → reviewed → published`，失败可进入 `rejected`。修改内容通过 reviseContent 增加版本、回到 draft，并清除审查记录。

执行 schema、length、difficulty、answer/reference、duplicate 检查后，仍须有编辑审查：
- markValidated 只接受通过校验的 draft。
- recordReview 需要当前内容指纹、版本、reviewer、说明及五项审查结果。
- publishContent 只接受 reviewed，重新校验并核对审查指纹。
- reviewManifest 是此次人工级逐项阅读后固定的 **agent 审查记录**；不是虚构的人类姓名。
- 修改原文、参考、答案、解析、证据、版本等会使指纹失效。构建和 QA 不自动更新 manifest。
- 指纹是本地编辑变化检测，不是抵御恶意发布者的密码学签名。

## 6. Seed 内容处理

### Sentence

保留最初各方向 10 句，核对为 foundation；拒绝后来 80 道只改领域/编号、参考遗漏领域的模板。另独立编写 20 道复杂句（每方向 10），覆盖公共预算、能源、科研、金融、平台、档案、生态、劳动与贸易等；每题提供完整参考和结构提示。稳定旧 ID 保留，不影响已有记录快照。

### Paragraph

保留原 24 篇的 ID / 训练级别并逐条检查：
- 修复 zh-en_003 末尾新增信息漏译。
- 补全 en-zh standard 的不同追加句、持续复核、清晰记录及问责段落。
- en-zh_001 / 002 替换不连贯的通用结尾，改为学校讨论及公共花园各自的完整专项文本。
- 修正不确定性语气及共同主人翁意识的译法。
- 36 篇模板扩展不进入正式池。
- 未扩展至 60 篇；旧标准段落仍有共享结尾，后续应独立重写，不能视作高难度内容增量。

### 综合能力

旧 80 Vocabulary、80 Grammar、15 Reading、6 Cloze 正文对象全部 rejected：
- 词义题脱离真实语境、重复或干扰项存在近义歧义。
- 语法题没有待填位置，统一答案与完整题干不对应。
- 阅读五类问题统一答案，指代与态度题无法成立。
- 完形正文没有实际空格，十个答案全部 evidence。

新增 10 词汇、10 语法、1 阅读、1 完形。词汇覆盖语域、归因、方法表象、暂定结论、责任授权、互证与混杂；语法覆盖反事实、逻辑主语、倒装、虚拟、关系结构、强调句等。解析逐项说明正确依据及干扰项。

Reading：329 words，5 类问题，推断/态度/论证类占 60%；平均句长 16.4 words，复杂句关键词启发式比例 55%。该比例不是语法解析器得出的权威分数。原句直接复制即可作答比例 0 为编辑判断，不代表自动证明；词汇复杂度保留具体解释，不制造数值。

Cloze：一篇连贯的河流修复评估材料，正文明确出现 (1)–(10) ___，覆盖归因、让步、对比、非谓语、搭配与纠错逻辑。

## 7. Exam Passage / Full Practice

| ID | 方向 | 主题 | 长度 |
|---|---|---|---:|
| exam_reviewed_zh_en_001 | zh-en | 城市防洪 | 287 字 |
| exam_reviewed_zh_en_002 | zh-en | 科研评价 | 289 字 |
| exam_reviewed_zh_en_003 | zh-en | 文化与旅游 | 295 字 |
| exam_reviewed_zh_en_004 | zh-en | 供应链 | 300 字 |
| exam_reviewed_en_zh_001 | en-zh | 公共能源投资 | 451 words |
| exam_reviewed_en_zh_002 | en-zh | 人工智能与采购 | 444 words |
| exam_reviewed_en_zh_003 | en-zh | 养老金沟通 | 454 words |
| exam_reviewed_en_zh_004 | en-zh | 农业育种与种子保存 | 451 words |

均为独立原创 simulated 材料，pending 来源核验，不是官方真题。中文约 300 字、英文约 450 words 是内部单篇训练负荷。

| Set | 中译英 | 英译汉 | 选材检查 |
|---|---:|---:|---|
| full_practice_reviewed_001 | 576 字 / 2 篇 | 895 words / 2 篇 | 防洪、科研、能源投资、AI采购；复杂条件与公共治理 |
| full_practice_reviewed_002 | 595 字 / 2 篇 | 905 words / 2 篇 | 文化、供应链、养老金、农业；分配风险与长期维护 |

每套 4 个独立且方向正确的 Exam Passage ID，无普通 Paragraph 拼装、无同篇重复。结构和内容可供抽查；完整模拟训练 workspace 仍未实现，入口明确 disabled，不冒充可练习。

## 8. Duplicate Detection

使用 Unicode normalization、文本 hash、四字符 shingles 的 Dice similarity、完全重复及相同选项序列检测。相似度阈值 0.8，另保留超过 45 字符的相似文本筛查；不再为测试通过而将阈值放宽到只认完全相同。

- Published：0 unresolved warnings。
- 所有候选：7,134 对警告，包含多个相同选项模式及模板配对，**不是 7,134 道题**。
- 全部逐对结果保留在 content-qa.json。
- 基础规则不能代替语义重复审查。Paragraph 共用结尾仍是明确已知问题。

## 9. Reference QA / Objective QA

发布池有 72 个翻译对象：40 Sentence + 24 Paragraph + 8 Exam Passage。执行源/目标语言、非空、非同文、模板摘要/省略占位、数字、重复参考、两个 reference 字段一致性检查，并逐段检查主要信息、限定和逻辑。自动校验不宣称能证明语义完整。

35 个客观题 item：检查四个唯一选项、答案在选项中、解析非空、子题 ID 唯一、篇章关联、阅读题型及空格对应。新增题目经过逐项语义阅读；实际难度和歧义仍需用户抽查，未冒称人类考官终审。

## 10. Rejected 与候选状态

333 rejected 内容对象：
- 80 旧 Sentence：模板换名词/编号、参考漏信息。
- 36 中断前新增 Paragraph：模板化扩充、跨语言领域未翻译/增译。
- 181 旧综合对象（80+80+15+6）：题干、选项、篇章、答案无法构成合格流程；其子题合计旧 295 item。
- 16 旧 Extended：共享模板、长度和参考不适合考试篇章。
- 20 中断前新增 Exam 模板：循环段落、增漏译、英文负荷不足。

旧 3 套 practiceSets 引用被拒绝 Extended，已标记 rejected；它们不是新的 2 套 Full Practice，也不计入内容对象注册表。

所有原始材料仍留在代码审计区，不删除用户训练记录、收藏或历史答案。

## 11. Published Pool / UI 兼容

publishedPool 提供 selectPublished、getPublishedContentPool、poolNeedsRefill。训练使用的 Sentence、Paragraph、Vocabulary、Grammar、Reading、Cloze 导出列表均经过状态、固定审查指纹与单项 QA 过滤。批量 QA 还检查整个发布池的 ID / 相似度冲突。

Hub 与题库数量由实际 published 导出计算：
- 综合能力按 Vocabulary / Grammar / Reading passages+questions / Cloze passages+blanks 分别显示。
- 翻译实务保留四级，每一级给出真实数量。
- Exam/Full 仍标注 workspace 未开放。
- 综合题目展示新 difficultyTier。
- 首页及视觉系统没有重做。

## 12. AI Generator Contract / validation pipeline

generateContent(request, {provider, pool})：
- request: contentType、direction、difficultyTier、topic、count、constraints。
- 7 类内容可请求，count 为 1–50 整数。
- 未提供 provider 时明确抛出 GENERATOR_DISABLED；本项目没有真实模型 provider、API key 或网络调用。
- 将来适配器可返回一批对象，但输出 ID 强制使用 类型+方向+UUID，状态强制 draft，清除伪造 reviewedBy / qualityReview。
- draft → schema → length → difficulty → reference/answer → duplicate → independent editorial review → published。
- 测试只注入本地内存 fixture，未调用付费 AI。
- Next 操作不会调用生成器。
- 没有后台持久 draft queue；当前是可测试的数据与接口层，将来由显式批量操作驱动，不是实时生成产品。

## 13. Tests / Build / Preview

- npm test：PASS。保留历史 schema / storage 兼容测试；增加类型/生命周期、空池与非 published 排除、篡改审查、摘要/同文/语言/数字、选项错误、子题结构、完形缺空、Exam 长度、Full Practice 四篇/方向/总长度、模板相似、重复 ID、生成器禁用及 UUID/draft 隔离等反例。
- npm run content:check：PASS **发布质量门槛**，同时输出 allQuantityTargetsMet=false。完整详细结果在 content-qa.json，逐项错误不会隐藏。
- npm run build：PASS。
- 本地服务器：http://127.0.0.1:5174/，HTTP 200。
- 浏览器实际点击/输入：NOT VERIFIED。本轮未声称浏览器端到端验收通过。

## 14. 完整 QA 与抽查材料

- [完整内容 QA JSON](./content-qa.json)：427 个对象逐项检查、状态、拒绝原因、相似配对、组卷长度、发布失败及数量缺口。
- [Published 原文、参考、题干与解析](./published-content-review.md)：94 个对象及两套模拟，方便不经过未开放 workspace 直接逐条抽查。
- reviewManifest：固定逐条 agent 审查指纹，修改后须重审；不是自动“合格证”。

## 15. 仍存在的问题

1. 大部分数量目标不足，详见首表；没有交付约 300 个合格综合题。
2. advanced 尚未发布，20/60/20 分布未达标。
3. 旧 Paragraph 仍有重复结尾/通用治理结构；此次以完整参考和基础专项身份保留，后续需提升独立内容质量。
4. 当前是 agent 编辑审查，未经过 CATTI 教师审校或考生难度标定；词汇复杂度无可靠量化语料标准。
5. 基础相似度不覆盖语义改写、复杂答案歧义，不能替代审查。
6. Exam / Full 内容与结构有了，训练工作区尚未开放。
7. Generator 尚无模型适配器/持久审核队列，是本轮有意保留的架构边界。

## 16. 人工抽查 Checklist

- [ ] 对比 Sentence 中两个方向新长句的条件、否定、指代，参考是否完整。
- [ ] 抽 Paragraph en-zh_003/004/009，核对末段不再漏译；检查短篇 001/002 自然连贯。
- [ ] 对照八篇 Exam 原文/参考，检查每段事实、限定、术语与语气。
- [ ] 检查两套 Full Practice 题材组合和四篇负荷是否适合目标用户。
- [ ] 对词汇/语法的四项选择尝试反驳标准答案；争议项应退回 draft/rejected。
- [ ] 阅读五题分别能否由文章论证支持，指代及态度是否成立。
- [ ] 完形十空逐一填回全文，确认每个最佳答案及跨句关系。
- [ ] 从 Hub/题库检查实际数量，不再把旧模板全部计入。
- [ ] 确认缩量发布和难度分布缺口，不把 QA 命令通过误当数量达标。
- [ ] 人工检查浏览器训练、下一题、记录联动；本轮尚未做浏览器自动化。

## 17. 修改文件 / 新增文件

完整文件清单附后，由最终 git diff 相对 checkpoint 生成；dist 为构建产物，不是手工改 UI。


### 修改 / 构建替换

- dist/assets/index-BxmcNA4x.js
- dist/index.html
- package.json
- scripts-content-audit.mjs
- src/features/comprehensive/comprehensiveDataset.js
- src/features/content/aiContentSpec.js
- src/features/content/contentAudit.js
- src/features/content/contentDifficulty.js
- src/features/content/contentRegistry.js
- src/features/exercises/exerciseSchema.js
- src/features/exercises/sentenceDataset.js
- src/features/questionBank/paragraphDataset.js
- src/features/translation/extendedDataset.js
- src/features/translation/practiceSets.js
- src/pages/ComprehensiveTraining/ComprehensiveTrainingPage.jsx
- src/pages/QuestionBank/QuestionBankPage.jsx
- src/pages/TrainingHub/ComprehensiveHubPage.jsx
- src/pages/TrainingHub/TranslationHubPage.jsx
- tests/coreContracts.mjs

### 新增

- dist/assets/index-CErA2GuO.js
- docs/round-b/Round-B-Report.md
- docs/round-b/content-qa.json
- docs/round-b/published-content-review.md
- scripts-content-check.mjs
- src/features/comprehensive/legacyComprehensive.js
- src/features/comprehensive/reviewedSeeds.js
- src/features/content/contentValidation.js
- src/features/content/difficultyProfile.js
- src/features/content/publishedPool.js
- src/features/content/reviewManifest.js
- src/features/content/seedReview.js
- src/features/exercises/reviewedSentenceSeeds.js
- src/features/questionBank/paragraphExpansion.js
- src/features/questionBank/shortParagraphRepairs.js
- src/features/translation/additionalExamEn.js
- src/features/translation/examEvidence.js
- src/features/translation/examPassageDataset.js
- src/features/translation/fullPracticeSets.js
- src/features/translation/rejectedExamTemplates.js
- src/features/translation/reviewedExamSeeds.js
- tests/contentEngine.mjs
