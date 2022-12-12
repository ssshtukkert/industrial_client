<template>
  <q-dialog persistent @show="beforeShow">
    <q-card :style="styleContent">
      <q-bar class="bg-teal text-white">
        <div :class="classTitle + ' text-left'">{{ elementName }}</div>
        <q-space />
        <slot name="buttonsWindow" />
      </q-bar>
      <q-card-section align="center">
        <slot name="content" />
      </q-card-section>
      <q-card-actions align="center">
        <slot name="actions" />
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Dialog',
  props: {
    elementName: {
      type: String,
      default: '',
    },
    classTitle: {
      type: String,
      default: 'text-h6',
    },
    styleContent: {
      type: String,
    },
    beforeShow: {
      type: Function,
      default() {
      },
    },
  },
});
</script>
