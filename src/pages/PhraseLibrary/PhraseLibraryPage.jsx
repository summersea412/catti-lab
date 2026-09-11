import React from 'react';
export default function PhraseLibraryPage(){return <div className='page'><p className='eyebrow'>CATTI LAB</p><h2>Phrase Library</h2><p className='page-description'>A calm space to shape your translation practice.</p><div className='card-grid'>{Array.from({length:12},(_,i)=><div className='placeholder-card' key={i}>0{i+1}</div>)}</div></div>}
