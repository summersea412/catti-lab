import React,{createContext,useContext,useState} from 'react';import {readStorage,writeStorage,STORAGE_KEYS} from '../../storage/storageAdapter';import {normalizeTrainingSession} from './trainingSchema';export {normalizeTrainingSession} from './trainingSchema';
const KEY=STORAGE_KEYS.sessions;const read=()=>readStorage(KEY,[]).map(normalizeTrainingSession);
const C=createContext(null);
export function TrainingProvider({children}){const[sessions,setSessions]=useState(read);const add=s=>{const now=new Date().toISOString();const n=normalizeTrainingSession({id:crypto.randomUUID?.()||String(Date.now()),createdAt:now,submittedAt:now,...s});const all=[n,...sessions];setSessions(all);writeStorage(KEY,all);return n};return <C.Provider value={{sessions,add}}>{children}</C.Provider>}
export const useTrainingSessions=()=>useContext(C);
