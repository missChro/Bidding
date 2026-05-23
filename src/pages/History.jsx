import { HISTORY } from '../data/mock.js';

export default function History() {
  const won = HISTORY.filter(h => h.result === '中标');
  return (
    <div>
      <div className="stat-grid mb-20">
        {[
          { label: '历史项目', val: HISTORY.length, color: 'var(--text-primary)' },
          { label: '中标率', val: `${Math.round(won.length/HISTORY.length*100)}%`, color: 'var(--teal)' },
          { label: '平均模块数', val: Math.round(HISTORY.reduce((s,h)=>s+h.modules,0)/HISTORY.length), color: 'var(--accent)' },
          { label: '平均得分', val: Math.round(HISTORY.reduce((s,h)=>s+h.score,0)/HISTORY.length), color: 'var(--amber)' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead><tr><th>项目名称</th><th>标签</th><th>完成日期</th><th>模块数</th><th>合同金额</th><th>商务得分</th><th>结果</th><th>操作</th></tr></thead>
          <tbody>
            {HISTORY.map(h => (
              <tr key={h.id}>
                <td style={{ maxWidth: 280, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontWeight:500 }}>{h.name}</td>
                <td><span className={`badge ${h.tag==='国网'?'badge-blue':'badge-purple'}`}>{h.tag}</span></td>
                <td><span style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--text-muted)' }}>{h.date}</span></td>
                <td><span style={{ fontFamily:'var(--mono)' }}>{h.modules}</span></td>
                <td><span style={{ fontFamily:'var(--mono)' }}>{h.amount}</span></td>
                <td><span style={{ fontFamily:'var(--mono)', fontWeight:600, color: h.score>=88?'var(--teal)':'var(--amber)' }}>{h.score}</span></td>
                <td><span className={`badge ${h.result==='中标'?'badge-green':'badge-gray'}`}>{h.result}</span></td>
                <td><div className="flex gap-6"><button className="btn btn-sm btn-ghost">查看</button><button className="btn btn-sm">复用</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
