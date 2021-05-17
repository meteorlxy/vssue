import VueI18n from 'vue-i18n';

const messages: VueI18n.LocaleMessageObject = {
  // auth
  login: '使用 {platform} 登入',
  logout: '登出',
  currentUser: '當前用戶',

  // comment input
  loading: '載入中',
  submit: '提交',
  submitting: '發表中',
  submitComment: '發表評論',
  cancel: '取消',
  edit: '編輯',
  editMode: '編輯模式',
  delete: '刪除',
  reply: '回覆',

  // reactions
  heart: '喜歡',
  like: '贊',
  unlike: '踩',

  // pagination
  perPage: '每頁評論數',
  sort: '點擊改變排序方式',
  page: '頁數',
  prev: '上一頁',
  next: '下一頁',

  // hint
  comments: '評論 | {count} 條評論 | {count} 條評論',
  loginToComment: '使用 {platform} 帳號登入後發表評論',
  placeholder: '留下你的評論丨支持 Markdown 語法丨Ctrl + Enter 發表評論',
  noLoginPlaceHolder: '登入後才能發表評論丨支持 Markdown 語法',

  // status
  failed: '評論加載失敗',
  initializing: '正在初始化...',
  issueNotCreated: '點擊創建 Issue',
  loadingComments: '正在加載評論...',
  loginRequired: '登入後查看評論',
  noComments: '還沒有評論，來發表第一條評論吧！',

  // alerts
  reactionGiven: `已經點擊過 '{reaction}' 了`,
  deleteConfirm: '確認要刪除該評論嗎？',
  deleteFailed: '評論刪除失敗',
};

export default messages;
