import { useState } from 'react';
import { BID_MODULES, COMPANY_VARS } from '../data/mock.js';

// Variables per module
const MODULE_VARS = {
  cover:       ['项目名称', '采购编号', '标的名称', '标包名称', '公司名称'],
  review_idx:  ['项目名称', '采购编号'],
  deviation:   ['项目名称', '标的/标包/标段名称', '公司名称'],
  legal_rep:   ['公司名称', '法定代表人', '性别', '年龄', '职务'],
  auth_letter: ['法定代表人', '公司名称', '委托代理人', '联系电话'],
  seal_proof:  ['招标方公司名称', '投标专用章', '公司名称'],
  basic_info:  ['公司名称', '统一社会信用代码', '法定代表人', '注册地址', '联系人', '联系电话', '电子邮箱', '网址', '基本账户开户行', '基本账户账号'],
  related_co:  ['公司名称'],
  pledge:      ['公司名称', '项目名称'],
  litigation:  ['公司名称'],
  finance:     ['公司名称', '年份1', '年份2', '年份3'],
  projects:    ['公司名称', '项目名称', '合同签订时间', '合同对方', '合同金额'],
  integrity:   ['公司名称', '纳税信用等级', '年份'],
};

const PREVIEW_CONTENT = {
  cover: `（{项目名称}）投标文件\n\n采购编号：（{采购编号}）\n\n商务投标文件\n\n投标人：{公司名称}（盖单位公章或电子印章）`,
  deviation: `投标偏差表（商务部分）\n\n项目名称：{项目名称}\n标的/标包/标段名称：{标的/标包/标段名称}\n\n如完全响应，投标人应在偏差表中填写"无偏差"。\n\n投标人名称（盖公章/电子章）：{公司名称}`,
  auth_letter: `授权委托书\n\n本人{法定代表人}系{公司名称}的法定代表人，现委托{委托代理人}为我方代理人。代理人根据授权，以我方名义签署、澄清确认、递交、撤回、修改投标文件、签订合同和处理有关事宜。\n\n投标人：{公司名称}（盖单位公章）`,
  basic_info: `投标人基本情况表\n\n投标人名称：{公司名称}\n统一社会信用代码：{统一社会信用代码}\n法定代表人：{法定代表人}\n注册地址：{注册地址}\n联系人：{联系人}\n联系电话：{联系电话}`,
};

export default function Templates() {
  const [selected, setSelected] = useState('cover');
  const [varValues, setVarValues] = useState({});

  const templateModules = BID_MODULES.filter(m => m.type === 'template' || m.type === 'generate');
  const sel = BID_MODULES.find(m => m.id === selected);
  const vars = MODULE_VARS[selected] || [];

  const getValue = (v) => varValues[v] ?? COMPANY_VARS[v] ?? '';
  const preview = (PREVIEW_CONTENT[selected] || `【${sel?.name}】\n\n模板内容将根据变量自动填充。`)
    .replace(/\{([^}]+)\}/g, (_, k) => getValue(k) || `{{${k}}}`);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr', gap: 16, height: 'calc(100vh - 100px)', minHeight: 0 }}>

      {/* Left: module list */}
      <div style={{ overflow: 'hidden auto' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>商务模板模块</div>
        {templateModules.map(m => (
          <div key={m.id} onClick={() => setSelected(m.id)} style={{
            padding: '9px 12px', marginBottom: 3, borderRadius: 'var(--radius-md)', cursor: 'pointer',
            background: selected === m.id ? 'var(--accent-glow)' : 'var(--bg-surface)',
            border: `1px solid ${selected === m.id ? 'var(--accent)' : 'var(--border)'}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: selected === m.id ? 500 : 400, color: selected === m.id ? 'var(--accent)' : 'var(--text-primary)', marginBottom: 2 }}>{m.name}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>{m.no} · {m.type === 'generate' ? 'AI生成' : '模板填充'}</div>
          </div>
        ))}
      </div>

      {/* Center: variables */}
      <div style={{ overflow: 'hidden auto' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>变量填写</div>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 16 }}>
          {vars.length ? vars.map((v, i) => (
            <div key={v} style={{ display: 'flex', alignItems: 'center', borderBottom: i < vars.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
              <div style={{ width: 140, padding: '9px 12px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, borderRight: '1px solid var(--border-light)', flexShrink: 0 }}>{v}</div>
              <input
                type="text"
                value={getValue(v)}
                onChange={e => setVarValues(s => ({ ...s, [v]: e.target.value }))}
                placeholder={`输入${v}`}
                style={{ flex: 1, border: 'none', borderRadius: 0, background: 'transparent', padding: '9px 12px', fontSize: 12 }}
              />
              {COMPANY_VARS[v] && <span style={{ fontSize: 10, color: 'var(--teal)', padding: '0 10px', flexShrink: 0 }}>自动</span>}
            </div>
          )) : (
            <div style={{ padding: '20px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>此模块无需手动填写变量</div>
          )}
        </div>
        <div className="flex gap-8">
          <button className="btn flex-1" style={{ justifyContent: 'center' }}>重置为默认值</button>
          <button className="btn btn-primary flex-1" style={{ justifyContent: 'center' }}>生成此模块</button>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>变量说明</div>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {[['公司名称','素材库 — 基础信息'],['项目名称','本次招标文件解析'],['采购编号','本次招标文件解析'],['法定代表人','素材库 — 基础信息'],['联系电话','素材库 — 基础信息']].map(([v, src], i, arr) => (
              <div key={v} style={{ display: 'flex', padding: '8px 12px', borderBottom: i < arr.length-1 ? '1px solid var(--border-light)' : 'none', fontSize: 11 }}>
                <code style={{ color: 'var(--accent)', background: 'var(--accent-dim)', padding: '1px 6px', borderRadius: 3, marginRight: 10, fontFamily: 'var(--mono)', flexShrink: 0 }}>{`{${v}}`}</code>
                <span style={{ color: 'var(--text-muted)' }}>{src}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: preview */}
      <div style={{ overflow: 'hidden auto' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>预览效果</div>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', minHeight: 240 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, fontFamily: 'var(--mono)' }}>{sel?.no} · {sel?.name}</div>
          <pre style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'var(--font)' }}>{preview}</pre>
        </div>
        <button className="btn btn-primary mt-16" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>⬇ 导出此模块 Word</button>
      </div>
    </div>
  );
}
