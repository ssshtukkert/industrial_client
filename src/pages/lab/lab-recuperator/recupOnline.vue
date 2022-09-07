<template>
  <q-page class="full-width row wrap justify-start items-start content-start">
    <q-card class="col-6 bg-primary">
      <div class="text-h6 text-white text-center">Температура</div>
      <q-item>
        <Chart ref="bar1" name='Температура наружняя, С' typeChart="bar" barChartId="chart-bar1" colorDefault="yellow">
        </Chart>
      </q-item>
      <q-item>
        <Chart ref="bar2" name='Температура помещения, С' typeChart="line" barChartId="chart-bar2" label="цвыв"
          colorDefault="black"></Chart>
      </q-item>
      <q-item>
        <Chart ref="bar5" name='Теплоцентраль' typeChart="line" barChartId="chart-bar5" label="цвыв"
          colorDefault="blue"></Chart>
      </q-item>
      <q-item class="col-6">
        <q-btn color="teal" @click="addData">Добавить</q-btn>
      </q-item>
    </q-card>
    <q-card class="col-6 bg-primary">
      <div class="text-h6 text-white text-center">Влажность</div>
      <q-item>
        <Chart ref="bar3" name='Влажность наружная' typeChart="line" barChartId="chart-bar3" label="цвыв"
          colorDefault="gray"></Chart>
      </q-item>
      <q-item>
        <Chart ref="bar4" name='Влажность помещение' typeChart="line" barChartId="chart-bar4" label="цвыв"
          colorDefault="gray"></Chart>
      </q-item>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
import Chart from 'src/components/charts/chart.vue';
// import { Websocket } from 'src/store/fun/Websocket/Websocket.js';
import {
  ref, inject, onMounted, onBeforeUnmount,
} from 'vue';

export default {
  name: 'PageIndex',
  components: {
    Chart,
  },

  setup() {
    const bar1 = ref(null);
    const bar2 = ref(null);
    const {
      state, WebSocket_Init, WebSocket_Listen, WebSocket_Close, isOpen, getData, getLabels, addValueData, getLength, getCurrentDate,
    } = inject('store');

    // временная функция
    function addData() {
      bar1.value.pushArray(addValueData(getCurrentDate()));
      bar1.value.deleteFirst();

      bar2.value.pushArray(addValueData(getCurrentDate()));
      bar2.value.deleteFirst();
    }
    function sendWebsocket() {
      console.log(isOpen(state.socket));
      state.socket.send(JSON.stringify({
        name: 1,
        array: [
          { id: 1, text: 'sd' },
        ],

      }));
    }

    function parse(json) {
      // потом сделать проверку try catch
      // eslint-disable-next-line no-console
      console.log(json);
      bar2.value.pushArray(addValueData(getCurrentDate(), json[0]));
      bar2.value.deleteFirst();
    }
    onMounted(() => {
      WebSocket_Init('', { getMain: 1 });
      WebSocket_Listen(parse);

      bar1.value.setData(getLabels(), getData(), getLength());
      bar2.value.setData(getLabels(), getData(), getLength());
    });
    onBeforeUnmount(() => {
      WebSocket_Close();
    });
    return {
      Chart,
      addData,
      bar1,
      bar2,
      sendWebsocket,
    };
  },
};
</script>
