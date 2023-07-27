import VueI18n from 'vue-i18n';

const messages: VueI18n.LocaleMessageObject = {
  // auth
  login: 'Masuk dengan {platform}',
  logout: 'Keluar',
  currentUser: 'Pengguna Saat Ini',

  // comment input
  loading: 'Memuat',
  submit: 'Kirim',
  submitting: 'Mengirim',
  submitComment: 'Kirim Komentar',
  cancel: 'Batalkan',
  edit: 'Sunting',
  editMode: 'Mode Menyunting',
  delete: 'Hapus',
  reply: 'Balas',

  // reactions
  heart: 'Heart',
  like: 'Like',
  unlike: 'Unlike',

  // pagination
  perPage: 'Komentar per halaman',
  sort: 'Klik untuk mengubah arah pengurutan',
  page: 'Halaman',
  prev: 'Halaman Sebelumnya',
  next: 'Halaman Sesudahnya',

  // hint
  comments: 'Komentar | {count} Komentar | {count} Komentar',
  loginToComment: 'Masuk dengan {platform} akun untuk meniggalkan komentar',
  placeholder:
    'Tinggalkan komentar. Mendukung gaya penulisan Markdown. Ctrl + Enter untuk mengirim.',
  noLoginPlaceHolder:
    'Tinggalkan komentar. Mendukung gaya penulisan Markdown. ',

  // status
  failed: 'Gagal untuk memuat komentar',
  initializing: 'Inisialisasi...',
  issueNotCreated: 'Klik untuk membuat isu',
  loadingComments: 'Memuat komentar...',
  loginRequired: 'Masuk untuk melihat komentar',
  noComments: 'Belum ada komentar. Tinggalkan komentar pertama !',

  // alerts
  reactionGiven: `Reaksi '{reaction}' sudah diberikan`,
  deleteConfirm: 'Konfirmasi untuk menghapus komentar ini ?',
  deleteFailed: 'Gagal untuk menghapus komentar',
};

export default messages;
