import {DIFFICULTY_TIERS} from './contentDifficulty.js';
export const CATTI_DIFFICULTY_PROFILE={
 version:2,
 benchmark:{title:'已恢复 CATTI 二级笔译公开整理材料',basis:'translationBenchmark.js 中 6 篇：2022 年主体 3 篇，2018 年辅助 3 篇；逐篇十维编辑对照。',limitations:'来源为公开整理，未认证官方考试边界；难度尚未经考生标定。详见 docs/training-rebuild/Content Review.md。'},
 tiers:{
 foundation:'可低于考试负荷；用于基本功。不可因排序或 legacy hard 标签升级。',
 'catti-standard':'具体语境中的近义、语域与复杂结构；篇章推断、衔接及完整细节；翻译题需十维证据和独立双语审查。',
 'catti-advanced':'需在标准档基础上增加真实语义歧义消解、密集跨段约束或多层范围处理，不以单纯篇幅/生词数升级。保留具体比较依据，不能只靠长度定档。'
 },
 translationLevels:['sentence','paragraph','exam-passage','full-practice'],
 sentenceRanges:{'zh-en':[60,120],'en-zh':[60,120]},
 paragraphRanges:{'zh-en':[250,400],'en-zh':[250,400]},
 suggestedMinutes:{sentence:[8,15],paragraph:[25,40],'exam-passage':[40,55],'full-practice':180,comprehensiveSimulation:120},
 examPassageRanges:{'zh-en':[280,350],'en-zh':[400,500]},
 fullPracticeRanges:{'zh-en':[550,650],'en-zh':[850,950]},
 rangeNote:'以上为 CATTI Lab 内部训练范围，单篇约 300 字/450 words；不是官方单篇硬性规定。',
 comprehensiveTarget:{foundation:.2,'catti-standard':.6,'catti-advanced':.2},
 publicationRules:['six distinct content-specific evidence fields for non-foundation','source/reference editorial coverage','one best answer with distractor explanation','no unresolved duplicate warnings','fixed content fingerprint review manifest','no automatic promotion of legacy approved'],
 supportedTiers:DIFFICULTY_TIERS
};

