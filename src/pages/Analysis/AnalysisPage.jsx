import CompanionIllustration from '../../features/companion/CompanionIllustration';
import React from 'react';
export default function AnalysisPage() {
  return <div className="analysis-preview">
    <style>{`
      .analysis-preview{min-width:0}
      .analysis-intro{display:flex;justify-content:space-between;gap:15px;align-items:center;margin-bottom:22px}
      .analysis-intro h2{font:normal 27px Georgia,serif;margin:0 0 8px}
      .analysis-intro p{margin:0;color:var(--muted);font-size:13px;line-height:1.6}
      .analysis-preview .preview-label{border:1px solid var(--line);background:var(--paper);padding:6px 10px;border-radius:18px;font-size:11px;white-space:nowrap;color:var(--muted)}
      .analysis-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:22px}
      .analysis-metric{border:1px solid var(--line);border-radius:10px;padding:18px 14px;background:var(--lav)}
      .analysis-metric:nth-child(2){background:var(--butter)}.analysis-metric:nth-child(3){background:var(--blush)}.analysis-metric:nth-child(4){background:var(--sage)}
      .analysis-metric h3{font-size:12px;font-weight:400;margin:0}.analysis-metric strong{font:normal 30px Georgia,serif;display:block;margin:18px 0 10px}
      .analysis-metric small{font-size:11px;color:var(--muted)}
      .analysis-panels{display:grid;grid-template-columns:1.3fr 1fr;gap:16px}
      .analysis-panel{border:1px solid var(--line);border-radius:11px;background:var(--paper);padding:22px;min-width:0}
      .analysis-panel h3{font-size:16px;font-weight:500;margin:0 0 8px}
      .analysis-panel p{font-size:12px;color:var(--muted);line-height:1.8}
      .trend-placeholder{height:275px;margin-top:20px;border-bottom:1px solid var(--line);background:repeating-linear-gradient(to bottom,transparent 0,transparent 36px,#e9e4dc 37px,transparent 38px);display:grid;place-items:center}
      .trend-placeholder span{background:var(--paper);padding:10px;color:var(--muted);font-size:12px}
      .trend-axis{display:flex;justify-content:space-between;margin-top:10px;color:var(--muted);font-size:10px}
      .distribution-row{display:flex;justify-content:space-between;border-bottom:1px solid #eae4dc;padding:10px 0;font-size:13px}
      .distribution-row i{display:inline-block;width:8px;height:8px;background:var(--lav-deep);border-radius:50%;margin-right:9px}
      .analysis-bottom{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}
      .analysis-bottom .analysis-panel:first-child{background:#f2f5ef}
      .analysis-bottom .analysis-panel:last-child{background:#faf2e2}

      .panel-heading{display:flex;justify-content:space-between;gap:12px;align-items:baseline}
      .panel-heading>span{font-size:11px;color:var(--muted);white-space:nowrap}
      .empty-donut{box-sizing:border-box;width:130px;height:130px;border:14px solid #eee9e1;border-radius:50%;margin:20px auto 10px;display:flex;flex-direction:column;align-items:center;justify-content:center}
      .empty-donut strong{font:normal 30px Georgia,serif}.empty-donut span{font-size:11px;color:var(--muted);margin-top:3px}
      .mix-empty{text-align:center}
      .ability-region{padding:15px;border:1px solid #dce4d5;border-radius:8px;background:#f0f4ec;margin-top:12px}
      .ability-region:last-child{background:#faf0ec;border-color:#ebddd6}
      .ability-region h4{font-size:13px;font-weight:500;margin:0 0 7px}
      .ability-region p{margin:0}
      .analysis-bottom .analysis-panel:first-child{background:var(--paper)}
      @media(max-width:1200px){.analysis-metrics{grid-template-columns:repeat(2,1fr)}.analysis-panels,.analysis-bottom{grid-template-columns:1fr}}
    `}</style>
    <div className="analysis-intro"><div><h2>A view of your progress</h2><p>把每一次练习，慢慢积累成看得见的进步。</p></div><span className="preview-label">布局预览 · 暂无学习数据</span></div>
    <div className="analysis-metrics">{[
      ['学习时长','—','累计 / 本周 · 暂无记录'],['完成练习','0','暂无已完成练习'],['正确率 / 综合表现','—','完成训练后呈现'],['连续学习','0 天','从第一次练习开始'],
    ].map(([title,value,note]) => <section className="analysis-metric" key={title}><h3>{title}</h3><strong>{value}</strong><small>{note}</small></section>)}</div>
    <div className="analysis-panels">
      <section className="analysis-panel"><p className="eyebrow">STUDY RHYTHM</p><div className="panel-heading"><h3>学习时长趋势</h3><span>最近 7 天</span></div><p>暂无学习时长记录</p><div className="trend-placeholder"><span>记录学习后，趋势将在这里呈现</span></div><div className="trend-axis" aria-hidden="true"><span>7 天前</span><span>今天</span></div></section>
      <section className="analysis-panel"><p className="eyebrow">PRACTICE MIX</p><h3>练习类型分布</h3><div className="empty-donut" role="img" aria-label="练习类型分布：0 次练习，暂无数据"><strong>0</strong><span>次练习</span></div><p className="mix-empty">暂无练习数据</p>{['中译英','英译汉','段落训练','真题训练'].map(t=><div className="distribution-row" key={t}><span><i />{t}</span><span>—</span></div>)}</section>
    </div>
    <CompanionIllustration character="green" size="small" className="analytics-companion" /><div className="analysis-bottom">
      <section className="analysis-panel"><p className="eyebrow">STRENGTHS & GROWTH</p><h3>优势与待提升</h3><div className="ability-region"><h4>做得好的方面</h4><p>完成几次训练后，这里会逐渐形成你的能力画像。</p></div><div className="ability-region"><h4>可以提升的方面</h4><p>完成几次训练后，这里会逐渐形成你的能力画像。</p></div></section>
      <section className="analysis-panel"><p className="eyebrow">NEXT SMALL STEP</p><h3>下一步建议</h3><p>完成第一次训练后，我们会根据你的表现生成学习建议。</p></section>
    </div>
  </div>;
}




