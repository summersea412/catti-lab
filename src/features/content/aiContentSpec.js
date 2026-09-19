import {DIFFICULTY_TIERS} from './contentDifficulty.js';
import {validateGeneratedContent} from './contentValidation.js';
export const GENERATABLE_TYPES=['sentence','paragraph','exam-passage','vocabulary','grammar','reading','cloze'];
export const AI_CONTENT_GENERATION_SPEC={version:2,requestFields:['contentType','direction','difficultyTier','topic','count','constraints'],statuses:['draft','validated','reviewed','published'],strategy:'offline batch -> QA -> editorial review -> content pool; never generate on Next'};
export function validateGenerationRequest(r={}){return GENERATABLE_TYPES.includes(r.contentType)&&['zh-en','en-zh'].includes(r.direction)&&DIFFICULTY_TIERS.includes(r.difficultyTier)&&typeof r.topic==='string'&&r.topic.trim().length>0&&Number.isInteger(r.count)&&r.count>0&&r.count<=50&&r.constraints&&typeof r.constraints==='object'&&!Array.isArray(r.constraints)}
export async function generateContent(request,{provider,pool=[]}={}){
 if(!validateGenerationRequest(request))throw new Error('Invalid generation request');
 if(!provider)throw new Error('GENERATOR_DISABLED: Round B has no model provider or network implementation');
 if(typeof provider.generate!=='function'||!provider.name)throw new Error('Provider contract invalid');
 const raw=await provider.generate(structuredClone(request));
 if(!Array.isArray(raw)||raw.length!==request.count)throw new Error('Provider count mismatch');
 const items=raw.map(x=>({...x,id:request.contentType+'_'+request.direction+'_'+crypto.randomUUID(),contentType:request.contentType,direction:request.direction,difficultyTier:request.difficultyTier,topic:request.topic,contentStatus:'draft',sourceType:'practice',source:'Generated practice; not official CATTI content',verificationStatus:'pending',contentVersion:1,generatedBy:provider.name,reviewedBy:null,qualityReview:null}));
 return {items,validation:items.map(x=>({id:x.id,...validateGeneratedContent(x,[...pool,...items.filter(y=>y.id!==x.id)])})),published:false};
}

