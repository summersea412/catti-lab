import React from 'react';
import useCurrentUser from '../../hooks/useCurrentUser';
export default function Header({ route }) {
  const { profile, countdownText } = useCurrentUser();
  return <header className="header">
    <div><p className="eyebrow">YOUR STUDY DESK</p><h1>{route.label}</h1><p className="header-subtitle">A considered space for English–Chinese translation practice.</p></div>
    <div className="header-meta" style={{ flexShrink: 0 }}>
      <span className="status-dot" />
      <div style={{ textAlign: 'right', maxWidth: 220 }}>
        <strong data-testid="header-nickname" style={{ display: 'block', color: 'var(--ink)', overflowWrap: 'anywhere', marginBottom: 6 }}>{profile?.nickname ?? '学习者'}</strong>
        <span data-testid="header-countdown">{countdownText}</span>
      </div>
      <div className="avatar" aria-hidden="true">{Array.from(profile?.nickname ?? 'L')[0].toUpperCase()}</div>
    </div>
  </header>;
}

