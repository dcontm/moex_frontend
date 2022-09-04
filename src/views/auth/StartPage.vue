<template>
  <v-container fluid>
    <v-row>
        <v-col>
            <div class="text-center">
                <router-link to="/auth/register">
                    <v-btn x-large color="primary" dark>Запросить приглашение</v-btn>
                </router-link>
            </div>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <div class="text-center">
                <router-link to="/auth/login">
                    <v-btn x-large color="primary" dark>Войти</v-btn>
                </router-link>
            </div>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
    name: 'startpage'
}
</script>