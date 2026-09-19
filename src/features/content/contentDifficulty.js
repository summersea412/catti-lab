export const DIFFICULTY_TIERS=['foundation','catti-standard','catti-advanced'];
export const CONTENT_STATUSES=['draft','validated','reviewed','published','rejected'];
export const DIFFICULTY_LEVELS=['foundation','transition','catti2','catti2_plus'];
export const REVIEW_STATUSES=['draft','reviewed','approved','rejected'];
export const EVIDENCE_FIELDS=['lexicalComplexity','syntacticComplexity','inferenceDemand','discourseComplexity','domainKnowledge','translationChallenges'];
// Legacy labels and array positions are not evidence of CATTI difficulty.
export const toDifficultyTier=value=>DIFFICULTY_TIERS.includes(value)?value:null;
export const toContentStatus=item=>CONTENT_STATUSES.includes(item?.contentStatus)?item.contentStatus:'draft';
export const difficultyForIndex=()=> 'foundation';
export function validateDifficultyEvidence(e={}) {return EVIDENCE_FIELDS.every(k=>typeof e?.[k]==='string'&&e[k].trim().length>=12)&&new Set(EVIDENCE_FIELDS.map(k=>e[k])).size===6}
export function validateContentMetadata(x={}) {return Boolean(DIFFICULTY_TIERS.includes(x.difficultyTier)&&CONTENT_STATUSES.includes(x.contentStatus)&&x.id&&x.contentVersion&&x.source&&x.generatedBy&&(x.difficultyTier==='foundation'||validateDifficultyEvidence(x.difficultyEvidence)))}


export const TRANSLATION_EVIDENCE_FIELDS=['lexicalComplexity','syntacticComplexity','informationDensity','discourseComplexity','crossSentenceReference','logicalRelations','domainKnowledge','register','transformationDemand','mistranslationRisk'];
