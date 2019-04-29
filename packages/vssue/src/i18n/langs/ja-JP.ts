import VueI18n from 'vue-i18n'

const messages: VueI18n.LocaleMessageObject = {
  // auth
  login: '{platform} でログイン',
  logout: 'ログアウト',
  currentUser: '現在のユーザー',

  // comment input
  loading: '読み込み中',
  submit: '送信',
  submitting: '送信中',
  submitComment: 'コメントを送信',
  cancel: 'キャンセル',
  edit: '編集',
  editMode: '編集モード',
  delete: '削除',
  reply: '返信',

  // reactions
  heart: 'ハート',
  like: '高評価',
  unlike: '低評価',

  // pagination
  perPage: 'コメント/ページ',
  sort: '並び順を変更するにはクリックしてください',
  page: 'ページ',
  prev: '前のページ',
  next: '次のページ',

  // hint
  comments: 'コメント | {count} コメント | {count} コメント',
  loginToComment: 'コメントを残すには {platform} アカウントでログインしてください。',
  placeholder: 'コメントを残してください。Markdown 記法をサポートしています。 Ctrl + Enter で送信できます。',
  noLoginPlaceHolder: 'コメントを残すにはログインしてください。マークダウン記法をサポートしています。',

  // status
  failed: 'コメントの読み込みに失敗しました',
  initializing: '初期化中...',
  issueNotCreated: 'Click to create issue',
  loadingComments: 'コメントの読み込み中...',
  loginRequired: 'コメントを見るにはログインしてください',
  noComments: 'まだコメントがありません。最初のコメントを残しましょう！',

  // alerts
  reactionGiven: `既に '{reaction}' のリアクションをしています`,
  deleteConfirm: '本当にコメントを削除してもいいですか？',
  deleteFailed: 'コメントの削除に失敗しました',
}

export default messages
