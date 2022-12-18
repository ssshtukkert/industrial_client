<template >
  <q-page class="justify-center full-width" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Подготовка воздуха (Удаляемые)</div>
    </q-card-section>
    <div class="row">
      <div class="col-6">
        <Chart_v3 :ref="charts[0]" name='Расход вентилятора Приточного, м³/ч'
          :parameters="[{ name: 'Расход', color: 'rgb(97, 138, 199)' }, { name: 'Уставка', color: 'white' }]"
          classValue="text-h6" classSetpoint="text-h6" chartId="chart0" colorDefault="yellow" :legend="false"
          classTitle="text-h8" :height="80" valueMeasure="м³/ч" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[1]" name='Управление вентилятором Приточным, %'
          :parameters="[{ name: 'Производительность, %', color: 'rgb(97, 138, 199)' }]" chartId="chart1"
          classValue="text-h6" classSetpoint="text-h6" colorDefault="black" :legend="false" classTitle="text-h8"
          valueMeasure="%" :height="80" />
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <Chart_v3 :ref="charts[2]" name='Расход вентилятора Вытяжка, м³/ч'
          :parameters="[{ name: 'Расход', color: 'rgb(97, 138, 199)' }, { name: 'Уставка', color: 'white' }]"
          classValue="text-h6" classSetpoint="text-h6" chartId="chart2" colorDefault="black" :legend="false"
          classTitle="text-h8" valueMeasure="м³/ч" :height="80" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[3]" name='Управление вентилятором Вытяжка, %'
          :parameters="[{ name: 'Производительность, %', color: 'rgb(97, 138, 199)' }]" chartId="chart3"
          classValue="text-h6" classSetpoint="text-h6" colorDefault="black" :legend="false" classTitle="text-h8"
          valueMeasure="%" :height="80" />
      </div>
    </div>
    <q-card-section class="row">
      <q-select dark class="text-h6 col-6 q-pa-sm" label="Параметр:" options-selected-class="text-h6"
        popup-content-class="text-h6" outlined v-model="parameter" @update:model-value="loadChart"
        :options="['deltap_11_12', 'deltap_11_22', 'deltap_21_22', 'KPD_T']" label-color="grey"
        popup-content-style="background-color: rgb(60, 60, 60); color:  white;">
        <template v-slot:selected>
          <div class="text-white">
            {{ parameter }}
          </div>
        </template>
      </q-select>
      <q-input dark class="col-2 q-pa-sm" v-model="count" type="number" label="Количество записей" color="white"
        input-class="text-h6 text-white" outlined label-color="grey" @update:model-value="loadChart"
        :rules="[val => (val >= 1) && (+val <= 6000) || 'Введите корректные данные']"/>
    </q-card-section>
    <Chart :ref="charts[4]" name='Данные по испытаниям'
      :parameters="[{ name: 'Параметр', color: 'rgb(97, 138, 199)' }]" chartId="chart4" classValue="text-h6"
      classSetpoint="text-h6" colorDefault="black" :legend="false" classTitle="text-h8" :height="80" />
  </q-page>
</template>

<script>
import {
  inject, ref, onMounted, onBeforeUnmount,
} from 'vue';
import Chart from 'src/components/charts/chart_v2.vue';
import Chart_v3 from 'src/components/charts/chart_v3.vue';
import axios from 'axios';

export default {
  name: 'Output',
  components: {
    Chart,
    Chart_v3,
  },
  setup() {
    document.title = 'Подготовка воздуха (Удаляемые)';
    const charts = [];
    const dataValues = [];
    const load = ref(0);
    const parameter = ref('KPD_T');
    const count = ref(720);
    for (let index = 0; index < 5; index += 1) {
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
    function updateChartv3(index, values, time, direct, update) {
      if (time) {
        charts[index].value.pushValues(values, time, direct, update);
      } else {
        charts[index].value.pushValues(values, getCurrentTime(), direct, update);
      }
    }
    function updateChartv3Set(index, values, value, setpoint, time, direct, update) {
      if (time) {
        charts[index].value.pushValues(values, time, direct, update);
      } else {
        charts[index].value.pushValues(values, getCurrentTime(), direct, update);
      }
      if (setpoint) {
        charts[index].value.setSetpoint(Number(setpoint).toFixed(2));
      }
      if (value) {
        charts[index].value.setValue(Number(value).toFixed(2));
      }
    }
    function shift() {
      if (dataValues.length > 0) {
        const mes = dataValues[dataValues.length - 1];
        updateChartv3(0, [{ value: mes.m3h_21_UdalPr }, { value: mes.Set_m3h_21_UdalPr }], mes.time, false, false);
        updateChart(1, mes.SCo_reg_m3h_udalpr, null, mes.time, false, false);
        updateChartv3(2, [{ value: mes.m3h_11_UdalVyt }, { value: mes.Set_m3h_11_UdalVyt }], mes.time, false, false);
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
            // updateChart(0, mes.m3h_21_UdalPr.value, mes.m3h_21_UdalPr.setpoint, mes.time, true, true);
            updateChartv3Set(0, [{ value: mes.m3h_21_UdalPr.value }, { value: mes.m3h_21_UdalPr.setpoint }], mes.m3h_21_UdalPr.value, mes.m3h_21_UdalPr.setpoint, mes.time, true, true);
            updateChart(1, mes.SCo_reg_m3h_udalpr.value, null, mes.time, true, true);
            // updateChart(2, mes.m3h_11_UdalVyt.value, mes.m3h_11_UdalVyt.setpoint, mes.time, true, true);
            updateChartv3Set(2, [{ value: mes.m3h_11_UdalVyt.value }, { value: mes.m3h_11_UdalVyt.setpoint }], mes.m3h_11_UdalVyt.value, mes.m3h_11_UdalVyt.setpoint, mes.time, true, true);
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
    function loadChart() {
      charts[4].value.myChart.data.datasets[0].data.length = 0;
      charts[4].value.myChart.data.labels.length = 0;
      charts[4].value.setVisible(false);
      axios
        .get(`${host}/testrecup/${parameter.value}/${count.value}`).then((responseM) => {
          const arrayValue = [];
          const arrayTime = [];
          for (let index = responseM.data.length - 1; index >= 0; index -= 1) {
            arrayValue.push(responseM.data[index][parameter.value]);
            arrayTime.push(responseM.data[index].dt);
          }
          charts[4].value.myChart.data.datasets[0].data = arrayValue;
          charts[4].value.myChart.data.labels = arrayTime;
          charts[4].value.setName(parameter.value);
          charts[4].value.setVisible(true);
          charts[4].value.update();
        });
    }
    onMounted(() => {
      axios
        .get(`${host}/app/database/AirDevice/720`).then((responseM) => {
          for (let index = responseM.data.length - 1; index >= 0; index -= 1) {
            dataValues.push(responseM.data[index]);
          }
          shift();
        });
      loadChart();
      // написать удаление элементов при размонтировании образа
      WebSocket_Create('recup', { getMain: 1 });
      WebSocket_Listen('recup', listen);
    });
    onBeforeUnmount(() => {
      WebSocket_Close('recup');
    });
    return {
      Chart,
      Chart_v3,
      charts,
      load,
      parameter,
      loadChart,
      count,
    };
  },
};
</script>
<style scoped>

</style>
