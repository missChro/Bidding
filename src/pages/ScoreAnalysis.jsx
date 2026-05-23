import { BID_MODULES, MATERIALS, HISTORY } from '../data/mock.js';

const SCORE_POINTS = [
  { item: '类似项目业绩（合同额≥500万）', module: 'projects',   score: 15, hit: true  },
  { item: 'ISO9001 质量认证',              module: 'basic_info', score: 8,  hit: true  },
  { item: '高新技术企业认定',              module: 'basic_info', score: 6,  hit: true  },
  { item: '专利数量（≥10项）',             module: 'patent',     score: 8,  hit: true  },
  { item: '纳税信用 A 级',                 module: 'integrity',  score: 6,  hit: true  },
  { item: '驻场团队配置',                  module: null,         score: 10, hit: false },
  { item: '出版书籍（≥1本）',              module: 'books',      score: 5,  hit: false },
  { item: '企业所获奖项（省级以上）',      module: 'awards',     score: 8,  hit: true  },
];

export default function ScoreAnalysis() {
  const total = SCORE_POINTS.reduce((s,p) => s+p.score, 0);
  const achieved = SCORE_POINTS.filter(p=>p.hit).reduce((s,p) => s+p.score, 0);
  return (
    <div>
      <div className="stat-grid mb-20">
        {[
          { label: '总分值', val: total, color: 'var(--text-primary)' },
          { label: '当前预估得分', val: achieved, color: 'var(--amber)' },
          { label: '已覆盖项', val: SCORE_POINTS.filter(p=>p.hit).length, color: 'var(--teal)' },
          { label: '缺失项', val: SCORE_POINTS.filter(p=>!p.hit).length, color: 'var(--red)' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-val" style={{ color: s.color, fontFamily:'var(--mono)' }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid-2 gap-16">
        <div>
          <div className="section-hd mb-12"><div className="section-title">得分点 — 应答对照</div></div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead><tr><th>得分点</th><th>分值</th><th>对应模块</th><th>状态</th></tr></thead>
              <tbody>
                {SCORE_POINTS.map((s, i) => {
                  const mod = s.module ? BID_MODULES.find(m => m.id === s.module) : null;
                  return (
                    <tr key={i}>
                      <td style={{ fontSize: 12 }}>{s.item}</td>
                      <td><span style={{ fontFamily:'var(--mono)', fontWeight:600, color:'var(--accent)' }}>{s.score}</span></td>
                      <td><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{mod?.name || '需额外提供'}</span></td>
                      <td><span className={`badge ${s.hit?'badge-green':'badge-red'}`}>{s.hit?'已覆盖':'缺失'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="section-hd mb-12"><div className="section-title">缺失项处理建议</div></div>
          {SCORE_POINTS.filter(p=>!p.hit).map((s,i) => (
            <div key={i} style={{ padding:'12px 14px', background:'var(--red-dim)', border:'1px solid var(--red)', borderRadius:'var(--radius-md)', marginBottom: 8 }}>
              <div className="flex justify-between align-center mb-4">
                <span style={{ fontSize:12, fontWeight:500, color:'var(--red)' }}>{s.item}</span>
                <span style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--red)' }}>-{s.score}分</span>
              </div>
              <div style={{ fontSize:11, color:'var(--text-muted)' }}>
                {s.module ? `上传素材到模块：${BID_MODULES.find(m=>m.id===s.module)?.name}` : '需人工补充对应材料'}
              </div>
            </div>
          ))}
          <div className="section-hd mb-12 mt-16"><div className="section-title">历史得分参考</div></div>
          {HISTORY.map(h => (
            <div key={h.id} className="flex align-center gap-10 mb-8">
              <div className={`dot dot-${h.result==='中标'?'green':'amber'}`} />
              <div style={{ flex:1, fontSize:11, color:'var(--text-secondary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{h.name}</div>
              <div style={{ width:60, height:3, background:'var(--bg-elevated)', borderRadius:2, overflow:'hidden', flexShrink:0 }}>
                <div style={{ height:'100%', width:`${h.score}%`, background: h.result==='中标'?'var(--teal)':'var(--text-muted)', borderRadius:2 }} />
              </div>
              <span style={{ fontFamily:'var(--mono)', fontSize:11, fontWeight:600, color:h.result==='中标'?'var(--teal)':'var(--text-muted)', flexShrink:0 }}>{h.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
