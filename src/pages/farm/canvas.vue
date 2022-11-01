<template>
  <div id="vue-canvas"></div>
</template>

<script>
import P5 from 'p5';

export default {
  name: 'VueCanvas',

  props: {
    script: {
      type: Function,
      default: () => 1,
    },
  },

  setup() {
    console.log('setup');
  },

  mounted() {
    console.log('mounted');
    const p5 = new P5(this.script);
    console.log(p5);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#vue-canvas {
  display: block;
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
}
</style>
