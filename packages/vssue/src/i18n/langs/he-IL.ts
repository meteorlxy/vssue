import VueI18n from 'vue-i18n';

const messages: VueI18n.LocaleMessageObject = {
  // auth
  login: 'התחברו עם {platform}',
  logout: 'התנתקו',
  currentUser: 'משתמש/ת נוכחי/ת',

  // comment input
  loading: 'טוען',
  submit: 'שליחה',
  submitting: 'שולח',
  submitComment: 'שליחת תגובה',
  cancel: 'ביטל',
  edit: 'עריכה',
  editMode: 'מצב עריכה',
  delete: 'מחיקה',
  reply: 'תשובה',

  // reactions
  heart: 'לב',
  like: 'לייק',
  unlike: 'אנלייק',

  // pagination
  perPage: 'תגובות לדף',
  sort: 'לחצו כדי לשנות את כיוון המיון',
  page: 'דף',
  prev: 'הדף הקודם',
  next: 'הדף הבא',

  // hint
  comments: 'תגובות | {count} תגובה | {count} תגובות',
  loginToComment: 'התחברו עם חשבון {platform} כדי להשאיר תגובה',
  placeholder:
    'השאירו תגובה. יש תמיכה בעיצוב בעזרת Markdown. Ctrl + Enter כדי לשלוח.',
  noLoginPlaceHolder:
    'התחברו כדי להשאיר תגובה. יש תמיכה בעיצוב בעזרת Markdown. ',

  // status
  failed: 'כשלון בטעינת התגובות',
  initializing: 'מאתחל...',
  issueNotCreated: 'לחצו ליצירת issue',
  loadingComments: 'טוען תגובות...',
  loginRequired: 'התחברו כדי לצפות בתגובות',
  noComments: 'עדיין אין תגובות. השאירו תגובה ראשונה !',

  // alerts
  reactionGiven: `כבר ניתן חיווי '{reaction}'`,
  deleteConfirm: 'בטוחים במחיקת התגובה ?',
  deleteFailed: 'כשלון במחיקת התגובה',
};

export default messages;
