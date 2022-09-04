<template>
  <v-card>
    {{user}}
  </v-card>
</template>

<script>
export default {
  data: () => ({
    return: {
        user: ''
    }
  }),
  created () {
    this.user = this.$store.state.auth.user.info
  }
}
</script>