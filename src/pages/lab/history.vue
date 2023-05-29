<template >
  <q-page class="justify-center full-width" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Исторические данные</div>
    </q-card-section>
    <div class="row">
      <div class="col-12">
        <Chart :ref="charts[0]" name='' :parameters="[{ name: '', color: 'rgb(97, 138, 199)' }]" classValue="text-h6"
          classSetpoint="text-h6" chartId="chart0" colorDefault="yellow" :legend="false" classTitle="text-h6"
          :height="100" valueMeasure="Па" style="min-height: 700px;" :countMax="count" :step="3600">
          <template v-slot:topLabel>
            <q-card-section class="row items-center">
              <q-select dark class="text-h6 col-2 q-pa-sm" label="Параметр:" options-selected-class="text-h6"
                popup-content-class="text-h6" outlined v-model="parameter" @update:model-value="updateParameterChart"
                 label-color="grey"
                :options="['DataTwT_11', 'DataTwT_12', 'DataTwT_21', 'DataTwT_22', 'Hc_11', 'Hc_12', 'Hc_21', 'Hc_22',
                'Hc_Lab', 'KPD_H', 'KPD_T', 'Patm', 'Plotnost_11', 'Plotnost_12', 'Plotnost_21', 'Plotnost_22', 'Pressure_11', 'Pressure_12', 'Pressure_21',
                'Pressure_22', 'Rh_11', 'Rh_12', 'Rh_21', 'Rh_22', 'Rh_Lab', 'Rh_TMA1_21', 'Rh_TMA2_21', 'Rh_TMA3_21', 'Rh_TMA4_21', 'Rh_TMA5_21', 'Rh_TMA6_21',
                'Rh_TMA7_12', 'Rh_TMA8_12', 'Rh_TMA9_12', 'Rh_TMA10_12', 'Rh_TMA11_12', 'Rh_TMA12_12', 'Rh_TMA13_22', 'Rh_TMA14_22', 'Rh_TMA15_22', 'Rh_TMA16_22',
                'Rh_TMA17_22', 'Rh_TMA18_22', 'T_Lab', 'Rh_TMA19_11', 'Rh_TMA20_11', 'Rh_TMA21_11', 'Rh_TMA22_11', 'Rh_TMA23_11', 'Rh_TMA24_11', 'Speed_11_13',
                'Speed_11_15', 'Speed_11_16', 'Speed_11_Sr', 'Speed_12_5', 'Speed_12_6', 'Speed_12_7', 'Speed_12_8', 'Speed_12_Sr', 'Speed_21_1', 'Speed_21_2',
                'Speed_21_3', 'Speed_21_4', 'Speed_21_Sr', 'Speed_22_9', 'Speed_22_10', 'Speed_22_11', 'Speed_22_12', 'Speed_22_Sr', 'T_11', 'T_12', 'T_22',
                'T_TMA1_21', 'T_TMA2_21', 'T_TMA3_21', 'T_TMA4_21', 'T_TMA5_21', 'T_TMA6_21', 'T_TMA7_12', 'T_TMA8_12', 'T_TMA9_12', 'T_TMA10_12', 'T_TMA11_12',
                'T_TMA12_12', 'T_TMA13_22', 'T_TMA14_22', 'T_TMA15_22', 'T_TMA16_22', 'T_TMA17_22', 'T_TMA18_22', 'T_TMA19_11', 'T_TMA20_11', 'T_TMA21_11',
                'T_TMA22_11', 'T_TMA23_11', 'T_TMA24_11', 'Warm_balance', 'deltap_11_12', 'deltap_11_22', 'deltap_21_22', 'm3h_11', 'm3h_12', 'm3h_21', 'm3h_22',
                'mass_11', 'mass_11_21', 'mass_12', 'mass_21', 'mass_22', 'T_21']"
                popup-content-style="background-color: rgb(60, 60, 60); color:  white;">
                <template v-slot:selected>
                  <div class="text-white">
                    {{ parameter }}
                  </div>
                </template>
              </q-select>
              <q-input dark class="col-4 text-h6 q-pa-sm" outlined v-model="dateStart" label-color="grey" color="white"
                label="Время старта" @update:model-value="updateChartStartTime">
                <template v-slot:prepend>
                  <q-icon dark name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date dark v-model="dateStart" mask="YYYY-MM-DD HH:mm:ss"
                        @update:model-value="updateChartStartTime">
                        <div class="row items-center justify-center">
                          <q-btn v-close-popup label="Закрыть" color="dark-grey" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:append>
                  <q-icon dark name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time dark v-model="dateStart" mask="YYYY-MM-DD HH:mm:ss" format24h
                        @update:model-value="updateChartStartTime">
                        <div class="row items-center justify-center">
                          <q-btn v-close-popup label="Закрыть" color="dark-grey" />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input v-if="!autoupdate" dark class="col-4 text-h6 q-pa-sm" outlined v-model="dateEnd"
                label-color="grey" color="white" label="Время финиша" @update:model-value="updateChartEndTime">
                <template v-slot:prepend>
                  <q-icon dark name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date dark v-model="dateEnd" mask="YYYY-MM-DD HH:mm:ss"
                        @update:model-value="updateChartEndTime">
                        <div class="row items-center justify-center">
                          <q-btn v-close-popup label="Закрыть" color="dark-grey" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:append>
                  <q-icon dark name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time dark v-model="dateEnd" mask="YYYY-MM-DD HH:mm:ss" format24h
                        @update:model-value="updateChartEndTime">
                        <div class="row items-center justify-center">
                          <q-btn v-close-popup label="Закрыть" color="dark-grey" />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-toggle class="col-1 text-h6" v-model="autoupdate" label="Автообновление"
                @update:model-value="updateAutoUpdate" />
            </q-card-section>
          </template>
        </Chart>
      </div>
    </div>
  </q-page>
</template>

<script>
import {
  inject, ref, onMounted, onBeforeUnmount,
} from 'vue';
import Chart from 'src/components/charts/chart_v4.vue';
import axios from 'axios';

export default {
  name: 'Output',
  components: {
    Chart,
  },
  setup() {
    document.title = 'Перепад 11-12 (обмерзание)';
    const charts = [];
    const parameter = ref('deltap_11_12');
    const autoupdate = ref(false);
    const parameters = [
      {
        parameters: [parameter],
        label: 'Перепад давления 11-22, Па',
      },
    ];
    const load = ref(false);
    for (let index = 0; index < 1; index += 1) {
      charts.push(ref(null));
    }
    const {
      host, WebSocket_Create, WebSocket_Listen, WebSocket_Close, getCurrentDate,
    } = inject('store');

    const today = new Date();
    const dateEnd = ref(null);
    today.setHours(today.getHours() - 6);
    const dateStart = ref(getCurrentDate(today));
    function updateChart_v4(index, values, time) {
      for (let iC = 0; iC < values.length; iC += 1) {
        charts[index].value.myChart.data.datasets[iC].data.push(values[iC]);
      }
      charts[index].value.myChart.data.labels.push(time);
      charts[index].value.update();
      // if (setpoint) {
      //   charts[index].value.setSetpoint(Number(setpoint).toFixed(2));
      // }
      // if (value) {
      //   charts[index].value.setValue(Number(value).toFixed(2));
      // }
    }
    function listen(json) {
      const mes = json.message;
      if (json.id === 2) {
        if (json.type === 'sendDataRecup') {
          console.log(mes);
          if (autoupdate.value) {
            updateChart_v4(0, [mes[parameter.value].value], mes.сreatedAt.value);
          }
        }
      }
    }
    function loadChartsFromData(chartsArray, datatable, parts, timeStart, timeFinish) {
      load.value = false;
      chartsArray.forEach((element) => {
        for (let i = 0; i < element.value.myChart.data.datasets.length; i += 1) {
          element.value.myChart.data.datasets[i].data.length = 0;
        }
        element.value.myChart.data.labels.length = 0;
        element.value.setVisible(false);
      });
      axios
        .get(`${host}/app/database-get-in-start-end/${datatable}/${timeStart}/${timeFinish}`).then((responseM) => {
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
          for (let iC = 0; iC < chartsArray.length; iC += 1) {
            for (let iA = 0; iA < parts[iC].parameters.length; iA += 1) {
              chartsArray[iC].value.myChart.data.datasets[iA].data = arrayValue[iC][iA];
            }
            chartsArray[iC].value.myChart.data.labels = arrayTime[iC];
            // chartsArray[iC].value.setName(parts[iC].label);
            chartsArray[iC].value.setVisible(true);
            chartsArray[iC].value.update();
            load.value = true;
          }
        });
    }
    function updateChartStartTime(date) {
      localStorage.setItem('startTime', date);
      loadChartsFromData([charts[0]], 'DataRecup', parameters, date, dateEnd.value);
    }
    function updateChartEndTime(date) {
      localStorage.setItem('endTime', date);
      loadChartsFromData([charts[0]], 'DataRecup', parameters, dateStart.value, date);
    }
    function updateParameterChart(par) {
      parameters[0].parameters = [par];
      localStorage.setItem('parameter', par);
      loadChartsFromData([charts[0]], 'DataRecup', parameters, dateStart.value, dateEnd.value);
    }
    function updateAutoUpdate(val) {
      dateEnd.value = getCurrentDate(new Date());
      loadChartsFromData([charts[0]], 'DataRecup', parameters, dateStart.value, dateEnd.value);
      localStorage.setItem('autoupdate', Number(val));
      localStorage.setItem('endTime', dateEnd.value);
    }
    onMounted(() => {
      const autoupd = localStorage.getItem('autoupdate');
      const p = localStorage.getItem('parameter');
      const startDate = localStorage.getItem('startTime');
      const endDate = localStorage.getItem('endTime');
      if (p) {
        parameter.value = p;
      }
      if (startDate) {
        dateStart.value = startDate;
      }
      autoupdate.value = Number(autoupd) === 1;
      if (endDate && !autoupdate.value) {
        dateEnd.value = endDate;
      } else {
        dateEnd.value = new Date(getCurrentDate());
      }
      updateParameterChart(parameter.value);
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
      updateChartEndTime,
      dateStart,
      dateEnd,
      updateChartStartTime,
      parameter,
      updateParameterChart,
      autoupdate,
      updateAutoUpdate,
    };
  },
};
</script>
<style scoped>

</style>
