<template >
  <q-page class="justify-center full-width" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Подготовка воздуха (Приток)</div>
    </q-card-section>
    <!-- <div v-show="load === 0"> -->
    <div class="row">
      <div class="col-4">
        <Chart :ref="charts[0]" name='Температура наружняя, °С' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart0" colorDefault="black" :legend="false" classTitle="text-h8" :height="70" valueMeasure="°С"  />
      </div>
      <div class="col-4">
        <Chart :ref="charts[1]" name='Температура помещение, °С' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart1" colorDefault="black" :legend="false" classTitle="text-h8" :height="70" valueMeasure="°С" />
      </div>
      <div class="col-4">
        <Chart :ref="charts[2]" name='Теплоцентраль, °С' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart2" colorDefault="black" :legend="false" classTitle="text-h8" :min="20"
          :max="50" :height="70" valueMeasure="°С" />
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <Chart :ref="charts[3]" name='Влажность наружная, г/кг'
          :parameters="[{ name: 'Влагосодержание', color: 'white' }]" typeChart="line" chartId="chart3"
          colorDefault="black" :legend="false" classTitle="text-h8" :max="20" :min="0" :height="50" valueMeasure="г/кг" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[4]" name='Влажность помещение, г/кг'
          :parameters="[{ name: 'Влагосодержание', color: 'white' }]" typeChart="line" chartId="chart4"
          colorDefault="black" :legend="false" classTitle="text-h8" :height="50" valueMeasure="г/кг" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[5]" name='Смешение Приток1, °С' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart5" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[6]" name='АбсВлСмешПриток1' :parameters="[{ name: 'Влагосодержание', color: 'white' }]"
          typeChart="line" chartId="chart6" colorDefault="black" :legend="false" classTitle="text-h8" :max="20"
          :min="0" valueMeasure="г/кг" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[7]" name='Вокал Приток1, °С' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart7" colorDefault="black" :legend="false" classTitle="text-h8" :max="50"
          :min="0" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[8]" name='ЭКал1 Приток1, °С' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart8" colorDefault="black" :legend="false" classTitle="text-h8" :min="0" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[9]" name='Влажность Приток1' :parameters="[{ name: 'Влагосодержание', color: 'white' }]"
          typeChart="line" chartId="chart9" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[10]" name='Вент Приток1' :parameters="[{ name: 'Расход', color: 'white' }]" typeChart="line"
          chartId="chart10" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="м3/ч" />
      </div>
    </div>
    <div class="row">
      <div class="col-3">
        <Chart :ref="charts[11]" name='УпрСмешПриток1' :parameters="[{ name: 'Производительность', color: 'white' }]"
          typeChart="line" chartId="chart11" colorDefault="black" :legend="false" classTitle="text-h8" :min="0"
          :max="100" valueMeasure="%" />
      </div>
      <div class="col-3">
        <Chart :ref="charts[12]" name='УпрВокалПриток1' :parameters="[{ name: 'Производительность', color: 'white' }]"
          typeChart="line" chartId="chart12" colorDefault="black" :legend="false" classTitle="text-h8" :min="0"
          :max="100" valueMeasure="%" />
      </div>
      <div class="col-3">
        <Chart :ref="charts[13]" name='УпрЭКал1 Приток1' :parameters="[{ name: 'Производительность', color: 'white' }]"
          typeChart="line" chartId="chart13" colorDefault="black" :legend="false" classTitle="text-h8" :min="0"
          :max="100" valueMeasure="%" />
      </div>
      <div class="col-3">
        <Chart :ref="charts[14]" name='УпрЭКал2 Приток1' :parameters="[{ name: 'Производительность', color: 'white' }]"
          typeChart="line" chartId="chart14" colorDefault="black" :legend="false" classTitle="text-h8" :min="0"
          :max="100" valueMeasure="%" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[15]" name='УпрВент Приток1' :parameters="[{ name: 'Производительность', color: 'white' }]"
          typeChart="line" chartId="chart15" colorDefault="black" :legend="false" classTitle="text-h8" :min="0"
          :max="100" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[16]" name='Смешение Приток2, °С' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart16" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[17]" name='ЭКал Приток2, °С' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart17" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[18]" name='Вент Приток2' :parameters="[{ name: 'Расход', color: 'white' }]" typeChart="line"
          chartId="chart18" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="м3/ч" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[19]" name='УпрСмеш Приток2' :parameters="[{ name: 'Производительность', color: 'white' }]"
          typeChart="line" chartId="chart19" colorDefault="black" :legend="false" classTitle="text-h8" :min="0"
          :max="100" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[20]" name='УпрЭкал Приток2' :parameters="[{ name: 'Производительность', color: 'white' }]"
          typeChart="line" chartId="chart20" colorDefault="black" :legend="false" classTitle="text-h8" :min="0"
          :max="100" valueMeasure="%" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[21]" name='ВыходТиВПриток1 (Выход), °С'
          :parameters="[{ name: 'Температура', color: 'white' }]" typeChart="line" chartId="chart21"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[22]" name='ВыходТиВПриток1 (Отн.Вл)' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart22" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[23]" name='ВыходТиВПриток1 (Абс.Вл)' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart23" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[24]" name='ВыходТиВПриток2 (Выход), °С'
          :parameters="[{ name: 'Температура', color: 'white' }]" typeChart="line" chartId="chart24" colorDefault="teal"
          :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[25]" name='ВыходТиВПриток2 (Отн.Вл)' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart25" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[26]" name='ВыходТиВПриток2 (Абс.Вл)' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart26" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
    </div>
    <div class="row">
      <div class="col-3">
        <Chart :ref="charts[27]" name='ВыходПриток (Температура), °С'
          :parameters="[{ name: 'Температура', color: 'white' }]" typeChart="line" chartId="chart27"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-3">
        <Chart :ref="charts[28]" name='ВыходПриток (Отн.Вл)' :parameters="[{ name: 'Влажность', color: 'white' }]"
          typeChart="line" chartId="chart28" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-3">
        <Chart :ref="charts[29]" name='ВыходПриток (Абс.Вл)' :parameters="[{ name: 'Температура', color: 'white' }]"
          typeChart="line" chartId="chart29" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-3">
        <Chart :ref="charts[30]" name='Температура влажного термометра, °С'
          :parameters="[{ name: 'Температура', color: 'white' }]" typeChart="line" chartId="chart30"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
    </div>
    <!-- </div>
    <q-inner-loading :showing="load > 0" color="white" :label="`Загрузка данных...${180 - load}/180`"
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
    document.title = 'Подготовка воздуха (Приток)';
    const { host } = inject('store');
    const charts = [];
    const dataValues = [];
    const load = ref(0);
    for (let index = 0; index < 31; index += 1) {
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
        updateChart(5, mes.SCo_t_smesh_pr1, null, mes.time, false, false);
        updateChart(6, mes.SCo_Hc_ecal1_pr1, null, mes.time, false, false);
        updateChart(7, mes.SCo_t_vokal_pr1, null, mes.time, false, false);
        updateChart(8, mes.SCo_t_ekal1_pr1, null, mes.time, false, false);
        updateChart(9, mes.Hc_21_Pr, null, mes.time, false, false);
        updateChart(10, mes.SCo_m3h_pr1, null, mes.time, false, false);
        updateChart(11, mes.SCo_reg_smesh_pr1, null, mes.time, false, false);
        updateChart(12, mes.SCo_reg_vokal_pr1, null, mes.time, false, false);
        updateChart(13, mes.SCo_reg_ekal1_pr1, null, mes.time, false, false);
        updateChart(14, mes.SCo_reg_ekal2_pr1, null, mes.time, false, false);
        updateChart(15, mes.SCo_reg_m3h_pr1, null, mes.time, false, false);
        updateChart(16, mes.SCo_t_smesh_pr2, null, mes.time, false, false);
        updateChart(16, mes.SCo_t_smesh_pr2, null, mes.time, false, false);
        updateChart(17, mes.T_21_Pr, null, mes.time, false, false);
        updateChart(18, mes.SCo_m3h_pr2, null, mes.time, false, false);
        updateChart(19, mes.SCo_reg_smesh_pr2, null, mes.time, false, false);
        updateChart(20, mes.SCo_reg_ekal_pr2, null, mes.time, false, false);
        updateChart(21, mes.SCo_t_pr1, null, mes.time, false, false);
        updateChart(22, mes.SCo_Rh_pr1, null, mes.time, false, false);
        updateChart(23, mes.SCo_Hc_pr1, null, mes.time, false, false);
        updateChart(24, mes.SCo_t_pr2, null, mes.time, false, false);
        updateChart(25, mes.SCo_Rh_pr2, null, mes.time, false, false);
        updateChart(26, mes.SCo_Hc_pr2, null, mes.time, false, false);
        updateChart(27, mes.T_21_Pr, null, mes.time, false, false);
        updateChart(28, mes.Rh_21_Pr, null, mes.time, false, false);
        updateChart(29, mes.Hc_21_Pr, null, mes.time, false, false);
        updateChart(30, mes.TwT_21, null, mes.time, false, false);
        dataValues.pop();
        load.value = dataValues.length;
        setImmediate(shift);
      } else {
        for (let index = 0; index < 31; index += 1) {
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
            updateChart(5, mes.SCo_t_smesh_pr1.value, mes.SCo_t_smesh_pr1.setpoint, mes.time, true, true);
            updateChart(6, mes.SCo_Hc_ecal1_pr1.value, null, mes.time, true, true);
            updateChart(7, mes.SCo_t_vokal_pr1.value, mes.SCo_t_vokal_pr1.setpoint, mes.time, true, true);
            updateChart(8, mes.SCo_t_ekal1_pr1.value, mes.SCo_t_ekal1_pr1.setpoint, mes.time, true, true);
            updateChart(9, mes.Hc_21_Pr.value, mes.Hc_21_Pr.setpoint, mes.time, true, true);
            updateChart(10, mes.SCo_m3h_pr1.value, mes.SCo_m3h_pr1.setpoint, mes.time, true, true);
            updateChart(11, mes.SCo_reg_smesh_pr1.value, null, mes.time, true, true);
            updateChart(12, mes.SCo_reg_vokal_pr1.value, null, mes.time, true, true);
            updateChart(13, mes.SCo_reg_ekal1_pr1.value, null, mes.time, true, true);
            updateChart(14, mes.SCo_reg_ekal2_pr1.value, null, mes.time, true, true);
            updateChart(15, mes.SCo_reg_m3h_pr1.value, null, mes.time, true, true);
            updateChart(16, mes.SCo_t_smesh_pr2.value, null, mes.time, true, true);
            updateChart(16, mes.SCo_t_smesh_pr2.value, mes.SCo_t_smesh_pr2.setpoint, mes.time, true, true);
            updateChart(17, mes.T_21_Pr.value, mes.T_21_Pr.setpoint, mes.time, true, true);
            updateChart(18, mes.SCo_m3h_pr2.value, mes.SCo_m3h_pr2.setpoint, mes.time, true, true);
            updateChart(19, mes.SCo_reg_smesh_pr2.value, null, mes.time, true, true);
            updateChart(20, mes.SCo_reg_ekal_pr2.value, null, mes.time, true, true);
            updateChart(21, mes.SCo_t_pr1.value, null, mes.time, true, true);
            updateChart(22, mes.SCo_Rh_pr1.value, null, mes.time, true, true);
            updateChart(23, mes.SCo_Hc_pr1.value, null, mes.time, true, true);
            updateChart(24, mes.SCo_t_pr2.value, null, mes.time, true, true);
            updateChart(25, mes.SCo_Rh_pr2.value, null, mes.time, true, true);
            updateChart(26, mes.SCo_Hc_pr2.value, null, mes.time, true, true);
            updateChart(27, mes.T_21_Pr.value, mes.T_21_Pr.setpoint, mes.time, true, true);
            updateChart(28, mes.Rh_21_Pr.value, mes.Rh_21_Pr.setpoint, mes.time, true, true);
            updateChart(29, mes.Hc_21_Pr.value, mes.Hc_21_Pr.setpoint, mes.time, true, true);
            updateChart(30, mes.TwT_21.value, mes.TwT_21.setpoint, mes.time, true, true);
          } else {
            const obj = {};
            // eslint-disable-next-line no-restricted-syntax, guard-for-in
            for (const key in mes) {
              obj[key] = mes[key].value;
            }
            dataValues.push(obj);
            shift();
          }
        }
      }
    }

    onMounted(() => {
      axios
        .get(`${host}/app/database/AirDevice/360`).then((responseM) => {
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
