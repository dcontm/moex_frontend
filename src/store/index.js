import Vue from 'vue'
import Vuex from 'vuex'
import redis from './modules/redis'
import auth from './modules/auth'


Vue.use(Vuex)

export default new Vuex.Store({

  modules: {
    redis,
    auth
  }
})
