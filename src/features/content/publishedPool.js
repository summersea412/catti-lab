import {getContentRegistry} from './contentAudit.js';
import {checkContent,reviewValid} from './contentValidation.js';
export function selectPublished(items){const candidates=items.filter(x=>x.contentStatus==='published');return candidates.filter(x=>reviewValid(x)&&checkContent(x,candidates.filter(y=>y.id!==x.id)).valid)}
export const getPublishedContentPool=()=>selectPublished(getContentRegistry().items);
export function poolNeedsRefill(items,thresholds={sentence:100,paragraph:60,'exam-passage':20,vocabulary:80,grammar:80,reading:15,cloze:6}){const p=selectPublished(items);return Object.entries(thresholds).map(([type,target])=>({type,target,published:p.filter(x=>x.contentType===type).length})).filter(x=>x.published<x.target)}

