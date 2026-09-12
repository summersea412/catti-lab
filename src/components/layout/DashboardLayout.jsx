import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Badge from '../ui/Badge';
import useCurrentUser from '../../hooks/useCurrentUser';
export default function DashboardLayout({ children, active, onNavigate, route }) {
  const { profile, daysUntilExam, countdownText, directionLabel } = useCurrentUser();
  return <div className="app-shell">
    <style>{`
      .exam-card{background:var(--lav)}
      .exam-card .exam-value{font:normal 38px Georgia,serif;margin:18px 0 8px;color:var(--navy)}
      .exam-value small{font:13px Arial,sans-serif;margin-left:6px}
      .exam-card .exam-date{font-size:13px;letter-spacing:.06em;margin:0;color:#6f647d}
      .rail-link{padding:8px 0;background:transparent;border:0;color:#69557c;text-align:left;font:inherit;font-size:14px;cursor:pointer}
      .rail-link:hover{text-decoration:underline}
      .goal-card{background:#edf2e9}
      .goal-card .goal-value{font:normal 35px Georgia,serif;margin:15px 0;color:var(--navy)}
      .goal-value small{font-size:14px}
      .goal-card .ui-badge{display:inline-block;border-radius:20px;background:var(--paper);border:1px solid #cbd7c5;padding:6px 12px;font-size:12px;color:#526349}
    `}</style>
    <Sidebar active={active} onNavigate={onNavigate} />
    <main className="main"><Header route={route} />
      <div className="content-grid"><section className="page-content">{children}</section>
        <aside className="dashboard-rail">
          <div className="rail-card note-card"><p className="eyebrow">TODAY'S NOTE</p><h3>Small progress is still progress.</h3><p>Build a steady translation rhythm, one careful choice at a time.</p><span className="rail-stamp">✦ A LITTLE, EVERY DAY</span></div>
          <section className="rail-card exam-card" aria-label="考试倒计时">
            <p className="eyebrow">EXAM COUNTDOWN</p>
            {daysUntilExam === null ? <><p>未设置考试日期</p><button className="rail-link" onClick={() => onNavigate('settings')}>设置考试日期 →</button></> : <>
              <div className="exam-value" data-testid="exam-value" aria-label={countdownText}>
                {daysUntilExam > 0 ? <>{daysUntilExam}<small>天</small></> : daysUntilExam === 0 ? <small>今天考试</small> : <small>{countdownText}</small>}
              </div><p className="exam-date" data-testid="exam-date">{profile.targetExam.examDate.replaceAll('-', '.')}</p>
            </>}
          </section>
          {active !== 'analysis' && <section className="rail-card goal-card" aria-label="今日学习目标">
            <p className="eyebrow">TODAY'S GOAL</p>
            <div className="goal-value" data-testid="daily-goal">{profile ? <>{profile.dailyStudyMinutes} <small>min</small></> : <small>尚未设置学习目标</small>}</div>
            <Badge data-testid="direction-badge">{directionLabel}</Badge>
          </section>}
          <div className="rail-card quote-card"><p className="eyebrow">A LINE TO KEEP</p><p className="quote">“The best translation begins with attention.”</p><span className="quote-by">— CATTI LAB</span></div>
        </aside>
      </div>
    </main>
  </div>;
}


