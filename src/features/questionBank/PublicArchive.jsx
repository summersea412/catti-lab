import {trainingLibraryView} from './sourceRegistryService';
import Breadcrumb from '../../components/training/Breadcrumb';
import {Crumbs} from '../../components/training/BackAction';
import TrainingTimer,{useTrainingTimer} from '../../components/training/TrainingTimer';
import React,{useMemo,useState} from 'react';
import {PAST_PAPER_SOURCE_REGISTRY,REGISTRY_YEARS} from './sourceRegistry';
import {contentLabels,contentState,visibleContentStats,objectiveResult,defaultVariant,filterRegistry,fullSessionExercises,isTrainable,registryStats,sessionSnapshot,trainingExercise,pastPaperRepository} from './sourceRegistryService';
import {useTrainingSessions} from '../training/TrainingContext';
import {readStorage,writeStorage,STORAGE_KEYS} from '../../storage/storageAdapter';
import './publicArchive.css';
const subjectLabels={practical:'笔译实务',comprehensive:'笔译综合能力'};
const directionLabels={'en-zh':'英译汉','zh-en':'汉译英','vocabulary-grammar':'词汇语法',reading:'阅读',cloze:'完形'};
const stats=pastPaperRepository.stats();
const visibleStats=pastPaperRepository.visibleStats();
export default function PublicArchive(){
 const [filters,setFilters]=useState({year:'all',month:'all',subject:'all',direction:'all',query:'',availability:'trainable'});
 const [practice,setPractice]=useState(null);
 const rows=useMemo(()=>trainingLibraryView(filters),[filters]);
 const set=(key,value)=>setFilters(prev=>({...prev,[key]:value}));
 const clear=()=>setFilters({year:'all',month:'all',subject:'all',direction:'all',query:'',availability:'trainable'});
 const months=[...new Set(PAST_PAPER_SOURCE_REGISTRY.map(r=>r.month))].sort();
 if(practice)return <ArchivePractice key={practice.map(x=>x.id).join('|')} exercises={practice} onBack={()=>setPractice(null)}/>;
 return <section className="public-archive"><Breadcrumb path="questions"/>
  <p className="archive-summary">{stats.years} 年公开索引 · {stats.sessions} 场考试 · 站内可练 {stats.trainablePassages} 篇实务 / {visibleStats.comprehensive} 道综合题</p>
  <p className="archive-muted">全部收录 {visibleStats.total} · 实务完整 {visibleStats.complete} · 部分恢复 / 残缺 {visibleStats.partial}（含回忆整理 {visibleStats.recalled}） · 答案待补 {visibleStats.missingAnswer} · 参考译文待补 {visibleStats.missingReference}</p>
  <div className="question-filters archive-filters">
   <div className="archive-availability"><button className={filters.availability==='trainable'?'active':''} onClick={()=>set('availability','trainable')}>可训练 {visibleStats.trainable}</button><button className={filters.availability==='all'?'active':''} onClick={()=>set('availability','all')}>全部资料 {visibleStats.total+visibleStats.registryOnlyMaterials}</button></div><label>年份<select value={filters.year} onChange={e=>set('year',e.target.value)}><option value="all">全部年份</option>{REGISTRY_YEARS.map(y=><option key={y}>{y}</option>)}</select></label>
   <label>场次<select value={filters.month} onChange={e=>set('month',e.target.value)}><option value="all">全部场次</option>{months.map(m=><option key={m} value={m}>{m==='sample'?'样题':m+'月'}</option>)}</select></label>
   <label>科目<select value={filters.subject} onChange={e=>set('subject',e.target.value)}><option value="all">全部科目</option><option value="practical">笔译实务</option><option value="comprehensive">笔译综合能力</option></select></label>
   <label>方向<select value={filters.direction} onChange={e=>set('direction',e.target.value)}><option value="all">全部方向</option><option value="zh-en">汉译英</option><option value="en-zh">英译汉</option></select></label>
   <label className="archive-search">搜索<input value={filters.query} onChange={e=>set('query',e.target.value)} placeholder="年份、主题或原文"/></label>
   <button className="ui-button" onClick={clear}>清除筛选</button>
  </div>
  {!rows.length&&<div className="empty-panel"><p>没有找到符合条件的真题。</p><button className="ui-button" onClick={clear}>清除筛选</button></div>}
  {[...new Set(rows.map(r=>r.year))].map(year=><section className="archive-year" key={year}><h3>{year}</h3>{rows.filter(r=>r.year===year).map(record=><Session key={record.id} record={record} subject={filters.subject} availability={filters.availability} start={setPractice}/>)}</section>)}
 </section>;
}
function Sources({sources}){return <details className="archive-sources"><summary>题目来源 · {sources.length}</summary>{sources.map((s,i)=><div key={s.url+'-'+i}><a href={s.url} target="_blank" rel="noreferrer">{s.label||new URL(s.url).hostname} ↗</a>{s.evidence&&<p>{s.evidence}</p>}{s.note&&<small>{s.note}</small>}</div>)}</details>}
function Session({record:r,subject,availability,start}){
 const full=fullSessionExercises(r);
 return <details className="archive-session"><summary><strong>{r.year}.{r.month==='sample'?'样题':r.month}</strong><span>CATTI 英语二级笔译</span><small>{r.materials.some(p=>p.variants.some(isTrainable))?'有可训练内容':'来源索引'}</small></summary>
 {Object.entries(r.subjects).filter(([s])=>(subject==='all'||s===subject)&&(availability==='all'||r.visibleMaterials.some(p=>p.subject===s))).map(([s,info])=>{
 const found=r.materials.filter(p=>p.subject===s),local=found.filter(p=>p.variants.some(isTrainable));
 const visible=r.visibleMaterials.filter(p=>p.subject===s);
 return <section className="archive-subject" key={s}><h4>{subjectLabels[s]}</h4><p className="archive-muted">{s==='practical'?`当前收录 ${local.length} / ${Number(r.year)<2005?'历史篇目数待核对':4} 篇正文 · 已定位 ${found.length} 个篇目位置`:`已导入 ${local.length} 道题`}</p><p className="archive-muted">{info.structure}</p>
 {s==='practical'&&<div className="archive-direction-counts">{['en-zh','zh-en'].map(d=><span key={d}>{directionLabels[d]} · {local.filter(p=>p.direction===d).length} / {Number(r.year)<2005?'待核对':2}</span>)}</div>}
 {s==='comprehensive'&&info.sections?.length>0&&<p className="archive-muted">来源涉及：{info.sections.join(' / ')}。题源及主题回忆不计作完整题目。</p>}
 {visible.map(p=><Material key={p.id} material={p} start={start}/>)}
 {!visible.length&&<p className="archive-muted">资料已找到 · 正文待补</p>}
 <Sources sources={r.sources.filter(x=>x.subject===s)}/>
 {s==='practical'&&full.length>0&&<button className="ui-button primary" onClick={()=>start(full)}>开始整套训练</button>}
 </section>})}
 </details>;
}
function Material({material:p,start}){
 const [selected,setSelected]=useState(defaultVariant(p).id);
 const variant=p.variants.find(v=>v.id===selected)||defaultVariant(p);
 const exercise=trainingExercise(p,variant);
 return <article className="archive-material"><div><h5>{directionLabels[p.section]||p.section} · {p.subject==='practical'?'Passage':'Question'} {p.number} — {variant.title}</h5><small>{variant.sourceLabel||p.sourceNote||'来源待进一步核验'}{exercise&&' · '+contentLabels[contentState(variant)]}</small></div>
 {p.variants.length>1&&<><p className="archive-version-note">存在公开版本差异（含题目归属差异）。</p><label>查看其他公开版本<select value={variant.id} onChange={e=>setSelected(e.target.value)}>{p.variants.map((v,i)=><option key={v.id} value={v.id}>版本 {i+1} · {v.title}{isTrainable(v)?' · 可训练':''}</option>)}</select></label></>}
 <p className="archive-muted">{isTrainable(variant)?(p.subject==='comprehensive'?(objectiveResult(variant,'').known?'含公开答案':'答案待补充'):(exercise.referenceAnswer?'含参考译文':'暂无人工参考译文')):'资料已找到 · 正文待补'}</p>
 {exercise&&<details><summary>浏览正文</summary><p className="archive-source-text">{exercise.sourceText}</p>{exercise.options?.map((option,i)=><p key={i}>{String.fromCharCode(65+i)}. {option}</p>)}</details>}
 <Sources sources={variant.sourceURLs.map(url=>({url}))}/>
 <button className="ui-button" disabled={!exercise} onClick={()=>start([exercise])}>{exercise?'开始单篇训练':'资料已找到 · 正文待补'}</button>
 </article>;
}
function ArchivePractice({exercises,onBack}){
 const {add}=useTrainingSessions();
 const [index,setIndex]=useState(0),[answer,setAnswer]=useState(()=>readStorage(STORAGE_KEYS.pastPaperDrafts,{})[exercises[0]?.id]||''),[submitted,setSubmitted]=useState(false),[showReference,setShowReference]=useState(false),[error,setError]=useState('');
 const [saved,setSaved]=useState(false);
 const e=exercises[index];const timer=useTrainingTimer(e.id,e.direction==='en-zh'?50:45);
 const submit=()=>{if(!answer.trim()){setError('先写点东西再交嘛。');return}if(submitted)return;try{add({...sessionSnapshot(e,answer,timer.startedAt),durationMs:timer.activeDurationMs,...timer.snapshot()});setSubmitted(true);setShowReference(true);setError('')}catch{setError('保存未完成，请保留答案后重试。')}};
 const back=()=>onBack();
 return <section className="public-archive archive-practice"><Crumbs back={back} items={[{label:'题库',onClick:back},{label:'历年真题',onClick:back},{label:e.year+'.'+String(e.session).replace('月','').padStart(2,'0'),onClick:back},{label:(e.direction==='zh-en'?'汉译英':'英译汉')+' Passage '+(e.passageIndex||'—')}]}/><h3>{e.year} · {e.session} · {e.title}</h3><small>{e.sourceLabel||e.sourceNote||'来源待进一步核验'}</small>{exercises.length>1&&<p>整套训练 · {index+1} / {exercises.length}</p>}
 {e.variants?.length>1&&<p className="archive-version-note">当前采用所选公开整理版本；该位置存在公开归属差异。</p>}
 {e.textCompleteness!=='complete'&&<p className="archive-muted">{contentLabels[e.textCompleteness]} · 公开资料仅恢复部分正文</p>}
 <TrainingTimer timer={timer} finished={submitted}/><div className="translation-workspace"><section className="translation-source"><p className="eyebrow">SOURCE TEXT · {e.topic}</p><p className="archive-source-text">{e.sourceText}</p></section><section className="translation-editor-panel"><label htmlFor="public-paper-answer">YOUR TRANSLATION</label>
 {e.options?<fieldset disabled={submitted}><legend>选择答案</legend>{e.options.map((option,i)=><label className="archive-option" key={option}><input type="radio" name="archive-answer" value={option} checked={answer===option} onChange={()=>{timer.firstInput();setAnswer(option)}}/>{String.fromCharCode(65+i)}. {option}</label>)}</fieldset>:<><textarea className="translation-editor" id="public-paper-answer" value={answer} onChange={ev=>{if(ev.target.value&&!timer.started)timer.start('first-input');setAnswer(ev.target.value);const drafts=readStorage(STORAGE_KEYS.pastPaperDrafts,{});writeStorage(STORAGE_KEYS.pastPaperDrafts,{...drafts,[e.id]:ev.target.value})}} readOnly={submitted} rows={10}/></>}
 <div className="training-actions">{!e.options&&<button className="ui-button" onClick={()=>{writeStorage(STORAGE_KEYS.pastPaperDrafts,{...readStorage(STORAGE_KEYS.pastPaperDrafts,{}),[e.id]:answer});setSaved(true)}}>保存草稿</button>}{submitted&&<button className="text-action" onClick={()=>setShowReference(!showReference)}>{showReference?'收起参考':'查看参考'}</button>}<button className="ui-button primary" disabled={submitted} onClick={submit}>{submitted?'已保存到学习记录':'提交并保存记录'}</button>{submitted&&index<exercises.length-1&&<button className="ui-button" onClick={()=>{setIndex(index+1);setAnswer(readStorage(STORAGE_KEYS.pastPaperDrafts,{})[exercises[index+1]?.id]||'');setSubmitted(false);setShowReference(false);setSaved(false)}}>下一篇 →</button>}</div>
 {saved&&<p role="status">草稿已保存</p>}{error&&<p role="alert">{error}</p>}{submitted&&<p role="status">本次作答已保存。{e.options?objectiveResult(e,answer).label:'本次不提供自动评分。'}</p>}
 {showReference&&<section className="archive-reference"><h4>参考译文 / 答案</h4>{e.options?<><p>{objectiveResult(e,answer).known?'公开答案：'+e.answer:'答案待补充'}</p>{objectiveResult(e,answer).known&&<p>{e.explanation||'暂无公开解析'}</p>}</>:<p>{e.referenceAnswer||'暂无人工参考译文'}</p>}{(e.referenceSource||e.referenceNote)&&<small>{e.referenceSource||e.referenceNote}</small>}</section>}
 </section></div><Sources sources={e.sourceURLs.map(url=>({url}))}/>
 </section>;
}

