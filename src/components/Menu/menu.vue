<template>
    <div class=" menu ">
      <menu-item
          v-for="link in menuItem"
          :key="link.title"
          v-bind="link"
      />
    </div>
</template>
<script>
import { defineComponent, ref } from 'vue';
import MenuItem from './menuItem.vue';

const linksList = [
  {
    title: 'Главная',
    icon: 'home',
    link: '',
  },
  {
    title: 'Производство',
    icon: 'hub',
    link: '/shop',
  },
  {
    title: 'Вентиляция',
    icon: 'pix',
    link: '/vent',
  },
  {
    title: 'Лаборатория',
    icon: 'science',
    link: '/lab',
  },
];

export default defineComponent({
  components: { MenuItem },
  name: 'Menu',

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      menuItem: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },

});
</script>
<style scoped>
.menu{
  display: flex;
  justify-content: space-between
}
</style>
