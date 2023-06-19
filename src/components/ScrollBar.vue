<template>
  <q-scroll-area dark :style="styleContent"
    :vertical-thumb-style="{ right: '2px', borderRadius: '0px', background: 'grey', width: '15px', opacity: 1 }"
    :horizontal-thumb-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', height: '15px', opacity: 1 }"
    :vertical-bar-style="{ right: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, width: '15px' }"
    :horizontal-bar-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, height: '15px' }">
    <slot name="default"/>
  </q-scroll-area>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ScrollBar',
  props: {
    styleContent: {
      type: String,
      default: 'height: 30vh;',
    },
  },
});
</script>
