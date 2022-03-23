<template >
    <div class=" q-gutter-md q-pa-md flex flex row">
       <MachineFields
       @click="clicked"
       />
       <ThingForm
       :colorField=colorField
       :radioCheck=radioCheck
       />
        <Mainform
       :colorField=colorField
       :height=height
       />
    </div>
</template>
<script>
import {
  ref, onMounted, onBeforeUnmount, inject,
} from 'vue';
import Mainform from './components/MainForms.vue';
import ThingForm from './components/thingForm.vue';
import MachineFields from './components/machineFields.vue';

export default {
  components: { Mainform, ThingForm, MachineFields },
  name: 'recupPar',
  setup() {
    const {
      WebSocket_Init, WebSocket_Close, WebSocket_Send, WebSocket_Listen,
    } = inject('store');
    onMounted(() => {
      WebSocket_Init('recup', { getMain: 1 });
      WebSocket_Listen();
    });
    onBeforeUnmount(() => {
      WebSocket_Close();
    });
    function clicked() {
      WebSocket_Send({ getMain: 'click' });
    }
    const colorField = 'teal';
    const radioCheck = ref('RRK');
    const height = '500px';
    return {
      colorField,
      radioCheck,
      height,
      clicked,
    };
  },
};
</script>
<style scoped>
.param{
    min-height: 1500;
}
</style>
