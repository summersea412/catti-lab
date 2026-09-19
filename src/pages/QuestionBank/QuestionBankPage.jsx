import {Crumbs} from '../../components/training/BackAction';
import React,{useMemo,useState}from'react';
import PublicArchive from "../../features/questionBank/PublicArchive";
import{SENTENCE_EXERCISES}from'../../features/exercises/sentenceDataset';
import{PARAGRAPH_EXERCISES}from'../../features/questionBank/paragraphDataset';
import{VOCABULARY_EXERCISES,GRAMMAR_EXERCISES,READING_PASSAGES,READING_QUESTIONS,CLOZE_PASSAGES,CLOZE_BLANKS}from'../../features/comprehensive/comprehensiveDataset';
import{EXAM_PASSAGES}from'../../features/translation/examPassageDataset';
import{FULL_PRACTICE_SETS}from'../../features/translation/fullPracticeSets';
import'../../styles/global.css';
const nav=id=>window.dispatchEvent(new CustomEvent('catti:navigate',{detail:id}));

export default function QuestionBankPage(){
 const[category,setCategory]=useState("registry");
 return <div className="question-page">{category!=="registry"&&<Crumbs items={[{label:"题库",onClick:()=>setCategory("registry")},{label:category==="specialized"?"专项训练":"综合能力"}]}/>}<div className="page-hero"><div><p className="eyebrow">CATTI SOURCE REGISTRY</p><h2>英语二级笔译公开资料库</h2><p>按年份、场次和科目查找公开资料，选择已收录正文开始训练。</p></div></div>
 <div className="question-filters category-filters">{[['registry','历年资料库'],['specialized','专项训练'],['comprehensive','综合能力']].map(([v,l])=><button type="button" className={'ui-button '+(category===v?'primary':'')} onClick={()=>setCategory(v)} key={v}>{l}</button>)}</div>
 {category==='registry'&&<PublicArchive/>}
 {category==='specialized'&&<div className="paper-list"><article className="paper-row"><div className="paper-info"><h3>Sentence Practice</h3><p>句子专项 · {SENTENCE_EXERCISES.length} 条 · 中译英 / 英译汉</p></div><button className="ui-button" onClick={()=>nav('sentence')}>进入训练</button></article><article className="paper-row"><div className="paper-info"><h3>Paragraph Practice</h3><p>篇章专项 · {PARAGRAPH_EXERCISES.length} 条 · 中译英 / 英译汉</p></div><button className="ui-button" onClick={()=>nav('paragraph')}>进入训练</button></article><article className="paper-row"><div className="paper-info"><h3>Exam Passage</h3><p>考试级单篇训练 · {EXAM_PASSAGES.length} 篇</p></div><button className="ui-button" onClick={()=>nav('exam-passage')}>进入训练</button></article><article className="paper-row"><div className="paper-info"><h3>CATTI Lab 整套模拟</h3><p>{FULL_PRACTICE_SETS.length} 套 · 4 passages · 180 min</p></div><button className="ui-button" onClick={()=>nav('full-practice')}>进入训练</button></article></div>}
 {category==='comprehensive'&&<div className="paper-list"><article className="paper-row"><div className="paper-info"><h3>笔译综合能力专项训练</h3><p>词汇 {VOCABULARY_EXERCISES.length} · 语法 {GRAMMAR_EXERCISES.length} · 阅读 {READING_PASSAGES.length} 篇 / {READING_QUESTIONS.length} 题 · 完形 {CLOZE_PASSAGES.length} 篇 / {CLOZE_BLANKS.length} 空</p><small>专项内容与历年公开资料 Registry 分开。</small></div><button className="ui-button" onClick={()=>nav('comprehensive-hub')}>开始训练</button></article></div>}
 </div>
}
