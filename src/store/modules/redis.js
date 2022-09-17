import { getWsAPI } from '@/axios-api.js'
export default {
    state: {shares: {},
            history: [],
            connection: ''

    },

    mutations: {
        addToHistory(state, {figi}) {
            state.history.push(figi)
            if (state.history.length > 10) {
                state.history.shift()
            }
        },
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
        getAll(state) {
            return Object.values(state.shares)
        },

        getShares(state) {
            return Object.values(state.shares).filter( (item) => !["USD","JPY", "EUR", "CNY"].includes(item.ticker))
        },
        getCurrency(state) {
            return Object.values(state.shares).filter( (item) => ["USD", "EUR", "CNY"].includes(item.ticker))
        },
        getHistory(state) {
            return Object.values(state.shares).filter( (item) => state.history.includes(item.figi))
        }
    },

    actions: {
        addToHistory(context, {figi}) {
            context.commit('addToHistory', {figi})
        },

        updateShares({commit, state}) {
            const connection = new WebSocket(getWsAPI+"/shares/price/wss")
            connection.onmessage = function(event) {
            const data = JSON.parse(event.data)
            commit('updateShares', {data, connection})
            }
        },

        socketDestroy({commit,state}) {
            commit('socketDestroy')
        }
    }
} 