import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
/*
import actions from './actions'
import mutations from './mutations'
*/

Vue.use(Vuex)

export default new Vuex.Store({
  state : {
    loginToken: '',
    loginEmail: '',
    memLevel: 0,
    isLoin: false,
    landingFavor: '',
    exchangeMarket: ''
  },
  mutations: {
    login(state, data) {
      state.loginToken = data.token
      state.loginEmail = data.email
      state.isLoin = true
    },
    logout(state) {
      state.loginToken = ''
      state.loginEmail = ''
      state.isLoin = false
    },
    setMemLevel(state, data) {
      state.memLevel = data
    },
    resetLandingFavor(state, data) {
      state.landingFavor = data
    },
    resetExchangeMarket(state, data) {
      state.exchangeMarket = data
    }
  },
  plugins: [
    createPersistedState({
      state: {
        getState: (key) => Cookies.getJSON(key),
        setState: (key, state) => Cookies.set(key, state, { expires: 3, secure: true })
      }
    })
  ]
})
