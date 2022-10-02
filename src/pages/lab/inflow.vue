<template >
  <q-page class="justify-center full-width">
    <div class="row">
      <div class="col-4">
        <Chart :ref="charts[0]" name='Температура наружняя, °С' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart0" colorDefault="black" :legend="false" classTitle="text-h8" :min="-20" :max="32"
          :step="15" />
      </div>
      <div class="col-4">
        <Chart :ref="charts[1]" name='Температура помещение, °С' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart1" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-4">
        <Chart :ref="charts[2]" name='Теплоцентраль, °С' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart2" colorDefault="black" :legend="false" classTitle="text-h8"  :min="20" :max="50" />
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <Chart :ref="charts[3]" name='Влажность наружная, г/кг' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart3" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-6">
        <Chart :ref="charts[4]" name='Влажность помещение, г/кг' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart4" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[5]" name='Смешение Приток1, °С' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart5" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[6]" name='АбсВлСмешПриток1' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart6" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[7]" name='Вокал Приток1, °С' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart7" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[8]" name='ЭКал1 Приток1, °С' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart8" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[9]" name='Влажность Приток1' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart9" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[10]" name='Вент Приток1' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart10" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
    </div>
    <div class="row">
      <div class="col-3">
        <Chart :ref="charts[11]" name='УпрСмешПриток1' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart11" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-3">
        <Chart :ref="charts[12]" name='УпрВокалПриток1' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart12" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-3">
        <Chart :ref="charts[13]" name='УпрЭКал1 Приток1' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart13" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-3">
        <Chart :ref="charts[14]" name='УпрЭКал2 Приток1' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart14" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>

    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[15]" name='УпрВент Приток1' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart15" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[16]" name='Смешение Приток2, °С' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart16" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[17]" name='ЭКал1 Приток2, °С' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart17" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[18]" name='Вент Приток2' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart18" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[19]" name='УпрСмеш Приток2' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart19" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[20]" name='УпрЭкал1 Приток2' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart20" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <Chart :ref="charts[21]" name='ВыходТиВПриток1 (Выход), °С'
          :parameters="[{ name: 'Температура', color: 'teal' }]" typeChart="line" chartId="chart21" colorDefault="black"
          :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[22]" name='ВыходТиВПриток1 (Отн.Вл)' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart22" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[23]" name='ВыходТиВПриток1 (Абс.Вл)' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart23" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[24]" name='ВыходТиВПриток2 (Выход), °С'
          :parameters="[{ name: 'Температура', color: 'teal' }]" typeChart="line" chartId="chart24" colorDefault="teal"
          :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[25]" name='ВыходТиВПриток1 (Отн.Вл)' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart25" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-2">
        <Chart :ref="charts[26]" name='ВыходТиВПриток1 (Абс.Вл)' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart26" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
    </div>
    <div class="row">
      <div class="col-3">
        <Chart :ref="charts[27]" name='ВыходПриток (Температура), °С'
          :parameters="[{ name: 'Температура', color: 'teal' }]" typeChart="line" chartId="chart27" colorDefault="black"
          :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-3">
        <Chart :ref="charts[28]" name='ВыходПриток (Отн.Вл)' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart28" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-3">
        <Chart :ref="charts[29]" name='ВыходПриток (Абс.Вл)' :parameters="[{ name: 'Температура', color: 'teal' }]"
          typeChart="line" chartId="chart29" colorDefault="black" :legend="false" classTitle="text-h8" />
      </div>
      <div class="col-3">
        <Chart :ref="charts[30]" name='Температура влажного термометра, °С'
          :parameters="[{ name: 'Температура', color: 'teal' }]" typeChart="line" chartId="chart30" colorDefault="black"
          :legend="false" classTitle="text-h8" />
      </div>
    </div>
  </q-page>
</template>

<script>
import {
  inject, ref, onMounted, onBeforeUnmount,
} from 'vue';
import Chart from 'src/components/charts/chart_v2.vue';

export default {
  name: 'Inflow',
  components: {
    Chart,
  },
  setup() {
    const charts = [];
    for (let index = 0; index < 31; index += 1) {
      charts.push(ref(null));
    }
    const {
      getCurrentTime, WebSocket_Create, WebSocket_Listen, WebSocket_Close,
    } = inject('store');

    function listen(json) {
      const mes = json.message;
      if (json.id === 2) {
        if (json.type === 'sendDataRecup') {
          charts[0].value.pushValues([{ value: mes.SCo_t_nar.value }], getCurrentTime());
          charts[0].value.setValue(`Темп: ${mes.SCo_t_nar.value}`);

          charts[2].value.pushValues([{ value: mes.SCo_t_tset.value }], getCurrentTime());
          charts[2].value.setValue(`Темп: ${mes.SCo_t_tset.value}`);

          charts[5].value.pushValues([{ value: mes.SCo_t_smesh_pr1.value }], getCurrentTime());
          charts[5].value.setValue(`Темп: ${mes.SCo_t_smesh_pr1.value}`);
        }
      }
    }

    onMounted(() => {
      // написать удаление элементов при размонтировании образа
      WebSocket_Create('recup', { getMain: 1 });
      WebSocket_Listen('recup', listen);
      // setInterval(() => {
      //   for (let index = 0; index < charts.length; index += 1) {
      //     const element = charts[index];
      //     const v = (23 * Math.random()).toFixed(2);
      //     element.value.pushValues([{ value: v }], getCurrentTime());
      //     element.value.setValue(`Темп: ${v}`);
      //     element.value.setSetpoint(`Уст: ${v}`);
      //     if (!element.value.getVisible()) {
      //       element.value.setVisible(true);
      //     }
      //   }
      // }, 2000);
    });
    onBeforeUnmount(() => {
      WebSocket_Close('recup');
    });
    return {
      Chart,
      charts,
    };
  },
};
</script>
<style scoped>

</style>
