<template >
  <q-page class="justify-center full-width" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Подготовка воздуха (Удаляемые)</div>
    </q-card-section>
    <!-- <div v-show="load === 0"> -->
    <div class="row">
      <div class="col-6">
        <Chart :ref="charts[0]" name='Вент Приточный' :parameters="[{ name: 'Расход', color: 'white' }]"
          typeChart="line" chartId="chart0" colorDefault="yellow" :legend="false" classTitle="text-h8" :height="80"
          valueMeasure="м3/ч" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[1]" name='Управление Вент Приточный'
          :parameters="[{ name: 'Производительность, %', color: 'white' }]" typeChart="line" chartId="chart1"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" :height="80"/>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <Chart :ref="charts[2]" name='Вент Вытяжка' :parameters="[{ name: 'Расход', color: 'white' }]" typeChart="line"
          chartId="chart2" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="м3/ч" :height="80"/>
      </div>
      <div class="col-6">
        <Chart :ref="charts[3]" name='Управление Вент Вытяжка'
          :parameters="[{ name: 'Производительность, %', color: 'white' }]" typeChart="line" chartId="chart3"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" :height="80"/>
      </div>
    </div>
    <!-- </div> -->
    <!-- <q-inner-loading :showing="load > 0" color="white" :label="`Загрузка данных...${180 - load}/180`"
      label-class="text-white" label-style="font-size: 1.1em" /> -->
  </q-page>
</template>

<script>
import {
  inject, ref, onMounted, onBeforeUnmount,
} from 'vue';
import Chart from 'src/components/charts/chart_v2.vue';
import axios from 'axios';

export default {
  name: 'Output',
  components: {
    Chart,
  },
  setup() {
    document.title = 'Подготовка воздуха (Удаляемые)';
    const charts = [];
    const dataValues = [];
    const load = ref(0);
    for (let index = 0; index < 4; index += 1) {
      charts.push(ref(null));
    }
    const {
      host, getCurrentTime, WebSocket_Create, WebSocket_Listen, WebSocket_Close,
    } = inject('store');
    function updateChart(index, value, setpoint, time, direct, update) {
      if (time) {
        charts[index].value.pushValues([{ value }], time, direct, update);
      } else {
        charts[index].value.pushValues([{ value }], getCurrentTime(), direct, update);
      }
      if (setpoint != null) {
        charts[index].value.setSetpoint(Number(setpoint).toFixed(2));
      }
    }
    function shift() {
      if (dataValues.length > 0) {
        const mes = dataValues[dataValues.length - 1];
        updateChart(0, mes.m3h_21_UdalPr, null, mes.time, false, false);
        updateChart(1, mes.SCo_reg_m3h_udalpr, null, mes.time, false, false);
        updateChart(2, mes.m3h_11_UdalVyt, null, mes.time, false, false);
        updateChart(3, mes.SCo_reg_m3h_udelvyt, null, mes.time, false, false);
        dataValues.pop();
        load.value = dataValues.length;
        setImmediate(shift);
      } else {
        for (let index = 0; index < 4; index += 1) {
          charts[index].value.update();
        }
      }
    }
    function listen(json) {
      const mes = json.message;
      if (json.id === 2) {
        if (json.type === 'sendAirDevices') {
          console.log(mes);
          if (dataValues.length === 0) {
            updateChart(0, mes.m3h_21_UdalPr.value, mes.m3h_21_UdalPr.setpoint, mes.time, true, true);
            updateChart(1, mes.SCo_reg_m3h_udalpr.value, null, mes.time, true, true);
            updateChart(2, mes.m3h_11_UdalVyt.value, mes.m3h_11_UdalVyt.setpoint, mes.time, true, true);
            updateChart(3, mes.SCo_reg_m3h_udelvyt.value, null, mes.time, true, true);
          } else {
            const obj = {};
            // eslint-disable-next-line no-restricted-syntax, guard-for-in
            for (const key in mes) {
              obj[key] = mes[key].value;
            }
            dataValues.push(obj);
            shift();
          }
        } else if (json.type === 'sendDataRecup') {
          console.log(mes);
        }
      }
    }

    onMounted(() => {
      axios
        .get(`${host}/app/database/AirDevice/720`).then((responseM) => {
          for (let index = responseM.data.length - 1; index >= 0; index -= 1) {
            dataValues.push(responseM.data[index]);
          }
          shift();
        });
      // написать удаление элементов при размонтировании образа
      WebSocket_Create('recup', { getMain: 1 });
      WebSocket_Listen('recup', listen);
    });
    onBeforeUnmount(() => {
      WebSocket_Close('recup');
    });
    return {
      Chart,
      charts,
      load,
    };
  },
};
</script>
<style scoped>

</style>
