import VueI18n from 'vue-i18n'

const messages: VueI18n.LocaleMessageObject = {
  // auth
  login: 'Login with {platform}',
  logout: 'Logout',
  currentUser: 'Current User',

  // comment input
  loading: 'Loading',
  submit: 'Submit',
  submitting: 'Submitting',
  submitComment: 'Submit Comment',
  cancel: 'Cancel',
  edit: 'Edit',
  editMode: 'Edit Mode',
  delete: 'Delete',
  reply: 'Reply',

  // reactions
  heart: 'Heart',
  like: 'Like',
  unlike: 'Unlike',

  // pagination
  perPage: 'Comments per page',
  sort: 'Click to change the sort direction',
  page: 'Page',
  prev: 'Previous Page',
  next: 'Next Page',

  // hint
  comments: 'Comments | {count} Comment | {count} Comments',
  loginToComment: 'Login with {platform} account to leave a comment',
  placeholder: 'Leave a comment. Styling with Markdown is supported. Ctrl + Enter to submit.',
  noLoginPlaceHolder: 'Login to leave a comment. Styling with Markdown is supported. ',

  // status
  failed: 'Failed to load comments',
  initializing: 'Initializing...',
  issueNotCreated: 'Click to create issue',
  loadingComments: 'Loading comments...',
  loginRequired: 'Login to view comments',
  noComments: 'No comments yet. Leave the first comment !',

  // alerts
  reactionGiven: `Already given '{reaction}' reaction`,
  deleteConfirm: 'Confirm to delete this comment ?',
  deleteFailed: 'Failed to delete comment',
}

export default messages
