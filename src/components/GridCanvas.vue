<template>
  <div v-if="initElements.length > 0" class="row items-center justify-center text-h6" align="center">
    <div id="grid" class="grid-container fit" @click="clickEmpty"
      :style="`width: ${width}px; min-width: ${width}px; max-width: ${width}px; height: ${height}px; min-height: ${height}px;`">
      <template v-for="x in 30" :key="x">
        <span v-if="visibleGrid" style="color: grey; z-index: 1; position: relative; top: calc(-100% * 16);">
          {{ x }}
        </span>
        <template v-for="y in 15" :key="y">
          <div v-if="visibleGrid" :style="`border: 1px solid grey;
      grid-area: ${y} / ${x} / span 1 / span 1;`">
          </div>
          <span v-if="visibleGrid && x == 1"
            :style="`color: grey; z-index: 0; position: absolute; left: calc(50% - ${15 * 32}px - 40px); top: ${32 * (y)}px`">
            {{ y }}
          </span>
        </template>
      </template>
      <ImageElement ref="elements" v-for="element in initElements" :key="element" :id="element.id" :class="`grid-item`"
        :type="element.type" :name="element.name || ''" :imageTop="loadImage(element.imageTop)"
        :imageBottom="loadImage(element.imageBottom)" :textTop="element.textTop" :textBottom="element.textBottom"
        :idname="element.id" :classImage="element.classImage || ''" :clickSelect="clickSelect" :sendValue="sendValue"
        :descriptionTop="element.descriptionTop" :descriptionBottom="element.descriptionBottom" :color="element.color"
        :colorTextTop="element.colorTextTop" :colorTextBottom="element.colorTextBottom" :include="element.include"
        :style="`grid-area: ${element.y} / ${element.x} / span ${element.h || 1} / span ${element.w || 1};`" />
    </div>
  </div>
</template>

<script>
import {
  defineComponent, ref, inject,
} from 'vue';
import ImageElement from 'src/components/imageElement.vue';
// import ScrollBar from 'src/components/ScrollBar.vue';

export default defineComponent({
  name: 'GridCanvas',
  components: {
    ImageElement,
    // ScrollBar,
  },
  props: {
    width: {
      type: Number,
      default: 900,
    },
    height: {
      type: Number,
      default: 600,
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
  },
  setup() {
    const {
      getObject,
    } = inject('store');
    const visibleGrid = ref(false);
    const initElements = ref([]);
    const elements = ref(null);
    // функция загружает изображение  ${element.color || ''}
    function loadImage(file) {
      if (file) {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        return require(`src/components/components/${file}`);
      }
      return '';
    }
    function getElement(elId) {
      return getObject(initElements.value, 'id', elId);
    }

    function clearText(elId) {
      const el = getElement(elId);
      el.textTop = '';
      el.textBottom = '';
      el.colorTextBottom = 'white';
      el.colorTextTop = 'white';
    }
    function updateText(elId, text, dir, color) {
      try {
        const refel = getObject(elements.value, 'idname', elId);
        const el = getElement(elId);
        if (dir === 'top') {
          el.textTop = text;
          el.colorTextTop = color || 'white';
        } else if (dir === 'bottom') {
          el.textBottom = text;
          el.colorTextBottom = color || 'white';
        } else if (dir === 'include') {
          el.include = text;
          refel.value = text;
        }
      } catch (err) {
        console.log('Ошибка обновления текстового лейбла');
      }
    }
    function getValue(elId) {
      try {
        return getObject(elements.value, 'idname', elId).value;
      } catch (err) {
        throw new Error('Не найден объект');
      }
    }
    function isFocus(elId) {
      try {
        return getObject(elements.value, 'idname', elId).focus;
      } catch (err) {
        throw new Error('Не найден объект');
      }
    }
    function updateSuffix(elId, suff) {
      getObject(elements.value, 'idname', elId).suff = suff;
    }
    function updateDescription(elId, text, dir) {
      const el = getElement(elId);
      if (dir === 'top') {
        el.descriptionTop = text;
      } else if (dir === 'bottom') {
        el.descriptionBottom = text;
      }
    }

    function init(structure) {
      initElements.value.length = 0;
      structure.forEach((obj) => {
        initElements.value.push(obj);
        clearText(obj.id);
      });
    }
    return {
      elements,
      initElements,
      loadImage,
      isFocus,
      getValue,
      updateText,
      updateSuffix,
      clearText,
      updateDescription,
      getElement,
      init,
      visibleGrid,
    };
  },

});
</script>
<style>
.grid-container {
  padding: 0px;
  margin: 32px;
  display: grid;
  grid-template-rows: repeat(15, 32px);
  grid-template-columns: repeat(30, 32px);
}

.grid-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.bordered {
  border: 1px solid grey;
}
</style>
