<template>
    <q-dialog v-model="visible" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 900px; max-width: 95vw; background-color: rgb(60, 60, 60);">
        <q-bar class="bg-red text-white">
          <div class="text-h6">{{ name }}</div>
        </q-bar>
        <q-card-section class="text-h6 text-white">
          {{ text }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn color="dark-grey" label="OK" v-close-popup />
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
