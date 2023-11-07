<template>
  <q-dialog v-model="visible" class="text-h6" persistent transition-show="scale" transition-hide="scale">
    <q-card style="width: 900px; max-width: 95vw; background-color: rgb(60, 60, 60);">
      <q-bar class="text-white" style="background-color: rgb(80, 80, 80);">
        <div>{{ name }}</div>
      </q-bar>
      <q-card-section align="center" class="text-white" style="background-color: rgb(60, 60, 60);">
        {{ text }}
      </q-card-section>
      <q-card-actions align="center" class="text-black" style="background-color: rgb(60, 60, 60);">
        <slot name="buttons" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DialogConfirm',
  methods: {
    hide() {
      this.visible = false;
    },
    show() {
      this.visible = true;
    },
    setName(newName) {
      this.name = newName;
    },
    setText(newText) {
      this.text = newText;
    },
  },
  props: {
    nameDef: {
      type: String,
      default: 'Подтверждение',
    },
    textDef: {
      type: String,
      default: 'Принять изменения?',
    },
  },
  data(props) {
    const visible = ref(false);
    return {
      visible,
      name: props.nameDef,
      text: props.textDef,
    };
  },

});
</script>
