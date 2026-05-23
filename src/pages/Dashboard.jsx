import { BID_MODULES, MATERIALS, HISTORY } from '../data/mock.js';

const ACTIVE_PROJECTS = [
  { id: 1, name: '某市供电局配网自动化系统采购', code: 'GW-2024-0312', step: 2, deadline: '2024-03-28', tag: '国网', modules: 15 },
  { id: 2, name: '南方电网调度通信系统升级改造', code: 'NW-2024-0287', step: 3, deadline: '2024-04-05', tag: '南网', modules: 17 },
];
const STEP_LABELS = ['', '上传招标文件', '确认模块清单', '素材匹配', '填充&生成', '拼装&导出'];

const missingMats = MATERIALS.filter(m => m.status === 'missing');
const readyMats = MATERIALS.filter(m => m.status === 'ready');

export default function Dashboard({ onNav }) {
  return (
    <div>
      {/* Stats */}
      <div className="stat-grid mb-20">
        <div className="stat-card">
          <div className="stat-val">{ACTIVE_PROJECTS.length}</div>
          <div className="stat-label">进行中项目</div>
          <div className="stat-change stat-up">↑ 2 本月新建</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: 'var(--teal)' }}>{readyMats.length}</div>
          <div className="stat-label">素材已就绪</div>
          <div className="stat-change" style={{ color: 'var(--text-muted)' }}>共 {MATERIALS.length} 个模块</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: 'var(--red)' }}>{missingMats.length}</div>
          <div className="stat-label">素材缺失</div>
          <div className="stat-change" style={{ color: 'var(--red)' }}>需人工上传</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: 'var(--teal)' }}>{Math.round(HISTORY.filter(h=>h.result==='中标').length/HISTORY.length*100)}%</div>
          <div className="stat-label">历史中标率</div>
          <div className="stat-change stat-up">↑ 8% vs 去年</div>
        </div>
      </div>

      <div className="grid-2 gap-16 mb-20">
        {/* Active projects */}
        <div>
          <div className="section-hd mb-12">
            <div className="section-title">进行中的标书</div>
            <button className="btn btn-primary btn-sm" onClick={() => onNav('workflow')}>＋ 新建标书</button>
          </div>
          {ACTIVE_PROJECTS.map(p => (
            <div key={p.id} className="card mb-12" style={{ cursor: 'pointer' }} onClick={() => onNav('workflow')}>
              <div className="flex align-center justify-between mb-8">
                <span className={`badge ${p.tag === '国网' ? 'badge-blue' : 'badge-purple'}`}>{p.tag}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--amber)' }}>截止 {p.deadline}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, lineHeight: 1.4 }}>{p.name}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 10 }}>{p.code} · {p.modules} 个模块</div>
              <div className="flex align-center justify-between mb-6">
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>当前：{STEP_LABELS[p.step]}</span>
                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--accent)' }}>步骤 {p.step}/5</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(p.step/5)*100}%`, background: 'var(--accent)' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Module status overview */}
        <div>
          <div className="section-hd mb-12">
            <div className="section-title">素材库状态</div>
            <button className="btn btn-sm" onClick={() => onNav('library')}>查看全部</button>
          </div>
          <div className="card mb-12" style={{ padding: '12px 16px' }}>
            {BID_MODULES.slice(0, 8).map(m => {
              const mat = MATERIALS.find(mat => mat.moduleId === m.id);
              const status = !m.autoFill ? 'manual' : mat?.status === 'ready' ? 'ready' : 'missing';
              return (
                <div key={m.id} className="flex align-center justify-between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div className="flex align-center gap-8">
                    <div className={`dot dot-${status === 'ready' ? 'green' : status === 'missing' ? 'red' : 'amber'}`} />
                    <span style={{ fontSize: 12 }}>{m.name}</span>
                  </div>
                  <span style={{ fontSize: 11, color: status === 'ready' ? 'var(--teal)' : status === 'missing' ? 'var(--red)' : 'var(--text-muted)' }}>
                    {status === 'ready' ? '就绪' : status === 'missing' ? '缺失' : '人工'}
                  </span>
                </div>
              );
            })}
            <div style={{ padding: '8px 0', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', cursor: 'pointer' }} onClick={() => onNav('library')}>
              查看全部 {BID_MODULES.length} 个模块 →
            </div>
          </div>

          {missingMats.length > 0 && (
            <div style={{ padding: '12px 14px', background: 'var(--red-dim)', border: '1px solid var(--red)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--red)', marginBottom: 6 }}>⚠ 需人工上传的素材</div>
              {missingMats.map(m => (
                <div key={m.id} className="flex align-center justify-between" style={{ padding: '4px 0' }}>
                  <span style={{ fontSize: 11, color: 'var(--red)' }}>· {m.name}</span>
                  <button className="btn btn-sm" style={{ fontSize: 10, background: 'var(--red-dim)', borderColor: 'var(--red)', color: 'var(--red)', padding: '2px 8px' }}>上传</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="section-hd mb-12"><div className="section-title">历史标书</div><button className="btn btn-sm" onClick={() => onNav('history')}>查看全部</button></div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead><tr><th>项目名称</th><th>标签</th><th>完成日期</th><th>模块数</th><th>商务得分</th><th>结果</th></tr></thead>
          <tbody>
            {HISTORY.map(h => (
              <tr key={h.id} onClick={() => onNav('history')}>
                <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</td>
                <td><span className={`badge ${h.tag === '国网' ? 'badge-blue' : 'badge-purple'}`}>{h.tag}</span></td>
                <td><span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)' }}>{h.date}</span></td>
                <td><span style={{ fontFamily: 'var(--mono)' }}>{h.modules}</span></td>
                <td><span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: h.score >= 88 ? 'var(--teal)' : 'var(--amber)' }}>{h.score}</span></td>
                <td><span className={`badge ${h.result === '中标' ? 'badge-green' : 'badge-gray'}`}>{h.result}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
