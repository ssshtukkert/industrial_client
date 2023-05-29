<template >
  <q-page class="justify-center full-width" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Подготовка воздуха (Вытяжка)</div>
    </q-card-section>
    <div class="row justify-center">
      <div class="col-6 ">
        <Chart :ref="charts[2]" :parameters="parameters[2].datails" :chartId="parameters[2].name" colorDefault="black"
          :legend="false" classTitle="text-h6" :height="70" classValue="text-h6" valueMeasure="°С" />
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <Chart :ref="charts[0]" :parameters="parameters[0].datails" :chartId="parameters[0].name" colorDefault="black"
          :legend="false" classTitle="text-h6" :height="50" classValue="text-h6" valueMeasure="°С" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[3]" :parameters="parameters[3].datails" :chartId="parameters[3].name" colorDefault="black"
          :legend="false" classTitle="text-h6" :height="50" classValue="text-h6" valueMeasure="г/кг" />
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <Chart :ref="charts[1]" :parameters="parameters[1].datails" :chartId="parameters[1].name" colorDefault="black"
          :legend="false" classTitle="text-h6" :height="50" classValue="text-h6" valueMeasure="°С" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[4]" :parameters="parameters[4].datails" :chartId="parameters[4].name" colorDefault="black"
          :legend="false" classTitle="text-h6" :height="50" classValue="text-h6" valueMeasure="г/кг" />
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
        <Chart :ref="charts[7]" :parameters="parameters[7].datails" :chartId="parameters[7].name" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="°С">
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
        <Chart :ref="charts[12]" name='' :parameters="parameters[12].datails" :chartId="parameters[12].name"
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
        <Chart :ref="charts[14]" :parameters="parameters[14].datails" :chartId="parameters[14].name"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[15]" :parameters="parameters[15].datails" :chartId="parameters[15].name"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[13]" :parameters="parameters[13].datails" :chartId="parameters[13].name"
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
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[18]" :parameters="parameters[18].datails" :chartId="parameters[18].name"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[19]" :parameters="parameters[19].datails" :chartId="parameters[19].name"
          colorDefault="black" :legend="true" classSetpoint="text-h6" classValue="text-h6" classTitle="text-h8"
          valueMeasure="°С" :height="60" />
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
  name: 'Outflow',
  components: {
    Chart,
  },
  setup() {
    document.title = 'Подготовка воздуха (Вытяжка)';
    const charts = [];
    const tObr = ref(0);
    const stat = ref('');
    let CodeStatus1 = [];
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
        parameters: ['SCo_t_smesh_vyt', 'Set_SCo_t_smesh_vyt'],
        datails: [{ name: '°С', color }, { name: 'Уставка,°С', color: 'white' }],
        label: 'Температура смешения Вытяжка, °С',
      },
      {
        name: 'chart6',
        parameters: ['SCo_Hc_ecal1_vyt'],
        datails: [{ name: 'г/кг', color }],
        label: 'Влагосодержание воздуха смешения Вытяжки, г/кг',
      },
      {
        name: 'chart7',
        parameters: ['SCo_t_vokal_vyt', 'Set_SCo_t_vokal_vyt'],
        datails: [{ name: '°С:', color }, { name: 'Уставка,°С', color: 'white' }],
        label: 'Температура воздуха после водяного калорифера Вытяжка, °С',
      },
      {
        name: 'chart8',
        parameters: ['SCo_t_ekal1_vyt', 'Set_SCo_t_ekal1_vyt'],
        datails: [{ name: '°С', color }, { name: 'Уставка,°С', color: 'white' }],
        label: 'Температура воздуха после электрического калорифера перед увлажнителем Вытяжка, °С',
      },
      {
        name: 'chart9',
        parameters: ['Hc_11_Vyt', 'Set_Hc_11_Vyt'],
        datails: [{ name: 'г/кг', color }, { name: 'Уставка,г/кг', color: 'white' }],
        label: 'Влагосодержание воздуха после увлажнителя Вытяжка, г/кг',
      },
      {
        name: 'chart10',
        parameters: ['SCo_m3h_vyt', 'Set_SCo_m3h_vyt'],
        datails: [{ name: 'м³/ч', color }, { name: 'Уставка,м³/ч', color: 'white' }],
        label: 'Расход воздуха вентилятора Вытяжки, м³/ч',
      },
      {
        name: 'chart11',
        parameters: ['SCo_reg_t_smesh_vyt'],
        datails: [{ name: '%', color }],
        label: 'Процент открытия клапана смешения Вытяжки, %',
      },
      {
        name: 'chart12',
        parameters: ['SCo_reg_vokal_vyt'],
        datails: [{ name: '%', color }],
        label: 'Управление водяным калорифером Вытяжки, %',
      },
      {
        name: 'chart13',
        parameters: ['SCo_reg_m3h_vyt'],
        datails: [{ name: '%', color }],
        label: 'Управление вентилятором Вытяжки, %',
      },
      {
        name: 'chart14',
        parameters: ['SCo_reg_ekal1_vyt'],
        datails: [{ name: '%', color }],
        label: 'Управление электрическим калорифером перед увлажнителем Вытяжки, %',
      },
      {
        name: 'chart15',
        parameters: ['SCo_reg_ekal2_vyt'],
        datails: [{ name: '%', color }],
        label: 'Управление электрическим калорифером после вентилятора Вытяжки, %',
      },
      {
        name: 'chart16',
        parameters: ['T_11_Vyt', 'Set_T_11_Vyt'],
        datails: [{ name: '°С', color }, { name: 'Уставка,°С', color: 'white' }],
        label: 'Температура на выходе Вытяжка, °С',
      },
      {
        name: 'chart17',
        parameters: ['Rh_11_Vyt', 'Set_Rh_11_Vyt'],
        datails: [{ name: '%', color }, { name: 'Уставка,%', color: 'white' }],
        label: 'Относительная влажность на выходе Вытяжка, %',
      },
      {
        name: 'chart18',
        datails: [{ name: 'г/кг', color }, { name: 'Уставка,г/кг', color: 'white' }],
        parameters: ['Hc_11_Vyt', 'Set_Hc_11_Vyt'],
        label: 'Влагосодержание воздуха на выходе Вытяжка, г/кг',
      },
      {
        name: 'chart19',
        parameters: ['TwT_11', 'Set_TwT_11', 'setMax', 'setMin'],
        datails: [{ name: '°С', color }, { name: 'Уставка', color: 'white' }, { name: 'Уставка + 0.3', color: 'green' }, { name: 'Уставка - 0.3', color: 'green' }],
        label: 'Температура влажного термометра Вытяжки, °С',
      },
    ]);
    for (let index = 0; index < 20; index += 1) {
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
    // function updChart(index, par, mes) {
    //   updateChart_v4(charts[index], [mes[par]], mes[par].value, (mes[par].setpoint || null), mes.createdAt.value);
    // }
    let workVyt = false;
    let smeshWorkVyt = false;
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
          updChart(5, 'SCo_t_smesh_vyt', mes);
          updChart(6, 'SCo_Hc_ecal1_vyt', mes);
          updChart(7, 'SCo_t_vokal_vyt', mes);
          updChart(8, 'SCo_t_ekal1_vyt', mes);
          updChart(9, 'Hc_11_Vyt', mes);
          updChart(10, 'SCo_m3h_vyt', mes);
          updChart(11, 'SCo_reg_t_smesh_vyt', mes);
          updChart(12, 'SCo_reg_vokal_vyt', mes);
          updChart(13, 'SCo_reg_m3h_vyt', mes);
          updChart(14, 'SCo_reg_ekal1_vyt', mes);
          updChart(15, 'SCo_reg_ekal2_vyt', mes);
          updChart(16, 'T_11_Vyt', mes);
          updChart(17, 'Rh_11_Vyt', mes);
          updChart(18, 'Hc_11_Vyt', mes);
          const setMax = Number(mes.TwT_11.setpoint) + 0.3;
          const setMin = Number(mes.TwT_11.setpoint) - 0.3;
          updateChart_v4(charts[19], [mes.TwT_11.value, mes.TwT_11.setpoint, setMax, setMin], mes.TwT_11.value, mes.TwT_11.setpoint, mes.createdAt.value);
          tObr.value = mes.SCo_t_obr_vokal_vyt.value;
          workVyt = Number(mes.CodeSets.value[3]) === 1;
        } else if (json.type === 'sendDataRecup') {
          CodeStatus1 = convertToBinary(mes.CodeStatus1.value).split('');
          while (CodeStatus1.length < 10) {
            CodeStatus1.unshift(Number(0));
          }
          CodeStatus1.reverse();
          smeshWorkVyt = Number(CodeStatus1[5]) === 1;
        }
        if (workVyt && smeshWorkVyt) {
          stat.value = 'воздух';
        } else {
          stat.value = 'вода';
        }
      }
    }
    onMounted(() => {
      loadChartsFromData(charts, 'AirDevice', parameters.value, 720, () => {
        if (charts[19].value) {
        // дозагрузка графика №19 (добавление значений мин макс к уставке)
          const arrayMax = [];
          const arrayMin = [];
          for (let index = 0; index < charts[19].value.myChart.data.datasets[1].data.length; index += 1) {
            arrayMax.push(Number(charts[19].value.myChart.data.datasets[1].data[index]) + 0.3);
            arrayMin.push(Number(charts[19].value.myChart.data.datasets[1].data[index]) - 0.3);
          }
          charts[19].value.myChart.data.datasets[2].data = arrayMax;
          charts[19].value.myChart.data.datasets[3].data = arrayMin;
          charts[19].value.update();
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
      parameters,
      Chart,
      charts,
      tObr,
      stat,
    };
  },
};
</script>
<style scoped>

</style>
