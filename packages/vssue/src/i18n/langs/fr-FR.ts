import VueI18n from 'vue-i18n';

const messages: VueI18n.LocaleMessageObject = {
  // auth
  login: 'Se connecter avec {platform}',
  logout: 'Se déconnecter',
  currentUser: 'Utilisateur actuel',

  // comment input
  loading: 'Chargement',
  submit: 'Poster',
  submitting: "En cours d'envoi",
  submitComment: 'Ajouter un commentaire',
  cancel: 'Annuler',
  edit: 'Éditer',
  editMode: 'Mode édition',
  delete: 'Supprimer',
  reply: 'Répondre',

  // reactions
  heart: 'Adorer',
  like: 'Approuver',
  unlike: 'Désapprouver',

  // pagination
  perPage: 'Commentaires par pages',
  sort: "Cliquez pour changer l'ordre de tri",
  page: 'Page',
  prev: 'Page précédente',
  next: 'Page suivante',

  // hint
  comments: 'Commentaires | {count} Commentaires | {count} Commentaires',
  loginToComment:
    'Se connecter avec votre compte {platform} pour laisser un commentaire',
  placeholder:
    'Laisser un commentaire. Le Markdown est supporté. Ctrl + Enter pour poster.',
  noLoginPlaceHolder:
    'Connectez-vous pour laisser un commentaire. Le Markdown est supporté. ',

  // status
  failed: 'Impossible de charger les commentaires',
  initializing: 'Initialisation...',
  issueNotCreated: 'Cliquez pour créer un commentaire',
  loadingComments: 'Chargment des commentaires...',
  loginRequired: 'Se connecter pour voir les commentaires',
  noComments:
    "Il n'y a pas de commentaire pour le moment. Laissez le premier commentaire !",

  // alerts
  reactionGiven: `Réaction '{reaction}' déjà donnée`,
  deleteConfirm: 'Voulez-vous vraiment supprimer ce commentaire?',
  deleteFailed: 'Impossible de créer le commentaire',
};

export default messages;
