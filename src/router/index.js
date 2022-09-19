import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'StartPage',
    component: () => import('../views/auth/StartPage.vue'),
    meta: {authUtils: true, layout: "auth"}
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: {layout: "auth", authUtils: true}
  },
  {
    path: '/auth/register',
    name: 'Signup',
    component: () => import('../views/auth/Register.vue'),
    meta: {layout: "auth", authUtils: true}
  },
  {
    path: '/auth/forgot_password',
    name: 'ForgotPassword',
    component: () => import('../views/auth/ForgotPassword.vue'),
    meta: {layout: "auth", authUtils: true}
  },
  {
    path: '/shares',
    name: 'Shares',
    component: () => import('../views/showcase/Shares.vue'),
    meta: {layout: "showcase", requiresLogin: true}
  },
  {
    path: '/shares/edit',
    name: 'SharesEdit',
    component: () => import('../views/showcase/SharesEdit.vue'),
    meta: {layout: "showcase", requiresLogin: true}
  },
  {
    path: '/shares/:figi',
    name: 'ShareDetail',
    component: () => import('../views/showcase/ShareDetail.vue'),
    meta: {layout: "showcase", requiresLogin: true}
  },
  {
    path: '/users/me',
    name: 'UsersMe',
    component: () => import('../views/showcase/UsersMe.vue'),
    meta: {layout: "showcase", requiresLogin: true}
  },
  {
    path: '/users',
    name: 'UsersList',
    component: () => import('../views/showcase/UsersList.vue'),
    meta: {layout: "showcase", requiresLogin: true}
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
