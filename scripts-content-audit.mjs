import {contentAudit} from './src/features/content/contentAudit.js';
const a=contentAudit();console.log(JSON.stringify({counts:a.counts,difficulty:a.difficultyDistribution,contentStatus:a.contentStatusDistribution,publishedFailures:a.publishedFailures,duplicatePairs:a.duplicateDetection.allCandidates.length},null,2));

