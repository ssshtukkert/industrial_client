<template>
  <q-page class="q-pa-none text-white full-width full-height" padding style="background-color: rgb(60, 60, 60);">
    <q-card-section style="background-color: rgb(80, 80, 80);" class="flex full-width justify-start">
      <slot name="subname" />
    </q-card-section>
    <q-card-actions class="flex fit justify-start">
      <slot name="actions" />
    </q-card-actions>
    <q-card-section  class="flex fit content-between">
      <slot name="content" />
    </q-card-section>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Page',
  props: {
    headColor: {
      type: String,
      default: 'red',
    },
    nameDef: {
      type: String,
      default: '',
    },
    textDef: {
      type: String,
      default: 'Ошибка',
    },
  },
  methods: {
    show() {
      this.visible = true;
    },
    setColor(color) {
      this.color = color;
    },
    setName(newName) {
      this.name = newName;
    },
    getName() {
      return this.name;
    },
    setText(newText) {
      this.text = newText;
    },
  },
  data(props) {
    const visible = ref(false);
    return {
      visible,
      color: props.headColor,
      name: props.nameDef,
      text: props.textDef,
    };
  },

});
</script>
