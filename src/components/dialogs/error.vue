<template>
    <q-dialog v-model="visible" persistent transition-show="scale" transition-hide="scale">
      <q-card>
        <q-card-section class="bg-red text-white">
          <div class="text-h6">{{ name }}</div>
        </q-card-section>
        <q-card-section class="bg-white text-h6 q-pt-none">
          {{ text }}
        </q-card-section>
        <q-card-actions align="right" class="bg-grey-4">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DialogError',
  props: {
    nameDef: {
      type: String,
      default: 'Error',
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
    setName(newName) {
      this.name = newName;
    },
    setText(newText) {
      this.text = newText;
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
