import fs from 'node:fs';
import {contentAudit} from './src/features/content/contentAudit.js';
const report=contentAudit();
fs.mkdirSync('docs/round-b',{recursive:true});
fs.writeFileSync('docs/round-b/content-qa.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,checks:undefined,rejected:{count:report.rejected.length,details:'docs/round-b/content-qa.json'},unpublished:{count:report.unpublished.length,details:'docs/round-b/content-qa.json'},duplicateDetection:{published:report.duplicateDetection.published,allCandidatePairs:report.duplicateDetection.allCandidates.length,details:'docs/round-b/content-qa.json'}},null,2));
console.log('Full per-item report: docs/round-b/content-qa.json; semantic review is documented separately, not inferred from length.');
if(!report.valid)process.exitCode=1;

