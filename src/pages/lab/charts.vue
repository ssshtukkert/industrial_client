<template >
  <q-page class="justify-center full-width" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Графики</div>
    </q-card-section>
    <div class="row">
      <Chart :ref="charts[0]" name='Т_TMA1-6_21 °С' :parameters="[
        { name: 'T_ТМА1_21', color: 'red' },
        { name: 'T_ТМА2_21', color: 'green' },
        { name: 'T_ТМА3_21', color: 'blue' },
        { name: 'T_ТМА4_21', color: 'yellow' },
        { name: 'T_ТМА5_21', color: 'white' },
        { name: 'T_ТМА6_21', color: 'orange' },
      ]" typeChart="line" chartId="chart0" :legend="true" classTitle="text-h6" :height="70" />
    </div>
    <div class="row">
      <Chart :ref="charts[1]" name='Rh_TMA1-6_21 %' :parameters="[
        { name: 'Rh_ТМА1_21', color: 'red' },
        { name: 'Rh_ТМА2_21', color: 'green' },
        { name: 'Rh_ТМА3_21', color: 'blue' },
        { name: 'Rh_ТМА4_21', color: 'yellow' },
        { name: 'Rh_ТМА5_21', color: 'white' },
        { name: 'Rh_ТМА6_21', color: 'orange' },
      ]" typeChart="line" chartId="chart1" :legend="true" classTitle="text-h6" :height="70" />
    </div>
    <div class="row">
      <Chart :ref="charts[2]" name='Т_TMA13-18_22 °С' :parameters="[
        { name: 'T_ТМА13_22', color: 'red' },
        { name: 'T_ТМА14_22', color: 'green' },
        { name: 'T_ТМА15_22', color: 'blue' },
        { name: 'T_ТМА16_22', color: 'yellow' },
        { name: 'T_ТМА17_22', color: 'white' },
        { name: 'T_ТМА18_22', color: 'orange' },
      ]" typeChart="line" chartId="chart2" :legend="true" classTitle="text-h6" :height="70" />
    </div>
    <div class="row">
      <Chart :ref="charts[3]" name='Rh_TMA13-18_22 %' :parameters="[
        { name: 'Rh_ТМА13_22', color: 'red' },
        { name: 'Rh_ТМА14_22', color: 'green' },
        { name: 'Rh_ТМА15_22', color: 'blue' },
        { name: 'Rh_ТМА16_22', color: 'yellow' },
        { name: 'Rh_ТМА17_22', color: 'white' },
        { name: 'Rh_ТМА18_22', color: 'orange' },
      ]" typeChart="line" chartId="chart3" :legend="true" classTitle="text-h6" :height="70" />
    </div>
    <div class="row">
      <Chart :ref="charts[4]" name='Т_TMA19-24_11 °С' :parameters="[
        { name: 'T_ТМА19_22', color: 'red' },
        { name: 'T_ТМА20_22', color: 'green' },
        { name: 'T_ТМА21_22', color: 'blue' },
        { name: 'T_ТМА22_22', color: 'yellow' },
        { name: 'T_ТМА23_22', color: 'white' },
        { name: 'T_ТМА24_22', color: 'orange' },
      ]" typeChart="line" chartId="chart4" :legend="true" classTitle="text-h6" :height="70" />
    </div>
    <div class="row">
      <Chart :ref="charts[5]" name='Rh_TMA19-24_11 %' :parameters="[
        { name: 'Rh_ТМА19_22', color: 'red' },
        { name: 'Rh_ТМА20_22', color: 'green' },
        { name: 'Rh_ТМА21_22', color: 'blue' },
        { name: 'Rh_ТМА22_22', color: 'yellow' },
        { name: 'Rh_ТМА23_22', color: 'white' },
        { name: 'Rh_ТМА24_22', color: 'orange' },
      ]" typeChart="line" chartId="chart5" :legend="true" classTitle="text-h6" :height="70" />
    </div>
    <div class="row">
      <Chart :ref="charts[6]" name='Т_TMA7-12_12 °С' :parameters="[
        { name: 'T_ТМА7_22', color: 'red' },
        { name: 'T_ТМА8_22', color: 'green' },
        { name: 'T_ТМА9_22', color: 'blue' },
        { name: 'T_ТМА10_22', color: 'yellow' },
        { name: 'T_ТМА11_22', color: 'white' },
        { name: 'T_ТМА12_22', color: 'orange' },
      ]" typeChart="line" chartId="chart6" :legend="true" classTitle="text-h6" :height="70" />
    </div>
    <div class="row">
      <Chart :ref="charts[7]" name='Rh_TMA7-12_12 %' :parameters="[
        { name: 'Rh_ТМА7_22', color: 'red' },
        { name: 'Rh_ТМА8_22', color: 'green' },
        { name: 'Rh_ТМА9_22', color: 'blue' },
        { name: 'Rh_ТМА10_22', color: 'yellow' },
        { name: 'Rh_ТМА11_22', color: 'white' },
        { name: 'Rh_ТМА12_22', color: 'orange' },
      ]" typeChart="line" chartId="chart7" :legend="true" classTitle="text-h6" :height="70" />
    </div>
  </q-page>
</template>

<script>
import {
  inject, ref, onMounted, onBeforeUnmount,
} from 'vue';
import Chart from 'src/components/charts/chart_v3.vue';
import axios from 'axios';

export default {
  name: 'Charts',
  components: {
    Chart,
  },
  setup() {
    document.title = 'Графики';
    const charts = [];
    const dataValues = [];
    const load = ref(0);
    for (let index = 0; index < 8; index += 1) {
      charts.push(ref(null));
    }
    const {
      host, getCurrentTime, WebSocket_Create, WebSocket_Listen, WebSocket_Close,
    } = inject('store');
    function updateChart(index, values, time, direct, update) {
      if (time) {
        charts[index].value.pushValues(values, time, direct, update);
      } else {
        charts[index].value.pushValues(values, getCurrentTime(), direct, update);
      }
    }
    function shift() {
      if (dataValues.length > 0) {
        const mes = dataValues[dataValues.length - 1];
        const valuesT_TMA1_6 = [];
        valuesT_TMA1_6.push(
          { value: mes.T_TMA1_21 },
          { value: mes.T_TMA2_21 },
          { value: mes.T_TMA3_21 },
          { value: mes.T_TMA4_21 },
          { value: mes.T_TMA5_21 },
          { value: mes.T_TMA6_21 },
        );
        updateChart(0, valuesT_TMA1_6, mes.time, false, false);
        const valuesRh_TMA1_6 = [];
        valuesRh_TMA1_6.push(
          { value: mes.Rh_TMA1_21 },
          { value: mes.Rh_TMA2_21 },
          { value: mes.Rh_TMA3_21 },
          { value: mes.Rh_TMA4_21 },
          { value: mes.Rh_TMA5_21 },
          { value: mes.Rh_TMA6_21 },
        );
        updateChart(1, valuesRh_TMA1_6, mes.time, false, false);
        const valuesT_TMA13_18 = [];
        valuesT_TMA13_18.push(
          { value: mes.T_TMA13_22 },
          { value: mes.T_TMA14_22 },
          { value: mes.T_TMA15_22 },
          { value: mes.T_TMA16_22 },
          { value: mes.T_TMA17_22 },
          { value: mes.T_TMA18_22 },
        );
        updateChart(2, valuesT_TMA13_18, mes.time, false, false);
        const valuesRh_TMA13_18 = [];
        valuesRh_TMA13_18.push(
          { value: mes.Rh_TMA13_22 },
          { value: mes.Rh_TMA14_22 },
          { value: mes.Rh_TMA15_22 },
          { value: mes.Rh_TMA16_22 },
          { value: mes.Rh_TMA17_22 },
          { value: mes.Rh_TMA18_22 },
        );
        updateChart(3, valuesRh_TMA13_18, mes.time, false, false);
        const valuesT_TMA19_24 = [];
        valuesT_TMA19_24.push(
          { value: mes.T_TMA19_11 },
          { value: mes.T_TMA20_11 },
          { value: mes.T_TMA21_11 },
          { value: mes.T_TMA22_11 },
          { value: mes.T_TMA23_11 },
          { value: mes.T_TMA24_11 },
        );
        updateChart(4, valuesT_TMA19_24, mes.time, false, false);
        const valuesRh_TMA19_24 = [];
        valuesRh_TMA19_24.push(
          { value: mes.Rh_TMA19_11 },
          { value: mes.Rh_TMA20_11 },
          { value: mes.Rh_TMA21_11 },
          { value: mes.Rh_TMA22_11 },
          { value: mes.Rh_TMA23_11 },
          { value: mes.Rh_TMA24_11 },
        );
        updateChart(5, valuesRh_TMA19_24, mes.time, false, false);
        const valuesT_TMA7_12 = [];
        valuesT_TMA7_12.push(
          { value: mes.T_TMA7_12 },
          { value: mes.T_TMA8_12 },
          { value: mes.T_TMA9_12 },
          { value: mes.T_TMA10_12 },
          { value: mes.T_TMA11_12 },
          { value: mes.T_TMA12_12 },
        );
        updateChart(6, valuesT_TMA7_12, mes.time, false, false);
        const valuesRh_TMA7_12 = [];
        valuesRh_TMA7_12.push(
          { value: mes.Rh_TMA7_12 },
          { value: mes.Rh_TMA8_12 },
          { value: mes.Rh_TMA9_12 },
          { value: mes.Rh_TMA10_12 },
          { value: mes.Rh_TMA11_12 },
          { value: mes.Rh_TMA12_12 },
        );
        updateChart(7, valuesRh_TMA7_12, mes.time, false, false);
        dataValues.pop();
        load.value = dataValues.length;
        setImmediate(shift);
      } else {
        for (let index = 0; index < 8; index += 1) {
          charts[index].value.update();
        }
      }
    }
    function listen(json) {
      const mes = json.message;
      if (json.id === 2) {
        if (json.type === 'sendDataRecup') {
          console.log(mes);
          if (dataValues.length === 0) {
            const valuesT_TMA1_6 = [];
            valuesT_TMA1_6.push(
              { value: mes.T_TMA1_21.value },
              { value: mes.T_TMA2_21.value },
              { value: mes.T_TMA3_21.value },
              { value: mes.T_TMA4_21.value },
              { value: mes.T_TMA5_21.value },
              { value: mes.T_TMA6_21.value },
            );
            updateChart(0, valuesT_TMA1_6, mes.time, true, true);
            const valuesRh_TMA1_6 = [];
            valuesRh_TMA1_6.push(
              { value: mes.Rh_TMA1_21.value },
              { value: mes.Rh_TMA2_21.value },
              { value: mes.Rh_TMA3_21.value },
              { value: mes.Rh_TMA4_21.value },
              { value: mes.Rh_TMA5_21.value },
              { value: mes.Rh_TMA6_21.value },
            );
            updateChart(1, valuesRh_TMA1_6, mes.time, true, true);
            const valuesT_TMA13_18 = [];
            valuesT_TMA13_18.push(
              { value: mes.T_TMA13_22.value },
              { value: mes.T_TMA14_22.value },
              { value: mes.T_TMA15_22.value },
              { value: mes.T_TMA16_22.value },
              { value: mes.T_TMA17_22.value },
              { value: mes.T_TMA18_22.value },
            );
            updateChart(2, valuesT_TMA13_18, mes.time, true, true);
            const valuesRh_TMA13_18 = [];
            valuesRh_TMA13_18.push(
              { value: mes.Rh_TMA13_22.value },
              { value: mes.Rh_TMA14_22.value },
              { value: mes.Rh_TMA15_22.value },
              { value: mes.Rh_TMA16_22.value },
              { value: mes.Rh_TMA17_22.value },
              { value: mes.Rh_TMA18_22.value },
            );
            updateChart(3, valuesRh_TMA13_18, mes.time, true, true);
            const valuesT_TMA19_24 = [];
            valuesT_TMA19_24.push(
              { value: mes.T_TMA19_11.value },
              { value: mes.T_TMA20_11.value },
              { value: mes.T_TMA21_11.value },
              { value: mes.T_TMA22_11.value },
              { value: mes.T_TMA23_11.value },
              { value: mes.T_TMA24_11.value },
            );
            updateChart(4, valuesT_TMA19_24, mes.time, true, true);
            const valuesRh_TMA19_24 = [];
            valuesRh_TMA19_24.push(
              { value: mes.Rh_TMA19_11.value },
              { value: mes.Rh_TMA20_11.value },
              { value: mes.Rh_TMA21_11.value },
              { value: mes.Rh_TMA22_11.value },
              { value: mes.Rh_TMA23_11.value },
              { value: mes.Rh_TMA24_11.value },
            );
            updateChart(5, valuesRh_TMA19_24, mes.time, true, true);
            const valuesT_TMA7_12 = [];
            valuesT_TMA7_12.push(
              { value: mes.T_TMA7_12.value },
              { value: mes.T_TMA8_12.value },
              { value: mes.T_TMA9_12.value },
              { value: mes.T_TMA10_12.value },
              { value: mes.T_TMA11_12.value },
              { value: mes.T_TMA12_12.value },
            );
            updateChart(6, valuesT_TMA7_12, mes.time, true, true);
            const valuesRh_TMA7_12 = [];
            valuesRh_TMA7_12.push(
              { value: mes.Rh_TMA7_12.value },
              { value: mes.Rh_TMA8_12.value },
              { value: mes.Rh_TMA9_12.value },
              { value: mes.Rh_TMA10_12.value },
              { value: mes.Rh_TMA11_12.value },
              { value: mes.Rh_TMA12_12.value },
            );
            updateChart(7, valuesRh_TMA7_12, mes.time, true, true);
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
        .get(`${host}/app/database/DataRecup/360`).then((responseM) => {
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
