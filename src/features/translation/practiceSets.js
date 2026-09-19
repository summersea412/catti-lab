import {EXTENDED_EXERCISES} from './extendedDataset.js';
const makeSet=(i)=>({id:`catti_practice_set_${String(i).padStart(3,'0')}`,title:`CATTI Practice Set ${i}`,examLevel:'CATTI-2',sourceType:'practice',verificationStatus:'pending',reviewStatus:'rejected',contentStatus:'rejected',estimatedMinutes:180,datasetVersion:1,directions:{'en-zh':EXTENDED_EXERCISES.filter(x=>x.direction==='en-zh').slice((i-1)*2,(i-1)*2+2).map(x=>x.id),'zh-en':EXTENDED_EXERCISES.filter(x=>x.direction==='zh-en').slice((i-1)*2,(i-1)*2+2).map(x=>x.id)}});
export const CATTI_PRACTICE_SETS=[1,2,3].map(makeSet);
