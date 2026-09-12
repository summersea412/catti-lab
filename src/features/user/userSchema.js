export const STUDY_MINUTES = [30, 60, 90, 120];
export const DIRECTIONS = ['zh_en', 'en_zh', 'balanced'];
export const DEFAULT_PROFILE_INPUT = {
  nickname: '', targetExam: { certification: 'CATTI', language: 'English', level: 2, mode: 'translation', examDate: '' },
  dailyStudyMinutes: 60, primaryDirection: 'balanced',
};
export function normalizeNickname(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}
export function validateProfile(input) {
  const errors = {};
  if (typeof input.nickname !== 'string' || !input.nickname.trim()) errors.nickname = '请输入用户昵称';
  const date = input.targetExam?.examDate;
  if (date) {
    const parsed = new Date(date + 'T00:00:00Z');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
      errors.examDate = '请选择有效的考试日期';
    }
  } else if (date !== '') errors.examDate = '请选择有效的考试日期';
  if (!STUDY_MINUTES.includes(input.dailyStudyMinutes)) errors.dailyStudyMinutes = '请选择每天的学习时间';
  if (!DIRECTIONS.includes(input.primaryDirection)) errors.primaryDirection = '请选择主要训练方向';
  return errors;
}

