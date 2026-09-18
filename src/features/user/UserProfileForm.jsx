import React, { useState } from 'react';
import useCurrentUser from '../../hooks/useCurrentUser';
import { DEFAULT_PROFILE_INPUT, STUDY_MINUTES } from './userSchema';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const directionLabels = [['zh_en', '中译英'], ['en_zh', '英译汉'], ['balanced', '均衡']];
export default function UserProfileForm() {
  const { profile, isSaving, updateProfile } = useCurrentUser();
  const [draft, setDraft] = useState(() => profile ?? DEFAULT_PROFILE_INPUT);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  function change(key, value) {
    setDraft(previous => key === 'examDate'
      ? { ...previous, targetExam: { ...previous.targetExam, examDate: value } }
      : { ...previous, [key]: value });
    setErrors(previous => ({ ...previous, [key]: undefined }));
    setMessage('');
  }
  function cancel() {
    setDraft(profile ?? DEFAULT_PROFILE_INPUT);
    setErrors({});
    setMessage('');
  }
  async function save(event) {
    event.preventDefault();
    setMessage('');
    setErrors({});
    try {
      const saved = await updateProfile(draft);
      setDraft(saved);
      setMessage('设置已保存');
    } catch (error) {
      setErrors(error.fields ?? { form: '暂时无法保存，请重试' });
    }
  }
  return <div className="profile-shell">
    <style>{styles}</style>
    <Card className="profile-card">
      <div className="profile-heading">
        <div><p className="eyebrow">LEARNING PROFILE</p><h2>学习档案</h2><p className="profile-lead">让学习节奏，贴合你的每一天。</p></div>
        <Badge>YOUR STUDY RHYTHM</Badge>
      </div>
      <form onSubmit={save} noValidate>
        <fieldset disabled={isSaving} className="profile-fields">
          <div className="profile-field">
            <label htmlFor="profile-nickname">用户昵称</label>
            <Input id="profile-nickname" value={draft.nickname} placeholder="Sonya" autoComplete="nickname"
              aria-required="true" aria-invalid={Boolean(errors.nickname)} aria-describedby={errors.nickname ? 'nickname-error' : undefined}
              onChange={e => change('nickname', e.target.value)} />
            {errors.nickname && <p id="nickname-error" className="field-error" role="alert">{errors.nickname}</p>}
          </div>
          <div className="profile-field">
            <label htmlFor="profile-exam">目标考试 <span className="field-aside">固定考试</span></label>
            <Input id="profile-exam" value="CATTI 英语二级笔译" readOnly />
          </div>
          <div className="profile-field">
            <label htmlFor="profile-date">考试日期 <span className="field-aside">可稍后填写</span></label>
            <Input id="profile-date" type="date" value={draft.targetExam.examDate}
              aria-invalid={Boolean(errors.examDate)} aria-describedby={errors.examDate ? 'date-error' : undefined}
              onChange={e => change('examDate', e.target.value)} />
            {errors.examDate && <p id="date-error" className="field-error" role="alert">{errors.examDate}</p>}
          </div>
          <fieldset className="profile-choice">
            <legend>每天可学习时间</legend>
            <div className="choice-row">{STUDY_MINUTES.map(minutes => <label key={minutes} className="choice">
              <input type="radio" name="study-minutes" checked={draft.dailyStudyMinutes === minutes} onChange={() => change('dailyStudyMinutes', minutes)} />
              <span>{minutes} <small>min</small></span>
            </label>)}</div>
            {errors.dailyStudyMinutes && <p className="field-error" role="alert">{errors.dailyStudyMinutes}</p>}
          </fieldset>
          <fieldset className="profile-choice">
            <legend>主要训练方向</legend>
            <div className="choice-row directions">{directionLabels.map(([value, label]) => <label key={value} className="choice">
              <input type="radio" name="direction" checked={draft.primaryDirection === value} onChange={() => change('primaryDirection', value)} />
              <span>{label}</span>
            </label>)}</div>
            {errors.primaryDirection && <p className="field-error" role="alert">{errors.primaryDirection}</p>}
          </fieldset>
        </fieldset>
        <div className="profile-footer">
          <div className="save-feedback" role="status" aria-live="polite">{message}</div>
          <div className="profile-actions">
            <Button disabled={isSaving} onClick={cancel}>取消</Button>
            <Button className="primary" type="submit" disabled={isSaving}>{isSaving ? '保存中…' : '保存设置'}</Button>
          </div>
        </div>
        {errors.form && <p role="alert" className="field-error">{errors.form}</p>}
      </form>
    </Card>
    <p className="profile-session-note">设置会保存在当前设备，刷新后仍然保留。</p>
  </div>;
}
const styles = `
.profile-shell {max-width:790px}
.profile-shell .profile-card{border:1px solid var(--line);border-radius:14px;background:var(--paper);overflow:hidden}
.profile-heading{padding:28px 30px;background:linear-gradient(110deg,#eee7f5,#faf6ed);display:flex;justify-content:space-between;gap:18px;align-items:flex-start;border-bottom:1px solid var(--line)}
.profile-heading h2{margin:0;font-size:26px;font-weight:500}
.profile-lead{font-size:13px;color:var(--muted);margin:10px 0 0}
.profile-shell .ui-badge{display:inline-block;background:var(--butter);border:1px solid #e8dba9;border-radius:20px;padding:7px 10px;font-size:9px;letter-spacing:.09em;white-space:nowrap}
.profile-fields{border:0;padding:28px 30px;margin:0;display:grid;gap:24px}
.profile-field{display:grid;gap:9px}
.profile-field label,.profile-choice legend{font-size:14px;font-weight:500}
.field-aside{font-size:11px;color:var(--muted);font-weight:400;margin-left:8px}
.profile-shell .ui-input{box-sizing:border-box;width:100%;min-width:0;min-height:44px;padding:11px 13px;border:1px solid var(--line);border-radius:7px;background:#fffefb;color:var(--ink);font:inherit;font-size:14px}
.profile-shell .ui-input[readonly]{background:#f0f3ed;color:#586450}
.profile-shell .ui-input:focus-visible,.profile-shell .ui-button:focus-visible{outline:2px solid #a68bbf;outline-offset:3px}
.profile-shell .ui-input[aria-invalid=true]{border-color:#ac6261}
.profile-choice{margin:0;padding:0;border:0;min-width:0}
.profile-choice legend{padding:0;margin-bottom:12px}
.choice-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.choice-row.directions{grid-template-columns:repeat(3,1fr)}
.choice{position:relative;cursor:pointer}
.choice input{position:absolute;opacity:0;width:1px;height:1px}
.choice span{display:block;text-align:center;border:1px solid var(--line);border-radius:7px;padding:12px 5px;font-size:14px;background:var(--paper)}
.choice small{font-size:11px;color:var(--muted);margin-left:3px}
.choice input:checked + span{background:var(--lav);border-color:#b9a8cf;color:var(--navy)}
.directions .choice input:checked + span{background:var(--sage);border-color:#aebfa7}
.choice input:focus-visible + span{outline:2px solid #a68bbf;outline-offset:3px}
.choice:hover span{border-color:#b9a8cf}
.profile-footer{padding:20px 30px;border-top:1px solid var(--line);display:flex;gap:12px;align-items:center;justify-content:space-between;background:#fcfaf6}
.profile-actions{display:flex;gap:10px;margin-left:auto}
.profile-shell .ui-button{cursor:pointer;border:1px solid var(--line);border-radius:7px;padding:11px 17px;background:var(--paper);color:var(--ink);font:inherit;font-size:13px;white-space:nowrap}
.profile-shell .ui-button.primary{background:var(--lav);border-color:#c6b5db}
.profile-shell .ui-button:hover{filter:brightness(.97)}
.profile-shell .ui-button:disabled{opacity:.6;cursor:wait}
.save-feedback{font-size:12px;color:#4e6c46}
.field-error{font-size:12px;color:#a15151;margin:0}
.profile-session-note{font-size:11px;color:var(--muted);line-height:1.7;padding:0 5px}
@media(max-width:700px){.profile-heading,.profile-fields,.profile-footer{padding:20px}.profile-heading{flex-wrap:wrap}.choice-row{grid-template-columns:repeat(2,1fr)}.profile-footer{flex-wrap:wrap}}
`;


