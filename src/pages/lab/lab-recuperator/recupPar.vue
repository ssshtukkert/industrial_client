<template >
    <div class=" q-gutter-md q-pa-md flex flex row">
       <MachineFields
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
import { ref } from '@vue/reactivity';
import Mainform from './components/MainForms.vue';
import ThingForm from './components/thingForm.vue';
import MachineFields from './components/machineFields.vue';
// import { ref } from 'vue';

export default {
  components: { Mainform, ThingForm, MachineFields },
  name: 'recupPar',

  setup() {
    const colorField = 'teal';
    const radioCheck = ref('RRK');
    const height = '500px';
    return {
      colorField,
      radioCheck,
      height,
    };
  },
};
</script>
<style scoped>
.param{
    min-height: 1500;
}
</style>
