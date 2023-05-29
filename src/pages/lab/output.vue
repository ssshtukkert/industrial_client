<template >
  <q-page class="justify-center full-width" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Подготовка воздуха (Удаляемые)</div>
    </q-card-section>
    <div class="row">
      <div class="col-6">
        <Chart :ref="charts[0]"
          :parameters="parameters[0].datails"
          classValue="text-h6" classSetpoint="text-h6" :chartId="parameters[0].name"  colorDefault="yellow" :legend="false"
          classTitle="text-h6" :height="80" valueMeasure="м³/ч" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[2]"
          :parameters="parameters[2].datails"
          classValue="text-h6" classSetpoint="text-h6" :chartId="parameters[2].name"  colorDefault="black" :legend="false"
          classTitle="text-h6" valueMeasure="м³/ч" :height="80" />
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <Chart :ref="charts[1]" :parameters="parameters[1].datails"
          :chartId="parameters[1].name" classValue="text-h6" classSetpoint="text-h6" colorDefault="black" :legend="false"
          classTitle="text-h6" valueMeasure="%" :height="80" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[3]" :parameters="parameters[3].datails"
        :chartId="parameters[3].name"  classValue="text-h6" classSetpoint="text-h6" colorDefault="black" :legend="false"
          classTitle="text-h6" valueMeasure="%" :height="80" />
      </div>
    </div>
  </q-page>
</template>

<script>
import {
  inject, ref, onMounted, onBeforeUnmount,
} from 'vue';
import Chart from 'src/components/charts/chart_v4.vue';
import {
  loadChartsFromData, updateChart_v4, color,
} from './fun';

export default {
  name: 'Output',
  components: {
    Chart,
  },
  setup() {
    document.title = 'Подготовка воздуха (Удаляемые)';
    const charts = [];
    const parameters = ref([
      {
        name: 'chart0',
        parameters: ['m3h_21_UdalPr', 'Set_m3h_21_UdalPr'],
        datails: [{ name: 'м³/ч', color }, { name: 'Уставка,м³/ч', color: 'white' }],
        label: 'Расход вентилятора Приточного, м³/ч',
      },
      {
        name: 'chart1',
        parameters: ['SCo_reg_m3h_udalpr'],
        datails: [{ name: '%', color }],
        label: 'Управление вентилятором Приточным, %',
      },
      {
        name: 'chart2',
        parameters: ['m3h_11_UdalVyt', 'Set_m3h_11_UdalVyt'],
        datails: [{ name: 'м³/ч', color }, { name: 'Уставка,м³/ч', color: 'white' }],
        label: 'Расход вентилятора Вытяжка, м³/ч',
      },
      {
        name: 'chart3',
        parameters: ['SCo_reg_m3h_udelvyt'],
        datails: [{ name: '%', color }],
        label: 'Управление вентилятором Вытяжка, %',
      },
    ]);
    for (let index = 0; index < 4; index += 1) {
      charts.push(ref(null));
    }
    const {
      WebSocket_Create, WebSocket_Listen, WebSocket_Close,
    } = inject('store');
    // функция упрощённого обновления графиков
    function updChart(index, par, mes) {
      const values = [mes[par].value];
      if (mes[par].setpoint) {
        values.push(mes[par].setpoint);
      }
      updateChart_v4(charts[index], values, mes[par].value, mes[par].setpoint, mes.createdAt.value);
    }
    function listen(json) {
      const mes = json.message;
      if (json.id === 2) {
        if (json.type === 'sendAirDevices') {
          console.log(mes);
          updChart(0, 'm3h_21_UdalPr', mes);
          updChart(1, 'SCo_reg_m3h_udalpr', mes);
          updChart(2, 'm3h_11_UdalVyt', mes);
          updChart(3, 'SCo_reg_m3h_udelvyt', mes);
        }
      }
    }
    onMounted(() => {
      loadChartsFromData(charts, 'AirDevice', parameters.value, 720);
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
      parameters,
    };
  },
};
</script>
<style scoped>

</style>
