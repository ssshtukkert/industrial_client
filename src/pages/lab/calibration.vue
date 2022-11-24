<template >
  <q-page class="justify-center full-width" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Калибровка датчиков давления</div>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-3 text-grey">
          ДавлПритокДо (21)
          <div v-if="calibration1 == 0" class="text-h6 text-white">
            {{ pa1 }} Па
          </div>
          <div v-if="calibration1 > 0" class="text-h6 text-white">
            Калибровка: {{ calibration1 }}
          </div>
            <q-btn type="submit" :loading="calibration1 > 0" color="teal" label="Корректировка РА1" @click="calibration(1)"/>
        </div>
        <div class="col-3 text-grey">
          ДавлВытяжкаПосле (12)
          <div v-if="calibration2 == 0" class="text-h6 text-white">
            {{ pa2 }} Па
          </div>
          <div v-if="calibration2 > 0" class="text-h6 text-white">
            Калибровка: {{ calibration2 }}
          </div>
          <q-btn type="submit" :loading="calibration2 > 0" color="teal" label="Корректировка РА2" @click="calibration(2)"/>
        </div>
        <div class="col-3 text-grey">
          ДавлПритокПосле (22)
          <div v-if="calibration3 == 0" class="text-h6 text-white">
            {{ pa3 }} Па
          </div>
          <div v-if="calibration3 > 0" class="text-h6 text-white">
            Калибровка:  {{ calibration3 }}
          </div>
          <q-btn type="submit" :loading="calibration3 > 0" color="teal" label="Корректировка РА3" @click="calibration(3)"/>
        </div>
        <div class="col-3 text-grey">
          ДавлВытяжкаДо (11)
          <div v-if="calibration4 == 0" class="text-h6 text-white">
            {{ pa4 }} Па
          </div>
          <div v-if="calibration4 > 0" class="text-h6 text-white">
            Калибровка: {{ calibration4 }}
          </div>
          <q-btn type="submit" :loading="calibration4 > 0" color="teal" label="Корректировка РА4" @click="calibration(4)"/>
        </div>
      </div>
    </q-card-section>
  </q-page>
</template>

<script>
import {
  inject, ref, onMounted, onBeforeUnmount,
} from 'vue';

export default {
  name: 'Calibration',
  setup() {
    document.title = 'Калибровка';
    const pa1 = ref(0);
    const pa2 = ref(0);
    const pa3 = ref(0);
    const pa4 = ref(0);
    const calibration1 = ref(0);
    const calibration2 = ref(0);
    const calibration3 = ref(0);
    const calibration4 = ref(0);
    const {
      WebSocket_Create, WebSocket_Listen, WebSocket_Close, WebSocket_Send, getCurrentTime,
    } = inject('store');
    function calibration(pa) {
      WebSocket_Send('recup', {
        id: 2, type: 'calibration', value: pa, timestamp: getCurrentTime(),
      });
      if (pa === 1) {
        calibration1.value = 15;
      } else if (pa === 2) {
        calibration2.value = 15;
      } else if (pa === 3) {
        calibration3.value = 15;
      } else if (pa === 4) {
        calibration4.value = 15;
      }
    }
    function listen(json) {
      const mes = json.message;
      if (json.id === 2) {
        if (json.type === 'sendDataRecup') {
          pa1.value = mes.Pressure_21.value;
          pa2.value = mes.Pressure_12.value;
          pa3.value = mes.Pressure_22.value;
          pa4.value = mes.Pressure_11.value;
          console.log(mes);
        } else if (json.type === 'sendAirDevices') {
          console.log(mes);
          calibration1.value = mes.calibration1.value;
          calibration2.value = mes.calibration2.value;
          calibration3.value = mes.calibration3.value;
          calibration4.value = mes.calibration4.value;
        }
      }
    }
    onMounted(() => {
      // написать удаление элементов при размонтировании образа
      WebSocket_Create('recup', { getMain: 1 });
      WebSocket_Listen('recup', listen);
    });
    onBeforeUnmount(() => {
      WebSocket_Close('recup');
    });
    return {
      pa1,
      pa2,
      pa3,
      pa4,
      calibration,
      calibration1,
      calibration2,
      calibration3,
      calibration4,
    };
  },
};
</script>
<style scoped>

</style>
