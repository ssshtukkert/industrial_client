<template>
  <div class="fit text-h10" :style="styleContent">
    <q-icon v-if="name == ''" class="bottom fit">
      <img :src="imageBottom" :id="size" @click="clickSelect('empty')"
        style="margin: 0px; min-height: var(--sizeY);   min-width: var(--sizeX);">
    </q-icon>
    <q-btn v-if="name != ''" class="fit" style="padding: 0px;" @click="clickSelect(idname)">
      <div class="fit" :id="size" style="margin: 0px; min-height: var(--sizeY);  min-width: var(--sizeX);">
        <div class="index-text" style="color: rgb(0, 0, 0);">
          {{ text }}
        </div>
        <img v-if="imageBottom != ''" class="bottom fit" :src="imageBottom" />
        <img v-if="imageTop != ''" class="top fit" :src="imageTop" />
      </div>
      <q-tooltip v-if="name != ''" :delay="500">
        <div class="text-h6">
          {{ name }}
        </div>
      </q-tooltip>
    </q-btn>

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
    idname: {
      type: String,
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
    text: {
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

.index-text {
  position: relative;
  left: 0px;
  top: -18px;
  z-index: 2;
  color: black;
}

.white {
  filter: brightness(0) invert(1);
}

.grey {
  filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(35deg) brightness(100%) contrast(0%);
}

.green {
  filter: invert(74%) sepia(24%) saturate(4389%) hue-rotate(353deg) brightness(90%) contrast(80%);
}

#xsmall {
  --sizeY: 16px;
  --sizeX: 16px;
}

#small {
  --sizeY: 32px;
  --sizeX: 32px;
}

#large {
  --sizeY: 64px;
  --sizeX: 32px;
}

.rotate180 {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}

.rotate90 {
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);
}

.rotate270 {
  -webkit-transform: rotate(270deg);
  -moz-transform: rotate(270deg);
  -ms-transform: rotate(270deg);
  -o-transform: rotate(270deg);
  transform: rotate(270deg);
}

.scaleY {
  transform: scaleY(-1);
}

.scaleX {
  transform: scaleX(-1);
}</style>
