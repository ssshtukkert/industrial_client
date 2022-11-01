<template>
  <q-page class="full-width" style="margin: 0px;">
    <MachineFields @click="clicked" style="margin: 10px;"/>
    <ThingForm :colorField=colorField :radioCheck=radioCheck style="margin: 10px;"/>
    <Mainform :colorField=colorField :height=height style="margin: 10px;"/>
    <FreeMode :colorField=colorField :height=height style="margin: 10px;"/>
  </q-page>
</template>

<script>
import Mainform from './components/MainForms.vue';
import ThingForm from './components/thingForm.vue';
import MachineFields from './components/machineFields.vue';
import FreeMode from './components/freeMode.vue';

export default {
  name: 'MainRecup',
  components: {
    Mainform, ThingForm, MachineFields, FreeMode,
  },
  setup() {
    document.title = 'Установки';
    return {
    };
  },
};
</script>
<style>

</style>
