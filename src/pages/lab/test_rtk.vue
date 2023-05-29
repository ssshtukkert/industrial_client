<template >
  <q-page class="justify-center full-width text-white" style="background-color: rgb(60, 60, 60);">
    <q-card-section  style="background-color: rgb(80, 80, 80);">
      <div class="row">
        <div class=" col-6 text-h6" style="margin: 10px;">Хост ESP</div>
        <space />
        <q-input class="col-2" v-model="host" @update:model-value="updateHost" dark color="white"
          input-class="text-h6 text-white" outlined label-color="grey" label="Адрес:" style="margin: 10px;"/>
        <q-input class="col-1" v-model="port" @update:model-value="updateHost" dark color="white"
          input-class="text-h6 text-white" outlined label-color="grey" label="Порт:" style="margin: 10px;" />
      </div>

    </q-card-section>
    <div class="row">
      <div class="col-8">
        <Chart :ref="charts[0]" :parameters="parameters[0].datails" classValue="text-h6" classSetpoint="text-h6"
          :chartId="parameters[0].name" colorDefault="yellow" :legend="true" classTitle="text-h6" :height="80"
          valueMeasure="°С" />
      </div>
      <q-card-section v-show="load" class="col-4 text-h6 ">

        Температура 1:
        <div class="text-h4" style="color: rgb(97, 138, 199);" align="center">
          {{ temperature1 }} °С
        </div>
        Температура 2:
        <div class="text-white text-h4" align="center">
          {{ temperature2 }} °С
        </div>
      </q-card-section>
      <q-card-section class="col-4 text-h6" v-show="!load">
        <q-inner-loading :showing="!load" color="white" label="Получение данных с ESP" label-class="text-white"
          label-style="font-size: 1.1em" />
      </q-card-section>

    </div>
    <div v-show="false" class="row">
      <div class="col-8">
        <Chart :ref="charts[1]" :parameters="parameters[1].datails" classValue="text-h6" classSetpoint="text-h6"
          :chartId="parameters[1].name" colorDefault="yellow" :legend="true" classTitle="text-h6" :height="80"
          valueMeasure="°С" />
      </div>
    </div>
  </q-page>
</template>

<script>
import {
  ref, onMounted, onBeforeUnmount, // inject,
} from 'vue';
import Chart from 'src/components/charts/chart_v4.vue';
import axios from 'axios';
import {
  color,
} from './fun';
import store from '../../store/index.js';

export default {
  name: 'TestRtk',
  components: {
    Chart,
  },
  setup() {
    document.title = 'Испытания РТК';
    const charts = [];
    const temperature1 = ref('-');
    const temperature2 = ref('-');
    const load = ref(false);
    const host = ref('10.54.7.14');
    const port = ref('81');
    const parameters = ref([
      {
        name: 'chart0',
        parameters: ['temperature1', 'temperature2'],
        datails: [{
          name: 'Точка 1',
          color,
        },
        {
          name: 'Точка 2',
          color: 'white',
        }],
        label: 'Температура внутри корпуса, °С',
      },
      {
        name: 'chart1',
        parameters: ['temperature1', 'temperature2'],
        datails: [{
          name: 'Вентилятор',
          color,
        },
        {
          name: 'Нагреватель',
          color: 'white',
        }],
        label: 'Производительность',
      },
    ]);

    function updateChart(index, values, time, direct, update) {
      if (time) {
        charts[index].value.pushValues(values, time, direct, update);
      } else {
        charts[index].value.pushValues(values, new Date(), direct, update);
      }
    }

    for (let index = 0; index < 2; index += 1) {
      charts.push(ref(null));
    }
    function listen(json) {
      console.log(json);
      temperature1.value = json.labTemperature1.toFixed(1);
      temperature2.value = json.labTemperature2.toFixed(1);
      updateChart(0, [json.labTemperature1, json.labTemperature2], null, true, true);
      load.value = true;
    }
    let ws;
    function loadChartsFromData(chartsArray, parts, thenfunc) {
      chartsArray.forEach((element) => {
        for (let i = 0; i < element.value.myChart.data.datasets.length; i += 1) {
          element.value.myChart.data.datasets[i].data.length = 0;
        }
        element.value.myChart.data.labels.length = 0;
        element.value.setVisible(false);
      });
      axios
        .get(`${store.host}/labrtk/get_all_values/420`).then((responseM) => {
          console.log(responseM);
          let currentChart = 0;
          const arrayValue = [];
          const arrayTime = [];
          for (let iC = 0; iC < chartsArray.length; iC += 1) {
            arrayValue.push([]);
            arrayTime.push([]);
            parts[iC].parameters.forEach(() => {
              arrayValue[iC].push([]);
            });
          }
          for (let index = responseM.data.length - 1; index >= 0; index -= 1) {
            for (let iC = 0; iC < chartsArray.length; iC += 1) {
              for (let iA = 0; iA < parts[iC].parameters.length; iA += 1) {
                arrayValue[iC][iA].push(responseM.data[index][parts[iC].parameters[iA]]);
              }
              arrayTime[iC].push(responseM.data[index].createdAt);
            }
          }
          function loadchart() {
            if (chartsArray[currentChart].value) {
              for (let iA = 0; iA < parts[currentChart].parameters.length; iA += 1) {
                chartsArray[currentChart].value.myChart.data.datasets[iA].data = arrayValue[currentChart][iA];
              }
              chartsArray[currentChart].value.myChart.data.labels = arrayTime[currentChart];
              chartsArray[currentChart].value.setName(parts[currentChart].label);
              chartsArray[currentChart].value.setVisible(true);
              chartsArray[currentChart].value.update();

              if (currentChart === chartsArray.length - 1) {
                if (thenfunc) {
                  setImmediate(thenfunc);
                }
              } else {
                setImmediate(loadchart);
              }
              currentChart += 1;
            }
          }
          setImmediate(loadchart);
        });
    }

    function reconnectWebSocket() {
      if (ws) {
        ws.close();
      }
      ws = new WebSocket(`ws://${host.value}:${port.value}`);
      // написать удаление элементов при размонтировании образа
      ws.onopen = function () {
        ws.send(JSON.stringify({ getMain: 1 }));
        loadChartsFromData(charts, parameters.value);
        try {
          ws.onmessage = async (data) => {
            try {
              const getJson = JSON.parse(data.data);
              listen(getJson);
            } catch (e) {
              console.log(data);
            }
          };
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      };
    }
    function updateHost() {
      load.value = false;
      reconnectWebSocket();
    }
    onMounted(() => {
      reconnectWebSocket();
    });
    onBeforeUnmount(() => {
      ws.close();
    });
    return {
      Chart,
      load,
      charts,
      parameters,
      temperature1,
      temperature2,
      host,
      port,
      updateHost,
    };
  },
};
</script>
<style scoped></style>
