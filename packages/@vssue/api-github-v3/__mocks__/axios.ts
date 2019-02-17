import axios from 'axios'
import moxios from 'moxios'

moxios.stubRequest(new RegExp('login/oauth/access_token'), {
  status: 200,
  response: {
    access_token: 'test-token',
  },
})

export default axios
