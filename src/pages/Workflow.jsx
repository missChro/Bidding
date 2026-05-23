import { useState } from 'react';
import { BID_MODULES, MATERIALS, COMPANY_VARS } from '../data/mock.js';

const STEPS = [
  { id: 1, label: '上传招标文件',   desc: 'AI 解析商务评分标准、评审因素、偏差要求' },
  { id: 2, label: '确认模块清单',   desc: '核对招标方要求的模块及顺序' },
  { id: 3, label: '素材匹配',       desc: '从素材库自动匹配，缺失项提示人工补充' },
  { id: 4, label: '填充 & 生成',    desc: '变量填入模板，AI 生成动态内容' },
  { id: 5, label: '拼装 & 导出',    desc: '按顺序拼装，统一命名，导出文件' },
];

const typeLabel = { template: '模板填充', generate: 'AI生成', material: '素材匹配', mixed: '混合' };
const typeColor = { template: 'var(--accent)', generate: 'var(--purple)', material: 'var(--teal)', mixed: 'var(--amber)' };

// Simulated parse result from uploaded tender doc
const PARSED_RESULT = {
  projectName: '某市供电局配网自动化系统采购项目',
  tenderNo: 'GW-2024-0312',
  client: '国家电网某市供电局',
  deadline: '2024-03-28',
  requiredModules: ['cover','index_table','review_idx','deviation','auth_letter','basic_info','related_co','pledge','litigation','finance','projects','integrity','pos_dev','patent','awards'],
  scorePoints: [
    { item: '类似项目业绩（合同额≥500万）', score: 15, cat: '业绩' },
    { item: 'ISO9001 质量认证',              score: 8,  cat: '资质' },
    { item: '高新技术企业认定',              score: 6,  cat: '资质' },
    { item: '专利数量（≥10项）',             score: 8,  cat: '专利' },
    { item: '纳税信用 A 级',                 score: 6,  cat: '诚信' },
    { item: '驻场团队配置',                  score: 10, cat: '人员' },
    { item: '售后承诺（≥3年质保）',          score: 10, cat: '承诺' },
  ],
};

export default function Workflow() {
  const [step, setStep] = useState(1);
  const [uploaded, setUploaded] = useState(false);
  const [parsed, setParsed] = useState(false);
  const [moduleStates, setModuleStates] = useState({});  // moduleId -> 'confirmed'|'excluded'|null

  const requiredModules = parsed
    ? BID_MODULES.filter(m => PARSED_RESULT.requiredModules.includes(m.id))
    : BID_MODULES;

  const getMaterialMatch = (moduleId) => {
    const mats = MATERIALS.filter(m => m.moduleId === moduleId);
    if (!mats.length) return null;
    return mats[0];
  };

  const matchSummary = requiredModules.map(m => {
    const mat = getMaterialMatch(m.id);
    const status = m.autoFill && mat?.status === 'ready' ? 'ready'
                 : m.autoFill && (!mat || mat.status === 'missing') ? 'missing'
                 : !m.autoFill ? 'manual'
                 : 'partial';
    return { ...m, mat, matchStatus: status };
  });

  const readyCount   = matchSummary.filter(m => m.matchStatus === 'ready').length;
  const missingCount = matchSummary.filter(m => m.matchStatus === 'missing').length;
  const manualCount  = matchSummary.filter(m => m.matchStatus === 'manual').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 260px', gap: 16, height: 'calc(100vh - 100px)', minHeight: 0 }}>

      {/* ── Left: Step nav ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>生成流程</div>
        {STEPS.map((s, i) => {
          const state = s.id < step ? 'done' : s.id === step ? 'active' : 'todo';
          return (
            <div key={s.id}>
              <div className={`step-item${state === 'active' ? ' active' : ''}${state === 'done' ? ' done' : ''}`} onClick={() => setStep(s.id)}>
                <div className={`step-num s-${state}`}>{state === 'done' ? '✓' : s.id}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: state === 'active' ? 'var(--accent)' : 'var(--text-primary)', marginBottom: 1 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{s.desc}</div>
                </div>
              </div>
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </div>
          );
        })}

        {parsed && (
          <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', fontSize: 12 }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: 8, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>当前项目</div>
            <div style={{ fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 6 }}>{PARSED_RESULT.projectName}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)' }}>{PARSED_RESULT.tenderNo}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', marginTop: 3 }}>截止 {PARSED_RESULT.deadline}</div>
          </div>
        )}
      </div>

      {/* ── Center: Main ── */}
      <div style={{ overflow: 'hidden auto', minWidth: 0 }}>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div className="section-hd mb-16"><div className="section-title">上传招标文件</div></div>
            {!uploaded ? (
              <div className="upload-zone mb-16" onClick={() => setUploaded(true)}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>⬆</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>拖入招标文件（点击模拟上传）</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>支持 PDF / Word，AI 自动解析商务部分</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)', marginTop: 6 }}>解析内容：商务评分标准 · 评审因素 · 偏差要求 · 模块清单</div>
              </div>
            ) : !parsed ? (
              <div style={{ padding: '24px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--amber)', marginBottom: 8 }}>⚙ AI 解析中...</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>正在提取商务评分标准、评审因素、模块要求</div>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => { setParsed(true); setStep(2); }}>模拟完成解析 →</button>
              </div>
            ) : (
              <div style={{ padding: 16, background: 'var(--teal-dim)', border: '1px solid var(--teal)', borderRadius: 'var(--radius-lg)', marginBottom: 16 }}>
                <div style={{ color: 'var(--teal)', fontWeight: 500, marginBottom: 4 }}>✓ 解析完成</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>识别到 {PARSED_RESULT.requiredModules.length} 个模块，{PARSED_RESULT.scorePoints.length} 个评分项</div>
              </div>
            )}
            <div className="section-hd mb-10"><div className="section-title" style={{ fontSize: 12 }}>AI 将解析以下内容</div></div>
            {[
              ['商务评分标准', '各评审项分值、评分规则'],
              ['评审因素清单', '资格要求、商务要求逐项拆解'],
              ['偏差要求',     '哪些条款需要声明响应情况'],
              ['模块要求',     '招标方要求提供的文件模块及顺序'],
              ['关键变量',     '交货期、质保期、项目名称等填充变量'],
            ].map(([t, d]) => (
              <div key={t} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 12 }}>
                <span style={{ color: 'var(--teal)', flexShrink: 0 }}>✓</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500, width: 100, flexShrink: 0 }}>{t}</span>
                <span style={{ color: 'var(--text-muted)' }}>{d}</span>
              </div>
            ))}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div className="section-hd mb-8">
              <div className="section-title">确认模块清单</div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>共 {requiredModules.length} 个模块</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14 }}>以下为招标文件要求提供的商务模块，按顺序排列，可排除非必要项</div>

            {requiredModules.map((m, i) => {
              const state = moduleStates[m.id];
              const excluded = state === 'excluded';
              return (
                <div key={m.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', marginBottom: 4,
                  border: `1px solid ${excluded ? 'var(--border-light)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)',
                  opacity: excluded ? 0.45 : 1,
                }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-muted)', flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ width: 52, fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-muted)', flexShrink: 0 }}>{m.no}</div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: 'var(--bg-elevated)', color: typeColor[m.type], fontFamily: 'var(--mono)' }}>{typeLabel[m.type]}</span>
                  {m.required && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: 'var(--red-dim)', color: 'var(--red)', fontFamily: 'var(--mono)' }}>必须</span>}
                  <button className="btn btn-sm btn-ghost" style={{ fontSize: 11 }} onClick={() => setModuleStates(s => ({ ...s, [m.id]: excluded ? null : 'excluded' }))}>
                    {excluded ? '恢复' : '排除'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <div className="section-hd mb-8">
              <div className="section-title">素材匹配结果</div>
              <div className="flex gap-8">
                <span className="badge badge-green">已匹配 {readyCount}</span>
                <span className="badge badge-red">缺失 {missingCount}</span>
                <span className="badge badge-gray">人工 {manualCount}</span>
              </div>
            </div>

            {['missing', 'manual', 'partial', 'ready'].map(status => {
              const group = matchSummary.filter(m => m.matchStatus === status);
              if (!group.length) return null;
              const labels = { missing: '⚠ 缺失 — 需人工上传', manual: '👤 人工处理', partial: '⚡ 部分匹配', ready: '✓ 自动匹配' };
              const colors = { missing: 'var(--red)', manual: 'var(--amber)', partial: 'var(--accent)', ready: 'var(--teal)' };
              return (
                <div key={status} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: colors[status], marginBottom: 8 }}>{labels[status]}</div>
                  {group.map(m => (
                    <div key={m.id} className="doc-item" style={{ borderColor: status === 'missing' ? 'var(--red-dim)' : undefined }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors[status], flexShrink: 0 }} />
                      <div className="doc-body">
                        <div className="doc-name">{m.name}</div>
                        <div className="doc-meta">
                          {m.mat ? m.mat.name : '素材库中无对应内容'}
                          {m.mat?.note ? ` · ${m.mat.note}` : ''}
                        </div>
                      </div>
                      {status === 'missing' ? (
                        <button className="btn btn-sm" style={{ background: 'var(--red-dim)', borderColor: 'var(--red)', color: 'var(--red)' }}>上传素材</button>
                      ) : status === 'ready' ? (
                        <button className="btn btn-sm btn-ghost">替换</button>
                      ) : (
                        <button className="btn btn-sm">处理</button>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div>
            <div className="section-hd mb-16"><div className="section-title">填充变量 & 生成内容</div></div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>基础变量（自动填充）</div>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                {Object.entries(COMPANY_VARS).map(([k, v], i) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 0, borderBottom: i < Object.entries(COMPANY_VARS).length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                    <div style={{ width: 160, padding: '9px 14px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, borderRight: '1px solid var(--border-light)', flexShrink: 0 }}>{k}</div>
                    <div style={{ flex: 1, padding: '9px 14px', fontSize: 12, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{v}</div>
                    <button className="btn btn-sm btn-ghost" style={{ marginRight: 8 }}>编辑</button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>本次项目变量</div>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                {[
                  ['项目名称', PARSED_RESULT.projectName],
                  ['采购编号', PARSED_RESULT.tenderNo],
                  ['招标人',   PARSED_RESULT.client],
                  ['投标截止日期', PARSED_RESULT.deadline],
                  ['交货期', '合同签订后90天内'],
                  ['质保期', '3年'],
                ].map(([k, v], i, arr) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', borderBottom: i < arr.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                    <div style={{ width: 160, padding: '9px 14px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, borderRight: '1px solid var(--border-light)', flexShrink: 0 }}>{k}</div>
                    <input type="text" defaultValue={v} style={{ flex: 1, border: 'none', borderRadius: 0, background: 'transparent', padding: '9px 14px', fontSize: 12 }} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>AI 生成模块</div>
              {requiredModules.filter(m => m.type === 'generate').map(m => (
                <div key={m.id} className="doc-item">
                  <span style={{ fontSize: 14 }}>🤖</span>
                  <div className="doc-body">
                    <div className="doc-name">{m.name}</div>
                    <div className="doc-meta">根据招标文件评审项自动生成</div>
                  </div>
                  <button className="btn btn-sm">预览生成结果</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div>
            <div className="section-hd mb-16">
              <div className="section-title">拼装 & 导出</div>
              <span className="badge badge-green">✓ 拼装完成</span>
            </div>
            <div style={{ padding: 16, background: 'var(--teal-dim)', border: '1px solid var(--teal)', borderRadius: 'var(--radius-lg)', marginBottom: 20 }}>
              <div style={{ color: 'var(--teal)', fontWeight: 500, marginBottom: 4 }}>✓ {requiredModules.length} 个模块已按顺序拼装</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>文件命名规则：序号_模块名称（如 01_封面、02_评审因素索引表…）</div>
            </div>

            {requiredModules.map((m, i) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', marginBottom: 3, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)', width: 24, flexShrink: 0 }}>{String(i+1).padStart(2,'0')}</span>
                <div style={{ flex: 1, fontSize: 12 }}>{String(i+1).padStart(2,'0')}_{m.name}</div>
                <span className="badge badge-green" style={{ fontSize: 10 }}>✓</span>
                <button className="btn btn-sm btn-ghost" style={{ fontSize: 11 }}>预览</button>
              </div>
            ))}

            <div className="flex gap-12 mt-16">
              <button className="btn btn-primary flex-1" style={{ justifyContent: 'center', padding: '11px' }}>⬇ 导出为统一 Word 文件</button>
              <button className="btn flex-1" style={{ justifyContent: 'center', padding: '11px' }}>⬇ 导出为独立文件（ZIP）</button>
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex justify-between mt-16">
          <button className="btn" onClick={() => setStep(s => Math.max(1, s-1))} disabled={step === 1}>← 上一步</button>
          <button className="btn btn-primary" onClick={() => setStep(s => Math.min(5, s+1))} disabled={step === 5}>下一步 →</button>
        </div>
      </div>

      {/* ── Right: Score summary ── */}
      <div style={{ overflow: 'hidden auto' }}>
        {parsed ? (
          <>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>商务评分项</div>
            <div className="card mb-12" style={{ padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 600, fontFamily: 'var(--mono)', color: 'var(--amber)' }}>
                {PARSED_RESULT.scorePoints.reduce((s, p) => s + p.score, 0)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>商务总分值</div>
            </div>
            {PARSED_RESULT.scorePoints.map(s => (
              <div key={s.item} className="score-row">
                <div className="score-meta">
                  <span style={{ fontSize: 11 }}>{s.item}</span>
                  <span className="score-val" style={{ fontSize: 12, color: 'var(--accent)' }}>{s.score}分</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(s.score / 15) * 100}%`, background: 'var(--accent)' }} />
                </div>
              </div>
            ))}

            <div style={{ marginTop: 16, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>模块统计</div>
            {[
              { label: '共需模块',   val: requiredModules.length,   color: 'var(--text-primary)' },
              { label: '自动填充',   val: readyCount,                color: 'var(--teal)' },
              { label: '需人工处理', val: missingCount + manualCount, color: 'var(--amber)' },
            ].map(r => (
              <div key={r.label} className="flex justify-between align-center" style={{ padding: '7px 0', borderBottom: '1px solid var(--border-light)', fontSize: 12 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: r.color }}>{r.val}</span>
              </div>
            ))}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)', fontSize: 12 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⬆</div>
            上传招标文件后<br />此处显示评分项分析
          </div>
        )}
      </div>
    </div>
  );
}
