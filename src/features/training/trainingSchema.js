export const TRAINING_SESSION_VERSION = 1;
export function normalizeTrainingSession(s = {}) {
  return { id:s.id??null, exerciseId:s.exerciseId??null, exerciseType:s.exerciseType??s.type??null, direction:s.direction??null, sourceText:s.sourceText??s.source??null, userAnswer:s.userAnswer??s.answer??null, referenceAnswer:s.referenceAnswer??s.reference??null, topic:s.topic??null, startedAt:s.startedAt??null, submittedAt:s.submittedAt??s.createdAt??null, durationMs:s.durationMs==null?null:Number(s.durationMs), status:s.status??null, hintsUsed:s.hintsUsed==null?null:Number(s.hintsUsed), referenceViewed:s.referenceViewed==null?null:Boolean(s.referenceViewed), sourceType:s.sourceType??null, source:s.source??null, year:s.year??null, paperId:s.paperId??null, datasetVersion:s.datasetVersion??null, examLevel:s.examLevel??null, paperType:s.paperType??null, sectionType:s.sectionType??null, questionType:s.questionType??null, trainingMode:s.trainingMode??null, schemaVersion:s.schemaVersion??TRAINING_SESSION_VERSION, createdAt:s.createdAt??s.submittedAt??null };
}
export const calculateDurationMs=(startedAt,submittedAt)=>{const a=Date.parse(startedAt),b=Date.parse(submittedAt);return Number.isFinite(a)&&Number.isFinite(b)?Math.max(0,b-a):null};


