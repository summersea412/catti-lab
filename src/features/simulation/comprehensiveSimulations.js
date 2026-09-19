import {VOCABULARY_EXERCISES,GRAMMAR_EXERCISES,READING_PASSAGES,CLOZE_PASSAGES} from '../comprehensive/comprehensiveDataset.js';
import {SIM_OBJECTIVES,SIM_READINGS,SIM_CLOZES} from './simulationContent.js';
const sections=(v,g,r,c)=>[{id:'vocabulary',title:'词汇',items:v},{id:'grammar',title:'语法',items:g},{id:'reading',title:'阅读理解',items:r},{id:'cloze',title:'完形 / 语言运用',items:c}];
export const COMPREHENSIVE_SIMULATIONS=[
 {id:'comp_sim_001',title:'综合能力整套模拟 1 · 公共政策与证据',sections:sections(VOCABULARY_EXERCISES,GRAMMAR_EXERCISES,READING_PASSAGES,CLOZE_PASSAGES)},
 ...[0,1].map(i=>({id:`comp_sim_00${i+2}`,title:`综合能力整套模拟 ${i+2} · ${i?'制度、交通与文化':'艺术、科学与判断'}`,sections:sections(SIM_OBJECTIVES.slice(i*20,i*20+10),SIM_OBJECTIVES.slice(i*20+10,i*20+20),[SIM_READINGS[i]],[SIM_CLOZES[i]])}))
].map(s=>({...s,sourceType:'simulated',estimatedMinutes:120,sharedPool:false,model:'CATTI Lab 当前训练模型：10词汇、10语法、5阅读题、10完形空；非官方题量复刻。'}));
