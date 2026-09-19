# CATTI Lab V2 — Training Workspace UX Consolidation Report

本轮仅收敛导航、训练工作区、计时与真题可见性；新增 8 篇独立难度校准样本。未接 AI、未搜索新真题、未开启或修改 Desktop Pet、未重新设计首页、未批量替换翻译题库、未 Git commit。

| # | 项目 | 结果 / 实现 |
|---|---|---|
|1|Breadcrumb 页面覆盖|首页无面包屑；训练、翻译实务、综合能力、整套模拟、题库、分析、表达、积累、记录、设置使用轻量层级。题库单篇最多 4 层，记录展开为学习 › 学习记录 › 训练详情；祖先可点、当前项不可点。|
|2|Focus Back Navigation|Sentence、Paragraph、Exam、实务整套、综合整套、词汇、语法、Reading、Cloze、真题单篇使用箭头 + 简化层级。返回列表保留题库筛选；段落草稿恢复。|
|3|Paragraph Split Workspace|桌面左右原文 / 编辑，独立滚动；390px 上下布局；保存草稿、提交为主要动作，参考保留次级 Tab。|
|4|Exam Passage Split Workspace|桌面双栏，明确 45 min 为 CATTI Lab 单篇建议，非官方单篇时限。|
|5|Past Paper Split Workspace|PDF 恢复原文与译文编辑分栏；缺参考仍可提交，保存历史后返回题库。|
|6|Reading Split Workspace|左原文右题目，各自滚动；选择答案才启动计时。|
|7|Cloze Split Workspace|左全文、右各空选项；点击 Blank 定位并高亮，单纯点击定位不启动计时；手机切换原文 / 题目。|
|8|Timer state model|未开始 → 运行 ↔ 暂停 → 已结束。建议时长、实际活跃时长、目标剩余、超时分开。离开训练自动暂停，恢复草稿后需继续计时。|
|9|Timer start trigger|首次真实输入 / 选答案为 first-input；手动开始为 manual；恢复草稿不冒充新输入。轻量开始反馈。|
|10|Overtime|达到建议时间不中断作答，实际时间继续累计；超时 = max(active − recommended, 0)。浏览器用隔离存储的超时状态测试，不伪称等待了 45 分钟。|
|11|TrainingSession timer fields|保存 recommendedDurationMs、activeDurationMs、elapsedDurationMs、overtimeMs、timerStartedAt、timerStartTrigger、pauseDurationMs、submittedAt。Analysis 优先 active，旧记录 fallback duration；不修改旧记录。实务四篇共用 180 min，逐篇活跃时间之和等于整套时间；综合篇/整套按题分摊，避免重复计时。|
|12|真题 data trainable 数量|37 篇实务 + 2 道综合 = 39 项。|
|13|真题 UI 可见 trainable 数量|浏览器实际数到默认 39 个可训练条目，其中 37 篇实务；无 disabled 待补项混入默认列表。|
|14|Registry-only 数量|17 个已定位但无正文篇目；53 个无可练正文科目索引；34 个无正文普通场次 + 1 个样题索引。它们是不同口径，不可相加。全部资料计数 56 指 39 正文项 + 17 空篇目，不是全部科目索引数。|
|15|整套模拟命名|首页入口文字、训练入口、侧栏/路由名、模拟选择页和题库入口统一为“整套模拟”；首页仅文字替换，没有布局重设计。src 中不再有“模拟训练”展示文案。|
|16|8 篇 Calibration Batch|中英两个方向 × Paragraph / Exam × 每类 2 篇，共 8 篇，全部独立存放、未发布进训练池。完整原文与参考见 Calibration-Batch.md 及本地盲评页。|
|17|每篇 Benchmark comparison|每篇对照 3 篇同方向既有 CATTI 公开恢复材料，逐篇说明术语、句法、逻辑与语篇挑战。编辑提案均 MATCH；人工 Difficulty Acceptance 仍 PENDING。|
|18|npm test|PASS，含新增计时、分摊、37 篇可见映射和 8 篇隔离校准契约测试。|
|19|content:check|PASS：已发布池校验无失败。旧总体数量目标仍有缺口，allQuantityTargetsMet=false；本轮遵守禁止扩充，不把“校验通过”说成内容建设完成。|
|20|build|PASS；保留既有单包体积警告（约 773 kB），没有趁此做拆包重构。|
|21|Browser QA|PASS：Paragraph 输入/自动计时/暂停/返回/草稿；Exam 手动与超时；PDF 真题提交返回；Reading、Cloze、Breadcrumb、Focus、390px；整套共享计时与刷新持久化。测试使用隔离浏览器，不清空或写入用户现有记录。|
|22|runtime errors|0，浏览器 Runtime.exceptionThrown 监听结果。|

## Calibration Batch

|样本|类型|方向|长度|编辑比较|人工验收|
|---|---|---|---|---|---|
|古籍中的沉默与史家推断|Paragraph|zh-en|292 字|MATCH|待验|
|资产估值与转型承诺|Paragraph|zh-en|303 字|MATCH|待验|
|地图上的边界与地面的生活|Paragraph|en-zh|274 words|MATCH|待验|
|文学批评中的“普遍性”|Paragraph|en-zh|267 words|MATCH|待验|
|译本、读者与世界文学|Exam Passage|zh-en|306 字|MATCH|待验|
|科研基础设施与知识共享|Exam Passage|zh-en|308 字|MATCH|待验|
|保险合同与无法预见的风险|Exam Passage|en-zh|430 words|MATCH|待验|
|博物学标本与知识的署名|Exam Passage|en-zh|435 words|MATCH|待验|

长度范围保持用户冻结规格。8 篇 Length Gate 均通过；难度不由长度推出。
中文样本均比较：2022.11 职业教育、2018.05 丝绸之路、2018.05 碳汇。
英文样本均比较：2022.11 劳动力、2022.11 疫情与运输、2018.05 柬埔寨旅游与教育。
这些是公开恢复文本，未宣称官方原卷边界已经认证。每一组以 A–D 混合全文展示，先作答/比较再展开身份、参考与编辑理由；顺序固定便于重复审查，未谎称进行过独立受试者盲测。

## 真题映射与剩余边界

逐场清单见 Registry-Mapping.md / registry-mapping-audit.json。14 条 PDF 恢复元数据修正为既有场次，连接 8 个主题和方向对应的空位置。保留原始导入 ID 与文件，不改历史快照。
2018.11 部分英译汉资料的编号相同而主题不符，不用另一篇的正文覆盖“手机依恋”“贸易保护”位置。公开版本差异保留。37 是当前可训练材料对象数，不能据此宣称恢复了 37 个经官方认证的独立 Passage。

## 验收入口与证据

- 主站：http://127.0.0.1:5174/
- 独立校准盲评：http://127.0.0.1:5174/calibration/index.html
- 样本与 24 条逐篇对比理由：Calibration-Batch.md
- 浏览器记录：browser-qa.json / browser-extended.json
- 视觉截图：paragraph-desktop.png / paragraph-mobile.png
- 自动测试：tests/workspaceConsolidation.mjs、tests/workspaceConsolidation.browser.mjs、tests/workspaceExtended.browser.mjs

技术 PASS 不等于人工难度 PASS。本轮停止；只有收到明确“难度校准通过”，才进入下一轮题库扩展。
