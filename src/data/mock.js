// ─── 商务标书模块定义（按真实顺序）───
export const BID_MODULES = [
  { id: 'cover',       no: '0',    name: '封面',                   required: true,  autoFill: true,  type: 'template', file: '1_商务_封面' },
  { id: 'index_table', no: '引1',  name: '初步评审响应一览表',      required: true,  autoFill: true,  type: 'generate', file: null },
  { id: 'review_idx',  no: '一',   name: '评审因素索引表',          required: true,  autoFill: true,  type: 'generate', file: '2_商务_评审因素索引表' },
  { id: 'deviation',   no: '二',   name: '投标偏差表（商务部分）',  required: true,  autoFill: true,  type: 'template', file: '3_商务_投标偏差表' },
  { id: 'legal_rep',   no: '三',   name: '法定代表人身份证明',      required: false, autoFill: true,  type: 'template', file: '4_商务_法定代表人身份证明' },
  { id: 'auth_letter', no: '四',   name: '授权委托书',              required: false, autoFill: true,  type: 'template', file: '5_商务_授权委托书' },
  { id: 'seal_proof',  no: '五',   name: '投标专用章效力证明文件',  required: false, autoFill: false, type: 'template', file: '6_商务_投标专用章效力证明文件' },
  { id: 'basic_info',  no: '六',   name: '投标人基本情况表',        required: true,  autoFill: true,  type: 'template', file: '7_商务_投标人基本情况表' },
  { id: 'related_co',  no: '七',   name: '投标人关联企业情况声明',  required: true,  autoFill: true,  type: 'template', file: '8_商务_投标人关联企业情况声明' },
  { id: 'pledge',      no: '八',   name: '投标人承诺书',            required: true,  autoFill: true,  type: 'template', file: '9_商务_投标人承诺书' },
  { id: 'litigation',  no: '九',   name: '近年发生的诉讼及仲裁情况表', required: true, autoFill: true, type: 'template', file: '10_商务_近年发生的诉讼及仲裁情况表' },
  { id: 'finance',     no: '十',   name: '近年财务状况表',          required: true,  autoFill: true,  type: 'material', file: '11_商务_近年财务状况表' },
  { id: 'projects',    no: '十一', name: '近年完成的类似项目情况表',required: true,  autoFill: true,  type: 'material', file: '12_商务_近年完成的类似项目情况表' },
  { id: 'integrity',   no: '十二', name: '诚信经营',                required: true,  autoFill: false, type: 'material', file: '13_商务_诚信经营' },
  { id: 'others',      no: '十三', name: '需要提供的其他商务文件',  required: false, autoFill: false, type: 'mixed',    file: '14_商务_需要提供的其他商务文件' },
  { id: 'pos_dev',     no: '十三(一)', name: '正偏差总体说明（共32项）', required: false, autoFill: false, type: 'material', file: null },
  { id: 'patent',      no: '十三(二)', name: '企业自有专利情况',    required: false, autoFill: false, type: 'material', file: null },
  { id: 'copyright',   no: '十三(三)', name: '课程类作品著作权',    required: false, autoFill: false, type: 'material', file: null },
  { id: 'books',       no: '十三(四)', name: '出版书籍情况',        required: false, autoFill: false, type: 'material', file: null },
  { id: 'awards',      no: '十三(五)', name: '企业所获奖项',        required: false, autoFill: false, type: 'material', file: null },
];

// ─── 素材库（待填充真实公司数据）───
export const MATERIALS = [
  { id: 'm1', moduleId: 'basic_info', name: '投标人基本情况表（已填）', status: 'ready', lastUpdate: '2024-03-01', note: '含营业执照、三证' },
  { id: 'm2', moduleId: 'finance',    name: '2021-2023年财务状况表',    status: 'ready', lastUpdate: '2024-02-15', note: '含审计报告' },
  { id: 'm3', moduleId: 'projects',   name: '类似项目业绩表（国网版）', status: 'ready', lastUpdate: '2024-03-10', note: '3个500万以上项目' },
  { id: 'm4', moduleId: 'projects',   name: '类似项目业绩表（南网版）', status: 'ready', lastUpdate: '2024-03-10', note: '2个业绩' },
  { id: 'm5', moduleId: 'litigation', name: '诉讼仲裁声明（无败诉）',   status: 'ready', lastUpdate: '2024-01-20', note: '标准版' },
  { id: 'm6', moduleId: 'related_co', name: '关联企业声明（已填）',     status: 'ready', lastUpdate: '2024-02-01', note: '' },
  { id: 'm7', moduleId: 'pledge',     name: '投标人承诺书（通用版）',   status: 'ready', lastUpdate: '2024-01-15', note: '' },
  { id: 'm8', moduleId: 'integrity',  name: '纳税信用A级证明2023',      status: 'ready', lastUpdate: '2023-05-01', note: '税务总局' },
  { id: 'm9', moduleId: 'patent',     name: '企业专利清单（23项）',     status: 'ready', lastUpdate: '2024-03-01', note: '发明专利8项' },
  { id: 'm10',moduleId: 'awards',     name: '企业奖项证书汇总',         status: 'ready', lastUpdate: '2024-02-20', note: '省级以上5项' },
  { id: 'm11',moduleId: 'copyright',  name: '课程著作权证书（12项）',   status: 'ready', lastUpdate: '2024-01-10', note: '' },
  { id: 'm12',moduleId: 'books',      name: '出版书籍情况表',           status: 'missing', lastUpdate: null, note: '需补充' },
  { id: 'm13',moduleId: 'pos_dev',    name: '正偏差总体说明32项',       status: 'missing', lastUpdate: null, note: '需根据招标文件生成' },
  { id: 'm14',moduleId: 'seal_proof', name: '投标专用章效力证明',       status: 'missing', lastUpdate: null, note: '需线下盖章扫描' },
];

// ─── 填充变量（公司基础信息）───
export const COMPANY_VARS = {
  '公司名称': '某科技有限公司',
  '统一社会信用代码': '91440300XXXXXXXXXX',
  '法定代表人': '张某某',
  '注册地址': '广东省深圳市南山区科技园XX路XX号',
  '联系人': '李某某',
  '联系电话': '0755-XXXXXXXX',
  '电子邮箱': 'bidding@example.com',
  '网址': 'www.example.com',
  '基本账户开户行': '中国建设银行深圳南山支行',
  '基本账户账号': '4400XXXXXXXXXXXXXXXX',
};

// ─── 历史项目 ───
export const HISTORY = [
  { id: 1, name: '某省电力公司变电站综合监控平台', date: '2024-02-15', score: 91, result: '中标', amount: '430万', tag: '国网', modules: 14 },
  { id: 2, name: '输电线路在线监测系统采购项目',   date: '2024-01-30', score: 88, result: '中标', amount: '920万', tag: '国网', modules: 16 },
  { id: 3, name: '某市配电网自动化改造项目',       date: '2023-12-20', score: 79, result: '未中标', amount: '560万', tag: '国网', modules: 13 },
  { id: 4, name: '南方电网数字化运维平台',         date: '2023-11-18', score: 85, result: '中标', amount: '1580万', tag: '南网', modules: 17 },
];
