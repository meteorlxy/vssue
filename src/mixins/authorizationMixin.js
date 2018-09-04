export default {
  data () {
    return {
      user: null,
      accessToken: null
    }
  },

  computed: {
    accessTokenKey: {
      get () {
        return `Vssue.${this.config.platform}.access_token`
      }
    },

    isLogined () {
      return this.accessToken !== null && this.user !== null
    },

    isAdmin () {
      return this.isLogined && (this.user.username === this.config.owner || this.config.admins.contains(this.user.username))
    }
  },

  methods: {
    async handleAuthorize () {
      const accessToken = await this.api.handleAuthorize()
      if (accessToken) {
        // New access_token
        this.setAccessToken(accessToken)
        this.user = await this.api.getUser({ accessToken })
      } else if (this.accessToken) {
        // Stored access_token
        this.user = await this.api.getUser({ accessToken: this.accessToken })
      } else {
        // No access_token
        this.setAccessToken(null)
        this.user = null
      }
    },

    handleLogin () {
      this.api.redirectAuthorize()
    },

    handleLogout () {
      this.setAccessToken(null)
      this.user = null
    },

    getAccessToken () {
      return window.localStorage.getItem(this.accessTokenKey)
    },

    setAccessToken (token) {
      if (token === null) {
        window.localStorage.removeItem(this.accessTokenKey)
      } else {
        window.localStorage.setItem(this.accessTokenKey, token)
      }
      this.accessToken = token
    }
  }
}
