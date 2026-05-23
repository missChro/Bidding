import { useState } from 'react';
import './index.css';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Workflow from './pages/Workflow.jsx';
import Library from './pages/Library.jsx';
import Templates from './pages/Templates.jsx';
import History from './pages/History.jsx';
import ScoreAnalysis from './pages/ScoreAnalysis.jsx';

const PAGE_META = {
  dashboard: { title: '首页总览', sub: '所有项目一览' },
  workflow:  { title: '标书工作流', sub: '某市供电局配网自动化系统采购 · GW-2024-0312' },
  library:   { title: '素材库', sub: '业绩 / 资质 / 人员 / 承诺函管理' },
  templates: { title: '模板管理', sub: '固定模板 · 可复用模块 · 变量配置' },
  history:   { title: '历史标书', sub: '已完成项目档案' },
  score:     { title: '评分分析', sub: '得分点—应答对照 · 中标率分析' },
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const meta = PAGE_META[page];

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard onNav={setPage} />;
      case 'workflow':  return <Workflow />;
      case 'library':   return <Library />;
      case 'templates': return <Templates />;
      case 'history':   return <History />;
      case 'score':     return <ScoreAnalysis />;
      default:          return <Dashboard onNav={setPage} />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar active={page} onNav={setPage} />
      <div className="main-area">
        <div className="topbar">
          <div>
            <div className="topbar-title">{meta.title}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>{meta.sub}</div>
          </div>
          <div style={{ flex: 1 }} />
          {page === 'workflow' && (
            <>
              <button className="btn btn-sm">⬇ 导出 Word</button>
              <button className="btn btn-primary btn-sm">保存草稿</button>
            </>
          )}
          {page === 'dashboard' && (
            <button className="btn btn-primary btn-sm" onClick={() => setPage('workflow')}>＋ 新建标书</button>
          )}
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: 'var(--accent)', cursor: 'pointer' }}>
            张
          </div>
        </div>
        <div className="page-body">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
