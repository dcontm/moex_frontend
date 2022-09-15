<template>
  <v-card>
    <currency-widget />
    <v-card-title>
      Акции из индекса MOEX
      <v-bottom-navigation color="primary">
        <v-btn @click="changeFilter('all')">
          <span>Все</span>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>

        <v-btn @click="changeFilter('tracked')">
          <span>Избранные</span>
          <v-icon>mdi-heart-outline</v-icon>
        </v-btn>

        <v-btn @click="changeFilter('currency')"> 
          <span>Валюта</span>
          <v-icon>mdi-currency-usd</v-icon>
        </v-btn>

        <v-btn @click="changeFilter('history')"> 
          <span>Недавние</span>
          <v-icon>mdi-history</v-icon>
        </v-btn>
  
      </v-bottom-navigation>

      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Поиск"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      dense
      @click:row="toDetail"
      :search="search"
      :headers="headers"
      :items="shares"
      :items-per-page="50"
      item-key="name"
      class="elevation-1"
    >
      <template v-slot:item.figi ="{ item }">
        <v-icon  v-if="checkTracked(item.figi)" @click.stop="changeTrackedStatus(item.figi)" color="red darken-1">mdi-heart</v-icon>
        <v-icon v-else @click.stop="changeTrackedStatus(item.figi)">mdi-heart-outline</v-icon>
      </template>

      <template v-slot:item.price ="{ item }">
        <v-chip :color=item.color outlined>
          {{item.price}}
        </v-chip>
      </template>

      <template v-slot:item.pct ="{ item }">
        <v-chip :color=item.color outlined>
          {{item.pct}}
        </v-chip>
      </template>

    </v-data-table>
  </v-card>
</template>

<script>
  import CurrencyWidget from '../../components/CurrencyWidget.vue'
  export default {
    components: {
      CurrencyWidget
    },
    data: () => ({
      filter: 'all',
      search: '',
      selected: [],
      headers: [
        {text:'Избранное', value: 'figi'},
        { text: 'Тикер', value: 'ticker' },
        { text: 'Название', value: ('name') },
        { text: 'Цена', value: 'price' },
        {text: 'Изменение', value: 'pct'},
        { text: 'Free float (%)', value: 'free_float' },
      ],
    }),
    computed: {
      shares() {        
        let dataMarket = Object.values(this.$store.state.redis.shares)
        let arr = dataMarket.filter( (item) => !["USD","JPY", "EUR", "CNY"].includes(item.ticker))
        switch(this.filter) {          
          case 'all' :
            break
          case 'tracked':
            arr = arr.filter( (item) => this.$store.state.auth.user.info.tracked.includes(item.figi))
          case 'history':
            arr = arr.filter( (item) => this.$store.state.auth.user.info.tracked.includes(item.figi))
          case 'currency':
            arr = dataMarket.filter( (item) => ["USD", "EUR", "CNY"].includes(item.ticker))                   
        }
        arr.forEach( (item) => {
          this.getdiff(item)
        })
        return arr
      },
    },
    methods: {
      changeFilter(param) {
        this.filter = param
      },

      changeTrackedStatus(figi) {
        this.$store.dispatch("changeTrackedStatus", figi)
      },

      checkTracked(figi) {
        return this.$store.state.auth.user.info.tracked.includes(figi)
      },

      getdiff(item) {
        item['diff'] = item.price - item.old_price
        item['pct'] = this.roundPct(item.diff / (item.old_price/100))
        return item
      },

      roundPct(value) {
        try {
          value = value.toString().split('.')
          return value[0]+'.'+value[1].slice(0,2)+'%'
        }
        catch {
          return value+'%'
        }
      },

      toDetail (item) {
        return this.$router.push('/shares/'+item.figi)
      }
    }
  }
</script>