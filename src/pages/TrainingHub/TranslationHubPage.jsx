import React from 'react';
import {SENTENCE_EXERCISES} from '../../features/exercises/sentenceDataset';
import {PARAGRAPH_EXERCISES} from '../../features/questionBank/paragraphDataset';
import {EXAM_PASSAGES} from '../../features/translation/examPassageDataset';
import {FULL_PRACTICE_SETS} from '../../features/translation/fullPracticeSets';
const go=id=>window.dispatchEvent(new CustomEvent('catti:navigate',{detail:id}));
export default function TranslationHubPage(){
const items=[
['Sentence',SENTENCE_EXERCISES.length+' exercises · 句子与长难句基本功','sentence'],
['Paragraph',PARAGRAPH_EXERCISES.length+' exercises · 篇章专项训练','paragraph'],
['Exam Passage',EXAM_PASSAGES.length+' passages · 单篇考试级训练','exam-passage'],
['Full Practice',FULL_PRACTICE_SETS.length+' sets · CATTI Lab 整套模拟 · 180 min','full-practice']];
return <div className="page-hero"><div><p className="eyebrow">TRANSLATION PRACTICE</p><h2>翻译实务</h2><p>CATTI Lab 专项训练设计，不等同于官方独立题型。</p><div className="hub-list">{items.map(([title,count,route],i)=><button type="button" className={'hub-row'+(route?'':' disabled')} disabled={!route} key={title} onClick={()=>route&&go(route)}><span><b>Level {i+1} · {title}</b><small>{count}</small></span><strong>{route?'→':'即将开放'}</strong></button>)}</div></div></div>
}

