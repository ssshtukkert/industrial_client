<template >
  <q-page class="justify-center full-width" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Подготовка воздуха (Вытяжка)</div>
    </q-card-section>
    <div class="row justify-center">
      <div class="col-4 ">
        <Chart :ref="charts[2]" name='Теплоцентраль, °С'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }]" chartId="chart2" colorDefault="black"
          :legend="false" classTitle="text-h8" :height="70" classValue="text-h6" valueMeasure="°С" />
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <Chart :ref="charts[0]" name='Температура наружняя, °С'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }]" chartId="chart0" colorDefault="black"
          :legend="false" classTitle="text-h8" :height="50" classValue="text-h6" valueMeasure="°С" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[3]" name='Влажность наружная, г/кг'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }]" chartId="chart3" colorDefault="black"
          :legend="false" classTitle="text-h8" :height="50" classValue="text-h6" valueMeasure="г/кг" />
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <Chart :ref="charts[1]" name='Температура помещение, °С'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }]" chartId="chart1" colorDefault="black"
          :legend="false" classTitle="text-h8" :height="50" classValue="text-h6" valueMeasure="°С" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[4]" name='Влажность помещение, г/кг'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }]" chartId="chart4" colorDefault="black"
          :legend="false" classTitle="text-h8" :height="50" classValue="text-h6" valueMeasure="г/кг" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart_v3 :ref="charts[5]" name='Температура смешения Вытяжка, °С'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }, { name: 'Уставка:', color: 'white' }]"
          chartId="chart5" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[6]" name='Абсолютная влажность воздуха смешения Вытяжки, г/кг'
          :parameters="[{ name: 'Влагосодержание', color: 'rgb(97, 138, 199)' }]" chartId="chart6" colorDefault="black"
          :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-2">
        <Chart_v3 :ref="charts[7]" name='Температура воздуха после водяного калорифера Вытяжка, °С'
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
          name='Температура воздуха после электрического калорифера перед увлажнителем Вытяжка, °С'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }, { name: 'Уставка', color: 'white' }]"
          chartId="chart8" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart_v3 :ref="charts[9]" name='Абсолютная влажность воздуха после увлажнителя Вытяжка, г/кг'
          :parameters="[{ name: 'Влагосодержание', color: 'rgb(97, 138, 199)' }, { name: 'Уставка', color: 'white' }]"
          chartId="chart9" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-2">
        <Chart_v3 :ref="charts[10]" name='Расход воздуха вентилятора Вытяжки, м3/ч'
          :parameters="[{ name: 'Расход', color: 'rgb(97, 138, 199)' }, { name: 'Уставка', color: 'white' }]"
          chartId="chart10" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="м3/ч" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[11]" name='Процент открытия клапана смешения Вытяжки, %'
          :parameters="[{ name: 'Производительность', color: 'rgb(97, 138, 199)' }]" chartId="chart11"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">

      </div>
      <div class="col-2">
        <Chart :ref="charts[12]" name='Управление водяным калорифером Вытяжки, %'
          :parameters="[{ name: 'Производительность', color: 'rgb(97, 138, 199)' }]" chartId="chart12"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%">
          <template v-slot:topLabel>
            <div align="center">
              <q-badge style="background-color: rgb(60, 60, 60);">
                <div class="text-white text-h8">
                  Режим: {{stat}}
                </div>
              </q-badge>
            </div>
          </template>
        </Chart>
      </div>
      <div class="col-2">
        <Chart :ref="charts[14]" name='Управление электрическим калорифером перед увлажнителем Вытяжки, %'
          :parameters="[{ name: 'Производительность', color: 'rgb(97, 138, 199)' }]" chartId="chart14"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[15]" name='Управление электрическим калорифером после вентилятора Вытяжки, %'
          :parameters="[{ name: 'Производительность', color: 'rgb(97, 138, 199)' }]" chartId="chart15"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[13]" name='Управление вентилятором Вытяжки, %'
          :parameters="[{ name: 'Производительность', color: 'rgb(97, 138, 199)' }]" chartId="chart13"
          colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
    </div>
    <div class="row">

      <div class="col-2">
        <Chart_v3 :ref="charts[16]" name='Температура на выходе Вытяжка, °С' :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' },
        { name: 'Уставка:', color: 'white' }]" chartId="chart16" colorDefault="black" :legend="false"
          classTitle="text-h8" valueMeasure="°С" />
      </div>
      <div class="col-2">
        <Chart_v3 :ref="charts[17]" name='Относительная влажность на выходе Вытяжка %'
          :parameters="[{ name: 'Влажность', color: 'rgb(97, 138, 199)' }, { name: 'Уставка', color: 'white' }]"
          chartId="chart17" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="%" />
      </div>
      <div class="col-2">
        <Chart_v3 :ref="charts[18]" name='Абсолютная влажность на выходе Вытяжка, г/кг'
          :parameters="[{ name: 'Влажность', color: 'rgb(97, 138, 199)' }, { name: 'Уставка', color: 'white' }]"
          chartId="chart18" colorDefault="black" :legend="false" classTitle="text-h8" valueMeasure="г/кг" />
      </div>
      <div class="col-6">
        <Chart_v3 :ref="charts[19]" name='Температура влажного термометра Вытяжки, °С'
          :parameters="[{ name: 'Температура', color: 'rgb(97, 138, 199)' }, { name: 'Уставка', color: 'white' }, { name: 'Уставка + 0.3', color: 'green' }, { name: 'Уставка - 0.3', color: 'green' }]"
          chartId="chart19" colorDefault="black" :legend="true" classSetpoint="text-h6" classValue="text-h6"
          classTitle="text-h8" valueMeasure="°С" :height="60" />
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
    document.title = 'Подготовка воздуха (Вытяжка)';
    const { host } = inject('store');
    const charts = [];
    const dataValues = [];
    const load = ref(0);
    const tObr = ref(0);
    const stat = ref('');
    let CodeStatus1 = [];
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
        // updateChart(5, mes.SCo_t_smesh_vyt, null, mes.time, false, false);
        updateChartv3(5, [{ value: mes.SCo_t_smesh_vyt },
          { value: mes.Set_SCo_t_smesh_vyt }], mes.time, false, false);
        updateChart(6, mes.SCo_Hc_ecal1_vyt, null, mes.time, false, false);
        // updateChart(7, mes.SCo_t_vokal_vyt, null, mes.time, false, false);

        updateChartv3(7, [{ value: mes.SCo_t_vokal_vyt },
          { value: mes.Set_SCo_t_vokal_vyt }], mes.time, false, false);
        // updateChart(8, mes.SCo_t_ekal1_vyt, null, mes.time, false, false);
        updateChartv3(8, [{ value: mes.SCo_t_ekal1_vyt },
          { value: mes.Set_SCo_t_ekal1_vyt }], mes.time, false, false);
        // updateChart(9, mes.Hc_11_Vyt, null, mes.time, false, false);
        updateChartv3(9, [{ value: mes.Hc_11_Vyt },
          { value: mes.Set_Hc_11_Vyt }], mes.time, false, false);
        // updateChart(10, mes.SCo_m3h_vyt, null, mes.time, false, false);
        updateChartv3(10, [{ value: mes.SCo_m3h_vyt },
          { value: mes.Set_SCo_m3h_vyt }], mes.time, false, false);
        updateChart(11, mes.SCo_reg_t_smesh_vyt, null, mes.time, false, false);
        updateChart(12, mes.SCo_reg_vokal_vyt, null, mes.time, false, false);
        updateChart(13, mes.SCo_reg_m3h_vyt, null, mes.time, false, false);
        updateChart(14, mes.SCo_reg_ekal1_vyt, null, mes.time, false, false);
        updateChart(15, mes.SCo_reg_ekal2_vyt, null, mes.time, false, false);
        // updateChart(16, mes.T_11_Vyt, null, mes.time, false, false);
        updateChartv3(16, [{ value: mes.T_11_Vyt },
          { value: mes.Set_T_11_Vyt }], mes.time, false, false);
        // updateChart(17, mes.Rh_11_Vyt, null, mes.time, false, false);
        updateChartv3(17, [{ value: mes.Rh_11_Vyt },
          { value: mes.Set_Rh_11_Vyt }], mes.time, false, false);
        // updateChart(18, mes.Hc_11_Vyt, null, mes.time, false, false);
        updateChartv3(18, [{ value: mes.Hc_11_Vyt },
          { value: mes.Set_Hc_11_Vyt }], mes.time, false, false);
        // updateChart(19, mes.TwT_11, null, mes.time, false, false);
        const setMax = Number(mes.Set_TwT_11 + 0.3).toFixed(2);
        const setMin = Number(mes.Set_TwT_11 - 0.3).toFixed(2);
        updateChartv3(19, [{ value: mes.TwT_11 },
          { value: mes.Set_TwT_11 }, { value: setMax }, { value: setMin }], mes.time, false, false);
        dataValues.pop();
        load.value = dataValues.length;
        setImmediate(shift);
      } else {
        for (let index = 0; index < 20; index += 1) {
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
            // updateChart(5, mes.SCo_t_smesh_vyt.value, mes.SCo_t_smesh_vyt.setpoint, mes.time, true, true);
            updateChartv3Set(5, [{ value: mes.SCo_t_smesh_vyt.value },
              { value: mes.SCo_t_smesh_vyt.setpoint }], mes.SCo_t_smesh_vyt.value, mes.SCo_t_smesh_vyt.setpoint, mes.time, true, true);
            updateChart(6, mes.SCo_Hc_ecal1_vyt.value, null, mes.time, true, true);
            // updateChart(7, mes.SCo_t_vokal_vyt.value, mes.SCo_t_vokal_vyt.setpoint, mes.time, true, true);
            updateChartv3Set(7, [{ value: mes.SCo_t_vokal_vyt.value },
              { value: mes.SCo_t_vokal_vyt.setpoint }], mes.SCo_t_vokal_vyt.value, mes.SCo_t_vokal_vyt.setpoint, mes.time, true, true);
            // updateChart(8, mes.SCo_t_ekal1_vyt.value, mes.SCo_t_ekal1_vyt.setpoint, mes.time, true, true);
            updateChartv3Set(8, [{ value: mes.SCo_t_ekal1_vyt.value },
              { value: mes.SCo_t_ekal1_vyt.setpoint }], mes.SCo_t_ekal1_vyt.value, mes.SCo_t_ekal1_vyt.setpoint, mes.time, true, true);
            // updateChart(9, mes.Hc_11_Vyt.value, mes.Hc_11_Vyt.setpoint, mes.time, true, true);
            updateChartv3Set(9, [{ value: mes.Hc_11_Vyt.value },
              { value: mes.Hc_11_Vyt.setpoint }], mes.Hc_11_Vyt.value, mes.Hc_11_Vyt.setpoint, mes.time, true, true);
            // updateChart(10, mes.SCo_m3h_vyt.value, mes.SCo_m3h_vyt.setpoint, mes.time, true, true);
            updateChartv3Set(10, [{ value: mes.SCo_m3h_vyt.value },
              { value: mes.SCo_m3h_vyt.setpoint }], mes.SCo_m3h_vyt.value, mes.SCo_m3h_vyt.setpoint, mes.time, true, true);
            updateChart(11, mes.SCo_reg_t_smesh_vyt.value, null, mes.time, true, true);
            updateChart(12, mes.SCo_reg_vokal_vyt.value, null, mes.time, true, true);
            updateChart(13, mes.SCo_reg_m3h_vyt.value, null, mes.time, true, true);
            updateChart(14, mes.SCo_reg_ekal1_vyt.value, null, mes.time, true, true);
            updateChart(15, mes.SCo_reg_ekal2_vyt.value, null, mes.time, true, true);
            // updateChart(16, mes.T_11_Vyt.value, mes.T_11_Vyt.setpoint, mes.time, true, true);
            updateChartv3Set(16, [{ value: mes.T_11_Vyt.value },
              { value: mes.T_11_Vyt.setpoint }], mes.T_11_Vyt.value, mes.T_11_Vyt.setpoint, mes.time, true, true);
            // updateChart(17, mes.Rh_11_Vyt.value, mes.Rh_11_Vyt.setpoint, mes.time, true, true);
            updateChartv3Set(17, [{ value: mes.Rh_11_Vyt.value },
              { value: mes.Rh_11_Vyt.setpoint }], mes.Rh_11_Vyt.value, mes.Rh_11_Vyt.setpoint, mes.time, true, true);
            // updateChart(18, mes.Hc_11_Vyt.value, mes.Hc_11_Vyt.setpoint, mes.time, true, true);
            updateChartv3Set(18, [{ value: mes.Hc_11_Vyt.value },
              { value: mes.Hc_11_Vyt.setpoint }], mes.Hc_11_Vyt.value, mes.Hc_11_Vyt.setpoint, mes.time, true, true);
            // updateChart(19, mes.TwT_11.value, mes.TwT_11.setpoint, mes.time, true, true);
            const setMax = Number(mes.TwT_11.setpoint) + 0.3;
            const setMin = Number(mes.TwT_11.setpoint) - 0.3;
            updateChartv3Set(19, [{ value: mes.TwT_11.value },
              { value: mes.TwT_11.setpoint }, { value: setMax }, { value: setMin }], mes.TwT_11.value, mes.TwT_11.setpoint, mes.time, true, true);
            tObr.value = mes.SCo_t_obr_vokal_vyt.value;
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
        } else if (json.type === 'sendDataRecup') {
          CodeStatus1 = convertToBinary(mes.CodeStatus1.value).split('');
          while (CodeStatus1.length < 10) {
            CodeStatus1.unshift(Number(0));
          }
          CodeStatus1.reverse();
          if (CodeStatus1[5] === '1') {
            stat.value = 'воздух';
          } else {
            stat.value = 'вода';
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
