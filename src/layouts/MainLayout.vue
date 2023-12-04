<template >
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-card-section class="q-pa-sm row items-center full-width">
          <img class="q-mt-xs" src="./logo.svg" style="width: 300px;">
          <q-space />
          <div v-if="isAuth()">
            <q-btn color="orange-10" :label="user().name">
              <q-popup-proxy>
                <q-card class="text-h6 text-white q-pa-md" style="background-color: rgb(60, 60, 60);">
                  <q-card-section>
                    Почта: {{ user().email }}
                  </q-card-section>
                  <q-card-section>
                    Роль: {{ user().role }}
                  </q-card-section>
                  <q-card-section>
                    <q-btn type="button" @click="logout">Выйти</q-btn>
                  </q-card-section>
                </q-card>
              </q-popup-proxy>
            </q-btn>
          </div>
          <div v-else>
            <span style="padding: 10px;">
              Вход не выполнен
            </span>
            <q-btn color="orange-10" @click="login">Войти</q-btn>
          </div>
          <div class="col-2 text-grey" align="right">
            v{{ version }}
          </div>
        </q-card-section>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="400" :breakpoint="800"
      style="background-color: rgb(60, 60, 60); overflow: hidden;">
      <q-scroll-area visible :delay="0" style="height: 100%;"
        :vertical-thumb-style="{ right: '2px', borderRadius: '0px', background: 'grey', width: '15px', opacity: 1 }"
        :horizontal-thumb-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', height: '15px', opacity: 1 }"
        :vertical-bar-style="{ right: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, width: '15px' }"
        :horizontal-bar-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, height: '15px' }">
        <Tree ref="navigator" :data="propsNav"></Tree>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  inject,
} from 'vue';
import Tree from 'components/Tree.vue';
import { useRoute, useRouter } from 'vue-router';
import store from '../store/index';

export default defineComponent({
  name: 'MainLayout',
  active: false,
  components: {
    Tree,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const propsNav = ref([{
      label: 'Навигация',
      selectable: false,
      children: [
        {
          label: 'Главная',
          selectable: true,
          to: '/home',
        },
        {
          label: 'Инженерные системы',
          selectable: false,
          node: '/monitoring',
          children: [
            { label: 'База мониторинга', to: '/monitoring/configurations' },
          ],
        },
        {
          label: 'Лаборатория',
          selectable: false,
          node: '/lab',
          children: [
            {
              label: 'Стенд испытания рекуператоров',
              selectable: false,
              node: 'lab/recup',
              children: [
                {
                  label: 'Установки',
                  to: '/lab/recup/main',
                },
                {
                  label: 'Подготовка воздуха Приток',
                  to: '/lab/recup/inflow',
                },
                {
                  label: 'Подготовка воздуха Вытяжка',
                  to: '/lab/recup/outflow',
                },
                {
                  label: 'Подготовка воздуха Удаляемые',
                  to: '/lab/recup/output',
                },
                {
                  label: 'Испытания',
                  to: '/lab/recup/tests',
                },
                {
                  label: 'Менеджер испытаний',
                  to: '/lab/recup/testmanager',
                },
                {
                  label: 'Графики',
                  selectable: false,
                  node: 'lab/recup/charts/',
                  children: [
                    {
                      label: 'Датчики',
                      to: '/lab/recup/charts/sensors',
                    },
                    {
                      label: 'Исторические данные',
                      to: '/lab/recup/charts/history',
                    },
                  ],
                },
                {
                  label: 'Калибровка',
                  to: '/lab/recup/calibration',
                },
                {
                  label: 'Журнал аварий',
                  to: '/lab/recup/alarms',
                },
              ],
            },
          ],
        },
        {
          label: 'Пользователи',
          to: '/services/users',
        },
      ],
    }]);
    const navigator = ref(null);
    const route = useRoute();
    const router = useRouter();
    const leftDrawerOpen = ref(props.open);
    const { version } = inject('store');

    function update() {
      store.storeVue.state.upd();
      const p = route.path;
      navigator.value.expand(p, Object.prototype.hasOwnProperty.call(route.params, 'id'));
    }
    function user() {
      return store.storeVue.state.user;
    }
    function isAuth() {
      return store.storeVue.getters.getAuth;
    }
    function hideToggleLeftDrawer() {
      leftDrawerOpen.value = false;
    }
    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
      update();
    }
    function login() {
      router.push('/services/login');
      update();
    }
    function logout() {
      store.storeVue.dispatch('logout').then(() => {
        router.replace('/services/login').then(() => window.location.reload());
      });
    }
    onMounted(() => {
      store.storeVue.state.upd = () => {
        store.storeVue.dispatch('isAuth').then(() => {
          // propsNav.value[0].children.push();
        }).catch((err) => {
          if (err) {
            console.log(err);
          }
        });
      };
      update();
    });
    return {
      user,
      isAuth,
      logout,
      login,
      hide() {
        console.log(4);
      },
      navigator,
      propsNav,
      leftDrawerOpen,
      hideToggleLeftDrawer,
      toggleLeftDrawer,
      click() {
        // eslint-disable-next-line no-console
        // console.log(1);
      },
      update,
      version,
    };
  },
});
</script>

<style>
@media screen and (min-width:800px) {
  .q-footer {
    display: none;
  }
}
</style>
