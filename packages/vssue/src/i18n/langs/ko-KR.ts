import VueI18n from 'vue-i18n';

const messages: VueI18n.LocaleMessageObject = {
  // auth
  login: '{platform} 로그인',
  logout: '로그아웃',
  currentUser: '현재 유저',

  // comment input
  loading: '로딩중',
  submit: '등록',
  submitting: '등록중',
  submitComment: '댓글 등록',
  cancel: '취소',
  edit: '편집',
  editMode: '편집 모드',
  delete: '삭제',
  reply: '회신',

  // reactions
  heart: '하트',
  like: '좋아요',
  unlike: '싫어요',

  // pagination
  perPage: '댓글 / 페이지',
  sort: '클릭하여 정렬 방식 변경',
  page: '페이지',
  prev: '이전 페이지',
  next: '다음 페이지',

  // hint
  comments: '댓글 | {count}개의 댓글 | {count}개의 댓글',
  loginToComment: '댓글을 남기려면 {platform} 로그인이 필요합니다.',
  placeholder:
    '댓글을 입력해주세요. 마크다운 문법을 지원합니다. Ctrl + Enter 단축키로 등록됩니다.',
  noLoginPlaceHolder:
    '로그인 후 댓글을 남겨주세요. 마크다운 문법을 지원합니다.',

  // status
  failed: '댓글 불러오기에 실패하였습니다',
  initializing: '초기화중...',
  issueNotCreated: '클릭하여 새 이슈를 생성합니다',
  loadingComments: '댓글을 불러오는 중입니다...',
  loginRequired: '댓글을 보려면 로그인이 필요합니다',
  noComments: '댓글이 하나도 없습니다. 첫 댓글을 남겨보세요!',

  // alerts
  reactionGiven: `이미 '{reaction}' 반응을 남겼습니다`,
  deleteConfirm: '정말 댓글을 삭제하시겠습니까?',
  deleteFailed: '댓글 삭제에 실패하였습니다',
};

export default messages;
