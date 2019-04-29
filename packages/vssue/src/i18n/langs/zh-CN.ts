import VueI18n from 'vue-i18n'

const messages: VueI18n.LocaleMessageObject = {
  // auth
  login: '使用 {platform} 登录',
  logout: '退出登录',
  currentUser: '当前用户',

  // comment input
  loading: '加载中',
  submit: '提交',
  submitting: '发表中',
  submitComment: '发表评论',
  cancel: '取消',
  edit: '编辑',
  editMode: '编辑模式',
  delete: '删除',
  reply: '回复',

  // reactions
  heart: '喜欢',
  like: '赞',
  unlike: '踩',

  // pagination
  perPage: '每页评论数',
  sort: '点击改变排序方式',
  page: '页数',
  prev: '上一页',
  next: '下一页',

  // hint
  comments: '评论 | {count} 条评论 | {count} 条评论',
  loginToComment: '使用 {platform} 帐号登录后发表评论',
  placeholder: '留下你的评论丨支持 Markdown 语法丨Ctrl + Enter 发表评论',
  noLoginPlaceHolder: '登陆后才能发表评论丨支持 Markdown 语法',

  // status
  failed: '评论加载失败',
  initializing: '正在初始化...',
  issueNotCreated: '点击创建 Issue',
  loadingComments: '正在加载评论...',
  loginRequired: '登录后查看评论',
  noComments: '还没有评论，来发表第一条评论吧！',

  // alerts
  reactionGiven: `已经添加过 '{reaction}' 了`,
  deleteConfirm: '确认要删除该评论吗？',
  deleteFailed: '评论删除失败',
}

export default messages
