export const EXERCISE_TYPES = ['sentence','paragraph','comprehensive','past-paper'];
export const DIRECTIONS = ['zh-en','en-zh'];
export const SOURCE_TYPES = ['practice','past-paper'];
export const VERIFICATION_STATUSES = ['pending','questionable','verified'];

export function normalizeExercise(input = {}) {
  const sourceType = input.sourceType ?? 'practice';
  return {
    id: input.id ?? null,
    type: input.type ?? 'sentence',
    direction: input.direction ?? null,
    sourceText: input.sourceText ?? '',
    referenceAnswer: input.referenceAnswer ?? input.referenceTranslation ?? '',
    topic: input.topic ?? null,
    difficulty: input.difficulty ?? null,
    sourceType,
    source: input.source ?? null,
    year: input.year ?? null,
    session: input.session ?? null,
    verificationStatus: input.verificationStatus ?? (sourceType === 'practice' ? 'pending' : null),
    hints: Array.isArray(input.hints) ? input.hints : [],
    estimatedMinutes: input.estimatedMinutes ?? null,
    paperId: input.paperId ?? null,
    datasetVersion: input.datasetVersion ?? 1,
  };
}

export function validateExercise(exercise) {
  return Boolean(exercise?.id && EXERCISE_TYPES.includes(exercise.type) && DIRECTIONS.includes(exercise.direction) && exercise.sourceText.trim() && exercise.referenceAnswer.trim() && SOURCE_TYPES.includes(exercise.sourceType) && (exercise.verificationStatus === null || VERIFICATION_STATUSES.includes(exercise.verificationStatus)));
}
