<template>
  <v-app>
    <component :is="layout">
      <h1>СЛОЙ {{layout}}</h1>
      <router-view />
    </component>
  </v-app>
</template>

<script>

import AuthLayout from './layouts/AuthLayout'
import ShowCaseLayout from './layouts/ShowCaseLayout'

  export default {
    name: 'App',
    computed: {
      layout() {
        return this.$route.meta.layout || "showcase"
      }
    },
    beforeCreate () {
      this.$store.dispatch('updateShares')
      console.log('start')
    },
    beforeDestroy() {
      this.$store.dispatch('socketDestroy')
      console.log('stop')
    },
    components: {
      auth: AuthLayout,
      showcase: ShowCaseLayout,
    }
  }
</script>
<style scoped>
div {
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>