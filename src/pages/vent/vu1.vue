<template>
  <q-page class="full-width row wrap justify-start items-start content-start">
    <div class="col" v-show="showSimulatedReturnDataVU">
      <q-item class="row">
        <q-card class="full-width">
          <q-card-section class="bg-secondary text-white">
            <div class="text-h6">Панель управления</div>
          </q-card-section>
          <q-card-section class="row">
            <q-card-section>
              <q-toggle size="96px" v-model="buttonVU" label="I/0 работа" @update:model-value="onofVU" />
            </q-card-section>
            <q-separator vertical inset />
            <q-card-section>
              <div class="text-h7">Уставка, °C:</div>
              <q-input v-model.number="setKanVU" type="number" filled style="max-width: 221px"
                @update:model-value="updateKanVU" :input-style="{ fontSize: '36px' }" lazy-rules @focus="focusonVU"
                @blur="focuslossVU"
                :rules="[val => val < 35 || 'Макс. уставка 35 °C', val => val > 18 || 'Мин. уставка 18 °C']">
                <template v-slot:after>
                  <q-btn color='primary' label='Применить' :disabled="disabledChangeTKanVU" @click="changeSetpointVU" />
                </template>
              </q-input>
            </q-card-section>
            <q-separator vertical inset />
            <q-card-section>
              <div class="text-h7">Статус:</div>
              <q-badge :color="colorStatusVU">
                <div class="text-h6">{{ statusVU }}</div>
              </q-badge>
            </q-card-section>
            <q-separator vertical inset v-show="warnMes" />
            <q-card-section v-show="warnMes">
              <div class="text-h7">Предупреждения:</div>
              <!-- <div>
                  <q-icon name="warning" color="yellow" size="100px" />
                </div> -->
              <q-badge color="yellow">
                <div class="text-h4 text-black">{{ warning }}</div>
              </q-badge>
            </q-card-section>
            <q-separator vertical inset />
            <q-card-section>
              <div class="text-h7">Аварии:</div>
              <q-list v-model="alarmsListVU" v-show="visibleAlarmsVU">
                <q-item v-for="alarm in getAlarmsVU()" :key="alarm.id" class="bg-white text-white">
                  <q-badge color="red">
                    <div class="text-h6 text-white">{{ alarm.text }}</div>
                    <q-tooltip class="text-h6">
                      {{ alarm.descript }}
                    </q-tooltip>
                  </q-badge>
                </q-item>
              </q-list>
              <div class="text-h6 text-black" v-show="!visibleAlarmsVU">
                <q-badge color="green">
                  <div class="text-h6 text-white">Отсутствуют</div>
                </q-badge>
              </div>
              <q-btn label="Сброс аварий" color='primary' v-show="visibleAlarmsVU" @click="resetAlarmVU" />
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-item>
      <q-item class="row">
        <q-card class="full-width">
          <q-card-section class="bg-secondary text-white">
            <div class="text-h6">Панель мониторинга</div>
          </q-card-section>
          <q-card class="row">
            <q-card-section class="col-10">
              <Chart ref="chart3" name='Температура, °C'
                :parameters="[{ name: 'Темп. наружняя', color: 'blue' }, { name: 'Темп. притока', color: 'green' }, { name: 'Темп. вытяжки', color: 'yellow' }, { name: 'Темп. обр. воды', color: 'gray' }]"
                chartId="chart3" colorDefault="black" :legend="true" classTitle="text-h8" valueMeasure="°С" />
            </q-card-section>
            <q-card-section class="col-2">
              <q-card-section class="bg-gray text-black">
                <div class="text-h7">Темп. наружняя, °C,:</div>
                <div class="text-h4">{{ tNarVU }}</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="bg-gray text-black">
                <div class="text-h7">Темп. притока, °C,:</div>
                <div class="text-h4">{{ tKanVU }}</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="bg-gray text-black">
                <div class="text-h7">Темп. вытяжки, °C:</div>
                <div class="text-h4">{{ tVytVU }}</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="bg-gray text-black">
                <div class="text-h7">Темп. обр. воды, °C:</div>
                <div class="text-h4">{{ tWaterVU }}</div>
              </q-card-section>
            </q-card-section>
          </q-card>
          <q-card class="row">
            <q-card-section class="col-10">
              <Chart ref="chart4" name='Частота вентиляторов, Гц'
                :parameters="[{ name: 'Частота прит. вент', color: 'blue' }, { name: 'Частота. выт. вент', color: 'red' }]"
                chartId="chart4" colorDefault="black" :legend="true" classTitle="text-h8" valueMeasure="°С" />
            </q-card-section>
            <q-card-section class="col-2">
              <q-card-section class="bg-gray text-black">
                <div class="text-h7">Приточный вент, Гц,:</div>
                <div class="text-h4">{{ pPVVU }}</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="bg-gray text-black">
                <div class="text-h7">Вытяжной вент, Гц,:</div>
                <div class="text-h4">{{ pVVVU }}</div>
              </q-card-section>
            </q-card-section>
          </q-card>
          <q-card class="row">
            <q-card-section class="col-10">
              <Chart ref="chart6" name='Производительность, %'
                :parameters="[{ name: 'Произв. вод. кал', color: 'blue' }]" chartId="chart6" colorDefault="black"
                :legend="false" classTitle="text-h8" valueMeasure="°С" />
            </q-card-section>
            <q-card-section class="col-2">
              <q-card-section class="bg-gray text-black">
                <div class="text-h7">Произв. вод. кал., %,:</div>
                <div class="text-h4">{{ pWCVU }}</div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-card>
      </q-item>
      <q-item class="row">
        <q-card class="col bg-white">
          <q-card-section class="bg-secondary text-white">
            <div class="row text-h6">Архивные данные</div>
          </q-card-section>
          <q-card-section class="row">
            <q-card-section class="col">
              <div class="row text-h7">Начало:</div>
              <div class="q-pa-xsm" style="max-width: 300px">
                <q-input input-class="text-h6" filled v-model="dateStart" @update:model-value="updateRoutes">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="dateStart" mask="YYYY-MM-DD HH:mm:ss" @update:model-value="updateRoutes">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Закрыть" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="dateStart" mask="YYYY-MM-DD HH:mm:ss" format24h
                          @update:model-value="updateRoutes">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Закрыть" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </q-card-section>
            <q-card-section class="col">
              <div class="row text-h7">Конец:</div>
              <div class="q-pa-xsm" style="max-width: 300px">
                <q-input input-class="text-h6" filled v-model="dateEnd" @update:model-value="updateRoutes">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="dateEnd" mask="YYYY-MM-DD HH:mm:ss" @update:model-value="updateRoutes">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Закрыть" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="dateEnd" mask="YYYY-MM-DD HH:mm:ss" format24h
                          @update:model-value="updateRoutes">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Закрыть" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </q-card-section>
          </q-card-section>
          <q-card-actions class="bg-grey-4">
            <q-btn :href="routeVU" target="_self" color="primary" label="Скачать .xlsx" />
          </q-card-actions>
        </q-card>
      </q-item>
      <q-item class="row">
        <q-card class="col bg-white">
          <q-card-section class="bg-secondary text-white">
            <div class="row text-h6">Журнал аварий</div>
          </q-card-section>
          <q-card-section>
            <q-table class="my-sticky-header-table" bordered binary-state-sort style="height: 400px" :columns="columns"
              :rows="rowsVU" virtual-scroll v-model:pagination="pagination" :rows-per-page-options="[0]"
              no-data-label="Записи в журнале отсутствуют">
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">
                    <div class="text-h6">
                      {{ col.label }}
                    </div>
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body-cell="props">
                <q-td :props="props">
                  <div class="text-h6">
                    {{ props.value }}
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </q-item>
    </div>
    <q-inner-loading :showing="loadVU" color="teal" label="Получение данных от контроллера..." label-class="text-teal"
      label-style="font-size: 1.1em" />
    <q-dialog v-model="changeDialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Авторизованный доступ</div>
        </q-card-section>
        <q-card-section class="row">
          <q-card-section class="col-6">
            Для внесения изменений в работу установки введите сервисный пароль:
          </q-card-section>
          <q-card-section class="col-6 q-pt-none">
            <q-input v-model="password" filled type="password" hint="Пароль" @update:model-value="updatePassword" />
          </q-card-section>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn v-model="confirmPassword" class="bg-teal text-white" label="Принять" @click="confirm"
            :disabled="disabled" />
          <q-btn class="bg-teal text-white" label="Отмена" v-close-popup @click="cancelConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="errorPasswordDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Ошибка</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Неверный пароль
        </q-card-section>
        <q-card-actions align="right" class="bg-red text-white">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>

import Chart from 'src/components/charts/chart_v3.vue';
import {
  ref, inject, onMounted, onBeforeUnmount,
} from 'vue';
import axios from 'axios';

export default {
  name: 'MainVent',
  components: {
    Chart,
  },
  setup() {
    document.title = 'Вент. установка №1';
    const nameObject = 'vu1';
    const tag = `${nameObject}_`;
    const tableItem = ref(null);

    const alarmsListVU = ref([]);

    const routeVU = ref(null);

    const loadVU = ref(false);
    const warnMes = ref(false);

    const showSimulatedReturnDataVU = ref(false);

    const tKanVU = ref(null);
    const tNarVU = ref(null);
    const tVytVU = ref(null);
    const tWaterVU = ref(null);

    const pPVVU = ref(null);
    const pVVVU = ref(null);

    const pWCVU = ref(null);

    const chart3 = ref(null);
    const chart4 = ref(null);
    const chart6 = ref(null);
    const dataValues = [];
    const setKanVU = ref(null);

    const buttonVU = ref(null);

    const statusVU = ref(null);
    const colorStatusVU = ref(null);
    const warning = ref(null);
    let focusTKan = false;
    const changeDialog = ref(false);
    const password = ref(null);
    const confirmPassword = ref(null);
    const disabled = ref(true);

    const disabledChangeTKanVU = ref(true);
    const errorPasswordDialog = ref(null);
    const passwordValue = '123';
    let changeParameter = -1;
    const tKanPrev = [null, null];
    const dateStart = ref('2022-09-08 21:56:00');

    const visibleAlarmsVU = ref(false);

    const alarmsTriggerVU = [false, false, false, false, false, false, false];
    const columns = ref([
      {
        name: 'alarm',
        label: 'Авария',
        align: 'left',
        field: (row) => row.alarm,
        format: (val) => `${val}`,
      },
      {
        name: 'datetime', align: 'left', label: 'Дата и время', field: 'datetime', sortOrder: 'ad',
      },
    ]);
    // const dataValuesVU = [];
    const {
      host, WebSocket_Create, WebSocket_Listen, WebSocket_Close, WebSocket_Send, getCurrentDate, getDataAlarms, getDataAlarm, getCurrentTime,
    } = inject('store');
    const dateEnd = ref(getCurrentDate());
    const alarms = getDataAlarms();
    const sender = 2;

    function getAlarmsVU() {
      const a = [];
      for (let index = 0; index < alarmsTriggerVU.length; index += 1) {
        if (alarmsTriggerVU[index]) {
          a.push(alarms[index]);
        }
      }
      return a;
    }
    const rowsVU = ref([]);

    // универсальные функции
    function updateAlarmJournal(rows, name) {
      rows.length = 0;
      axios
        .get(`${host}/api/alarms/${name}`).then((response) => {
          for (let index = 0; index < response.data.length; index += 1) {
            const element = response.data[index];
            const alarmEl = getDataAlarm(element.alarm);
            rows.push({ alarm: alarmEl.text, datetime: element.createdAt });
          }
        });
    }
    function checkIsUpdateTableJourmal(name, tableRows, json, func, rows) {
      if ((!tableRows[0] && json.tkPV)
        || (!tableRows[1] && json.tkVV)
        || (!tableRows[2] && json.ddPV)
        || (!tableRows[3] && json.ddVV)
        || (!tableRows[4] && json.fire)
        || (!tableRows[5] && json.thermoWC)) {
        func(rows, name);
      }
    }
    function updateChartv3(chart, values, time, direct, update) {
      if (time) {
        chart.pushValues(values, time, direct, update);
      } else {
        chart.pushValues(values, getCurrentTime(), direct, update);
      }
    }
    function shift() {
      if (dataValues.length > 0) {
        const mes = dataValues[dataValues.length - 1];
        // console.log(dataValues);
        updateChartv3(chart3.value, [{ value: mes.value_tNar },
          { value: mes.value_tKan }, { value: mes.value_tVyt }, { value: mes.value_tWater }], mes.time, false, false);
        updateChartv3(chart4.value, [{ value: mes.value_pPV },
          { value: mes.value_pVV }], mes.time, false, false);
        updateChartv3(chart6.value, [{ value: mes.value_pWC }], mes.time, false, false);
        dataValues.pop();
        // load.value = dataValues.length;
        setImmediate(shift);
      } else {
        chart3.value.update();
      }
    }
    function parse(json) {
      // потом сделать проверку try catch
      // eslint-disable-next-line no-console
      // console.log(json.tNar);
      if (json != null) {
        if ('id' in json) {
          if (json.id === 2) {
            if (!json.error) {
              console.log(json);
              if (!changeDialog.value) {
                if (json.alarm === 1) {
                  statusVU.value = 'Авария';
                  colorStatusVU.value = 'red';
                  // alarmsTriggerVU[6] = json.alarm;
                } else if (json.work === 1) {
                  statusVU.value = 'В работе';
                  colorStatusVU.value = 'green';
                } else {
                  statusVU.value = 'Дежурный';
                  colorStatusVU.value = 'yellow';
                }
                buttonVU.value = (json.work === 1);
                // seasonAuto.value = (json.sez_auto === 1);
                if (json.filter === 1) {
                  warning.value = 'Фильтр';
                  warnMes.value = true;
                } else {
                  warnMes.value = false;
                }

                updateChartv3(chart3.value, [{ value: json.tNar }, { value: json.tKan }, { value: json.tVyt }, { value: json.tWater }], json.timestamp, true, true);
                tKanVU.value = json.tKan;
                tNarVU.value = json.tNar;
                tVytVU.value = json.tVyt;
                tWaterVU.value = json.tWater;
                if (!focusTKan) {
                  setKanVU.value = json.setKan;
                }
              }
              const ppv = json.pPV;
              pPVVU.value = ppv;
              const pvv = json.pVV;
              pVVVU.value = pvv;
              const pwc = json.pWC;
              pWCVU.value = pwc.toFixed(1);
              updateChartv3(chart4.value, [{ value: ppv }, { value: pvv }], json.timestamp, true, true);
              updateChartv3(chart6.value, [{ value: pwc }], json.timestamp, true, true);

              checkIsUpdateTableJourmal(`${tag}alarm`, alarmsTriggerVU, json, updateAlarmJournal, rowsVU.value);

              alarmsTriggerVU[0] = json.tkPV;
              alarmsTriggerVU[1] = json.tkVV;
              alarmsTriggerVU[2] = json.ddPV;
              alarmsTriggerVU[3] = json.ddVV;
              alarmsTriggerVU[4] = json.fire;
              alarmsTriggerVU[5] = json.thermoWC;

              alarmsListVU.value = getAlarmsVU();
              visibleAlarmsVU.value = getAlarmsVU().length > 0;

              loadVU.value = false;
              showSimulatedReturnDataVU.value = true;
            }
          }
        }
      }
    }
    function createRoute(dir, start, end) {
      const route = `${host}/measures/${dir}/?start=${start}&end=${end}`;
      return route;
    }
    function replaceAt(str, index, replacement) {
      if (index >= str.length) {
        return str.valueOf();
      }
      return str.substring(0, index) + replacement + str.substring(index + 1);
    }
    function updateRoutes() {
      const newSt = dateStart.value.replaceAll('.', '-');
      const newS = replaceAt(newSt, 10, '_');
      const newEn = dateEnd.value.replaceAll('.', '-');
      const newE = replaceAt(newEn, 10, '_');

      routeVU.value = createRoute(`${tag}chart`, newS, newE);
    }
    onMounted(() => {
      loadVU.value = true;
      showSimulatedReturnDataVU.value = false;
      WebSocket_Create(nameObject, { getMain: 1 });
      WebSocket_Listen(nameObject, parse);
      axios
        .get(`${host}/app/database/${tag}chart/720`).then((responseM) => {
          for (let index = responseM.data.length - 1; index >= 0; index -= 1) {
            dataValues.push(responseM.data[index]);
          }
          shift();
        });

      updateRoutes();

      updateAlarmJournal(rowsVU.value, `${tag}alarm`);
    });
    onBeforeUnmount(() => {
      WebSocket_Close(nameObject);
    });

    function updateKanVU(newValue) {
      if (newValue > 35) {
        setKanVU.value = 35;
        disabledChangeTKanVU.value = true;
      } else if (newValue < 18) {
        setKanVU.value = 18;
        disabledChangeTKanVU.value = true;
      } else {
        disabledChangeTKanVU.value = (setKanVU.value === tKanPrev[1]);
      }
    }
    function updatePassword(newValue) {
      disabled.value = !(newValue.length > 0);
    }

    function preDialog() {
      password.value = '';
      changeDialog.value = true;
      updatePassword(password.value);
    }
    function onofVU(value) {
      buttonVU.value = !value;
      preDialog();
      changeParameter = 7;
    }
    function resetAlarmVU() {
      preDialog();
      changeParameter = 10;
    }
    function cancelConfirm() {
      if (changeParameter === 8) {
        const val = tKanPrev[1];
        setKanVU.value = val;
        disabledChangeTKanVU.value = true;
      }
    }
    function confirm() {
      if (password.value === passwordValue) {
        const time = getCurrentDate();
        if (changeParameter === 7) {
          // отключение включение вент установки
          const statePrev = buttonVU.value;
          buttonVU.value = !statePrev;
          const newValue = buttonVU.value;
          WebSocket_Send(nameObject, {
            id: sender, type: 'onof', value: newValue, timestamp: time,
          });
        } else if (changeParameter === 8) {
          // изм уставки вент установки
          const setpoint = setKanVU.value;
          tKanPrev[1] = setpoint;
          updateKanVU(setpoint);
          WebSocket_Send(nameObject, {
            id: sender, type: 'setpoint', value: setpoint, timestamp: time,
          });
        } else if (changeParameter === 10) {
          // сброс аварии вент установки
          WebSocket_Send(nameObject, {
            id: sender, type: 'reset', value: 1, timestamp: time,
          });
        }
        changeDialog.value = false;
        changeParameter = -1;
      } else {
        errorPasswordDialog.value = true;
      }
    }
    function focusonVU() {
      tKanPrev[1] = setKanVU.value;
      focusTKan = true;
    }
    function changeSetpointVU() {
      password.value = '';
      changeDialog.value = true;
      updatePassword(password.value);
      changeParameter = 8;
    }
    function focuslossVU() {
      focusTKan = false;
      changeSetpointVU();
    }
    return {
      tableItem,
      pagination: ref({
        rowsPerPage: 0,
        descending: true,
      }),
      columns,
      rowsVU,
      resetAlarmVU,
      alarmsTriggerVU,
      alarmsListVU,
      visibleAlarmsVU,
      getAlarmsVU,
      alarms,
      updateRoutes,

      routeVU,
      warnMes,
      cancelConfirm,

      disabledChangeTKanVU,
      errorPasswordDialog,
      disabled,
      changeDialog,
      password,

      buttonVU,
      onofVU,
      confirm,

      focuslossVU,
      focusonVU,
      changeSetpointVU,
      updateKanVU,
      updatePassword,
      confirmPassword,

      setKanVU,

      Chart,
      chart3,
      chart4,
      chart6,

      statusVU,
      colorStatusVU,
      warning,

      tKanVU,
      tNarVU,
      tVytVU,
      tWaterVU,

      pPVVU,
      pVVVU,

      pWCVU,

      loadVU,

      showSimulatedReturnDataVU,
      dateStart,
      dateEnd,
    };
  },
};
</script>
<style lang="sass" scoped>
  .card-example
    width: 288px
    height: 290px
  .my-sticky-header-table
    .q-table__top,
    .q-table__bottom,
    thead tr th
      position: sticky
      z-index: 1
    thead tr:first-child th
      top: 0
      background-color: white
</style>
