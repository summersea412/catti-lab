import CompanionIllustration from '../../features/companion/CompanionIllustration';
import React from 'react'; import UserProfileForm from '../../features/user/UserProfileForm'; export default function SettingsPage(){return <div className="settings-page"><div className="page-hero"><div><p className="eyebrow">YOUR STUDY DESK</p><h2>设置</h2><p>调整学习档案，让每一次打开都更贴近你的目标。</p></div></div><div className="settings-with-companion"><UserProfileForm /><CompanionIllustration character="orange" size="small" className="settings-companion" /></div></div>}


