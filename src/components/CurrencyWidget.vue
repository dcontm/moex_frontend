<template>
  <marquee>
    <v-chip class="ma-2" color="primary" outlined v-for="currency of getCurrency" :key=currency.figi>
      || {{currency.ticker}} {{currency.price}}  ₽ ||
    </v-chip>
  </marquee>
</template>

<script>
export default {
  computed: {
    getCurrency () {
        let dataMarket = Object.values(this.$store.state.redis.shares)
        dataMarket = dataMarket.filter( (item) => ["USD", "EUR", "CNY"].includes(item.ticker))
        return dataMarket
    }
  }
}
</script>