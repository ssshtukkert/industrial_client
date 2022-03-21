<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-white"  >
      <q-toolbar>
        <q-btn
         class="bg-grey-5"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
         <Header/>
        </q-toolbar-title>
      </q-toolbar>
      <q-tabs
      v-model="tab"
      align="right"
      class="text-black "
      inline-label
      mobile-arrows
      narrow-indicator
      indicator-color="white"
      active-bg-color="grey-4"
      >
        <q-route-tab
         name="home"
          :to="{ name: 'home' }"
           icon='home'
          label="Главная"
        />
        <q-route-tab
         name="plant"
         :to="{ name: 'plant' }"
          label="Производство"
        />
        <q-route-tab
         name="vent"
         :to="{ name: 'vent' }"
         label="Вентиляция"
        />
        <q-route-tab
         name="lab"
         :to="{ name: 'lab', params: {id: 'shopLab'} }"
         label="Лаборатория"
         />

      </q-tabs>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      side="left"
      overlay
      behavior="mobile"
      elevated
    >
      <q-list>
        <q-item-label
          header
        >
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal bordered class="bg-grey-1 text-black ">
      <q-toolbar>
        <q-toolbar-title>
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar> -->
          <small>
            © Nevatom 2020 - 2022
            <a href="mailto:nkaravan@nevatom.ru" style="text-decoration: none; color:black">
              <q-icon name="mail"/> Karavan Nickolay  </a>
              <q-badge
              color="grey"
              >версия {{version}}
              </q-badge>
            </small>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
// import EssentialLink from 'components/EssentialLink.vue';

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];

import { defineComponent, ref } from 'vue';
import Header from 'components/Header/Header.vue';
import * as packageInfo from '../../package.json';

export default defineComponent({
  name: 'MainLayout',

  components: {
    // EssentialLink,
    Header,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const { version } = packageInfo;
    const selectedTab = 'lab';
    return {
      tab: ref(selectedTab),
      version,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
