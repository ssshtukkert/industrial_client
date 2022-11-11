<template >
  <div>
    <q-card class="my-card bg-secondary text-white">
      <q-card-section>
        <div class="text-h6">Оборудование</div>
      </q-card-section>

      <q-separator dark />

      <q-card-section class="my-card bg-white text-black">
        <q-item class="flex wrap q-gutter-md">
          <div class=" widthField ">
            <q-radio v-model="radio" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="RPX" label="RPX" />
            <q-select v-model="RPXfield" transition-show="flip-up" transition-hide="flip-down" :color=color outlined
              :options="optionsRPX" label="RPX" class="text-black" hint="RPX" />
          </div>
          <div class=" widthField">
            <q-radio v-model="radio" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="RRK" label="RRK" />
            <q-select v-model="RRKfield" transition-show="flip-up" transition-hide="flip-down" :color=color outlined
              :options="optionsRRK" label="RRK" class="text-black" hint="RRK" />
          </div>
          <div class=" widthField">
            <q-radio v-model="radio" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="RPP" label="RPP" />
            <q-select v-model="RPPfield" transition-show="flip-up" transition-hide="flip-down" :color=color outlined
              :options="optionsRPP" label="RPP" class="text-black" hint="RPP" />
          </div>
        </q-item>
      </q-card-section>
      <q-separator dark />

      <q-card-actions class="bg-grey-4">
        <q-btn color="teal">Применить</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
import { ref } from 'vue';

export default {
  name: 'thingForm',
  props: ['colorField', 'radioCheck'],
  setup(props) {
    const radio = ref('RPX');
    const optionsRPX = [
      '700x400(500x600)0,3',
      '700x500(600x600)0,36',
      '700x600(650x600)0,39',
      '750x400(500x600)0,3',
      '750x500(600x600)0,36',
      '750x550(650x600)0,39',
      '800x400(500x600)0,3',
      '800x500(650x600)0,39',
      '400x200(200x400)0,08',
      '400x450(400x450)0,18',
      '400x600(600x400)0,24',
      '500x350(400x450)0,18',
      '500x500(600x400)0,24',
      '500x600(650x450)0,29',
      '550x450(600x400)0,24',
      '550x550(650x450)0,29',
      '600x300(400x450)0,18',
      '600x500(650x450)0,29',
      '200x200(200x200)0,04',
      '200x350(350x200)0,07',
      '220x150(200x200)0,04',
      '220x300(350x200)0,07',
      '220x400(450x200)0,09',
      '300x150(200x200)0,04',
      '300x300(450x200)0,09'];
    const optionsRRK = [
      '800(700x350)0,245',
      '900(800x400)0,32',
      '1000(800x500)0,4',
      '500(500x200)0,1',
      '600(500x300)0,15',
      '700(600x300)0,18',
      '200(200x100)0,02',
      '280(200x200)0,04',
      '370(300x200)0,06',
      '410(350x200)0,07',
      '450(400x200)0,08',
      '520(500x200)0,1',
    ];
    const optionsRPP = [
      '960x450(500x600)0,3',
      '960x500(500x600)0,3',
      '960x600(650x600)0,39',
      '674x400(400x450)0,18',
      '674x650(650x450)0,29',
      '815x350(400x450)0,18',
      '815x550(650x450)0,29',
      '230x300(200x200)0,04',
      '230x350(350x200)0,07',
      '271x450(350x200)0,07',
      '271x550(450x200)0,09',
      '312x350(350x200)0,07',
      '312x500(450x200)0,09',
      '394x300(350x200)0,07',
      '394x400(450x200)0,09',
      '480x200(350x200)0,07',
      '480x300(450x200)0,09',
      '534x200(350x200)0,07',
      '534x300(450x200)0,09',
    ];
    const RPXfield = ref(optionsRPX[0]);
    const RRKfield = ref(optionsRRK[0]);
    const RPPfield = ref(optionsRPP[0]);
    return {
      color: props.colorField,
      RPXfield,
      RRKfield,
      RPPfield,
      radio,
      optionsRPX,
      optionsRRK,
      optionsRPP,
    };
  },
};
</script>
<style scoped>
.widthField {
  min-width: 250px;
}
</style>
