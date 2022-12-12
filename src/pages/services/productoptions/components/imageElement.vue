<template>
  <div :style="styleContent">
    <q-btn v-if="name != ''" class="fit" style="padding: 0px;" @click="clickSelect(name)">
      <div class="fit" :id="size" style="margin: 0px; min-height: var(--sizeY); max-height: var(--sizeY)">
        <img v-if="imageBottom != ''" class="bottom fit" :src="imageBottom" />
        <img v-if="imageTop != ''" class="top fit" :src="imageTop" />
      </div>
      <q-tooltip v-if="name != ''" :delay="500">
        <div class="text-h6">
          {{ name }}
        </div>
        <p class="text-h6" style="white-space: pre-line; max-width: 300px;">
          {{ descript }}
        </p>
      </q-tooltip>
    </q-btn>
    <q-icon v-if="name == ''" class="fit">
      <img class="" :src="imageBottom" :id="size" style="min-height: var(--sizeY); max-height: var(--sizeY)">
    </q-icon>
  </div>
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
    descript: {
      type: String,
      default: '',
    },
    clickSelect: {
      type: Function,
      default() {
      },
    },
    imageBottom: {
      type: String,
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
    styleContent: {
      type: String,
      default: '',
    },
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

.red {
  filter: invert(5%) sepia(78%) saturate(6858%) hue-rotate(-35deg) brightness(97%) contrast(0%);
}

#xsmall {
  --sizeY: 32px;
}

#small {
  --sizeY: 64px;
}

#large {
  --sizeY: 128px;
}

.rotate180 {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}

.scaleY {
  transform: scaleY(-1);
}

.scaleX {
  transform: scaleX(-1);
}
</style>
