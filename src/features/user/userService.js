import { normalizeNickname, validateProfile } from './userSchema';

// Pure profile operation: the caller owns state; persistence is not connected.
export async function saveProfile(currentProfile, input) {
  const errors = validateProfile(input);
  if (Object.keys(errors).length) {
    const error = new Error('请检查档案字段');
    error.code = 'VALIDATION_ERROR';
    error.fields = errors;
    throw error;
  }
  const now = new Date().toISOString();
  return {
    id: currentProfile?.id ?? 'usr_' + crypto.randomUUID(),
    nickname: input.nickname.trim(),
    nicknameNormalized: normalizeNickname(input.nickname),
    targetExam: {
      certification: 'CATTI', language: 'English', level: 2, mode: 'translation',
      examDate: input.targetExam.examDate,
    },
    dailyStudyMinutes: input.dailyStudyMinutes,
    primaryDirection: input.primaryDirection,
    trainingDirection: input.primaryDirection,
    createdAt: currentProfile?.createdAt ?? now,
    updatedAt: now,
  };
}



