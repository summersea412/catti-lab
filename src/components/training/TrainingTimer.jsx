import React,{useEffect,useRef,useState} from 'react';
import {readStorage,writeStorage} from '../../storage/storageAdapter';
import {newTimer,advanceTimer,timerContract} from './timerModel';
const KEY='catti.trainingTimers';
export const clockLabel=ms=>{const s=Math.floor(Math.max(0,ms||0)/1000);return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`};
function load(id,minutes){const old=readStorage(KEY,{})[id],now=Date.now();return old?.version===2&&!old.finished?{...old,running:false,lastUpdated:now}:newTimer(minutes*60000,now)}
export function useTrainingTimer(id,minutes=30,segmentId=null){
 const [state,setState]=useState(()=>load(id,minutes)),[notice,setNotice]=useState(false);const ref=useRef({id,state,segment:segmentId});
 const persist=()=>{const c=ref.current;c.state=advanceTimer(c.state,Date.now(),c.segment);writeStorage(KEY,{...readStorage(KEY,{}),[c.id]:c.state});return c.state};
 useEffect(()=>{ref.current={id,state:load(id,minutes),segment:segmentId};setState(ref.current.state);setNotice(false);const tick=setInterval(()=>setState({...persist()}),250);return()=>{clearInterval(tick);persist();ref.current.state={...ref.current.state,running:false};writeStorage(KEY,{...readStorage(KEY,{}),[ref.current.id]:ref.current.state})}},[id,minutes]);
 useEffect(()=>{persist();ref.current.segment=segmentId},[segmentId]);
 useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(false),3000);return()=>clearTimeout(t)},[notice]);
 const update=patch=>{persist();ref.current.state={...ref.current.state,...patch};writeStorage(KEY,{...readStorage(KEY,{}),[id]:ref.current.state});setState({...ref.current.state})};
 const start=trigger=>{if(ref.current.state.timerStartedAt||ref.current.state.finished)return;update({timerStartedAt:new Date().toISOString(),timerStartTrigger:trigger,running:true});setNotice(true)};
 const finish=()=>{if(ref.current.state.finished)return;update({running:false,finished:true,finishedAt:Date.now()})};
 const snapshot=()=>timerContract(persist(),Date.now());
 const c=timerContract(state,Date.now());return {...state,...c,minutes,started:Boolean(state.timerStartedAt),elapsedMs:c.activeDurationMs,startedAt:c.timerStartedAt,remainingMs:Math.max(0,c.recommendedDurationMs-c.activeDurationMs),recommendedRemaining:Math.max(0,c.recommendedDurationMs-c.activeDurationMs),notice,start,firstInput:()=>start('first-input'),pause:()=>update({running:false}),resume:()=>state.timerStartedAt?update({running:true}):start('manual'),finish,snapshot,segmentDurations:()=>persist().segments,toggle:()=>state.timerStartedAt?update({running:!ref.current.state.running}):start('manual')};
}
export default function TrainingTimer({timer,finished=false}){useEffect(()=>{if(finished)timer.finish()},[finished]);return <><div className="training-timer"><span>建议 {timer.minutes} min</span><strong>实际 {clockLabel(timer.activeDurationMs)}</strong>{!timer.started?<><span>尚未开始</span><button type="button" className="text-action" disabled={finished} onClick={()=>timer.start('manual')}>开始计时</button></>:<><span>{timer.overtimeMs>0?`超时 ${clockLabel(timer.overtimeMs)}`:timer.remainingMs>0?`目标剩余 ${clockLabel(timer.remainingMs)}`:'建议时间已到'}</span><span>{finished?'已结束':timer.running?'计时中':'已暂停'}</span><button type="button" className="text-action" disabled={finished} onClick={timer.toggle}>{timer.running?'暂停':'继续'}</button></>}</div>{timer.notice&&<p className="timer-notice" role="status">已开始记录本次训练时间</p>}</>}
