<template lang="ru">
    <div class="q-pa-md row items-start q-gutter-md">
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

    };
  },
};
</script>
<style scoped>

</style>
