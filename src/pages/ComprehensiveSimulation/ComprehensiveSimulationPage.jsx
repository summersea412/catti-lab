import {shareTimerContract} from '../../components/training/timerModel';
import React,{useState} from 'react';
import {COMPREHENSIVE_SIMULATIONS} from '../../features/simulation/comprehensiveSimulations';
import BackAction from '../../components/training/BackAction';
import TrainingTimer,{useTrainingTimer} from '../../components/training/TrainingTimer';
import PassageQuestions from '../../components/training/PassageQuestions';
import {readStorage,writeStorage} from '../../storage/storageAdapter';
import {useTrainingSessions} from '../../features/training/TrainingContext';
const KEY='catti.comprehensiveSimulationDrafts';
export default function ComprehensiveSimulationPage(){const [set,setSet]=useState(null);return set?<Workspace key={set.id} set={set} onBack={()=>setSet(null)}/>:<div className="training-page"><BackAction to="simulation" label="整套模拟" current="综合能力"/><h2>综合能力整套模拟</h2><p>CATTI Lab 自建模拟 · 120 min · 非历年真题</p><p className="source-note">每套独立 35 题：词汇 10 · 语法 10 · 阅读 5 · 完形 10。采用 CATTI Lab 训练模型，不声称复刻官方题量。</p><div className="hub-list">{COMPREHENSIVE_SIMULATIONS.map(s=><button className="hub-row" key={s.id} onClick={()=>setSet(s)}><span><b>{s.title}</b><small>词汇 · 语法 · 阅读 · 完形</small></span><strong>开始 →</strong></button>)}</div></div>}
function Workspace({set,onBack}){
 const {add}=useTrainingSessions();const [state,setState]=useState(()=>readStorage(KEY,{})[set.id]||{section:0,index:0,answers:{},saved:[]}),[submitted,setSubmitted]=useState(()=>Boolean(readStorage(KEY,{})[set.id]?.submitted));const timer=useTrainingTimer(set.id,120);const section=set.sections[state.section],item=section.items[state.index];
 const update=changes=>{const next={...state,...changes};setState(next);writeStorage(KEY,{...readStorage(KEY,{}),[set.id]:next})};
 const all=section.items.flatMap(p=>p.questions||p.blanks||[p]);const questions=item.questions||item.blanks;

 const saveSection=()=>{
  if(state.saved.includes(section.id)||all.some(q=>!state.answers[q.id]))return;
  const now=new Date().toISOString(),contract=timer.snapshot(),delta={...contract};for(const key of ['activeDurationMs','elapsedDurationMs','pauseDurationMs','overtimeMs'])delta[key]=Math.max(0,contract[key]-(state.accountedTimer?.[key]||0));delta.recommendedDurationMs=contract.recommendedDurationMs/set.sections.length;let n=0;
  section.items.forEach(p=>(p.questions||p.blanks||[p]).forEach(q=>{add({exerciseId:q.id,exerciseType:'comprehensive',paperId:set.id,sectionType:section.id,questionType:section.id,trainingMode:'full-comprehensive',sourceType:'simulated',direction:'en-zh',topic:p.topic,sourceText:p.sourceText||p.prompt,userAnswer:state.answers[q.id],referenceAnswer:q.answer,contentVersion:p.contentVersion,startedAt:timer.startedAt,submittedAt:now,...shareTimerContract(delta,all.length,n++),status:'completed'})}));
  update({saved:[...state.saved,section.id],accountedTimer:contract});
 };
 // Section submissions already persist every answer. Do not add a fictitious extra
 // completed exercise or count the same 120-minute timer a second time.
 const finish=()=>{if(submitted||state.saved.length!==set.sections.length)return;setSubmitted(true);update({submitted:true})};

 return <div className="training-page split-workspace"><BackAction label="综合能力模拟" current={set.title} onClick={onBack}/><h2>{set.title}</h2><TrainingTimer timer={timer} finished={submitted||state.saved.length===set.sections.length}/><div className="paragraph-tabs">{set.sections.map((s,i)=><button className={state.section===i?'active':''} key={s.id} onClick={()=>update({section:i,index:0})}>{s.title}{state.saved.includes(s.id)?' ✓':''}</button>)}</div><p>{state.index+1} / {section.items.length} · 本节已答 {all.filter(q=>state.answers[q.id]).length} / {all.length}</p>{questions?<PassageQuestions passage={item.sourceText||item.passage} mode={section.id} questions={questions} answers={state.answers} onAnswer={(id,value)=>{timer.firstInput();update({answers:{...state.answers,[id]:value}})}} submitted={state.saved.includes(section.id)} />:<div className="workspace-card"><p className="source-text">{item.prompt}</p><div className="choice-list">{item.options.map(o=><label key={o}><input type="radio" disabled={state.saved.includes(section.id)} checked={state.answers[item.id]===o} onChange={()=>{timer.firstInput();update({answers:{...state.answers,[item.id]:o}})}}/>{o}</label>)}</div>{state.saved.includes(section.id)&&<div className="feedback-panel"><h3>{state.answers[item.id]===item.answer?'✓ 回答正确':'✕ 回答错误'}</h3><p>我的答案：{state.answers[item.id]}</p><p>正确答案：{item.answer}</p><p>解析：{item.explanation}</p></div>}</div>}<div className="training-actions"><button className="ui-button" disabled={!state.index} onClick={()=>update({index:state.index-1})}>上一题</button><button className="ui-button" disabled={state.index===section.items.length-1} onClick={()=>update({index:state.index+1})}>下一题</button><button className="ui-button" disabled={state.saved.includes(section.id)||all.some(q=>!state.answers[q.id])} onClick={saveSection}>提交本节并保存</button><button className="ui-button primary" onClick={finish} disabled={submitted||state.saved.length!==set.sections.length}>提交整套模拟</button></div>{state.saved.includes(section.id)&&<p role="status">本节已保存 · {all.filter(q=>state.answers[q.id]===q.answer).length} / {all.length} 正确</p>}{submitted&&<p>整套模拟已保存到学习记录。</p>}</div>
}
