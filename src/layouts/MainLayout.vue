<template >
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <!-- <Header /> -->
        <!-- <q-toolbar-title>

        </q-toolbar-title> -->
        <q-card-section class="q-pa-sm row items-center full-width">
          <div class="text-h4 text-weight-bolder text-white">
            nevatom
          </div>
          <div class="col main-font text-h10 text-grey q-pa-sm" align="left" float="">
            технический сервер
          </div>
          <div class="col-2 text-grey"  align="right">
            v.0.12.7
          </div>
        </q-card-section>

      </q-toolbar>
    </q-header>

    <!-- <q-footer>
      <q-tabs>
        <q-route-tab v-for="nav in navigation" :to="nav.to" :key="nav.label" :icon="nav.icon" :label="nav.label">

        </q-route-tab>
      </q-tabs>
    </q-footer> -->
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
      <router-view  style="padding: 0px; margin: 0px; " />
    </q-page-container>
  </q-layout>
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
} from 'vue';
// import Header from 'components/Header/Header.vue';
import Tree from 'components/Tree.vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',
  active: false,
  components: {
    // Header,
    Tree,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const propsNav = [{
      label: 'Навигация',
      selectable: false,
      children: [
        {
          label: 'Главная',
          selectable: true,
          icon: 'home',
          to: '/home',
        },
        // {
        //   label: 'Производство',
        //   icon: 'precision_manufacturing',
        //   selectable: false,
        //   node: '/plant',
        // },
        {
          label: 'Вентиляция',
          icon: 'hvac',
          selectable: false,
          node: '/vent',
          children: [
            { label: 'Вент. установка №1', to: '/vent/vu1' },
            { label: 'Вент. установка №2', to: '/vent/vu2' },
          ],
        },
        {
          label: 'Лаборатория',
          icon: 'science',
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
            {
              label: 'Испытания РТК',
              to: '/lab/test_rtk',
            },
          ],
        },
        {
          label: 'Сервисы',
          icon: 'settings',
          selectable: false,
          node: '/services',
          children: [
            {
              label: 'Расчет себестоимости',
              selectable: false,
              node: '/services/genprice',
              children: [
                {
                  label: 'Расчеты',
                  to: '/services/genprice/calculations',
                },
              ],
            },
            {
              label: 'Подбор автоматики',
              selectable: false,
              node: '/services/productoptions',
              children: [
                {
                  label: 'Конфигурации',
                  to: '/services/productoptions/configurations',
                },
              ],
            },
            {
              label: 'ChatOA',
              to: '/services/chatOA',
            },
            {
              label: 'Справочники',
              selectable: false,
              node: '/services/references',
              children: [
                {
                  label: 'Материалы',
                  to: '/services/references/materials',
                },
                {
                  label: 'Категории материалов',
                  to: '/services/references/materials_categories',
                },
                {
                  label: 'Eд. измерения материалов',
                  to: '/services/references/materials_measures',
                },
                {
                  label: 'Вентиляторы',
                  to: '/services/references/fans',
                },
              ],
            },
            {
              label: 'Настройки',
              to: '/services/genprice/settings',
            },
          ],
        },
      ],
    }];
    const navigator = ref(null);
    const route = useRoute();
    const leftDrawerOpen = ref(props.open);
    function update() {
      const p = route.path;
      navigator.value.expand(p, Object.prototype.hasOwnProperty.call(route.params, 'id'));
    }
    function hideToggleLeftDrawer() {
      leftDrawerOpen.value = false;
    }
    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
      update();
    }
    onMounted(() => {
      update();
    });
    return {
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
