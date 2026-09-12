import React from 'react';
import { routes } from '../../app/routes';
import useCurrentUser from '../../hooks/useCurrentUser';
export default function Sidebar({ active, onNavigate }) {
  const { profile } = useCurrentUser();
  return <aside className="sidebar">
    <div className="brand">CATTI <span>LAB</span></div><p className="eyebrow">ENGLISH · LEVEL 2</p>
    <nav>{routes.map((r, i) => <button className={active === r.id ? 'nav-item active' : 'nav-item'} aria-current={active === r.id ? 'page' : undefined} onClick={() => onNavigate(r.id)} key={r.id}><span><b className="nav-index">0{i + 1}</b>{r.label}</span><small>→</small></button>)}</nav>
    <div className="sidebar-foot">
      <div className="sidebar-user">
        <span className="avatar small" style={{ flexShrink: 0 }} aria-hidden="true">{Array.from(profile?.nickname ?? 'L')[0].toUpperCase()}</span>
        <span data-testid="sidebar-nickname" style={{ overflowWrap: 'anywhere', minWidth: 0 }}>{profile?.nickname ?? '学习者'}</span>
        <button className="settings-mark" aria-label="打开设置" onClick={() => onNavigate('settings')} style={{ border: 0, background: 'transparent', cursor: 'pointer', color: 'inherit' }}>⚙</button>
      </div>
      <p>Keep a clear record.<br />Make each sentence count.</p>
    </div>
  </aside>;
}

