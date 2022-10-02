<template>
    <q-dialog v-model="visible" persistent transition-show="scale" transition-hide="scale">
      <q-card style="min-width: 50vw;">
        <q-card-section class="bg-teal text-white">
          <div class="text-h6">{{ name }}</div>
        </q-card-section>
        <q-card-section class="bg-white text-h6 q-pt-none">
          {{ text }}
        </q-card-section>
        <q-card-actions align="right" class="bg-grey-4">
          <slot name="buttons"/>
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
