import {contentAudit} from './src/features/content/contentAudit.js';
const a=contentAudit();console.log(JSON.stringify({counts:a.counts,difficulty:a.difficulty,topics:a.topics,reviewStatus:a.reviewStatus,duplicates:a.duplicates},null,2));

