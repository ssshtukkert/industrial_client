<template>
  <q-btn v-if="name != ''" @click="selected" class="full-width full-height" style="padding: 0px;">
    <div class="full-width full-height" :id="size" style="margin: 0px; min-height: var(--sizeY); max-height: var(--sizeY)">
      <img class="bottom fit" :src="imageBottom" />
      <img v-if="imageTop != ''" class="top fit" :src="imageTop" />
    </div>
    <q-tooltip v-if="name != ''">
      {{ name }}
    </q-tooltip>
  </q-btn>
  <q-icon v-if="name == ''" class="full-width full-height">
    <img :src="imageBottom" :id="size" style="min-height: var(--sizeY); max-height: var(--sizeY)">
  </q-icon>
</template>
<script>
import { defineComponent, require } from 'vue';

export default defineComponent({
  name: 'ImageElement',
  props: {
    name: {
      type: String,
      default: '',
    },
    selected: {
      type: Function,
      default() {
      },
    },
    imageBottom: {
      type: Image,
      default: require('./air.svg'),
    },
    imageTop: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'small',
    },
  },
  methods: {
  },
  data() {
    return {
    };
  },
});
</script>
<style>
.bottom {
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 0;
}

.top {
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 1;
}
#small {
  --sizeY: 64px;
}
#large {
  --sizeY: 128px;
}
</style>
