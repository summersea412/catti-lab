import React, { createContext, useEffect, useRef, useState } from 'react';
import { saveProfile } from './userService';

export const UserContext = createContext(null);
const DAY = 86400000;
function localDay() {
  const now = new Date();
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}
export default function UserProvider({ children }) {
  const [profile, setProfile] = useState(()=>{try{return JSON.parse(localStorage.getItem('catti.profile')||localStorage.getItem('catti.user.profile')||localStorage.getItem('userProfile')||'null')}catch{return null}});
  const [isSaving, setIsSaving] = useState(false);
  const [today, setToday] = useState(localDay);
  const pending = useRef(false);

  useEffect(() => {
    let timer;
    function refresh() {
      clearTimeout(timer);
      setToday(localDay());
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(refresh, midnight.getTime() - now.getTime() + 50);
    }
    refresh();
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  async function updateProfile(input) {
    if (pending.current) throw new Error('正在保存，请稍候');
    pending.current = true;
    setIsSaving(true);
    try {
      const next = await saveProfile(profile, input);
      const normalized={...next,primaryDirection:next.primaryDirection||next.trainingDirection||'balanced',trainingDirection:next.trainingDirection||next.primaryDirection||'balanced'}; setProfile(normalized); localStorage.setItem('catti.profile',JSON.stringify(normalized));
      return next;
    } finally {
      pending.current = false;
      setIsSaving(false);
    }
  }

  // Derived from the single profile state, never stored in layouts or pages.
  const examDate = profile?.targetExam.examDate ?? '';
  const daysUntilExam = examDate ? Math.round((Date.parse(examDate + 'T00:00:00Z') - today) / DAY) : null;
  const countdownText = daysUntilExam === null ? '未设置考试日期'
    : daysUntilExam > 0 ? '距考试 ' + daysUntilExam + ' 天'
    : daysUntilExam === 0 ? '今天考试' : '考试日期已过 ' + Math.abs(daysUntilExam) + ' 天';
  const directionLabel = profile ? { balanced: '均衡', zh_en: '中译英', en_zh: '英译汉' }[profile.primaryDirection] : '未设置方向';
  return <UserContext.Provider value={{ profile, isSaving, updateProfile, daysUntilExam, countdownText, directionLabel }}>{children}</UserContext.Provider>;
}


