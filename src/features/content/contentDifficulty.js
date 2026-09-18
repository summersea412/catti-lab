export const DIFFICULTY_LEVELS=['foundation','transition','catti2','catti2_plus'];
export const REVIEW_STATUSES=['draft','reviewed','approved','rejected'];
export function difficultyForIndex(index,total){const ratio=index/Math.max(total,1);return ratio<.08?'foundation':ratio<.28?'transition':ratio<.85?'catti2':'catti2_plus'}
export function validateContentMetadata(x={}){return DIFFICULTY_LEVELS.includes(x.difficultyLevel)&&REVIEW_STATUSES.includes(x.reviewStatus)&&Array.isArray(x.skillTags)&&x.difficultyReason?.length>10&&x.contentVersion}

