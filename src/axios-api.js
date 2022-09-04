import axios from 'axios'
import router from './router'
import store from './store'

const getWsAPI = 'ws://localhost:8000'

const getAPI = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 5000,
})

getAPI.interceptors.response.use(function (response) {
    return response
   }, function(error) {
    if (error.response.status === 401) {
      store.dispatch('logout')
      router.replace('/auth/login')
    }
    return Promise.reject((error.response.data))
   })

export {getWsAPI, getAPI}