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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Mainform from './components/MainForms.vue';
import ThingForm from './components/thingForm.vue';
import MachineFields from './components/machineFields.vue';

let socket = null;

export default {
  components: { Mainform, ThingForm, MachineFields },
  name: 'recupPar',
  setup() {
    const port = 1880;
    onMounted(() => {
      socket = new WebSocket(`ws://${window.location.hostname}:${port}/recup`);
      socket.onopen = function () {
        socket.send(JSON.stringify({ getMain: 'onopen' }));
      };
    });
    onBeforeUnmount(() => {
      // Close connection
      socket.close();
      // Destroy the WebSocket instance object
      socket = null;
    });
    function clicked() {
      socket.send(JSON.stringify({ getMain: 'click' }));
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
