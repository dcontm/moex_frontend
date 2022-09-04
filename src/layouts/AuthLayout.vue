<template>
  <v-container class="auth" fluid>
    <v-app-bar app>
      <v-toolbar-title>
        <v-img src="@/assets/logo.png"></v-img>
      </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-container>
</template>

<script>
  export default {
      name: "auth",
      components: {
      },
  }
</script>

<style>
.auth {
  /*margin-top:15%; */
  margin: auto;
}
.main-form{
  width: 380px;
  margin: auto;
}
</style>