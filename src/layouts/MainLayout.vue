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

    <q-footer>
      <q-tabs>
        <q-route-tab v-for="nav in navigation" :to="nav.to" :key="nav.label" :icon="nav.icon" :label="nav.label">

        </q-route-tab>
      </q-tabs>
    </q-footer>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="340" :breakpoint="800">
      <q-item-label header style="font-size:large">
        Навигация
      </q-item-label>
      <q-list @click="click">
        <q-item v-for="nav in navigation" :to="nav.to" :key="nav.label" v-ripple exact clickable>
          <q-item-section avatar>
            <q-icon color="primary" :name="nav.icon" />
          </q-item-section>
          <q-item-section style="font-size:large">{{ nav.label }}</q-item-section>
        </q-item>
        <!-- <Tree></Tree> -->
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import Header from 'components/Header/Header.vue';
// import Tree from 'components/Tree.vue';

export default defineComponent({
  name: 'MainLayout',
  active: false,
  components: {
    Header,
    // Tree,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {

      leftDrawerOpen,
      navigation: [
        {
          label: 'Главная',
          icon: 'home',
          to: '/',
        },
        {
          label: 'Вентиляция',
          icon: 'hvac',
          to: '/vent',
        },
        {
          label: 'Производство',
          icon: 'precision_manufacturing',
          to: '/plant',
        },
        {
          label: 'Лаборатория',
          icon: 'science',
          to: '/lab/:id',
        },
      ],
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
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
@media screen and (min-width:768px) {
  .q-footer {
    display: none;
  }

}
</style>
