import { getWsAPI } from '@/axios-api.js'
export default {
    state: {shares: {},
            connection: ''
    },

    mutations: {
        updateShares(state, {data, connection}) {
            state.shares = data
            state.connection = connection
        },
        socketDestroy(state) {
            state.connection.close()
            state.commit = ''
            console('connection close')
        }
    },

    getters: {
    },

    actions: {
        updateShares({commit, state}) {
            console.log('connetction wss in actions')
            const connection = new WebSocket(getWsAPI+"/shares/price/wss")
            connection.onmessage = function(event) {
            const data = JSON.parse(event.data)
            console.log(event)
            commit('updateShares', {data, connection})
            }
        },

        socketDestroy({commit,state}) {
            commit('socketDestroy')
        }
    }
} 