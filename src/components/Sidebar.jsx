const NAV = [
  {
    section: '工作台',
    items: [
      { id: 'dashboard', label: '首页总览', icon: '▦' },
      { id: 'workflow', label: '标书工作流', icon: '◈' },
    ]
  },
  {
    section: '素材管理',
    items: [
      { id: 'library', label: '素材库', icon: '⬡' },
      { id: 'templates', label: '模板管理', icon: '⊡' },
    ]
  },
  {
    section: '分析',
    items: [
      { id: 'history', label: '历史标书', icon: '⊘' },
      { id: 'score', label: '评分分析', icon: '◉' },
    ]
  }
];

export default function Sidebar({ active, onNav }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-name">标书智造</div>
        <div className="sidebar-logo-tag">BID·AI v1.0</div>
      </div>
      <div className="sidebar-nav">
        {NAV.map(group => (
          <div key={group.section}>
            <div className="nav-section-label">{group.section}</div>
            {group.items.map(item => (
              <div
                key={item.id}
                className={`nav-item${active === item.id ? ' active' : ''}`}
                onClick={() => onNav(item.id)}
              >
                <span style={{ fontSize: 15, lineHeight: 1 }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div style={{ marginBottom: 2 }}>某科技有限公司</div>
        <div>商务标书自动化系统</div>
      </div>
    </div>
  );
}
