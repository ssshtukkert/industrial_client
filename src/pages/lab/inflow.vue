<template >
  <q-page class="justify-center full-width" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Подготовка воздуха (Приток)</div>
    </q-card-section>
    <div class="row justify-center">
      <div class="col-4">
        <Chart :ref="charts[2]" name='Температура центрального теплоносителя, °С'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }]" chartId="chart2" colorDefault="black"
          :legend="false" classTitle="text-h8" :height="70" valueMeasure="°С" />
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <Chart :ref="charts[0]" name='Температура наружного воздуха, °С'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }]" chartId="chart0" colorDefault="black"
          :legend="false" classTitle="text-h8" :height="50" valueMeasure="°С" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[3]" name='Влагосодержание наружного воздуха, г/кг'
          :parameters="[{ name: 'Влагосодержание', color: 'rgb(97, 138, 199)' }]" chartId="chart3" colorDefault="black"
          :legend="false" classTitle="text-h8" :height="50" valueMeasure="г/кг" />
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <Chart :ref="charts[1]" name='Температура воздуха в помещении, °С'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }]" chartId="chart1" colorDefault="black"
          :legend="false" classTitle="text-h8" :height="50" valueMeasure="°С" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[4]" name='Влагосодержание воздуха в помещении, г/кг'
          :parameters="[{ name: 'Влагосодержание', color: 'rgb(97, 138, 199)' }]" chartId="chart4" colorDefault="black"
          :legend="false" classTitle="text-h8" :height="50" valueMeasure="г/кг" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart_v3 :ref="charts[5]" name='Температура смешения Приток1, °С'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }, { name: 'Уставка:', color: 'white' }]"
          chartId="chart5" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[6]" name='Влагосодержание воздуха смешения Приток1, г/кг'
          :parameters="[{ name: 'Влагосодержание', color: 'rgb(97, 138, 199)' }]" chartId="chart6" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-2">
        <Chart_v3 :ref="charts[7]" name='Температура воздуха после водяного калорифера Приток1, °С'
          :parameters="[{ name: 'Температура:', color: 'rgb(97, 138, 199)' }, { name: 'Уставка:', color: 'white' }]"
          chartId="chart7" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С">
          <template v-slot:bottomLabel>
            <div align="center">
              <q-badge style="background-color: rgb(80, 80, 80);">
                <div class="text-white text-h8">
                  Обратный теплоноситель: {{ tObr }} °С
                </div>
              </q-badge>
            </div>
          </template>
        </Chart_v3>
      </div>
      <div class="col-2">
        <Chart_v3 :ref="charts[8]"
          name='Температура воздуха после электрического калорифера перед увлажнителем Приток1, °С'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }, { name: 'Уставка:', color: 'white' }]"
          chartId="chart8" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>

      <div class="col-2">
        <Chart_v3 :ref="charts[9]" name='Влагосодержание воздуха после увлажнителя Приток1, г/кг'
          :parameters="[{ name: 'Влагосодержание', color: 'rgb(97, 138, 199)' }, { name: 'Уставка:', color: 'white' }]"
          chartId="chart9" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-2">
        <Chart_v3 :ref="charts[10]" name='Расход воздуха вентилятора Приток1, м³/ч'
          :parameters="[{ name: 'Расход', color: 'rgb(97, 138, 199)' }, { name: 'Уставка:', color: 'white' }]"
          chartId="chart10" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="м³/ч" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[11]" name='Процент открытия клапана смешения Приток1, %'
          :parameters="[{ name: 'Производительность', color: 'rgb(97, 138, 199)' }]" chartId="chart11"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">

      </div>
      <div class="col-2">
        <Chart :ref="charts[12]" name='Управление водяным калорифером Приток1, %'
          :parameters="[{ name: 'Производительность', color: 'rgb(97, 138, 199)' }]" chartId="chart12"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%">
          <template v-slot:topLabel>
            <div align="center">
              <q-badge style="background-color: rgb(60, 60, 60);">
                <div class="text-white text-h8">
                  Режим: {{ stat }}
                </div>
              </q-badge>
            </div>
          </template>
        </Chart>
      </div>
      <div class="col-2">
        <Chart :ref="charts[13]" name='Управление калорифером перед увлажнителем Приток1, %'
          :parameters="[{ name: 'Производительность', color: 'rgb(97, 138, 199)' }]" chartId="chart13"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>

      <div class="col-2">
        <Chart :ref="charts[14]" name='Управление калорифером после вентилятора Приток1, %'
          :parameters="[{ name: 'Производительность', color: 'rgb(97, 138, 199)' }]" chartId="chart14"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[15]" name='Управление вентилятором Приток1'
          :parameters="[{ name: 'Производительность', color: 'rgb(97, 138, 199)' }]" chartId="chart15"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart_v3 :ref="charts[16]" name='Температура смешения Приток2, °С'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }, { name: 'Уставка:', color: 'white' }]"
          chartId="chart16" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[17]" name='Температура воздуха в канале 11 перед рекуператором, °С'
          :parameters="[{ name: 'Температура:', color: 'rgb(97, 138, 199)' }, { name: 'Уставка:', color: 'white' }]"
          chartId="chart17" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart_v3 :ref="charts[18]" name='Расход воздуха вентилятора Приток2, м³/ч'
          :parameters="[{ name: 'Расход', color: 'rgb(97, 138, 199)' }, { name: 'Уставка:', color: 'white' }]"
          chartId="chart18" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="м³/ч" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[19]" name='Процент открытия клапана смешения Приток2, %'
          :parameters="[{ name: 'Производительность', color: 'rgb(97, 138, 199)' }]" chartId="chart19"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[20]" name='Управление электрическим калорифером перед вентилятором Приток2, %'
          :parameters="[{ name: 'Производительность', color: 'rgb(97, 138, 199)' }]" chartId="chart20"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[31]" name='Управление вентилятора Приток2, %'
          :parameters="[{ name: 'Производительность', color: 'rgb(97, 138, 199)' }]" chartId="chart31"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[21]" name='Температура на выходе Приток1, °С'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }]" chartId="chart21" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[22]" name='Относительная влажность на выходе Приток1, %'
          :parameters="[{ name: 'Влагосодержание', color: 'rgb(97, 138, 199)' }]" chartId="chart22" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[23]" name='Влагосодержание воздуха на выходе Приток1, г/кг'
          :parameters="[{ name: 'Влагосодержание', color: 'rgb(97, 138, 199)' }]" chartId="chart23" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[24]" name='Температура на выходе Приток2, °С'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }]" chartId="chart24" colorDefault="teal"
          :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[25]" name='Относительная влажность на выходе Приток2, %'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }]" chartId="chart25" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[26]" name='Влагосодержание воздуха на выходе Приток2, г/кг'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }]" chartId="chart26" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[27]" name='Выход Притока (Температура), °С'
          :parameters="[{ name: 'Температура:', color: 'rgb(97, 138, 199)' }, { name: 'Уставка:', color: 'white' }]"
          chartId="chart27" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart_v3 :ref="charts[28]" name='Выход Притока (Отн.Вл), %'
          :parameters="[{ name: 'Влажность', color: 'rgb(97, 138, 199)' }, { name: 'Уставка:', color: 'white' }]"
          chartId="chart28" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart_v3 :ref="charts[29]" name='Выход Притока (влагосодержание), г/кг'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }, { name: 'Уставка:', color: 'white' }]"
          chartId="chart29" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-6">
        <Chart_v3 :ref="charts[30]" name='Температура влажного термометра Приток, °С'
          :parameters="[{ name: 'Температура:', color: 'rgb(97, 138, 199)' }, { name: 'Уставка:', color: 'white' }, { name: 'Уставка + 0.3', color: 'green' }, { name: 'Уставка - 0.3', color: 'green' }]"
          chartId="chart30" colorDefault="black" :legend="true" classTitle="text-h8" classSetpoint="text-h6"
          classValue="text-h6" valueMeasure="°С" :height="60" />
      </div>
    </div>

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
  name: 'Inflow',
  components: {
    Chart,
    Chart_v3,
  },
  setup() {
    document.title = 'Подготовка воздуха (Приток)';
    const { host } = inject('store');
    const charts = [];
    const dataValues = [];
    const load = ref(0);
    const tObr = ref(0);
    const stat = ref('');
    let CodeStatus1 = [];
    for (let index = 0; index < 32; index += 1) {
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
      if (setpoint) {
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
        updateChart(0, mes.SCo_t_nar, null, mes.time, false, false);
        updateChart(1, mes.T_Lab, null, mes.time, false, false);
        updateChart(2, mes.SCo_t_tset, null, mes.time, false, false);
        updateChart(3, mes.SCo_Abs_nar, null, mes.time, false, false);
        updateChart(4, mes.Hc_Lab, null, mes.time, false, false);
        // updateChart(5, mes.SCo_t_smesh_pr1, null, mes.time, false, false);
        updateChartv3(5, [{ value: mes.SCo_t_smesh_pr1 },
          { value: mes.Set_SCo_t_smesh_pr1 }], mes.time, false, false);
        updateChart(6, mes.SCo_Hc_ecal1_pr1, null, mes.time, false, false);
        updateChartv3(7, [{ value: mes.SCo_t_vokal_pr1 },
          { value: mes.Set_SCo_t_vokal_pr1 }], mes.time, false, false);
        // updateChart(8, mes.SCo_t_ekal1_pr1, null, mes.time, false, false);
        updateChartv3(8, [{ value: mes.SCo_t_ekal1_pr1 },
          { value: mes.Set_SCo_t_ekal1_pr1 }], mes.time, false, false);
        // updateChart(9, mes.Hc_21_Pr, null, mes.time, false, false);
        updateChartv3(9, [{ value: mes.Hc_21_Pr },
          { value: mes.Set_Hc_21_Pr }], mes.time, false, false);
        // updateChart(10, mes.SCo_m3h_pr1, null, mes.time, false, false);
        updateChartv3(10, [{ value: mes.SCo_m3h_pr1 },
          { value: mes.Set_SCo_m3h_pr1 }], mes.time, false, false);
        updateChart(11, mes.SCo_reg_smesh_pr1, null, mes.time, false, false);
        updateChart(12, mes.SCo_reg_vokal_pr1, null, mes.time, false, false);
        updateChart(13, mes.SCo_reg_ekal1_pr1, null, mes.time, false, false);
        updateChart(14, mes.SCo_reg_ekal2_pr1, null, mes.time, false, false);
        updateChart(15, mes.SCo_reg_m3h_pr1, null, mes.time, false, false);
        // updateChart(16, mes.SCo_t_smesh_pr2, null, mes.time, false, false);
        updateChartv3(16, [{ value: mes.SCo_t_smesh_pr2 },
          { value: mes.Set_SCo_t_smesh_pr2 }], mes.time, false, false);
        // updateChart(17, mes.T_21_Pr, null, mes.time, false, false);
        updateChartv3(17, [{ value: mes.T_21_Pr },
          { value: mes.Set_T_21_Pr }], mes.time, false, false);
        // updateChart(18, mes.SCo_m3h_pr2, null, mes.time, false, false);
        updateChartv3(18, [{ value: mes.SCo_m3h_pr2 },
          { value: mes.Set_SCo_m3h_pr2 }], mes.time, false, false);
        updateChart(19, mes.SCo_reg_smesh_pr2, null, mes.time, false, false);
        updateChart(20, mes.SCo_reg_ekal_pr2, null, mes.time, false, false);
        updateChart(21, mes.SCo_t_pr1, null, mes.time, false, false);
        updateChart(22, mes.SCo_Rh_pr1, null, mes.time, false, false);
        updateChart(23, mes.SCo_Hc_pr1, null, mes.time, false, false);
        updateChart(24, mes.SCo_t_pr2, null, mes.time, false, false);
        updateChart(25, mes.SCo_Rh_pr2, null, mes.time, false, false);
        updateChart(26, mes.SCo_Hc_pr2, null, mes.time, false, false);
        // updateChart(27, mes.T_21_Pr, null, mes.time, false, false);
        updateChartv3(27, [{ value: mes.T_21_Pr },
          { value: mes.Set_T_21_Pr }], mes.time, false, false);
        // updateChart(28, mes.Rh_21_Pr, null, mes.time, false, false);
        updateChartv3(28, [{ value: mes.Rh_21_Pr },
          { value: mes.Set_Rh_21_Pr }], mes.time, false, false);
        // updateChart(29, mes.Hc_21_Pr, null, mes.time, false, false);
        updateChartv3(29, [{ value: mes.Hc_21_Pr }, { value: mes.Set_Hc_21_Pr }], mes.time, false, false);
        updateChart(31, mes.SCo_reg_m3h_pr2, null, mes.time, false, false);
        const setMax = mes.Set_TwT_21 + 0.3;
        const setMin = mes.Set_TwT_21 - 0.3;
        updateChartv3(30, [{ value: mes.TwT_21 }, { value: mes.Set_TwT_21 }, { value: setMax }, { value: setMin }], mes.time, false, false);
        dataValues.pop();
        load.value = dataValues.length;
        setImmediate(shift);
      } else {
        for (let index = 0; index < charts.lenght; index += 1) {
          charts[index].value.update();
        }
      }
    }
    function convertToBinary(number) {
      let num = number;
      let binary = (num % 2).toString();
      for (; num > 1;) {
        num = parseInt(num / 2, 10);
        binary = (num % 2) + (binary);
      }
      return binary;
    }
    let workPr = false;
    let smeshWorkPr = false;
    function listen(json) {
      const mes = json.message;
      if (json.id === 2) {
        if (json.type === 'sendAirDevices') {
          console.log(mes);
          if (dataValues.length === 0) {
            updateChart(0, mes.SCo_t_nar.value, null, mes.time, true, true);
            updateChart(1, mes.T_Lab.value, null, mes.time, true, true);
            updateChart(2, mes.SCo_t_tset.value, null, mes.time, true, true);
            updateChart(3, mes.SCo_Abs_nar.value, null, mes.time, true, true);
            updateChart(4, mes.Hc_Lab.value, null, mes.time, true, true);
            // updateChart(5, mes.SCo_t_smesh_pr1.value, mes.SCo_t_smesh_pr1.setpoint, mes.time, true, true);
            updateChartv3Set(5, [{ value: mes.SCo_t_smesh_pr1.value },
              { value: mes.SCo_t_smesh_pr1.setpoint }], mes.SCo_t_smesh_pr1.value, mes.SCo_t_smesh_pr1.setpoint, mes.time, true, true);
            updateChart(6, mes.SCo_Hc_ecal1_pr1.value, null, mes.time, true, true);
            // updateChart(7, mes.SCo_t_vokal_pr1.value, mes.SCo_t_vokal_pr1.setpoint, mes.time, true, true);
            updateChartv3Set(7, [{ value: mes.SCo_t_vokal_pr1.value },
              { value: mes.SCo_t_vokal_pr1.setpoint }], mes.SCo_t_vokal_pr1.value, mes.SCo_t_vokal_pr1.setpoint, mes.time, true, true);
            // updateChart(8, mes.SCo_t_ekal1_pr1.value, mes.SCo_t_ekal1_pr1.setpoint, mes.time, true, true);
            updateChartv3Set(8, [{ value: mes.SCo_t_ekal1_pr1.value },
              { value: mes.SCo_t_ekal1_pr1.setpoint }], mes.SCo_t_ekal1_pr1.value, mes.SCo_t_ekal1_pr1.setpoint, mes.time, true, true);
            // updateChart(9, mes.Hc_21_Pr.value, mes.Hc_21_Pr.setpoint, mes.time, true, true);
            updateChartv3Set(9, [{ value: mes.Hc_21_Pr.value },
              { value: mes.Hc_21_Pr.setpoint }], mes.Hc_21_Pr.value, mes.Hc_21_Pr.setpoint, mes.time, true, true);
            // updateChart(10, mes.SCo_m3h_pr1.value, mes.SCo_m3h_pr1.setpoint, mes.time, true, true);
            updateChartv3Set(10, [{ value: mes.SCo_m3h_pr1.value },
              { value: mes.SCo_m3h_pr1.setpoint }], mes.SCo_m3h_pr1.value, mes.SCo_m3h_pr1.setpoint, mes.time, true, true);
            updateChart(11, mes.SCo_reg_smesh_pr1.value, null, mes.time, true, true);
            updateChart(12, mes.SCo_reg_vokal_pr1.value, null, mes.time, true, true);
            updateChart(13, mes.SCo_reg_ekal1_pr1.value, null, mes.time, true, true);
            updateChart(14, mes.SCo_reg_ekal2_pr1.value, null, mes.time, true, true);
            updateChart(15, mes.SCo_reg_m3h_pr1.value, null, mes.time, true, true);
            // updateChart(16, mes.SCo_t_smesh_pr2.value, mes.SCo_t_smesh_pr2.setpoint, mes.time, true, true);
            updateChartv3Set(16, [{ value: mes.SCo_t_smesh_pr2.value },
              { value: mes.SCo_t_smesh_pr2.setpoint }], mes.SCo_t_smesh_pr2.value, mes.SCo_t_smesh_pr2.setpoint, mes.time, true, true);
            // updateChart(17, mes.T_21_Pr.value, mes.T_21_Pr.setpoint, mes.time, true, true);
            updateChartv3Set(17, [{ value: mes.T_21_Pr.value },
              { value: mes.T_21_Pr.setpoint }], mes.T_21_Pr.value, mes.T_21_Pr.setpoint, mes.time, true, true);
            // updateChart(18, mes.SCo_m3h_pr2.value, mes.SCo_m3h_pr2.setpoint, mes.time, true, true);
            updateChartv3Set(18, [{ value: mes.SCo_m3h_pr2.value },
              { value: mes.SCo_m3h_pr2.setpoint }], mes.SCo_m3h_pr2.value, mes.SCo_m3h_pr2.setpoint, mes.time, true, true);
            updateChart(19, mes.SCo_reg_smesh_pr2.value, null, mes.time, true, true);
            updateChart(20, mes.SCo_reg_ekal_pr2.value, null, mes.time, true, true);
            updateChart(21, mes.SCo_t_pr1.value, null, mes.time, true, true);
            updateChart(22, mes.SCo_Rh_pr1.value, null, mes.time, true, true);
            updateChart(23, mes.SCo_Hc_pr1.value, null, mes.time, true, true);
            updateChart(24, mes.SCo_t_pr2.value, null, mes.time, true, true);
            updateChart(25, mes.SCo_Rh_pr2.value, null, mes.time, true, true);
            updateChart(26, mes.SCo_Hc_pr2.value, null, mes.time, true, true);
            // updateChart(27, mes.T_21_Pr.value, mes.T_21_Pr.setpoint, mes.time, true, true);
            updateChartv3Set(27, [{ value: mes.T_21_Pr.value },
              { value: mes.T_21_Pr.setpoint }], mes.T_21_Pr.value, mes.T_21_Pr.setpoint, mes.time, true, true);
            // updateChart(28, mes.Rh_21_Pr.value, mes.Rh_21_Pr.setpoint, mes.time, true, true);
            updateChartv3Set(28, [{ value: mes.Rh_21_Pr.value },
              { value: mes.Rh_21_Pr.setpoint }], mes.Rh_21_Pr.value, mes.Rh_21_Pr.setpoint, mes.time, true, true);
            // updateChart(29, mes.Hc_21_Pr.value, mes.Hc_21_Pr.setpoint, mes.time, true, true);
            updateChartv3Set(29, [{ value: mes.Hc_21_Pr.value },
              { value: mes.Hc_21_Pr.setpoint }], mes.Hc_21_Pr.value, mes.Hc_21_Pr.setpoint, mes.time, true, true);
            updateChart(31, mes.SCo_reg_m3h_pr2.value, mes.SCo_reg_m3h_pr2.setpoint, mes.time, true, true);
            const setMax = Number(mes.TwT_21.setpoint) + 0.3;
            const setMin = Number(mes.TwT_21.setpoint) - 0.3;
            updateChartv3Set(30, [{ value: mes.TwT_21.value },
              { value: mes.TwT_21.setpoint }, { value: setMax }, { value: setMin }], mes.TwT_21.value, mes.TwT_21.setpoint, mes.time, true, true);
            tObr.value = mes.SCo_t_obr_vokal_pr1.value;
            workPr = Number(mes.CodeSets.value[0]) === 1;
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
          CodeStatus1 = convertToBinary(mes.CodeStatus1.value).split('');
          while (CodeStatus1.length < 10) {
            CodeStatus1.unshift(Number(0));
          }
          CodeStatus1.reverse();
          smeshWorkPr = Number(CodeStatus1[0]) === 1;
        }
        if (workPr && smeshWorkPr) {
          stat.value = 'воздух';
        } else {
          stat.value = 'вода';
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
      Chart_v3,
      charts,
      load,
      tObr,
      stat,
    };
  },
};
</script>
<style scoped>

</style>
