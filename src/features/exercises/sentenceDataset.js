import { normalizeExercise } from './exerciseSchema.js';

export const SENTENCE_EXERCISES = [
  normalizeExercise({ id:'sentence_practice_001', type:'sentence', direction:'zh-en', topic:'社会发展', sourceText:'城市更新不只是建筑空间的变化，也关乎人们如何在熟悉的地方继续生活。', referenceAnswer:'Urban renewal is not merely a change in architectural space; it is also about how people continue to live in familiar places.', hints:['使用 not merely…but also…表达并列关系。'], estimatedMinutes:3 }),
  normalizeExercise({ id:'sentence_practice_002', type:'sentence', direction:'en-zh', topic:'文化交流', sourceText:'Every careful translation begins with attention to the context.', referenceAnswer:'每一次严谨的翻译都始于对语境的关注。', hints:['注意 begin with 的搭配。'], estimatedMinutes:2 }),
];
