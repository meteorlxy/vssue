import VueI18n from 'vue-i18n'

const messages: VueI18n.LocaleMessageObject = {
  // auth
  login: 'Entrar com {platform}',
  logout: 'Sair',
  currentUser: 'Usuário Atual',

  // comment input
  loading: 'Carregando',
  submit: 'Enviar',
  submitting: 'Enviando',
  submitComment: 'Enviar Comentário',
  cancel: 'Cancelar',
  edit: 'Editar',
  editMode: 'Modo de Edição',
  delete: 'Apagar',
  reply: 'Responder',

  // reactions
  heart: 'Heart',
  like: 'Like',
  unlike: 'Unlike',

  // pagination
  perPage: 'Comentários por página',
  sort: 'Clique para alterar a ordenação',
  page: 'Página',
  prev: 'Página Anterior',
  next: 'Próxima Página',

  // hint
  comments: 'Comentários | {count} Comentário | {count} Comentários',
  loginToComment: 'Entre com uma conta {platform} para deixar um comentário',
  placeholder: 'Deixe um comentário. Estilos com Markdown suportados. Ctrl + Enter para enviar.',
  noLoginPlaceHolder: 'Entre para deixar um comentário. Estilos com Markdown suportados. ',

  // status
  failed: 'Falha ao carregar comentários',
  initializing: 'Inicializando...',
  issueNotCreated: 'Click to create issue',
  loadingComments: 'Carregando comentários...',
  loginRequired: 'Entrar para visualizar comentários',
  noComments: 'Nenhum comentário. Deixe o primeiro comentário!',

  // alerts
  reactionGiven: `Já reagiu com '{reaction}'`,
  deleteConfirm: 'Apagar este comentário?',
  deleteFailed: 'Falha ao apagar comentário',
}

export default messages
