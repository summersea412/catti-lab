export const EXAM_LEVELS = ['CATTI-2'];
export const PAPER_TYPES = ['comprehensive','practice'];
export const SECTION_TYPES = ['comprehensive-ability','translation-practice'];
export const QUESTION_TYPES = ['vocabulary','grammar','reading','cloze'];
export const EXAM_MODULES = [
  {id:'comprehensive',label:'笔译综合能力',description:'词汇、语法、阅读与语言运用专项训练',paperType:'comprehensive',sectionType:'comprehensive-ability'},
  {id:'practical',label:'笔译实务',description:'句子、段落与未来的完整篇章翻译训练',paperType:'practice',sectionType:'translation-practice'}
];
export function validateExamExercise(x={}) { return Boolean(x.id && EXAM_LEVELS.includes(x.examLevel) && PAPER_TYPES.includes(x.paperType) && SECTION_TYPES.includes(x.sectionType) && QUESTION_TYPES.includes(x.questionType) && ['zh-en','en-zh'].includes(x.direction) && Array.isArray(x.options) && x.options.length >= 2 && x.answer && x.sourceType === 'practice' && x.verificationStatus === 'pending'); }
