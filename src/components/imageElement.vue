<template>
  <div class="fit">
    <q-btn v-if="type == 'icon'" :ripple="{ color }" class="fit" flat style="padding: 0px;" @click="pressed(idname)"
      no-caps>
      <div style="margin: 0px; min-height: 100%;   min-width: 100%;">
        <img v-if="imageBottom != ''" :class="`bottom fit ${color}`" :src="imageBottom" />
        <img v-if="imageTop != ''" :class="`top fit ${color} ${classImage}`" :src="imageTop" />
      </div>
      <div v-if="textTop !== ''" :class="`index-text-top text-${colorTextTop}`">
        <q-badge class="text-h6" text-color="black" :color="colorTextTop">
          {{ textTop }}
        </q-badge>
      </div>
      <div v-if="textBottom !== ''" :class="`index-text-bottom text-${colorTextBottom}`">
        <q-badge dense class="text-h6" text-color="black" :color="colorTextBottom">
          {{ textBottom }}
        </q-badge>
      </div>
      <q-tooltip :delay="200">
        <div class="text-h6" style="white-space: pre-line;">
          {{ name }}
          <br />
          {{ descriptionTop }}
          <br />
          {{ descriptionBottom }}
        </div>
      </q-tooltip>
    </q-btn>
    <q-btn v-else-if="type == 'button'" :ripple="{ color }" class="fit" :flat="imageTop != ''" :color="color"
      text-color="black" @click="pressed(idname)" no-caps>
      <div v-if="imageTop == ''" class="text-h6" style="position: absolute;
  white-space: nowrap;">
        {{ name }}
      </div>
      <div v-else
        :style="`margin: 0px; padding: 0px; max-width: 100%; width: ${width}px; max-height: ${height}px; height: ${height}px;`">
        <img :class="`top fit ${color} ${classImage}`" :src="imageTop" />
      </div>
      <div v-if="textTop !== ''" :class="`index-text-top text-${colorTextTop}`">
        <q-badge class="text-h6" text-color="black" :color="colorTextTop">
          {{ textTop }}
        </q-badge>
      </div>
      <div v-if="textBottom !== ''" :class="`index-text-bottom text-${colorTextBottom}`">
        <q-badge dense class="text-h6" text-color="black" :color="colorTextBottom">
          {{ textBottom }}
        </q-badge>
      </div>
    </q-btn>
    <q-input ref="inputField" dense dark v-else-if="type == 'input'" class="text-h6" outlined hide-bottom-space
      v-model="value" @click="() => {
        focus = true;
        pressed(idname)
      }" @blur="() => {
  focus = false;
}" @focus="() => {
  focus = true;
}" :suffix="suff" @keydown.enter.prevent="() => {
  send(idname);
}" @update:model-value="() => {
  focus = true;
}">
      <div v-if="textTop !== ''" :class="`index-text-top text-${colorTextTop}`">
        <q-badge class="text-h6" text-color="black" :color="colorTextTop">
          {{ textTop }}
        </q-badge>
      </div>
      <div v-if="textBottom !== ''" :class="`index-text-bottom text-${colorTextBottom}`">
        <q-badge dense class="text-h6" text-color="black" :color="colorTextBottom">
          {{ textBottom }}
        </q-badge>
      </div>
      <q-btn v-if="focus" class="right text-white" @click="() => {
        focus = false;
        send(idname);
        inputField.blur();
      }">
        Ок
      </q-btn>
    </q-input>
  </div>
</template>
<script>
import { defineComponent, require, ref } from 'vue';

export default defineComponent({
  name: 'ImageElement',
  props: {
    type: {
      type: String,
      default: 'icon',
    },
    width: {
      type: Number,
      default: 32,
    },
    height: {
      type: Number,
      default: 32,
    },
    name: {
      type: String,
      default: '',
    },
    idname: {
      type: String,
    },
    color: {
      type: String,
    },
    colorTextTop: {
      type: String,
    },
    colorTextBottom: {
      type: String,
    },
    classImage: {
      type: String,
    },
    clickSelect: {
      type: Function,
      default() {
      },
    },
    sendValue: {
      type: Function,
      default() {
      },
    },
    imageBottom: {
      type: String,
      default: require('src/components/components/air.svg'),
    },
    imageTop: {
      type: String,
      default: '',
    },
    textTop: {
      type: String,
      default: '',
    },
    textBottom: {
      type: String,
      default: '',
    },
    descriptionTop: {
      type: String,
      default: '',
    },
    descriptionBottom: {
      type: String,
      default: '',
    },
  },
  setup() {
    const value = ref('');
    const focus = ref(false);
    const suff = ref('');
    const inputField = ref(null);
    function pressed(key) {
      if (key) {
        this.clickSelect(key);
      }
    }
    function send(key) {
      if (key) {
        this.sendValue(key);
      }
    }
    return {
      inputField,
      suff,
      value,
      pressed,
      send,
      focus,
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

.right {
  position: absolute;
  left: calc(100% + 20px);
  z-index: 1;
}

.index-text-top {
  position: absolute;
  white-space: nowrap;
  bottom: calc(100% + 5px);
  z-index: 2;
  font-size: medium;
}

.index-text-bottom {
  position: absolute;
  white-space: nowrap;
  top: calc(100% + 5px);
  z-index: 2;
  font-size: medium;
}

.yellow {
  filter: brightness(0) saturate(100%) invert(91%) sepia(13%) saturate(1072%) hue-rotate(22deg) brightness(87%) contrast(89%);
}

.white {
  filter: brightness(0) invert(1);
}

.blue {
  filter: brightness(0) saturate(100%) invert(8%) sepia(100%) saturate(7348%) hue-rotate(248deg) brightness(101%) contrast(144%);
}

.grey {
  filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(35deg) brightness(100%) contrast(0%);
}

.green {
  filter: brightness(0) saturate(100%) invert(56%) sepia(71%) saturate(301%) hue-rotate(80deg) brightness(98%) contrast(90%);
}

.black {
  filter: invert(7%) sepia(75%) saturate(427%) hue-rotate(60deg) brightness(95%) contrast(110%);
}

.red {
  filter: brightness(0) saturate(100%) invert(52%) sepia(9%) saturate(5858%) hue-rotate(325deg) brightness(97%) contrast(88%);
}

.silver {
  filter: invert(78%) sepia(5%) saturate(0%) hue-rotate(200deg) brightness(98%) contrast(91%);
}

.sky {
  filter: brightness(0) saturate(100%) invert(61%) sepia(74%) saturate(2260%) hue-rotate(152deg) brightness(103%) contrast(103%);
}

.brown {
  filter: invert(5%) sepia(99%) saturate(5310%) hue-rotate(352deg) brightness(101%) contrast(101%);
}

.rotate180 {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}

.rotate0 {
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
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
}
</style>
