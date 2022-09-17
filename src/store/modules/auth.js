import { getAPI} from '@/axios-api.js'
export default {
    state: {
        user: JSON.parse(localStorage.getItem('user')),
        history: []
    },

    mutations: {
        destroyUser (state) {
          state.user = null
          localStorage.removeItem('user')
        },
        upgradeStorage (state, {user}) {
          state.user = user
          localStorage.setItem('user', JSON.stringify(user))
        },
        changeTrackedStatus(state, figi) {
           if (state.user.info.tracked.includes(figi)) {
            state.user.info.tracked = state.user.info.tracked.filter(item => item !=figi ) 
           }
           else {
            state.user.info.tracked.push(figi)
           }
        }
    },

    getters: {
        loggedIn (state) {
          if (state.user) {
            return state.user.accessToken != null
          }
        },
        getToken(state) {
          return state.user.accessToken
        }
    },

    actions: {
        logout (context) {
          if (context.getters.loggedIn) {
            context.commit('destroyUser')
          }
        },
        async login(context, usercredentials) {
          try {
            const paramsLoginRequest = new URLSearchParams();
            paramsLoginRequest.append('username', usercredentials.username );
            paramsLoginRequest.append('password', usercredentials.password );
            const requestToken = await getAPI.post('/auth/jwt/login', paramsLoginRequest)
            const token = requestToken.data.access_token

            const config = {headers: { 'Authorization': 'Bearer ' + token}}
            const requestUser = await getAPI.get('/users/me', config)
            const user = {
              accessToken: token,
              info: requestUser.data

            }
            context.commit('upgradeStorage', {user})

          } catch (error) {
            throw error
          }
        },
        signup (context, usercredentials) {
          return new Promise((resolve, reject) => {
            getAPI.post('/auth/register', {
              email: usercredentials.username,
              password: usercredentials.password.password,
            })
            .then(response => {
              resolve()
            })
            .catch(err => {
              reject(err)
            })
          })
        },

        forgotPassword(context, usercredentials) {
          return new Promise((resolve, reject) => {
            getAPI.post('/auth/forgot-password', {
              email: usercredentials.email
            })
            .then(response => {
              resolve()
            })
            .catch(err => {
              reject(err)
            })
          })

        },

        async changeTrackedStatus({commit, state}, figi) {
          const config = {headers: { 'Authorization': 'Bearer ' + state.user.accessToken}}
          const userdata = await getAPI.get('/users/tracked/'+figi, config)
          const user = {
            accessToken: state.user.accessToken,
            info: userdata.data
          }
          commit('upgradeStorage', {user})
        }
    }
}