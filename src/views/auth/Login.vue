<template>
  <v-container class="spacing-playground pa-8">
    <br>
    <v-row class="mb-2">
      <v-icon color="#7FD5D5" x-large @click="$router.go(-1)">
        mdi-arrow-left
      </v-icon>
    </v-row>
    <v-row justify="center" align="center"><h2 class="blue--text text--lighten-2">Войти</h2></v-row>
    <v-row justify="center" align="center">
      <v-form @submit.prevent="submitHandler" class="main-form">

        <v-alert v-if="errorResponse" border="top" color="red lighten-2" dark>
          {{errorResponseText}}
        </v-alert>
        <v-text-field
          v-model.trim="username"
          id="username"
          label="Почта"
          type="text"
          required
          class= "d-flex align-center"
          :error-messages="usernameErrors"
          @input="$v.username.$touch()"
          @blur="$v.username.$touch()"
        ></v-text-field>

        <v-text-field
          v-model.trim="password"
          id="password"
          label="Пароль"
          type="password"
          required
          :error-messages="passwordErrors"
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
        ></v-text-field>

        <v-btn color="success" class="mr-4" type="submit">
          Войти
        </v-btn>
        <br>
        <div><router-link to="/auth/forgot_password">Забыли пароль?</router-link></div>
        <div>Ещё нет аккаунта? <router-link to="/auth/register">Зарегистрироваться.</router-link></div>
      </v-form>
    </v-row>

  </v-container>

</template>

<script>

import {required, minLength} from 'vuelidate/lib/validators'

export default {
    name: 'login',
    data () {
        return {
            username: null,
            password: null,
            errorResponse:  false,
            errorResponseText: null,
        }
    },

    validations: {
        username: {required, minLength: minLength(4)},
        password: {required, minLength: minLength(6)}
    },

    computed: {
      usernameErrors () {
        const errors = []
        if (!this.$v.username.$dirty) return errors
        !this.$v.username.minLength && errors.push('Логин должен содержать не менее 4 символов')
        !this.$v.username.required && errors.push('Введите Логин.')
        return errors
      },
       passwordErrors () {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.minLength && errors.push('Пароль должен содержать не менее 6 символов')
        !this.$v.password.required && errors.push('Введите пароль.')
        return errors
      },
    },

    methods: {
      login () {
        this.$store.dispatch('login', {
            username: this.username,
            password: this.password,
        })
        .then( () => {
          this.$router.push({path: '/shares'})
        })
        .catch(err => {
          console.log(err)
          this.errorResponseText = "Неправильная пара почта/пароль."
          this.errorResponse = true
          
        })
      },

      submitHandler() {
        this.errorResponse = false
        this.errorResponseText = null
        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }
        else {
          this.login();
        }
      }
    }
}
</script>
<style scoped>
.main-form {
  width: 380px;
  align-content: center;
}
</style>