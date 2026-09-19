# CATTI Lab V2 — Training Experience & Difficulty Rebuild Report

工作目录：D:\catti-study-assistant-v2。未 Git commit；未接 AI、未开启 Desktop Pet、未联网搜索真题、未改首页视觉。浏览器测试使用独立临时上下文，原有用户数据未清理。

| 序号 | 项目 | 结果 |
| --- | --- | --- |
| 1 | Reading 双栏 | PASS：桌面原文/题目独立滚动；逐题反馈和正确率；390px 单栏切换。 |
| 2 | Cloze 双栏 | PASS：十空作答、点击空号定位原文、逐空反馈；390px 无横向溢出。 |
| 3 | Back Navigation | PASS：20 个非首页路由逐一点击返回；详情返回记录；翻译草稿自动保存。 |
| 4 | Timer | 专项进入题目开始；Hub/题库/套卷列表不计时。暂停、恢复、超时继续；实务180min，综合120min。各题时长分摊，不重复累加整套时长。 |
| 5 | Sentence 数量 | 12（双向各6） |
| 6 | Sentence 难度 | Foundation 0 / Standard 8 / Advanced 4；中文87–97字，英文61–65 words；建议12min。 |
| 7 | Paragraph 数量 | 8（双向各4） |
| 8 | Paragraph 长度 | 中文 296–308 Han 字；英文 270–285 words；建议32min。 |
| 9 | Paragraph 难度 | Foundation 0 / Standard 6 / Advanced 2 |
| 10 | Exam Passage 数量 | 20（双向各10） |
| 11 | Exam Passage 长度 | 中文 287–317 Han 字；英文 439–459 words；建议45min。 |
| 12 | Exam Benchmark | 12篇 WITHIN、8篇 ABOVE（编辑判断）。每篇保存十维 evidence、比较锚点和完整译文；不宣称考官认证。 |
| 13 | 旧题替换 | 64条退出当前池：40句子、24段落；以12句子、8独立段落替代原池，不是一对一扩量。 |
| 14 | 旧题升级 | 0条原地升级。旧8篇考试级材料保持标准档，补充十维比较依据；新增12篇考试级材料。 |
| 15 | deprecated | 本轮64条；保留旧ID与内容，不删除或重写用户历史snapshot。此前已隔离模板不计入本轮64条。 |
| 16 | Benchmark Set | 6篇已恢复公开稿：2022年3篇为主，2018年3篇辅助；双向各3；记录来源URL、边界置信说明、句长统计和十维人工级编辑审读。 |
| 17 | 实务整套数量 | 5套：3 Standard、2 Advanced；各2中译英+2英译汉。 |
| 18 | 每套中文实际字数 | 1: 576；2: 595；3: 607；4: 609；5: 627 |
| 19 | 每套英文实际词数 | 1: 895；2: 905；3: 893；4: 882；5: 901 |
| 20 | 综合能力套数 | 3套，跨卷题目不重复；各10词汇+10语法+5阅读题+10完形空，共35题，120min。明确为 CATTI Lab 训练模型，不声称官方题量复刻。 |
| 21 | Past Paper 一致性 | PASS：数据层/界面/可练入口均39（37实务、2综合）；25个篇目位置仅索引，仍无正文。统计来自同一repository，不代表39条均已核验边界和去重。 |
| 22 | Coming Soon / disabled | 现有四级翻译入口及两类套卷均开放。表达库 NEW 仍明确即将开放；无正文索引禁用训练；题首/题尾、空答案、未答完、已提交为真实状态禁用。无内容可练却显示Coming Soon的入口。 |
| 23 | 9个真实浏览器流程 | 全部PASS，详见下表及 browser-qa.json；另20路由返回、超时继续、跨题snapshot、390px检查PASS。 |
| 24 | npm test | PASS（含新增冻结规格、套卷非重复、旧snapshot和SSOT合同测试）。 |
| 25 | npm run content:check | PASS；结构/完整引用/固定审查指纹/去重/套卷长度检查通过，不等同于语义机器认证。 |
| 26 | npm run build | PASS；现有单包体积提示仍在，未为消除提示擅自重构。 |
| 27 | Browser runtime errors | 0（隔离浏览器上下文中真实点击测试，不写入用户的学习数据）。 |
| 28 | 仍未完成能力 | AI批改、官方原卷认证、考生实测难度标定均未做。综合卷采用35题当前模型，未扩成官方题量。旧PDF资料仍有页眉/题源文章/归属或边界待进一步核验；本轮未扩展真题清理。 |

## 整套实务实际负荷

| 套卷 | 难度 | 中文Han字 | 英文words | 计时 | 校验 |
| --- | --- | --- | --- | --- | --- |
| 1 | catti-standard | 576 | 895 | 180 min | PASS |
| 2 | catti-standard | 595 | 905 | 180 min | PASS |
| 3 | catti-standard | 607 | 893 | 180 min | PASS |
| 4 | catti-advanced | 609 | 882 | 180 min | PASS |
| 5 | catti-advanced | 627 | 901 | 180 min | PASS |

## 真实浏览器流程

| Flow | 验证路径 | 结果 |
| --- | --- | --- |
| 1 | 首页→翻译实务→句子→输入/提示/参考→提交→返回 | PASS |
| 2 | 段落→输入→返回→草稿恢复→提交及记录 | PASS |
| 3 | 考试级单篇→输入→暂停/继续→提交→记录详情 | PASS |
| 4 | 2021.06 PDF恢复真题→输入→提交→返回真题 | PASS |
| 5 | 语法故意选错→错误反馈/我的答案/正确答案/解析→返回 | PASS |
| 6 | Reading双栏→5题→提交→5/5及100%→返回 | PASS |
| 7 | Cloze双栏→空号定位→10空→提交→逐空结果 | PASS |
| 8 | 实务套卷→4篇独立输入→切换→返回恢复→180min→提交4条snapshot | PASS |
| 9 | 综合套卷→四节作答与保存→120min→完成→刷新恢复状态 | PASS |

## 审计证据

- Content Review.md：72条旧有效内容逐题处理与32篇新稿双语审读重点。
- content-review.json：完整benchmark原文、来源和十维证据；逐题新旧审计。
- browser-qa.json：九条端到端结果与刷新保存。
- navigation-qa.json：20路由返回及39个真题入口的实际数量比较。
- timer-qa.json：超时不强制提交、下一题计时与不同题目快照。
- reading-desktop.png、cloze-mobile.png：已查看的视觉验证截图。

数据数量缩减是主动移除模板内容的结果，不用占位题补足旧数量。Standard/Advanced是依据公开材料逐篇比较的内部编辑分档，后续仍需用户和专业译者验收。

预览：http://127.0.0.1:5174/
