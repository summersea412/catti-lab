import CompanionIllustration from '../../features/companion/CompanionIllustration';
import React, { useState } from 'react';
import { readFavorites, toggleFavorite, filterPhrases } from '../../features/phraseLibrary/phraseService';

const items = [
  { expression: 'play a pivotal role in', meaning: '在……中发挥关键作用', example: 'Technology plays a pivotal role in social development.', direction: 'zh-en', topic: '社会发展', source: '2025.06 真题' },
  { expression: 'in the face of', meaning: '面对……时', example: 'In the face of change, clarity matters.', direction: 'en-zh', topic: '社会议题', source: '重点表达' },
  { expression: 'a sustainable approach to', meaning: '一种可持续的……方式', example: 'We need a sustainable approach to growth.', direction: 'zh-en', topic: '发展议题', source: '自定义收藏' },
];
const directions = [['all', '全部'], ['zh-en', '中译英'], ['en-zh', '英译汉']];

export default function PhraseLibraryPage() {
  const [favorites, setFavorites] = useState(readFavorites);
  const [query, setQuery] = useState('');
  const [direction, setDirection] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [error, setError] = useState('');
  const filtered = filterPhrases(items, { query, direction, favoritesOnly, favorites });
  const toggle = phrase => {
    try {
      setFavorites(toggleFavorite(favorites, phrase));
      setError('');
    } catch {
      setError('收藏暂时无法保存，请检查浏览器存储权限后重试。');
    }
  };
  const emptyFavorites = favoritesOnly && !items.some(item => favorites.includes(item.expression));

  return <div className="phrase-page">
    <div className="page-hero"><div><p className="eyebrow">PERSONAL LANGUAGE ARCHIVE</p><h2>表达库</h2><p>把遇见过的好表达，整理成自己的语言资源。</p></div><span className="hero-note">A phrase worth keeping</span></div>
    <div className="phrase-toolbar">
      <input className="ui-input" aria-label="搜索表达" placeholder="搜索英文表达、中文释义或主题..." value={query} onChange={event => setQuery(event.target.value)} />
      <div className="chip-row">
        {directions.map(([value, label]) => <button type="button" key={value} className={`chip${direction === value ? ' active' : ''}`} aria-pressed={direction === value} onClick={() => setDirection(value)}>{label}</button>)}
        <button type="button" className={`chip${favoritesOnly ? ' active' : ''}`} aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly(value => !value)}>重点</button>
        <button type="button" className="chip" disabled title="即将开放" style={{ opacity: 0.55, cursor: 'not-allowed' }}>NEW · 即将开放</button>
      </div>
    </div>
    {error && <p role="alert">{error}</p>}
    <CompanionIllustration character="green" size="medium" className="phrase-companion" />
    <div className="phrase-list">
      {filtered.map(item => <article className="phrase-entry" key={item.expression}>
        <div className="phrase-main"><span className="phrase-index">{String(items.indexOf(item) + 1).padStart(2, '0')}</span><h3>{item.expression}</h3><p className="phrase-meaning">{item.meaning}</p><p className="phrase-example">Example · {item.example}</p></div>
        <div className="phrase-meta"><span className="tag">{item.direction === 'zh-en' ? '中译英' : '英译汉'} · {item.topic}</span><span className="source">{item.source}</span><button type="button" className="save-star" aria-pressed={favorites.includes(item.expression)} aria-label={`${favorites.includes(item.expression) ? '取消收藏' : '收藏'}：${item.expression}`} onClick={() => toggle(item.expression)}>{favorites.includes(item.expression) ? '★' : '☆'}</button></div>
      </article>)}
      {!filtered.length && <div className="empty-panel" role="status">{emptyFavorites ? <><h3>还没有收藏表达。</h3><p>遇到值得留下的句子，就点一下星星吧。</p></> : <p>没有找到符合条件的表达。</p>}</div>}
    </div>
  </div>;
}
