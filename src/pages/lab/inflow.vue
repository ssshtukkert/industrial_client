<template >
  <q-page class="justify-center full-width" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Подготовка воздуха (Приток)</div>
    </q-card-section>
    <div class="row justify-center">
      <div class="col-6">
        <Chart :ref="charts[2]" :parameters="parameters[2].datails" :chartId="parameters[2].name" colorDefault="black"
          :legend="false" classTitle="text-h6" classValue="text-h6" :height="70" valueMeasure="°С" />
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <Chart :ref="charts[0]" :parameters="parameters[0].datails" :chartId="parameters[0].name" colorDefault="black"
          :legend="false" classTitle="text-h6" classValue="text-h6" :height="50" valueMeasure="°С" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[3]" :parameters="parameters[3].datails" :chartId="parameters[3].name" colorDefault="black"
          :legend="false" classTitle="text-h6" classValue="text-h6" :height="50" valueMeasure="г/кг" />
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <Chart :ref="charts[1]" :parameters="parameters[1].datails" :chartId="parameters[1].name" colorDefault="black"
          :legend="false" classTitle="text-h6" classValue="text-h6" :height="50" valueMeasure="°С" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[4]" :parameters="parameters[4].datails" :chartId="parameters[4].name" colorDefault="black"
          :legend="false" classTitle="text-h6" classValue="text-h6" :height="50" valueMeasure="г/кг" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[5]" :parameters="parameters[5].datails" :chartId="parameters[5].name" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[6]" :parameters="parameters[6].datails" :chartId="parameters[6].name" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[7]" :parameters="parameters[7].datails" :chartId="parameters[7].name" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С">
          <template v-slot:bottomLabel>
            <div align="center">
              <q-badge style="background-color: rgb(80, 80, 80);">
                <div class="text-white text-h8">
                  Обратный теплоноситель: {{ tObr }} °С
                </div>
              </q-badge>
            </div>
          </template>
        </Chart>
      </div>
      <div class="col-2">
        <Chart :ref="charts[8]" :parameters="parameters[8].datails" :chartId="parameters[8].name" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[9]" :parameters="parameters[9].datails" :chartId="parameters[9].name" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[10]" :parameters="parameters[10].datails" :chartId="parameters[10].name"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="м³/ч" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[11]" :parameters="parameters[11].datails" :chartId="parameters[11].name"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
      </div>
      <div class="col-2">
        <Chart :ref="charts[12]" :parameters="parameters[12].datails" :chartId="parameters[12].name"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%">
          <template v-slot:topLabel>
            <div align="left">
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
        <Chart :ref="charts[13]" :parameters="parameters[13].datails" :chartId="parameters[13].name"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[14]" :parameters="parameters[14].datails" :chartId="parameters[14].name"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[15]" :parameters="parameters[15].datails" :chartId="parameters[15].name"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[16]" :parameters="parameters[16].datails" :chartId="parameters[16].name"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[17]" :parameters="parameters[17].datails" :chartId="parameters[17].name"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[18]" :parameters="parameters[18].datails" :chartId="parameters[18].name"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="м³/ч" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[19]" :parameters="parameters[19].datails" :chartId="parameters[19].name"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[20]" :parameters="parameters[20].datails" :chartId="parameters[20].name"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[31]" :parameters="parameters[31].datails" :chartId="parameters[31].name"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[21]" :parameters="parameters[21].datails" :chartId="parameters[21].name" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[22]" :parameters="parameters[22].datails" :chartId="parameters[22].name" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[23]" :parameters="parameters[23].datails" :chartId="parameters[23].name" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[24]" :parameters="parameters[24].datails" :chartId="parameters[24].name" colorDefault="teal"
          :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[25]" :parameters="parameters[25].datails" :chartId="parameters[25].name" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[26]" :parameters="parameters[26].datails" :chartId="parameters[26].name" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[27]" :parameters="parameters[27].datails" :chartId="parameters[27].name" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[28]" :parameters="parameters[28].datails" :chartId="parameters[28].name" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[29]" :parameters="parameters[29].datails" :chartId="parameters[29].name" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[30]" :parameters="parameters[30].datails" :chartId="parameters[30].name" colorDefault="black"
          :legend="true" classTitle="text-h8" classSetpoint="text-h6"
          classValue="text-h6" valueMeasure="°С" :height="60" />
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
  loadChartsFromData, convertToBinary, updateChart_v4, color,
} from './fun';

export default {
  name: 'Inflow',
  components: {
    Chart,
  },
  setup() {
    document.title = 'Подготовка воздуха (Приток)';
    const charts = [];
    const tObr = ref(0);
    const stat = ref('');
    let CodeStatus1 = [];
    for (let index = 0; index < 32; index += 1) {
      charts.push(ref(null));
    }
    const {
      WebSocket_Create, WebSocket_Listen, WebSocket_Close,
    } = inject('store');
    const parameters = ref([
      {
        name: 'chart0',
        parameters: ['SCo_t_nar'],
        datails: [{ name: '°С', color }],
        label: 'Температура наружного воздуха, °С',
      },
      {
        name: 'chart1',
        parameters: ['T_Lab'],
        datails: [{ name: '°С', color }],
        label: 'Температура воздуха в помещении, °С',
      },
      {
        name: 'chart2',
        parameters: ['SCo_t_tset'],
        datails: [{ name: '°С', color }],
        label: 'Температура центрального теплоносителя, °С',
      },
      {
        name: 'chart3',
        parameters: ['SCo_Abs_nar'],
        datails: [{ name: 'г/кг', color }],
        label: 'Влагосодержание наружного воздуха, г/кг',
      },
      {
        name: 'chart4',
        parameters: ['Hc_Lab'],
        datails: [{ name: 'г/кг', color }],
        label: 'Влагосодержание воздуха в помещении, г/кг',
      },
      {
        name: 'chart5',
        parameters: ['SCo_t_smesh_pr1', 'Set_SCo_t_smesh_pr1'],
        datails: [{ name: '°С', color }, { name: 'Уставка,°С', color: 'white' }],
        label: 'Температура смешения Приток1, °С',
      },
      {
        name: 'chart6',
        parameters: ['SCo_Hc_ecal1_pr1'],
        datails: [{ name: 'г/кг', color }],
        label: 'Влагосодержание воздуха смешения Приток1, г/кг',
      },
      {
        name: 'chart7',
        parameters: ['SCo_t_vokal_pr1', 'Set_SCo_t_vokal_pr1'],
        datails: [{ name: '°С:', color }, { name: 'Уставка,°С', color: 'white' }],
        label: 'Температура воздуха после водяного калорифера Приток1, °С',
      },
      {
        name: 'chart8',
        parameters: ['SCo_t_ekal1_pr1', 'Set_SCo_t_ekal1_pr1'],
        datails: [{ name: '°С', color }, { name: 'Уставка,°С', color: 'white' }],
        label: 'Температура воздуха после электрического калорифера перед увлажнителем Приток1, °С',
      },
      {
        name: 'chart9',
        parameters: ['Hc_21_Pr', 'Set_Hc_21_Pr'],
        datails: [{ name: 'г/кг', color }, { name: 'Уставка,г/кг', color: 'white' }],
        label: 'Влагосодержание воздуха после увлажнителя Приток1, г/кг',
      },
      {
        name: 'chart10',
        parameters: ['SCo_m3h_pr1', 'Set_SCo_m3h_pr1'],
        datails: [{ name: 'м³/ч', color }, { name: 'Уставка,м³/ч', color: 'white' }],
        label: 'Расход воздуха вентилятора Приток1, м³/ч',
      },
      {
        name: 'chart11',
        parameters: ['SCo_reg_smesh_pr1'],
        datails: [{ name: '%', color }],
        label: 'Процент открытия клапана смешения Приток1, %',
      },
      {
        name: 'chart12',
        parameters: ['SCo_reg_vokal_pr1'],
        datails: [{ name: '%', color }],
        label: 'Управление водяным калорифером Приток1, %',
      },
      {
        name: 'chart13',
        parameters: ['SCo_reg_ekal1_pr1'],
        datails: [{ name: '%', color }],
        label: 'Управление калорифером перед увлажнителем Приток1, %',
      },
      {
        name: 'chart14',
        parameters: ['SCo_reg_ekal2_pr1'],
        datails: [{ name: '%', color }],
        label: 'Управление калорифером после вентилятора Приток1, %',
      },
      {
        name: 'chart15',
        parameters: ['SCo_reg_m3h_pr1'],
        datails: [{ name: '%', color }],
        label: 'Управление вентилятором Приток1, %',
      },
      {
        name: 'chart16',
        parameters: ['SCo_t_smesh_pr2', 'Set_SCo_t_smesh_pr2'],
        datails: [{ name: '°С', color }, { name: 'Уставка:', color: 'white' }],
        label: 'Температура смешения Приток2, °С',
      },
      {
        name: 'chart17',
        parameters: ['T_21_Pr', 'Set_T_21_Pr'],
        datails: [{ name: '°С:', color }, { name: 'Уставка:', color: 'white' }],
        label: 'Температура воздуха в канале 11 перед рекуператором, °С',
      },
      {
        name: 'chart18',
        parameters: ['SCo_m3h_pr2', 'Set_SCo_m3h_pr2'],
        datails: [{ name: 'м³/ч', color }, { name: 'Уставка:', color: 'white' }],
        label: 'Расход воздуха вентилятора Приток2, м³/ч',
      },
      {
        name: 'chart19',
        parameters: ['SCo_reg_smesh_pr2'],
        datails: [{ name: '%', color }],
        label: 'Процент открытия клапана смешения Приток2, %',
      },
      {
        name: 'chart20',
        parameters: ['SCo_reg_ekal_pr2'],
        datails: [{ name: '%', color }],
        label: 'Управление электрическим калорифером перед вентилятором Приток2, %',
      },
      {
        name: 'chart21',
        parameters: ['SCo_t_pr1'],
        datails: [{ name: '°С', color }],
        label: 'Температура на выходе Приток1, °С',
      },
      {
        name: 'chart22',
        parameters: ['SCo_Rh_pr1'],
        datails: [{ name: '%', color }],
        label: 'Относительная влажность на выходе Приток1, %',
      },
      {
        name: 'chart23',
        parameters: ['SCo_Hc_pr1'],
        datails: [{ name: 'г/кг', color }],
        label: 'Влагосодержание воздуха на выходе Приток1, г/кг',
      },
      {
        name: 'chart24',
        parameters: ['SCo_t_pr2'],
        datails: [{ name: '°С', color }],
        label: 'Температура на выходе Приток2, °С',
      },
      {
        name: 'chart25',
        parameters: ['SCo_Rh_pr2'],
        datails: [{ name: '%', color }],
        label: 'Относительная влажность на выходе Приток2, %',
      },
      {
        name: 'chart26',
        parameters: ['SCo_Hc_pr2'],
        datails: [{ name: 'г/кг', color }],
        label: 'Влагосодержание воздуха на выходе Приток2, г/кг',
      },
      {
        name: 'chart27',
        parameters: ['T_21_Pr', 'Set_T_21_Pr'],
        datails: [{ name: '°С:', color }, { name: 'Уставка:', color: 'white' }],
        label: 'Выход Притока (Температура), °С',
      },
      {
        name: 'chart28',
        parameters: ['Rh_21_Pr', 'Set_Rh_21_Pr'],
        datails: [{ name: '%', color }, { name: 'Уставка:', color: 'white' }],
        label: 'Выход Притока (Отн.Вл), %',
      },
      {
        name: 'chart29',
        parameters: ['Hc_21_Pr', 'Set_Hc_21_Pr'],
        datails: [{ name: 'г/кг', color }, { name: 'Уставка:', color: 'white' }],
        label: 'Выход Притока (влагосодержание), г/кг',
      },
      {
        name: 'chart30',
        parameters: ['TwT_21', 'Set_TwT_21', 'setMax', 'setMin'],
        datails: [{ name: '°С:', color }, { name: 'Уставка:', color: 'white' }, { name: 'Уставка + 0.3', color: 'green' }, { name: 'Уставка - 0.3', color: 'green' }],
        label: 'Температура влажного термометра Приток, °С',
      },
      {
        name: 'chart31',
        parameters: ['SCo_reg_m3h_pr2'],
        datails: [{ name: '%', color }],
        label: 'Управление вентилятора Приток2, %',
      },
    ]);
    // функция упрощённого обновления графиков
    function updChart(index, par, mes) {
      const values = [mes[par].value];
      if (mes[par].setpoint) {
        values.push(mes[par].setpoint);
      }
      updateChart_v4(charts[index], values, mes[par].value, mes[par].setpoint, mes.createdAt.value);
    }
    // function updChart(index, par, mes) {
    //   updateChart_v4(charts[index], [mes[par]], mes[par].value, (mes[par].setpoint || null), mes.createdAt.value);
    // }
    let workPr = false;
    let smeshWorkPr = false;
    function listen(json) {
      const mes = json.message;
      if (json.id === 2) {
        if (json.type === 'sendAirDevices') {
          console.log(mes);
          updChart(0, 'SCo_t_nar', mes);
          updChart(1, 'T_Lab', mes);
          updChart(2, 'SCo_t_tset', mes);
          updChart(3, 'SCo_Abs_nar', mes);
          updChart(4, 'Hc_Lab', mes);
          updChart(5, 'SCo_t_smesh_pr1', mes);
          updChart(6, 'SCo_Hc_ecal1_pr1', mes);
          updChart(7, 'SCo_t_vokal_pr1', mes);
          updChart(8, 'SCo_t_ekal1_pr1', mes);
          updChart(9, 'Hc_21_Pr', mes);
          updChart(10, 'SCo_m3h_pr1', mes);
          updChart(11, 'SCo_reg_smesh_pr1', mes);
          updChart(12, 'SCo_reg_vokal_pr1', mes);
          updChart(13, 'SCo_reg_ekal1_pr1', mes);
          updChart(14, 'SCo_reg_ekal2_pr1', mes);
          updChart(15, 'SCo_reg_m3h_pr1', mes);
          updChart(16, 'SCo_t_smesh_pr2', mes);
          updChart(17, 'T_21_Pr', mes);
          updChart(18, 'SCo_m3h_pr2', mes);
          updChart(19, 'SCo_reg_smesh_pr2', mes);
          updChart(20, 'SCo_reg_ekal_pr2', mes);
          updChart(21, 'SCo_t_pr1', mes);
          updChart(22, 'SCo_Rh_pr1', mes);
          updChart(23, 'SCo_Hc_pr1', mes);
          updChart(24, 'SCo_t_pr2', mes);
          updChart(25, 'SCo_Rh_pr2', mes);
          updChart(26, 'SCo_Hc_pr2', mes);
          updChart(27, 'T_21_Pr', mes);
          updChart(28, 'Rh_21_Pr', mes);
          updChart(29, 'Hc_21_Pr', mes);
          updChart(31, 'SCo_reg_m3h_pr2', mes);
          const setMax = Number(mes.TwT_21.setpoint) + 0.3;
          const setMin = Number(mes.TwT_21.setpoint) - 0.3;
          updateChart_v4(charts[30], [mes.TwT_21.value, mes.TwT_21.setpoint, setMax, setMin], mes.TwT_21.value, mes.TwT_21.setpoint, mes.createdAt.value);
          tObr.value = mes.SCo_t_obr_vokal_pr1.value;
          workPr = Number(mes.CodeSets.value[0]) === 1;
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
      loadChartsFromData(charts, 'AirDevice', parameters.value, 720, () => {
        if (charts[30].value) {
        // дозагрузка графика №19 (добавление значений мин макс к уставке)
          const arrayMax = [];
          const arrayMin = [];
          for (let index = 0; index < charts[30].value.myChart.data.datasets[1].data.length; index += 1) {
            arrayMax.push(Number(charts[30].value.myChart.data.datasets[1].data[index]) + 0.3);
            arrayMin.push(Number(charts[30].value.myChart.data.datasets[1].data[index]) - 0.3);
          }
          charts[30].value.myChart.data.datasets[2].data = arrayMax;
          charts[30].value.myChart.data.datasets[3].data = arrayMin;
          charts[30].value.update();
        }
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
      tObr,
      stat,
      parameters,
      updChart,
    };
  },
};
</script>
<style scoped>

</style>
