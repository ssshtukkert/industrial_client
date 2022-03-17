<template lang="ru">
    <div class="q-pa-md row items-start q-gutter-md">
        <!-- <MainRecup/> -->
        <MainRecup/>
    </div>
</template>
<script>
import MainRecup from './lab-recuperator/mainRecup.vue';

export default {
  name: 'shopLab',
  components: {
    MainRecup,
  },
  setup() {
    return {
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    };
  },
};
</script>
<style scoped>

</style>
