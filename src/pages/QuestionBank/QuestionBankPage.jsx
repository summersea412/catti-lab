import React from 'react';
export default function QuestionBankPage(){return <div className='page'><p className='eyebrow'>CATTI LAB</p><h2>Question Bank</h2><p className='page-description'>A calm space to shape your translation practice.</p><div className='card-grid'>{Array.from({length:12},(_,i)=><div className='placeholder-card' key={i}>0{i+1}</div>)}</div></div>}
