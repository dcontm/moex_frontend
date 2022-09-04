<template>
  <v-container class="spacing-playground pa-8">
    <br>
    <v-row class="mb-2">
      <v-icon color="#7FD5D5" x-large @click="$router.go(-1)">
        mdi-arrow-left
      </v-icon>
    </v-row>
    <v-row justify="center" align="center"><h2 class="blue--text text--lighten-2">Регистрация</h2></v-row>
    <v-row justify="center" align="center">
      <v-form @submit.prevent="submitHandler" class="main-form">

        <v-alert v-if="successedSendEmail" border="top" type="success">
          <span>Заявка принята. Доступ предоставляется в течении 1-2 дней.</span>
        </v-alert>

        <div v-if="errorResponse">
          <v-alert v-for="error in errorResponseText" :key="error.id" border="top" color="red lighten-2" dark>
            {{error}}
          </v-alert>
        </div>

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
          v-model.trim="password.password"
          id="password.password"
          label="Пароль"
          type="password"
          required
          :error-messages="passwordErrors"
          @input="$v.password.password.$touch()"
          @blur="$v.password.password.$touch()"
        ></v-text-field>

        <v-text-field
          v-model.trim="password.confirm"
          id="password.confirm"
          label="Повторите пароль"
          type="password"
          required
          :error-messages="passwordConfirmErrors"
          @input="$v.password.confirm.$touch()"
          @blur="$v.password.confirm.$touch()"
        ></v-text-field>

          <v-checkbox
            v-model="checkbox"
            label="С правилами ознакомлен."
            required
            :error-messages="checkboxErrors"
            @input="$v.checkbox.$touch()"
            @blur="$v.checkbox.$touch()"
          ></v-checkbox>
          <v-btn color="success"
                class="mr-4"
                type="submit"
            >
                Зарегистрироваться
            </v-btn>
        <br>
        <span>Уже есть аккаунт? <router-link to="/auth/login">Войти.</router-link></span>
      </v-form>
    </v-row>
  </v-container>
</template>

<script>

import {required, email, minLength, sameAs} from 'vuelidate/lib/validators'

export default {
    name: 'signup',
    data () {
        return {
            username: null,
            password: {
                password: null,
                confirm: null
            },
            checkbox: false,
            errorResponse:  false,
            errorResponseText: [],
            successedSendEmail: false
        }
    },

    validations: {
        username: { required, email},
        password: {
            password : {required, minLength: minLength(6)},
            confirm : {required, sameAs: sameAs(vm => {return vm.password || "";})}
        },
        checkbox: {
            checked (val) {
                return val
            },
        },
    },

    computed: {
      usernameErrors () {
        const errors = []
        if (!this.$v.username.$dirty) return errors
        !this.$v.username.email && errors.push('Введите корректный email в формате "email@example.com".')
        !this.$v.username.required && errors.push('Введите email.')
        return errors
      },
      passwordErrors () {
        const errors = []
        if (!this.$v.password.password.$dirty) return errors
        !this.$v.password.password.minLength && errors.push('Пароль должен содержать не менее 6 символов')
        !this.$v.password.password.required && errors.push('Введите пароль.')
        return errors
      },
      passwordConfirmErrors () {
        const errors = []
        if (!this.$v.password.confirm.$dirty) return errors
        !this.$v.password.confirm.sameAs && errors.push('Пароли не совпадают.')
        !this.$v.password.confirm.required && errors.push('Повторите пароль.')
        return errors
      },
      checkboxErrors () {
        const errors = []
        if (!this.$v.checkbox.$dirty) return errors
        !this.$v.checkbox.checked && errors.push('Вы должны принять правила!')
        return errors
      },
    },

    methods: {
      signup() {
        this.$store.dispatch('signup', {
            username: this.username,
            password: this.password,
        })
        .then( () => {
            this.successedSendEmail = true;
            setTimeout( () => {
              this.$router.push('/auth/login')
            }, 3000)
        })
        .catch(err => {
          this.errorResponse = true
          console.log(err)
          try {
            if (err.response.data.username) {
              this.errorResponseText.push(err.response.data.username[0])
            }
            else if (err.response.data.email) {
              this.errorResponseText.push(err.response.data.email[0])
            }
          }
          catch {
            this.errorResponseText.push("Неизвестная ошибка при регистрации")
          }
        })
      },

      submitHandler() {
        this.errorResponse = false
        this.errorResponseText = []
        this.successedSendEmail = false
        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }
        else {
          this.signup()
        }
      },
    }
}
</script>
<style scoped>
.loginForm {
  height: 200px;
  margin-bottom: 50%;
  width: 50%;
  margin-left:25%;

};
</style>