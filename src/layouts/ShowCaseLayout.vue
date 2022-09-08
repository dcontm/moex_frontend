<template>
  <v-app id="inspire" >
    <v-navigation-drawer
      v-model="drawer"
      app
    >
    <v-card class="mx-auto">
      <v-list>
        <v-list-item-group v-model="menuItem" active-class="border" color="#7FD5D5">
          <v-list-item :to="{ path: '/shares' }">Акции</v-list-item>
          <v-list-item v-if="$store.state.auth.user.info.is_superuser" :to="{ path: '/users' }">
            Пользователи
          </v-list-item>
          <v-list-item :to="{ path: '/users/me' }">Профиль</v-list-item>
          <v-list-item @click="logout">Выйти</v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
      <!--  -->
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <v-img src="@/assets/logo.png"></v-img>
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container class='showcase'>
        <div>
          <v-icon color="#7FD5D5" x-large @click="$router.go(-1)">
            mdi-arrow-left
          </v-icon>
        </div>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  export default {
      name: "showcase",
      components: {
      },
      data: () => ({
        drawer: false,
        menuItem: '',
      }),
      methods: {
        logout() {
          this.$store.dispatch
          ("logout")
          .then( () => {
            this.$router.push({path: '/'})
          })
          .catch(err => {
            console.log(err)
          })
        }
      }
  }
</script>

<style scoped>
.showcase {
    background: whitesmoke;
}
.border {
  border: 2px dashed orange;
}
</style>