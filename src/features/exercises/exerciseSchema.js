export const EXERCISE_TYPES = ['sentence','paragraph','comprehensive','past-paper'];
export const DIRECTIONS = ['zh-en','en-zh'];
export const SOURCE_TYPES = ['practice','past-paper'];
export const PAPER_TYPES = ['comprehensive','practice'];
export const SECTION_TYPES = ['comprehensive-ability','translation-practice'];
export const QUESTION_TYPES = ['sentence','paragraph','vocabulary','grammar','reading','cloze'];
export const VERIFICATION_STATUSES = ['pending','questionable','verified'];
export function normalizeExercise(input = {}) {
  const sourceType = input.sourceType ?? 'practice';
  return {id:input.id??null,type:input.type??'sentence',direction:input.direction??null,sourceText:input.sourceText??'',referenceAnswer:input.referenceAnswer??input.referenceTranslation??'',topic:input.topic??null,difficulty:input.difficulty??null,sourceType,source:input.source??null,year:input.year??null,session:input.session??null,verificationStatus:input.verificationStatus??(sourceType==='practice'?'pending':null),hints:Array.isArray(input.hints)?input.hints:[],estimatedMinutes:input.estimatedMinutes??null,paperId:input.paperId??null,datasetVersion:input.datasetVersion??1,examLevel:input.examLevel??null,paperType:input.paperType??null,sectionType:input.sectionType??null,questionType:input.questionType??null,options:Array.isArray(input.options)?input.options:[],answer:input.answer??null,explanation:input.explanation??null,difficultyLevel:input.difficultyLevel??null,difficultyReason:input.difficultyReason??null,skillTags:Array.isArray(input.skillTags)?input.skillTags:[],reviewStatus:input.reviewStatus??null,contentVersion:input.contentVersion??null};
}
export function validateExercise(exercise) { return Boolean(exercise?.id && EXERCISE_TYPES.includes(exercise.type) && DIRECTIONS.includes(exercise.direction) && exercise.sourceText.trim() && exercise.referenceAnswer.trim() && SOURCE_TYPES.includes(exercise.sourceType) && (exercise.verificationStatus===null || VERIFICATION_STATUSES.includes(exercise.verificationStatus))); }

