<template>
  <div>
    <currency-widget />
    <h2>{{share.name}}&ensp;({{share.ticker}})&ensp;<span style="color:green;">{{price.current}} руб.</span></h2>
    <br>
    
    <chart-widget />
    <v-simple-table>
        <template v-slot:default>
        <thead>
            <tr>
            <th class="text-left">
                Параметр
            </th>
            <th class="text-left">
                Значение
            </th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td>Число акции</td>
            <td>{{share.total}}</td>
            </tr>
            <tr>
            <td>Free float</td>
            <td>{{share.free_float*100}}%</td>
            </tr>
            <tr>
            <td>Вес в индексе</td>
            <td>{{share.weight}}</td>
            </tr>
        </tbody>
        </template>
    </v-simple-table>
  </div>
</template>

<script>
import {getAPI} from '../../axios-api'
import CurrencyWidget from '../../components/CurrencyWidget.vue'
import ChartWidget from '../../components/ChartWidget.vue'

export default {
  components: {
    ChartWidget,
    CurrencyWidget
  },
  data: () => ({
    share: '',
    price: {
      open: '',
      current: ''
    }
  }),
  methods: {
    async update(figi) {
      this.price.current = await this.$store.state.redis.shares[figi].price
      this.price.open = await this.$store.state.redis.shares[figi].price.old_price
    }
  },
  async created () {
    const figi = this.$route.params.figi
    const config = {headers: { 'Authorization': 'Bearer ' + this.$store.getters.getToken}}
    const response_info = await getAPI.get("/shares/"+figi, config);
    this.share = response_info.data
    let updateInterval = setInterval(() => {
      this.update(figi)
    }, 1000);
    this.$once('hook:beforeDestroy', () => clearInterval(updateInterval))
    console.log("Clear Interval")
  },
}
</script>