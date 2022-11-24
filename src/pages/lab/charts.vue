<template >
  <q-page class="justify-center full-width" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Графики</div>
    </q-card-section>
    <div class="row">
        <div class="col-6">
          <Chart :ref="charts[0]" name='Т_21(1-6) °С' :parameters="[
            { name: 'T21_1', color: 'red' },
            { name: 'T21_2', color: 'green' },
            { name: 'T21_3', color: 'blue' },
            { name: 'T21_4', color: 'yellow' },
            { name: 'T21_5', color: 'white' },
            { name: 'T21_6', color: 'orange' },
          ]" chartId="chart0" :legend="true" classTitle="text-h6" :height="70"/>
        </div>
        <div class="col-6">
          <Chart :ref="charts[1]" name='Rh_21(1-6) %' :parameters="[
          { name: 'Rh21_1', color: 'red' },
          { name: 'Rh21_2', color: 'green' },
          { name: 'Rh21_3', color: 'blue' },
          { name: 'Rh21_4', color: 'yellow' },
          { name: 'Rh21_5', color: 'white' },
          { name: 'Rh21_6', color: 'orange' },
        ]" chartId="chart1" :legend="true" classTitle="text-h6" :height="70"/>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <Chart :ref="charts[2]" name='Т_22(13-18) °С' :parameters="[
          { name: 'T22_13', color: 'red' },
          { name: 'T22_14', color: 'green' },
          { name: 'T22_15', color: 'blue' },
          { name: 'T22_16', color: 'yellow' },
          { name: 'T22_17', color: 'white' },
          { name: 'T22_18', color: 'orange' },
        ]" chartId="chart2" :legend="true" classTitle="text-h6" :height="70"/>
        </div>
        <div class="col-6">
          <Chart :ref="charts[3]" name='Rh_22(13-18) %' :parameters="[
          { name: 'Rh22_13', color: 'red' },
          { name: 'Rh22_14', color: 'green' },
          { name: 'Rh22_15', color: 'blue' },
          { name: 'Rh22_16', color: 'yellow' },
          { name: 'Rh22_17', color: 'white' },
          { name: 'Rh22_18', color: 'orange' },
        ]" chartId="chart3" :legend="true" classTitle="text-h6" :height="70"/>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <Chart :ref="charts[4]" name='Т_11(19-24) °С' :parameters="[
          { name: 'T11_19', color: 'red' },
          { name: 'T11_20', color: 'green' },
          { name: 'T11_21', color: 'blue' },
          { name: 'T11_22', color: 'yellow' },
          { name: 'T11_23', color: 'white' },
          { name: 'T11_24', color: 'orange' },
        ]" chartId="chart4" :legend="true" classTitle="text-h6" :height="70"/>
        </div>
        <div class="col-6">
          <Chart :ref="charts[5]" name='Rh_11(19-24) %' :parameters="[
          { name: 'Rh11_19', color: 'red' },
          { name: 'Rh11_20', color: 'green' },
          { name: 'Rh11_21', color: 'blue' },
          { name: 'Rh11_22', color: 'yellow' },
          { name: 'Rh11_23', color: 'white' },
          { name: 'Rh11_24', color: 'orange' },
        ]" chartId="chart5" :legend="true" classTitle="text-h6" :height="70"/>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <Chart :ref="charts[6]" name='Т_12(7-12) °С' :parameters="[
          { name: 'T12_7', color: 'red' },
          { name: 'T12_8', color: 'green' },
          { name: 'T12_9', color: 'blue' },
          { name: 'T12_10', color: 'yellow' },
          { name: 'T12_11', color: 'white' },
          { name: 'T12_12', color: 'orange' },
        ]" chartId="chart6" :legend="true" classTitle="text-h6" :height="70"/>
        </div>
        <div class="col-6">
          <Chart :ref="charts[7]" name='Rh_12(7-12) %' :parameters="[
          { name: 'Rh12_7', color: 'red' },
          { name: 'Rh12_8', color: 'green' },
          { name: 'Rh12_9', color: 'blue' },
          { name: 'Rh12_10', color: 'yellow' },
          { name: 'Rh12_11', color: 'white' },
          { name: 'Rh12_12', color: 'orange' },
        ]" chartId="chart7" :legend="true" classTitle="text-h6" :height="70"/>
        </div>
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
    const info = ref('');
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
    // function hoverTooltip(tooltipModel) {
    //   info.value = '';
    //   if (tooltipModel.title) {
    //     info.value += `\n${tooltipModel.title}`;
    //   }
    //   if (tooltipModel.body) {
    //     for (let index = 0; index < tooltipModel.body.length; index += 1) {
    //       const element = tooltipModel.body[index];
    //       info.value += `\n${element.lines}`;
    //     }
    //   }
    // }
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
        .get(`${host}/app/database/DataRecup/720`).then((responseM) => {
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
      info,
      // hoverTooltip,
    };
  },
};
</script>
<style scoped>

</style>
