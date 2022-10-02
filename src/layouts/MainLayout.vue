<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <Header />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- <q-footer>
      <q-tabs>
        <q-route-tab v-for="nav in navigation" :to="nav.to" :key="nav.label" :icon="nav.icon" :label="nav.label">

        </q-route-tab>
      </q-tabs>
    </q-footer> -->

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="400" :breakpoint="800">
      <Tree ref="navigator" :data="propsNav"></Tree>
    </q-drawer>
    <q-page-container>
      <router-view style="padding: 0px; margin: 0px;" />
    </q-page-container>
  </q-layout>
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  // computed,
} from 'vue';
import Header from 'components/Header/Header.vue';
import Tree from 'components/Tree.vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',
  active: false,
  components: {
    Header,
    Tree,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const propsNav = [{
      label: 'Навигация',
      selectable: false,
      node: '/home',
      children: [
        { label: 'Главная', icon: 'home', to: '/home' },
        {
          label: 'Производство',
          icon: 'precision_manufacturing',
          selectable: false,
          node: '/plant',
          children: [
            { label: 'Станок 1', to: '/plant' },
            { label: 'Станок 2', to: '/plant' },
          ],
        },
        {
          label: 'Вентиляция',
          icon: 'hvac',
          selectable: false,
          node: '/vent',
          children: [
            { label: 'Вент. установки', to: '/vent' },
          ],
        },
        {
          label: 'Лаборатория',
          icon: 'science',
          selectable: false,
          node: '/lab',
          children: [
            {
              label: 'Стенд подготовки воздуха',
              selectable: false,
              node: 'lab/recup',
              children: [
                {
                  label: 'Установки',
                  to: '/lab/recup/setpoints',
                },
                {
                  label: 'Подготовка воздуха Приток',
                  to: '/lab/recup/inflow',
                },
                {
                  label: 'Подготовка воздуха Вытяжка',
                  to: '/home',
                },
                {
                  label: 'Подготовка воздуха Удаляемые',
                  to: '/home',
                },
                {
                  label: 'Испытания',
                  to: '/home',
                },
                {
                  label: 'Графики',
                  to: '/home',
                },
                {
                  label: 'Калибровка',
                  to: '/home',
                },
                {
                  label: 'Журнал аварий',
                  to: '/home',
                },
              ],
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
                {
                  label: 'Справочники',
                  selectable: false,
                  node: '/services/genprice/references',
                  children: [
                    {
                      label: 'Материалы',
                      to: '/services/genprice/references/materials',
                    },
                    {
                      label: 'Категории материалов',
                      to: '/services/genprice/references/materials_categories',
                    },
                    {
                      label: 'Eд. измерения материалов',
                      to: '/services/genprice/references/materials_measures',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }];
    const navigator = ref(null);
    const route = useRoute();
    function update() {
      const p = route.path;
      navigator.value.expand(p);
    }
    onMounted(() => {
      update();
    });
    return {
      navigator,
      propsNav,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
        update();
      },
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
