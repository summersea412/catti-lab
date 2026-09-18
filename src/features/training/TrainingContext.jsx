import React,{createContext,useContext,useState} from 'react';
const KEY='catti.trainingSessions';
const normalize=s=>({exerciseId:s.exerciseId||s.id||'legacy-'+Date.now(),exerciseType:s.exerciseType||s.type||'sentence',direction:s.direction||'zh_en',startedAt:s.startedAt||s.createdAt||new Date().toISOString(),submittedAt:s.submittedAt||s.createdAt||new Date().toISOString(),durationMs:Number(s.durationMs)||0,status:s.status||'submitted',hintsUsed:Number(s.hintsUsed)||0,referenceViewed:Boolean(s.referenceViewed),...s});
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]').map(normalize)}catch{return[]}};
const C=createContext(null);
export function TrainingProvider({children}){const[sessions,setSessions]=useState(read);const add=s=>{const now=new Date().toISOString();const n=normalize({id:crypto.randomUUID?.()||String(Date.now()),createdAt:now,submittedAt:now,...s});const all=[n,...sessions];setSessions(all);localStorage.setItem(KEY,JSON.stringify(all));return n};return <C.Provider value={{sessions,add}}>{children}</C.Provider>}
export const useTrainingSessions=()=>useContext(C);
