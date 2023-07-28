<template>
  <q-page class="flex flex-center text-white" style="background-color: rgb(60, 60, 60);">
    <q-card style="background-color: rgb(60, 60, 60); width: 400px" v-if="!isAuth()">
      <q-card-section style="background-color: rgb(80, 80, 80);">
        <div class="text-h6"> Авторизация</div>
      </q-card-section>
      <q-card-section>
        <form class="q-pa-md login" @submit.prevent="login">
            <q-input dark required v-model="email" type="email" placeholder="Логин (адрес почты)" />
            <q-input dark required v-model="password" type="password" placeholder="Пароль" />
            <q-btn class="q-ma-md" type="submit">Войти</q-btn>
        </form>
        <div class="text-h6 text-red">
          {{ message }}
        </div>
      </q-card-section>
    </q-card>
    <q-card-section  v-if="isAuth()" class="text-h4">
        Привет, {{ user().name }}
    </q-card-section>
  </q-page>
</template>
<script>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import store from '../store/index';

export default {
  setup() {
    document.title = 'Вход';
    const router = useRouter();
    const route = useRoute();
    const email = ref('');
    const password = ref('');
    const message = ref('');
    function login() {
      message.value = '';
      store.storeVue.dispatch('login', {
        email: email.value,
        password: password.value,
      })
        .then(() => {
          router.push(route.query.redirect || '/services/login').then(() => {
            if (store.storeVue.state.upd) {
              store.storeVue.state.upd();
            }
          });
        })
        .catch((err) => {
          message.value = err.response.data.message;
        });
    }
    function isAuth() {
      return store.storeVue.getters.getAuth;
    }
    function user() {
      return store.storeVue.state.user;
    }
    return {
      login,
      isAuth,
      user,
      message,
      email,
      password,
    };
  },
};
</script>
