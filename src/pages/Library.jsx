import { useState } from 'react';
import { BID_MODULES, MATERIALS } from '../data/mock.js';

const statusStyle = {
  ready:   { label: '已就绪', color: 'var(--teal)',    bg: 'var(--teal-dim)' },
  missing: { label: '缺失',   color: 'var(--red)',     bg: 'var(--red-dim)' },
  partial: { label: '部分',   color: 'var(--amber)',   bg: 'var(--amber-dim)' },
};

const moduleTypeLabel = { template: '模板', generate: 'AI生成', material: '素材', mixed: '混合' };

export default function Library() {
  const [filter, setFilter] = useState('全部');
  const [search, setSearch] = useState('');

  // Merge modules with their materials
  const merged = BID_MODULES.map(m => {
    const mats = MATERIALS.filter(mat => mat.moduleId === m.id);
    const hasMissing = mats.some(mat => mat.status === 'missing') || (m.autoFill && !mats.length);
    const status = !m.autoFill ? 'manual' : mats.length && !hasMissing ? 'ready' : 'missing';
    return { ...m, mats, status };
  });

  const filterOpts = ['全部', '已就绪', '缺失', '人工处理'];
  const filtered = merged.filter(m => {
    const matchFilter = filter === '全部' || (filter === '已就绪' && m.status === 'ready') || (filter === '缺失' && m.status === 'missing') || (filter === '人工处理' && m.status === 'manual');
    const matchSearch = !search || m.name.includes(search);
    return matchFilter && matchSearch;
  });

  return (
    <div>
      {/* Stats */}
      <div className="stat-grid mb-20" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: '模块总数',   val: BID_MODULES.length,                                       color: 'var(--text-primary)' },
          { label: '素材已就绪', val: merged.filter(m => m.status === 'ready').length,          color: 'var(--teal)' },
          { label: '需人工补充', val: merged.filter(m => m.status === 'missing').length,        color: 'var(--red)' },
          { label: '素材库条目', val: MATERIALS.length,                                          color: 'var(--accent)' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex align-center justify-between mb-16">
        <div className="flex gap-8 align-center">
          <input type="search" placeholder="搜索模块..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 180 }} />
          <div className="chip-row">
            {filterOpts.map(f => <span key={f} className={`tag${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</span>)}
          </div>
        </div>
        <button className="btn btn-primary btn-sm">＋ 上传素材</button>
      </div>

      {/* Module list */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '32px 56px 1fr 80px 80px 120px 100px', gap: 0, padding: '8px 14px', borderBottom: '1px solid var(--border)', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          <div>#</div><div>编号</div><div>模块名称</div><div>类型</div><div>必须</div><div>素材状态</div><div>操作</div>
        </div>
        {filtered.map((m, i) => (
          <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '32px 56px 1fr 80px 80px 120px 100px', gap: 0, padding: '10px 14px', borderBottom: '1px solid var(--border-light)', alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)' }}>{i+1}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)' }}>{m.no}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{m.name}</div>
              {m.mats.length > 0 && (
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  {m.mats.map(mat => mat.name).join(' · ')}
                </div>
              )}
            </div>
            <div>
              <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontFamily: 'var(--mono)' }}>
                {moduleTypeLabel[m.type]}
              </span>
            </div>
            <div>
              {m.required
                ? <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: 'var(--red-dim)', color: 'var(--red)' }}>必须</span>
                : <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>可选</span>
              }
            </div>
            <div>
              {m.status === 'manual'
                ? <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>人工处理</span>
                : <span style={{ fontSize: 11, fontWeight: 500, color: statusStyle[m.status]?.color }}>
                    {statusStyle[m.status]?.label}
                  </span>
              }
            </div>
            <div className="flex gap-6">
              {m.status === 'missing' && <button className="btn btn-sm" style={{ fontSize: 11, background: 'var(--red-dim)', borderColor: 'var(--red)', color: 'var(--red)' }}>上传</button>}
              {m.mats.length > 0 && <button className="btn btn-sm btn-ghost" style={{ fontSize: 11 }}>查看</button>}
              {m.status === 'ready' && <button className="btn btn-sm btn-ghost" style={{ fontSize: 11 }}>替换</button>}
            </div>
          </div>
        ))}
      </div>

      {/* Missing items reminder */}
      {merged.filter(m => m.status === 'missing').length > 0 && (
        <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--red-dim)', border: '1px solid var(--red)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--red)', marginBottom: 8 }}>⚠ 以下模块素材缺失，需人工上传后才能生成标书</div>
          {merged.filter(m => m.status === 'missing').map(m => (
            <div key={m.id} style={{ fontSize: 12, color: 'var(--red)', padding: '3px 0' }}>
              · {m.no} {m.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
