<template>
  <q-card style="background-color: rgb(60, 60, 60);">
    <q-card-section class="row" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">
        {{ name }}
      </div>
      <slot name="subname" />
      <q-space/>
      <slot name="button" />
    </q-card-section>
    <q-card-section>
      <slot name="content" />
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Page',
  props: {
    nameDef: {
      type: String,
      default: '',
    },
  },
  methods: {
    setName(newName) {
      this.name = newName;
    },
    setText(newText) {
      this.text = newText;
    },
  },
  data(props) {
    return {
      name: props.nameDef,
    };
  },

});
</script>
