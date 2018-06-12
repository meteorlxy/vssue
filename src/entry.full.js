import Vue from 'vue'
import App from './Vssue'

class Vssue {
  get version () {
    /* global __VERSION__ */
    return __VERSION__
  }

  constructor (options = {}) {
    this.options = options
    this.app = null
    this._init()
  }

  _init () {
    const el = this.options.el || null

    this.app = new Vue({
      el,
      render: h => h(App, {
        props: { options: this.options }
      })
    })
  }
}

export default Vssue
