import React from 'react';
import {useTrainingSessions} from '../../features/training/TrainingContext';
import {readStorage,STORAGE_KEYS} from '../../storage/storageAdapter';
import './analysis.css';

const DAY=86400000;
const typeLabel=(session)=>{
  const type=session.exerciseType||session.type;
  if(type==='sentence') return '句子训练';
  if(type==='paragraph') return '段落训练';
  if(type==='past-paper'||type==='exam-passage') return 'Exam Passage';
  if(type==='review') return '错题复习';
  if(type==='full-practice') return '整套模拟';
  if(type==='comprehensive') return session.questionType==='grammar'?'语法专项':'综合能力';
  return '训练';
};
const directionLabel=(direction)=>direction==='zh-en'?'中译英':direction==='en-zh'?'英译中':'—';
const durationMs=(s)=>Number(s.activeDurationMs??s.durationMs??0);
const formatDuration=(ms)=>{const mins=Math.round(ms/60000);if(mins<1)return `${Math.max(0,Math.round(ms/1000))} sec`;if(mins<60)return `${mins} min`;return `${Math.floor(mins/60)}h ${mins%60}min`};
const dayKey=(date)=>{const d=new Date(date);return Number.isNaN(d.getTime())?'':`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`};
const startOfDay=(date)=>{const d=new Date(date);d.setHours(0,0,0,0);return d};
const dateLabel=(date)=>new Date(date).toLocaleDateString('zh-CN',{month:'numeric',day:'numeric'});

function Stat({label,value,detail}){return <div className="analysis-stat"><span className="analysis-stat-label">{label}</span><strong>{value}</strong>{detail&&<small>{detail}</small>}</div>}
function Empty({children}){return <p className="analysis-empty">{children}</p>}

export default function AnalysisPage(){
  const {sessions=[]}=useTrainingSessions();
  const collections=readStorage(STORAGE_KEYS.collections,[]);
  const now=new Date();
  const today=startOfDay(now);
  const weekStart=new Date(today.getTime()-6*DAY);
  const recent=[...sessions].sort((a,b)=>new Date(b.submittedAt||b.createdAt)-new Date(a.submittedAt||a.createdAt));
  const week=sessions.filter(s=>{const d=new Date(s.submittedAt||s.createdAt);return d>=weekStart&&d<new Date(today.getTime()+DAY)});
  const totalMs=sessions.reduce((sum,s)=>sum+durationMs(s),0);
  const weekMs=week.reduce((sum,s)=>sum+durationMs(s),0);
  const days=Array.from({length:7},(_,index)=>{const date=new Date(weekStart.getTime()+index*DAY);const key=dayKey(date);return {date,count:week.filter(s=>dayKey(s.submittedAt||s.createdAt)===key).length}});
  const moduleCounts={};
  sessions.forEach(s=>{const label=typeLabel(s);moduleCounts[label]=(moduleCounts[label]||0)+1});
  const modules=['句子训练','段落训练','Exam Passage','语法专项','综合能力','整套模拟','错题复习'];
  const maxModule=Math.max(1,...Object.values(moduleCounts));
  const timeCounts={上午:0,下午:0,晚上:0};
  week.forEach(s=>{const hour=new Date(s.submittedAt||s.createdAt).getHours();timeCounts[hour<12?'上午':hour<18?'下午':'晚上']+=durationMs(s)});
  const timeTotal=Object.values(timeCounts).reduce((a,b)=>a+b,0);
  const timeStyle=timeTotal?{background:`conic-gradient(#a995c3 0 ${(timeCounts.上午/timeTotal)*100}%,#c9bad5 ${(timeCounts.上午/timeTotal)*100}% ${((timeCounts.上午+timeCounts.下午)/timeTotal)*100}%,#ded4e4 ${((timeCounts.上午+timeCounts.下午)/timeTotal)*100}% 100%)`}:{};
  return <div className="analysis-page">
    <div className="analysis-heading"><div><p className="analysis-kicker">LEARNING ANALYTICS</p><h2>学习分析</h2><p>看见练习留下的痕迹。</p></div><span className="analysis-range">最近 7 天</span></div>
    <section className="analysis-overview" aria-label="学习概览"><Stat label="累计学习时长" value={formatDuration(totalMs)}/><Stat label="已完成练习数" value={sessions.length}/><Stat label="本周练习数" value={week.length}/><Stat label="错题数量" value={collections.filter(item=>item.type==='mistake').length}/></section>
    <div className="analysis-main-grid">
      <section className="analysis-panel trend-panel"><div className="panel-heading"><div><h3>近 7 日学习趋势</h3><p>每日练习数量</p></div><span>题数</span></div>{sessions.length?<div className="trend-chart" role="img" aria-label="近七日每日练习数量">{days.map(({date,count},index)=><div className="trend-column" key={dayKey(date)} title={`${dateLabel(date)} ${count} 题`}><div className={`trend-bar ${index===6?'today':''}`} style={{height:`${Math.max(count?count/Math.max(...days.map(x=>x.count),1)*100:2,2)}%`}}/><span>{date.toLocaleDateString('zh-CN',{weekday:'short'})}</span><b>{count}</b></div>)}</div>:<Empty>完成一次练习后，这里会出现你的学习趋势。</Empty>}</section>
      <section className="analysis-panel module-panel"><div className="panel-heading"><div><h3>训练模块分布</h3><p>你在不同模块的练习占比</p></div></div>{sessions.length?modules.map(label=>{const count=moduleCounts[label]||0;const percent=Math.round(count/sessions.length*100);return <div className="module-row" key={label}><div><span>{label}</span><small>{percent}% · {count} 题</small></div><div className="module-track"><i style={{width:`${count?Math.max(percent,3):0}%`}}/></div></div>}):<Empty>还没有训练记录。</Empty>}</section>
    </div>
    <div className="analysis-lower-grid">
      <section className="analysis-panel recent-panel"><div className="panel-heading"><div><h3>最近学习记录</h3><p>最近 5 条练习记录</p></div><button className="analysis-link" onClick={()=>window.dispatchEvent(new CustomEvent('catti:navigate',{detail:'records'}))}>查看全部 →</button></div>{recent.length?<div className="recent-table"><div className="recent-header"><span>日期</span><span>模块</span><span>内容类型</span><span>用时</span><span>状态</span></div>{recent.slice(0,5).map((s,index)=><div className="recent-row" key={s.id||index}><span>{dateLabel(s.submittedAt||s.createdAt)}</span><strong>{typeLabel(s)}</strong><span>{directionLabel(s.direction)}</span><span>{formatDuration(durationMs(s))}</span><em className={s.status==='completed'?'done':''}>{s.status==='completed'?'已完成':'进行中'}</em></div>)}</div>:<Empty>完成第一道练习后，记录会出现在这里。</Empty>}</section>
      <section className="analysis-panel time-panel"><div className="panel-heading"><div><h3>学习时长分布</h3><p>不同时间段的学习时长占比</p></div></div>{timeTotal?<div className="time-content"><div className="time-ring" style={timeStyle}><div><strong>{formatDuration(timeTotal)}</strong><small>本周总学习时长</small></div></div><div className="time-legend">{Object.entries(timeCounts).map(([label,value])=><div key={label}><i className={`time-dot ${label}`}/><span>{label}</span><b>{Math.round(value/timeTotal*100)}%</b></div>)}</div></div>:<Empty>开始计时训练后，这里会记录你的学习时间。</Empty>}</section>
    </div>
  </div>;
}
