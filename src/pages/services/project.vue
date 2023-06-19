<template>
  <Projects/>
</template>

<script>
import {
  defineComponent,
} from 'vue';
import Projects from './projects.vue';

export default defineComponent({
  name: 'Project',
  components: {
    Projects,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
