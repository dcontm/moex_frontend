<template>
  <v-container class="spacing-playground pa-8">
    <br>
    <v-row class="mb-2">
      <v-icon color="#7FD5D5" x-large @click="$router.go(-1)">
        mdi-arrow-left
      </v-icon>
    </v-row>
    <v-row justify="center" align="center"><h2 class="blue--text text--lighten-2">Восстановление пароля</h2></v-row>
    <v-row justify="center" align="center">
      <v-form @submit.prevent="submitHandler" class="main-form">

        <v-alert v-if="successedSendEmail" border="top" type="success">
          <span>На ваш email отправлено письмо с ссылкой для сброса пароля.</span>
        </v-alert>

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

        <v-btn
                color="success"
                class="mr-4"
                type="submit"
            >
                Восстановить
        </v-btn>
        <br>
        <br>
        </v-form>
    </v-row>
  </v-container>
</template>

<script>

import {required, minLength} from 'vuelidate/lib/validators'

export default {
    name: 'forgot_password',
    data () {
        return {
            username: null,
            errorResponse:  false,
            errorResponseText: null,
            successedSendEmail: false
        }
    },

    validations: {
        username: {required, minLength: minLength(4)},
    },

    computed: {
      usernameErrors () {
        const errors = []
        if (!this.$v.username.$dirty) return errors
        !this.$v.username.minLength && errors.push('Логин должен содержать не менее 4 символов')
        !this.$v.username.required && errors.push('Введите Логин.')
        return errors
      },
    },

    methods: {
      forgotPassword () {
        this.$store.dispatch('forgotPassword', {
            email: this.username,
        })
        .then( () => {
          this.successedSendEmail = true
          setInterval( () => {
            this.$router.push({path: '/auth/login'})
          },3000)
        })
        .catch(err => {
          console.log(err)
          this.errorResponseText = "Неизвестная ошибка. Пожайлуста, попробуйте позже."
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
          this.forgotPassword();
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