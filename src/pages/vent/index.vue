<template>
  <q-tabs v-model="tab" class="bg-teal text-grey-2 shadow-2" no-caps align="justify" active-color="white"
    style="font-size: 28px" indicator-color="white">
    <q-tab name="vu1">
      <div class="text-h6">Вент. установка №1</div>
    </q-tab>
    <q-tab name="vu2">
      <div class="text-h6">Вент. установка №2</div>
    </q-tab>
  </q-tabs>
  <q-separator />
  <q-tab-panels v-model="tab" animated keep-alive @transition="updateTabPanels">
    <q-tab-panel name="vu1">
      <q-page class="full-width row wrap justify-start items-start content-start">
        <div class="col" v-show="showSimulatedReturnDataVU1">
          <q-item class="row">
            <q-card class="full-width">
              <q-card-section class="bg-secondary text-white">
                <div class="text-h6">Панель управления</div>
              </q-card-section>
              <q-card-section class="row">
                <q-card-section>
                  <q-toggle size="96px" v-model="buttonVU1" label="I/0 работа" @update:model-value="onofVU1" />
                </q-card-section>
                <!-- <q-separator vertical inset />
              <q-card-section>
                <div class="text-h7">Режим:</div>
                <div class="q-gutter-sm">
                  <q-radio v-model="mode" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="winter"
                    label="Зима" @update:model-value="changeMode" />
                  <q-radio v-model="mode" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="summer"
                    label="Лето" @update:model-value="changeMode" />
                </div>
                <div class="q-gutter-sm">
                  <q-toggle size="32px" v-model="seasonAuto" label="Сезон (авторежим)" @update:model-value="seasonAutoOn" />
                </div>
              </q-card-section> -->
                <q-separator vertical inset />
                <q-card-section>
                  <div class="text-h7">Уставка, °C:</div>
                  <q-input v-model.number="setKanVU1" type="number" filled style="max-width: 221px"
                    @update:model-value="updateKanVU1" :input-style="{ fontSize: '36px' }" lazy-rules
                    @focus="focusonVU1" @blur="focuslossVU1"
                    :rules="[val => val < 35 || 'Макс. уставка 35 °C', val => val > 18 || 'Мин. уставка 18 °C']">
                    <template v-slot:after>
                      <q-btn color='primary' label='Применить' :disabled="disabledChangeTKanVU1"
                        @click="changeSetpointVU1" />
                    </template>
                  </q-input>
                </q-card-section>
                <q-separator vertical inset />
                <q-card-section>
                  <div class="text-h7">Статус:</div>
                  <q-badge :color="colorStatusVU1">
                    <div class="text-h6">{{ statusVU1 }}</div>
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
                  <q-list v-model="alarmsListVU1" v-show="visibleAlarmsVU1">
                    <q-item v-for="alarm in getAlarmsVU1()" :key="alarm.id" class="bg-white text-white">
                      <q-badge color="red">
                        <div class="text-h6 text-white">{{ alarm.text }}</div>
                        <q-tooltip class="text-h6">
                          {{ alarm.descript }}
                        </q-tooltip>
                      </q-badge>
                    </q-item>
                  </q-list>
                  <div class="text-h6 text-black" v-show="!visibleAlarmsVU1">
                    <q-badge color="green">
                      <div class="text-h6 text-white">Отсутствуют</div>

                    </q-badge>
                  </div>
                  <q-btn label="Сброс аварий" color='primary' v-show="visibleAlarmsVU1" @click="resetAlarmVU1" />
                </q-card-section>
              </q-card-section>
            </q-card>
          </q-item>
          <q-item class="row">
            <q-card class="full-width">
              <q-card-section class="bg-secondary text-white">
                <div class="row text-h6">Панель мониторинга</div>
              </q-card-section>
              <q-card class="row">
                <q-card-section class="col-10">
                  <Chart ref="chart1" name='Температура, °C' typeChart="line" barChartId="chart1" colorDefault="black">
                  </Chart>
                </q-card-section>
                <q-card-section class="col-2">
                  <q-card-section class="bg-gray text-black">
                    <div class="text-h7">Темп. наружняя, °C,:</div>
                    <div class="text-h4">{{ tNarVU1 }}</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="bg-gray text-black">
                    <div class="text-h7">Темп. притока, °C,:</div>
                    <div class="text-h4">{{ tKanVU1 }}</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="bg-gray text-black">
                    <div class="text-h7">Темп. вытяжки, °C:</div>
                    <div class="text-h4">{{ tVytVU1 }}</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="bg-gray text-black">
                    <div class="text-h7">Темп. обр. воды, °C:</div>
                    <div class="text-h4">{{ tWaterVU1 }}</div>
                  </q-card-section>
                </q-card-section>
              </q-card>
              <q-card class="row">
                <q-card-section class="col-10">
                  <Chart ref="chart2" name='Частота вентиляторов, Гц' typeChart="line" barChartId="chart2"
                    colorDefault="black">
                  </Chart>
                </q-card-section>
                <q-card-section class="col-2">
                  <q-card-section class="bg-gray text-black">
                    <div class="text-h7">Приточный вент, Гц,:</div>
                    <div class="text-h4">{{ pPVVU1 }}</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="bg-gray text-black">
                    <div class="text-h7">Вытяжной вент, Гц,:</div>
                    <div class="text-h4">{{ pVVVU1 }}</div>
                  </q-card-section>
                </q-card-section>
              </q-card>
              <q-card class="row">
                <q-card-section class="col-10">
                  <Chart ref="chart5" name='Производительность, %' typeChart="line" barChartId="chart5"
                    colorDefault="black">
                  </Chart>
                </q-card-section>
                <q-card-section class="col-2">
                  <q-card-section class="bg-gray text-black">
                    <div class="text-h7">Произв. вод. кал., %,:</div>
                    <div class="text-h4">{{ pWCVU1 }}</div>
                  </q-card-section>
                </q-card-section>
              </q-card>
            </q-card>
          </q-item>
          <q-item class="row">
            <q-card class="col">
              <q-card-section class="bg-secondary text-white">
                <div class="row text-h6">Архивные данные</div>
              </q-card-section>
              <q-card-section>
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
                                  <q-btn v-close-popup label="Close" color="primary" flat />
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
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </q-card-section>
                </q-card-section>
              </q-card-section>
              <q-card-actions class="bg-grey-4">
                <q-btn :href="routeVU1" target="_self" color="primary" label="Скачать .xlsx" />
              </q-card-actions>
            </q-card>
          </q-item>
          <q-item class="row">
            <q-card class="col bg-white">
              <q-card-section class="bg-secondary text-white">
                <div class="row text-h6">Журнал аварий</div>
              </q-card-section>
              <q-card-section>
                <q-table ref="tableItem" class="my-sticky-header-table" bordered style="height: 400px"
                  :columns="columns" :rows="rowsVU1" virtual-scroll v-model:pagination="pagination"
                  :rows-per-page-options="[0]" no-data-label="Записи в журнале отсутствуют">
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
        <q-inner-loading :showing="loadVU1" color="teal" label="Получение данных от контроллера..."
          label-class="text-teal" label-style="font-size: 1.1em" />
      </q-page>
    </q-tab-panel>
    <q-tab-panel name="vu2">
      <q-page class="full-width row wrap justify-start items-start content-start">
        <div class="col" v-show="showSimulatedReturnDataVU2">
          <q-item class="row">
            <q-card class="full-width">
              <q-card-section class="bg-secondary text-white">
                <div class="text-h6">Панель управления</div>
              </q-card-section>
              <q-card-section class="row">
                <q-card-section>
                  <q-toggle size="96px" v-model="buttonVU2" label="I/0 работа" @update:model-value="onofVU2" />
                </q-card-section>
                <!-- <q-separator vertical inset />
              <q-card-section>
                <div class="text-h7">Режим:</div>
                <div class="q-gutter-sm">
                  <q-radio v-model="mode" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="winter"
                    label="Зима" @update:model-value="changeMode" />
                  <q-radio v-model="mode" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="summer"
                    label="Лето" @update:model-value="changeMode" />
                </div>
                <div class="q-gutter-sm">
                  <q-toggle size="32px" v-model="seasonAuto" label="Сезон (авторежим)" @update:model-value="seasonAutoOn" />
                </div>
              </q-card-section> -->
                <q-separator vertical inset />
                <q-card-section>
                  <div class="text-h7">Уставка, °C:</div>
                  <q-input v-model.number="setKanVU2" type="number" filled style="max-width: 221px"
                    @update:model-value="updateKanVU2" :input-style="{ fontSize: '36px' }" lazy-rules
                    @focus="focusonVU2" @blur="focuslossVU2"
                    :rules="[val => val < 35 || 'Макс. уставка 35 °C', val => val > 18 || 'Мин. уставка 18 °C']">
                    <template v-slot:after>
                      <q-btn color='primary' label='Применить' :disabled="disabledChangeTKanVU2"
                        @click="changeSetpointVU2" />
                    </template>
                  </q-input>
                </q-card-section>
                <q-separator vertical inset />
                <q-card-section>
                  <div class="text-h7">Статус:</div>
                  <q-badge :color="colorStatusVU2">
                    <div class="text-h6">{{ statusVU2 }}</div>
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
                  <q-list v-model="alarmsListVU2" v-show="visibleAlarmsVU2">
                    <q-item v-for="alarm in getAlarmsVU2()" :key="alarm.id" class="bg-white text-white">
                      <q-badge color="red">
                        <div class="text-h6 text-white">{{ alarm.text }}</div>
                        <q-tooltip class="text-h6">
                          {{ alarm.descript }}
                        </q-tooltip>
                      </q-badge>
                    </q-item>
                  </q-list>
                  <div class="text-h6 text-black" v-show="!visibleAlarmsVU2">
                    <q-badge color="green">
                      <div class="text-h6 text-white">Отсутствуют</div>
                    </q-badge>
                  </div>
                  <q-btn label="Сброс аварий" color='primary' v-show="visibleAlarmsVU2" @click="resetAlarmVU2" />
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
                  <!-- <Chart ref="chart3" name='Температура, °C' typeChart="line" barChartId="chart3" colorDefault="black">
                  </Chart> -->
                  <Chart ref="chart3" name='Температура, °C'
                    :parameters="[{ name: 'Темп. наружняя', color: 'blue' }, { name: 'Темп. притока', color: 'green' }, { name: 'Темп. вытяжки', color: 'yellow' }, { name: 'Темп. обр. воды', color: 'gray' }]"
                    chartId="chart3" colorDefault="black" :legend="true" classTitle="text-h8" valueMeasure="°С" />
                </q-card-section>
                <q-card-section class="col-2">
                  <q-card-section class="bg-gray text-black">
                    <div class="text-h7">Темп. наружняя, °C,:</div>
                    <div class="text-h4">{{ tNarVU2 }}</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="bg-gray text-black">
                    <div class="text-h7">Темп. притока, °C,:</div>
                    <div class="text-h4">{{ tKanVU2 }}</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="bg-gray text-black">
                    <div class="text-h7">Темп. вытяжки, °C:</div>
                    <div class="text-h4">{{ tVytVU2 }}</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="bg-gray text-black">
                    <div class="text-h7">Темп. обр. воды, °C:</div>
                    <div class="text-h4">{{ tWaterVU2 }}</div>
                  </q-card-section>
                </q-card-section>
              </q-card>
              <q-card class="row">
                <q-card-section class="col-10">
                  <!-- <Chart ref="chart4" name='Частота вентиляторов, Гц' typeChart="line" barChartId="chart4"
                    colorDefault="black">
                  </Chart> -->
                  <Chart ref="chart4" name='Частота вентиляторов, Гц'
                    :parameters="[{ name: 'Частота прит. вент', color: 'blue' }, { name: 'Частота. выт. вент', color: 'red' }]"
                    chartId="chart4" colorDefault="black" :legend="true" classTitle="text-h8" valueMeasure="°С" />
                </q-card-section>
                <q-card-section class="col-2">
                  <q-card-section class="bg-gray text-black">
                    <div class="text-h7">Приточный вент, Гц,:</div>
                    <div class="text-h4">{{ pPVVU2 }}</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="bg-gray text-black">
                    <div class="text-h7">Вытяжной вент, Гц,:</div>
                    <div class="text-h4">{{ pVVVU2 }}</div>
                  </q-card-section>
                </q-card-section>
              </q-card>
              <q-card class="row">
                <q-card-section class="col-10">
                  <!-- <Chart ref="chart6" name='Производительность, %' typeChart="line" barChartId="chart6"
                    colorDefault="black"> -->
                  <Chart ref="chart6" name='Производительность, %'
                    :parameters="[{ name: 'Произв. вод. кал', color: 'blue' }]" chartId="chart6" colorDefault="black"
                    :legend="false" classTitle="text-h8" valueMeasure="°С" />
                </q-card-section>
                <q-card-section class="col-2">
                  <q-card-section class="bg-gray text-black">
                    <div class="text-h7">Произв. вод. кал., %,:</div>
                    <div class="text-h4">{{ pWCVU2.toFixed(2) }}</div>
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
                <q-btn :href="routeVU2" target="_self" color="primary" label="Скачать .xlsx" />
              </q-card-actions>
            </q-card>
          </q-item>
          <q-item class="row">
            <q-card class="col bg-white">
              <q-card-section class="bg-secondary text-white">
                <div class="row text-h6">Журнал аварий</div>
              </q-card-section>
              <q-card-section>
                <q-table class="my-sticky-header-table" bordered binary-state-sort style="height: 400px"
                  :columns="columns" :rows="rowsVU2" virtual-scroll v-model:pagination="pagination"
                  :rows-per-page-options="[0]" no-data-label="Записи в журнале отсутствуют">
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
        <q-inner-loading :showing="loadVU2" color="teal" label="Получение данных от контроллера..."
          label-class="text-teal" label-style="font-size: 1.1em" />
      </q-page>
    </q-tab-panel>
  </q-tab-panels>
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
</template>
<script>
import Chart from 'src/components/charts/chart_v3.vue';
import axios from 'axios';
import {
  ref, inject, onMounted, onBeforeUnmount,
} from 'vue';

export default {
  name: 'MainVent',
  components: {
    Chart,
  },
  setup() {
    const tableItem = ref(null);
    const alarmsListVU1 = ref([]);
    const alarmsListVU2 = ref([]);
    const tab = ref('vu1');
    const routeVU1 = ref(null);
    const routeVU2 = ref(null);
    const loadVU1 = ref(false);
    const loadVU2 = ref(false);
    const warnMes = ref(false);
    const showSimulatedReturnDataVU1 = ref(false);
    const showSimulatedReturnDataVU2 = ref(false);
    const tKanVU1 = ref(null);
    const tNarVU1 = ref(null);
    const tVytVU1 = ref(null);
    const tWaterVU1 = ref(null);
    const tKanVU2 = ref(null);
    const tNarVU2 = ref(null);
    const tVytVU2 = ref(null);
    const tWaterVU2 = ref(null);
    const pPVVU1 = ref(null);
    const pVVVU1 = ref(null);
    const pPVVU2 = ref(null);
    const pVVVU2 = ref(null);
    const pWCVU1 = ref(null);
    const pWCVU2 = ref(null);
    const chart1 = ref(null);
    const chart2 = ref(null);
    const chart3 = ref(null);
    const chart4 = ref(null);
    const chart5 = ref(null);
    const chart6 = ref(null);
    const setKanVU1 = ref(null);
    const setKanVU2 = ref(null);
    const buttonVU1 = ref(null);
    const buttonVU2 = ref(null);
    // const seasonAuto = ref(null);
    // const mode = ref(null);
    const statusVU1 = ref(null);
    const colorStatusVU1 = ref(null);
    const statusVU2 = ref(null);
    const colorStatusVU2 = ref(null);
    const warning = ref(null);
    let focusTKan = false;
    const changeDialog = ref(false);
    const password = ref(null);
    const confirmPassword = ref(null);
    const disabled = ref(true);
    const disabledChangeTKanVU1 = ref(true);
    const disabledChangeTKanVU2 = ref(true);
    const errorPasswordDialog = ref(null);
    const passwordValue = '123';
    let changeParameter = -1;
    const tKanPrev = [null, null];
    const dateStart = ref('2022-09-08 21:56:00');
    const host = 'http://10.154.152.88:3001';
    const mountChart = [false, false, false, false, false, false];
    const visibleAlarmsVU1 = ref(false);
    const visibleAlarmsVU2 = ref(false);
    const alarmsTriggerVU1 = [false, false, false, false, false, false, false];
    const alarmsTriggerVU2 = [false, false, false, false, false, false, false];
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
    const {
      WebSocket_Create, WebSocket_Listen, WebSocket_Close, WebSocket_Send, getCurrentDate, getDataAlarms, getDataAlarm,
    } = inject('store');
    const dateEnd = ref(getCurrentDate());
    const alarms = getDataAlarms();
    const sender = 2;
    function getAlarmsVU1() {
      const a = [];
      for (let index = 0; index < alarmsTriggerVU1.length; index += 1) {
        if (alarmsTriggerVU1[index]) {
          a.push(alarms[index]);
        }
      }
      return a;
    }
    function getAlarmsVU2() {
      const a = [];
      for (let index = 0; index < alarmsTriggerVU2.length; index += 1) {
        if (alarmsTriggerVU2[index]) {
          a.push(alarms[index]);
        }
      }
      return a;
    }
    const rowsVU1 = ref([]);
    const rowsVU2 = ref([]);

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
    function parseVU1(json) {
      if (json != null) {
        if ('id' in json) {
          if (json.id === 2) {
            if (!json.error) {
              if (!changeDialog.value) {
                if (json.alarm === 1) {
                  statusVU1.value = 'Авария';
                  colorStatusVU1.value = 'red';
                  alarmsTriggerVU1[6] = json.alarm;
                } else if (json.work === 1) {
                  statusVU1.value = 'В работе';
                  colorStatusVU1.value = 'green';
                } else {
                  statusVU1.value = 'Дежурный';
                  colorStatusVU1.value = 'yellow';
                }
                buttonVU1.value = (json.work === 1);
                // seasonAuto.value = (json.sez_auto === 1);
                if (json.filter === 1) {
                  warning.value = 'Фильтр';
                  warnMes.value = true;
                } else {
                  warnMes.value = false;
                }
                // if (json.season === 0) {
                //   mode.value = 'summer';
                // } else {
                //   mode.value = 'winter';
                // }
                chart1.value.pushValues([{ value: json.tNar }, { value: json.tKan }, { value: json.tVyt }, { value: json.tWater }], json.timestamp);
                tKanVU1.value = json.tKan;
                tNarVU1.value = json.tNar;
                tVytVU1.value = json.tVyt;
                tWaterVU1.value = json.tWater;
                if (!focusTKan) {
                  setKanVU1.value = json.setKan;
                }
              }
              const ppv = json.pPV;
              pPVVU1.value = ppv;
              const pvv = json.pVV;
              pVVVU1.value = pvv;
              const pwc = json.pWC;
              pWCVU1.value = pwc;
              chart2.value.pushValues([{ value: ppv }, { value: pvv }], json.timestamp);
              chart5.value.pushValues([{ value: pwc }], json.timestamp);

              checkIsUpdateTableJourmal('vu1_alarm', alarmsTriggerVU1, json, updateAlarmJournal, rowsVU1.value);

              alarmsTriggerVU1[0] = json.tkPV;
              alarmsTriggerVU1[1] = json.tkVV;
              alarmsTriggerVU1[2] = json.ddPV;
              alarmsTriggerVU1[3] = json.ddVV;
              alarmsTriggerVU1[4] = json.fire;
              alarmsTriggerVU1[5] = json.thermoWC;
              alarmsListVU1.value = getAlarmsVU1();
              visibleAlarmsVU1.value = getAlarmsVU1().length > 0;

              loadVU1.value = false;
              showSimulatedReturnDataVU1.value = true;
            }
          }
        }
      }
    }
    function parseVU2(json) {
      // потом сделать проверку try catch
      // eslint-disable-next-line no-console
      // console.log(json.tNar);
      if (json != null) {
        if ('id' in json) {
          if (json.id === 2) {
            if (!json.error) {
              if (!changeDialog.value) {
                if (json.alarm === 1) {
                  statusVU2.value = 'Авария';
                  colorStatusVU2.value = 'red';
                  alarmsTriggerVU2[6] = json.alarm;
                } else if (json.work === 1) {
                  statusVU2.value = 'В работе';
                  colorStatusVU2.value = 'green';
                } else {
                  statusVU2.value = 'Дежурный';
                  colorStatusVU2.value = 'yellow';
                }
                buttonVU2.value = (json.work === 1);
                // seasonAuto.value = (json.sez_auto === 1);
                if (json.filter === 1) {
                  warning.value = 'Фильтр';
                  warnMes.value = true;
                } else {
                  warnMes.value = false;
                }
                if (mountChart[2] === true) {
                  // chart3.value.pushValues([{ value: json.tNar }, { value: json.tKan }, { value: json.tVyt }, { value: json.tWater }], json.timestamp);
                  chart3.value.pushValues([{ value: json.tNar }, { value: json.tKan }, { value: json.tVyt }, { value: json.tWater }], json.timestamp, true, true);
                }
                tKanVU2.value = json.tKan;
                tNarVU2.value = json.tNar;
                tVytVU2.value = json.tVyt;
                tWaterVU2.value = json.tWater;
                if (!focusTKan) {
                  setKanVU2.value = json.setKan;
                }
              }
              const ppv = json.pPV;
              pPVVU2.value = ppv;
              const pvv = json.pVV;
              pVVVU2.value = pvv;
              const pwc = json.pWC;
              pWCVU2.value = pwc;
              if (mountChart[3] === true) {
                // chart4.value.pushValues([{ value: ppv }, { value: pvv }], json.timestamp);
                chart4.value.pushValues([{ value: ppv }, { value: pvv }], json.timestamp, true, true);
              }
              if (mountChart[5] === true) {
                chart6.value.pushValues([{ value: pwc }], json.timestamp, true, true);
                // chart6.value.pushValues([{ value: pwc }], json.timestamp);
              }

              checkIsUpdateTableJourmal('vu2_alarm', alarmsTriggerVU2, json, updateAlarmJournal, rowsVU2.value);

              alarmsTriggerVU2[0] = json.tkPV;
              alarmsTriggerVU2[1] = json.tkVV;
              alarmsTriggerVU2[2] = json.ddPV;
              alarmsTriggerVU2[3] = json.ddVV;
              alarmsTriggerVU2[4] = json.fire;
              alarmsTriggerVU2[5] = json.thermoWC;

              alarmsListVU2.value = getAlarmsVU2();
              visibleAlarmsVU2.value = getAlarmsVU2().length > 0;

              loadVU2.value = false;
              showSimulatedReturnDataVU2.value = true;
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
      routeVU1.value = createRoute('vu1_chart', newS, newE);
      routeVU2.value = createRoute('vu2_chart', newS, newE);
    }
    function updateTabPanels() {
      if (chart3.value != null && mountChart[2] === false) {
        // const parametresVU2 = [{ name: 'Темп. наружняя', color: 'blue' }, { name: 'Темп. притока', color: 'green' }, { name: 'Темп. вытяжки', color: 'yellow' }, { name: 'Темп. обр. воды', color: 'gray' }];
        // chart3.value.setParameters(parametresVU2);
        mountChart[2] = true;
      }
      if (chart4.value != null && mountChart[3] === false) {
        // const parametresPVU2 = [{ name: 'Частота прит. вент', color: 'blue' }, { name: 'Частота. выт. вент', color: 'red' }];
        // chart4.value.setParameters(parametresPVU2);
        mountChart[3] = true;
      }
      if (chart6.value != null && mountChart[5] === false) {
        // const parametresPWVU2 = [{ name: 'Произв. вод. кал', color: 'blue' }];
        // chart6.value.setParameters(parametresPWVU2);
        mountChart[5] = true;
      }
    }
    onMounted(() => {
      loadVU1.value = true;
      loadVU2.value = true;
      showSimulatedReturnDataVU1.value = false;
      showSimulatedReturnDataVU2.value = false;
      WebSocket_Create('vu1', { getMain: 1 });
      WebSocket_Listen('vu1', parseVU1);
      WebSocket_Create('vu2', { getMain: 1 });
      WebSocket_Listen('vu2', parseVU2);
      const parametresVU1 = [{ name: 'Темп. наружняя', color: 'blue' }, { name: 'Темп. притока', color: 'green' }, { name: 'Темп. вытяжки', color: 'yellow' }, { name: 'Темп. обр. воды', color: 'gray' }];
      chart1.value.setParameters(parametresVU1);
      const parametresPVU1 = [{ name: 'Частота. прит. вент', color: 'blue' }, { name: 'Частота. выт. вент', color: 'red' }];
      chart2.value.setParameters(parametresPVU1);
      const parametresPWVU1 = [{ name: 'Произв. вод. кал', color: 'blue' }];
      chart5.value.setParameters(parametresPWVU1);
      updateTabPanels();
      updateRoutes();
      updateAlarmJournal(rowsVU1.value, 'vu1_alarm');
      updateAlarmJournal(rowsVU2.value, 'vu2_alarm');
    });
    onBeforeUnmount(() => {
      WebSocket_Close('vu1');
      WebSocket_Close('vu2');
    });
    function updateKanVU1(newValue) {
      if (newValue > 35) {
        setKanVU1.value = 35;
        disabledChangeTKanVU1.value = true;
      } else if (newValue < 18) {
        setKanVU1.value = 18;
        disabledChangeTKanVU1.value = true;
      } else {
        disabledChangeTKanVU1.value = (setKanVU1.value === tKanPrev[0]);
      }
    }
    function updateKanVU2(newValue) {
      if (newValue > 35) {
        setKanVU2.value = 35;
        disabledChangeTKanVU2.value = true;
      } else if (newValue < 18) {
        setKanVU2.value = 18;
        disabledChangeTKanVU2.value = true;
      } else {
        disabledChangeTKanVU2.value = (setKanVU2.value === tKanPrev[1]);
      }
    }
    function updatePassword(newValue) {
      disabled.value = !(newValue.length > 0);
    }
    function onofVU1(value) {
      buttonVU1.value = !value;
      password.value = '';
      changeDialog.value = true;
      updatePassword(password.value);
      changeParameter = 0;
    }
    function preDialog() {
      password.value = '';
      changeDialog.value = true;
      updatePassword(password.value);
    }
    function onofVU2(value) {
      buttonVU2.value = !value;
      preDialog();
      changeParameter = 7;
    }
    function resetAlarmVU1() {
      preDialog();
      changeParameter = 9;
    }
    function resetAlarmVU2() {
      preDialog();
      changeParameter = 10;
    }
    // function seasonAutoOn(value) {
    //   seasonAuto.value = !value;
    //   password.value = '';
    //   changeDialog.value = true;
    //   updatePassword(password.value);
    //   changeParameter = 3;
    // }
    function cancelConfirm() {
      if (changeParameter === 2) {
        const val = tKanPrev[0];
        setKanVU1.value = val;
        disabledChangeTKanVU1.value = true;
      } else if (changeParameter === 8) {
        const val = tKanPrev[1];
        setKanVU2.value = val;
        disabledChangeTKanVU2.value = true;
      }
    }
    function confirm() {
      if (password.value === passwordValue) {
        const time = getCurrentDate();
        if (changeParameter === 0) {
          const statePrev = buttonVU1.value;
          buttonVU1.value = !statePrev;
          const newValue = buttonVU1.value;
          WebSocket_Send('vu1', {
            id: sender, type: 'onof', value: newValue, timestamp: time,
          });
        } else if (changeParameter === 1) {
          // let state = 0;
          // if (mode.value === 'winter') {
          //   mode.value = 'summer';
          // } else if (mode.value === 'summer') {
          //   mode.value = 'winter';
          //   state = 1;
          // }
          // WebSocket_Send({
          //   id: sender, type: 'mode', value: state, timestamp: time,
          // });
        } else if (changeParameter === 2) {
          // изм уставки VU1
          const setpoint = setKanVU1.value;
          tKanPrev[0] = setpoint;
          updateKanVU1(setpoint);
          WebSocket_Send('vu1', {
            id: sender, type: 'setpoint', value: setpoint, timestamp: time,
          });
        } else if (changeParameter === 3) {
          // const statePrev = seasonAuto.value;
          // seasonAuto.value = !statePrev;
          // const newValue = seasonAuto.value;
          // WebSocket_Send({
          //   id: sender, type: 'season_auto', value: newValue, timestamp: time,
          // });
        } else if (changeParameter === 7) {
          const statePrev = buttonVU2.value;
          buttonVU2.value = !statePrev;
          const newValue = buttonVU2.value;
          WebSocket_Send('vu2', {
            id: sender, type: 'onof', value: newValue, timestamp: time,
          });
        } else if (changeParameter === 8) {
          // изм уставки VU1
          const setpoint = setKanVU2.value;
          tKanPrev[1] = setpoint;
          updateKanVU2(setpoint);
          WebSocket_Send('vu2', {
            id: sender, type: 'setpoint', value: setpoint, timestamp: time,
          });
        } else if (changeParameter === 9) {
          WebSocket_Send('vu1', {
            id: sender, type: 'reset', value: 1, timestamp: time,
          });
        } else if (changeParameter === 10) {
          WebSocket_Send('vu2', {
            id: sender, type: 'reset', value: 1, timestamp: time,
          });
        }
        changeDialog.value = false;
        changeParameter = -1;
      } else {
        errorPasswordDialog.value = true;
      }
    }
    // function changeMode(value) {
    //   if (value === 'winter') {
    //     mode.value = 'summer';
    //   } else if (value === 'summer') {
    //     mode.value = 'winter';
    //   }
    //   password.value = '';
    //   changeDialog.value = true;
    //   updatePassword(password.value);
    //   changeParameter = 1;
    // }
    function focusonVU1() {
      tKanPrev[0] = setKanVU1.value;
      focusTKan = true;
    }
    function focusonVU2() {
      tKanPrev[1] = setKanVU2.value;
      focusTKan = true;
    }
    function changeSetpointVU1() {
      password.value = '';
      changeDialog.value = true;
      updatePassword(password.value);
      changeParameter = 2;
    }
    function changeSetpointVU2() {
      password.value = '';
      changeDialog.value = true;
      updatePassword(password.value);
      changeParameter = 8;
    }
    function focuslossVU1() {
      focusTKan = false;
      changeSetpointVU1();
    }
    function focuslossVU2() {
      focusTKan = false;
      changeSetpointVU2();
    }
    return {
      tableItem,
      pagination: ref({
        rowsPerPage: 0,
        descending: true,
      }),
      columns,
      rowsVU1,
      rowsVU2,
      resetAlarmVU1,
      resetAlarmVU2,
      alarmsTriggerVU2,
      alarmsListVU2,
      visibleAlarmsVU2,
      getAlarmsVU2,
      alarmsListVU1,
      visibleAlarmsVU1,
      getAlarmsVU1,
      alarms,
      alarmsTriggerVU1,
      tab,
      updateTabPanels,
      updateRoutes,
      routeVU1,
      routeVU2,
      warnMes,
      cancelConfirm,
      disabledChangeTKanVU1,
      disabledChangeTKanVU2,
      errorPasswordDialog,
      disabled,
      changeDialog,
      password,
      // seasonAuto,
      // seasonAutoOn,
      buttonVU1,
      buttonVU2,
      // mode,
      onofVU1,
      onofVU2,
      confirm,
      // changeMode,
      focuslossVU1,
      focuslossVU2,
      focusonVU1,
      focusonVU2,
      changeSetpointVU1,
      changeSetpointVU2,
      updateKanVU1,
      updateKanVU2,
      updatePassword,
      confirmPassword,
      setKanVU1,
      setKanVU2,
      Chart,
      chart1,
      chart2,
      chart3,
      chart4,
      chart5,
      chart6,
      statusVU1,
      colorStatusVU1,
      statusVU2,
      colorStatusVU2,
      warning,
      tKanVU1,
      tNarVU1,
      tVytVU1,
      tWaterVU1,
      tKanVU2,
      tNarVU2,
      tVytVU2,
      tWaterVU2,
      pPVVU1,
      pVVVU1,
      pPVVU2,
      pVVVU2,
      pWCVU1,
      pWCVU2,
      loadVU1,
      loadVU2,
      showSimulatedReturnDataVU1,
      showSimulatedReturnDataVU2,
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
