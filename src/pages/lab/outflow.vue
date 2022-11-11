<template >
  <q-page class="justify-center full-width" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Подготовка воздуха (Вытяжка)</div>
    </q-card-section>
    <!-- <div v-show="load === 0"> -->
    <div class="row">
      <div class="col-4">
        <Chart :ref="charts[0]" name='Температура наружняя, °С' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart0" colorDefault="black" :legend="false" classTitle="text-h8" :height="70"
          valueMeasure="°С" :min="-40" :max="60"/>
      </div>
      <div class="col-4">
        <Chart :ref="charts[1]" name='Температура помещение, °С' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart1" colorDefault="black" :legend="false" classTitle="text-h8" :height="70"
          valueMeasure="°С" />
      </div>
      <div class="col-4">
        <Chart :ref="charts[2]" name='Теплоцентраль, °С' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart2" colorDefault="black" :legend="false" classTitle="text-h8" :height="70"
          valueMeasure="°С" />
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <Chart :ref="charts[3]" name='Влажность наружная, г/кг' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart3" colorDefault="black" :legend="false" classTitle="text-h8" :height="50"
          valueMeasure="г/кг" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[4]" name='Влажность помещение, г/кг' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart4" colorDefault="black" :legend="false" classTitle="text-h8" :height="50"
          valueMeasure="г/кг" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[5]" name='Смешение Вытяжка, °С' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart5" colorDefault="black" :legend="false" classTitle="text-h8"
          valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[6]" name='АбсВлСмешВыт' :parameters="[{ name: 'Влагосодержание', color: 'white' }]"
          typeChart="line" chartId="chart6" colorDefault="black" :legend="false" classTitle="text-h8"
          valueMeasure="г/кг" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[7]" name='Вокал Вытяжка, °С' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart7" colorDefault="black" :legend="false" classTitle="text-h8"
          valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[8]" name='ЭКал Вытяжка, °С' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart8" colorDefault="black" :legend="false" classTitle="text-h8"
          valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[9]" name='Влажность Вытяжка' :parameters="[{ name: 'Влагосодержание', color: 'white' }]"
          typeChart="line" chartId="chart9" colorDefault="black" :legend="false" classTitle="text-h8"
          valueMeasure="г/кг" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[10]" name='Вент Вытяжка' :parameters="[{ name: 'Расход', color: 'white' }]" typeChart="line"
          chartId="chart10" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="м3/ч" :min="0"/>
      </div>
    </div>
    <div class="row">
      <div class="col-3">
        <Chart :ref="charts[11]" name='УпрСмешВыт' :parameters="[{ name: 'Производительность', color: 'white' }]"
          typeChart="line" chartId="chart11" colorDefault="black" :legend="false" classTitle="text-h8"
          valueMeasure="%" />
      </div>
      <div class="col-3">
        <Chart :ref="charts[12]" name='УпрВокалВыт' :parameters="[{ name: 'Производительность', color: 'white' }]"
          typeChart="line" chartId="chart12" colorDefault="black" :legend="false" classTitle="text-h8"
          valueMeasure="%" />
      </div>
      <div class="col-3">
        <Chart :ref="charts[13]" name='УпрВентВыт' :parameters="[{ name: 'Производительность', color: 'white' }]"
          typeChart="line" chartId="chart13" colorDefault="black" :legend="false" classTitle="text-h8"
          valueMeasure="%" />
      </div>
      <div class="col-3">
        <Chart :ref="charts[14]" name='УпрЭКал1Выт' :parameters="[{ name: 'Производительность', color: 'white' }]"
          typeChart="line" chartId="chart14" colorDefault="black" :legend="false" classTitle="text-h8"
          valueMeasure="%" />
      </div>

    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[15]" name='УпрЭКал2Выт' :parameters="[{ name: 'Производительность', color: 'white' }]"
          typeChart="line" chartId="chart15" colorDefault="black" :legend="false" classTitle="text-h8"
          valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[16]" name='Температура выход, °С' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart16" colorDefault="black" :legend="false" classTitle="text-h8"
          valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[17]" name='Относительная влажность' :parameters="[{ name: 'Влажность', color: 'white' }]"
          typeChart="line" chartId="chart17" colorDefault="black" :legend="false" classTitle="text-h8"
          valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[18]" name='АбсВлВыт' :parameters="[{ name: 'Влажность', color: 'white' }]" typeChart="line"
          chartId="chart18" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[19]" name='Температура влажного термометра'
          :parameters="[{ name: 'Температура', color: 'white' }]" typeChart="line" chartId="chart19"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С" />
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
  name: 'Inflow',
  components: {
    Chart,
  },
  setup() {
    document.title = 'Подготовка воздуха (Вытяжка)';
    const { host } = inject('store');
    const charts = [];
    const dataValues = [];
    const load = ref(0);
    for (let index = 0; index < 20; index += 1) {
      charts.push(ref(null));
    }
    const {
      getCurrentTime, WebSocket_Create, WebSocket_Listen, WebSocket_Close,
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
        updateChart(0, mes.SCo_t_nar, null, mes.time, false, false);
        updateChart(1, mes.T_Lab, null, mes.time, false, false);
        updateChart(2, mes.SCo_t_tset, null, mes.time, false, false);
        updateChart(3, mes.SCo_Abs_nar, null, mes.time, false, false);
        updateChart(4, mes.Hc_Lab, null, mes.time, false, false);
        updateChart(5, mes.SCo_t_smesh_vyt, null, mes.time, false, false);
        updateChart(6, mes.SCo_Hc_ecal1_vyt, null, mes.time, false, false);
        updateChart(7, mes.SCo_t_vokal_vyt, null, mes.time, false, false);
        updateChart(8, mes.SCo_t_ekal1_vyt, null, mes.time, false, false);
        updateChart(9, mes.Hc_11_Vyt, null, mes.time, false, false);
        updateChart(10, mes.SCo_m3h_vyt, null, mes.time, false, false);
        updateChart(11, mes.SCo_reg_t_smesh_vyt, null, mes.time, false, false);
        updateChart(12, mes.SCo_reg_vokal_vyt, null, mes.time, false, false);
        updateChart(13, mes.SCo_reg_m3h_vyt, null, mes.time, false, false);
        updateChart(14, mes.SCo_reg_ekal1_vyt, null, mes.time, false, false);
        updateChart(15, mes.SCo_reg_ekal2_vyt, null, mes.time, false, false);
        updateChart(16, mes.T_11_Vyt, null, mes.time, false, false);
        updateChart(17, mes.Rh_11_Vyt, null, mes.time, false, false);
        updateChart(18, mes.Hc_11_Vyt, null, mes.time, false, false);
        updateChart(19, mes.TwT_11, null, mes.time, false, false);
        dataValues.pop();
        load.value = dataValues.length;
        setImmediate(shift);
      } else {
        for (let index = 0; index < 20; index += 1) {
          charts[index].value.update();
        }
      }
    }
    function listen(json) {
      const mes = json.message;
      if (json.id === 2) {
        if (json.type === 'sendAirDevices') {
          if (dataValues.length === 0) {
            updateChart(0, mes.SCo_t_nar.value, null, mes.time, true, true);
            updateChart(1, mes.T_Lab.value, null, mes.time, true, true);
            updateChart(2, mes.SCo_t_tset.value, null, mes.time, true, true);
            updateChart(3, mes.SCo_Abs_nar.value, null, mes.time, true, true);
            updateChart(4, mes.Hc_Lab.value, null, mes.time, true, true);
            updateChart(5, mes.SCo_t_smesh_vyt.value, mes.SCo_t_smesh_vyt.setpoint, mes.time, true, true);
            updateChart(6, mes.SCo_Hc_ecal1_vyt.value, null, mes.time, true, true);
            updateChart(7, mes.SCo_t_vokal_vyt.value, mes.SCo_t_vokal_vyt.setpoint, mes.time, true, true);
            updateChart(8, mes.SCo_t_ekal1_vyt.value, mes.SCo_t_ekal1_vyt.setpoint, mes.time, true, true);
            updateChart(9, mes.Hc_11_Vyt.value, mes.Hc_11_Vyt.setpoint, mes.time, true, true);
            updateChart(10, mes.SCo_m3h_vyt.value, null, mes.time, true, true);
            updateChart(11, mes.SCo_reg_t_smesh_vyt.value, null, mes.time, true, true);
            updateChart(12, mes.SCo_reg_vokal_vyt.value, null, mes.time, true, true);
            updateChart(13, mes.SCo_reg_m3h_vyt.value, null, mes.time, true, true);
            updateChart(14, mes.SCo_reg_ekal1_vyt.value, null, mes.time, true, true);
            updateChart(15, mes.SCo_reg_ekal2_vyt.value, null, mes.time, true, true);
            updateChart(16, mes.T_11_Vyt.value, mes.T_11_Vyt.setpoint, mes.time, true, true);
            updateChart(17, mes.Rh_11_Vyt.value, mes.Rh_11_Vyt.setpoint, mes.time, true, true);
            updateChart(18, mes.Hc_11_Vyt.value, mes.Hc_11_Vyt.setpoint, mes.time, true, true);
            updateChart(19, mes.TwT_11.value, mes.TwT_11.setpoint, mes.time, true, true);
          } else {
            const obj = {};
            // eslint-disable-next-line no-restricted-syntax, guard-for-in
            for (const key in mes) {
              obj[key] = mes[key].value;
            }
            dataValues.push(obj);
            shift();
            charts[5].value.setSetpoint(Number(mes.SCo_t_smesh_vyt.setpoint).toFixed(2));
            charts[7].value.setSetpoint(Number(mes.SCo_t_vokal_vyt.setpoint).toFixed(2));
            charts[8].value.setSetpoint(Number(mes.SCo_t_ekal1_vyt.setpoint).toFixed(2));
            charts[9].value.setSetpoint(Number(mes.Hc_11_Vyt.setpoint).toFixed(2));
            charts[16].value.setSetpoint(Number(mes.T_11_Vyt.setpoint).toFixed(2));
            charts[17].value.setSetpoint(Number(mes.Rh_11_Vyt.setpoint).toFixed(2));
            charts[18].value.setSetpoint(Number(mes.Hc_11_Vyt.setpoint).toFixed(2));
            charts[19].value.setSetpoint(Number(mes.TwT_11.setpoint).toFixed(2));
          }
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
