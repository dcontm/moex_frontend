import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Vuelidate from 'vuelidate'
import VueApexCharts from 'vue-apexcharts'

Vue.use(Vuelidate)
Vue.config.productionTip = false

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)


router.beforeEach((to, from, next) => {
  if (!store.getters.loggedIn) {
    if (to.matched.some(record => record.meta.requiresLogin)) {
      next({ path: '/auth/login' })
    }
    else {
      next()
    }
  }
  else {
    if (to.matched.some(record => record.meta.authUtils)) {
      next({ path: '/shares' })
    }
    else {
      next()
    }
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

