<template>
  <q-page class="text-white" padding style="background-color: rgb(60, 60, 60);">
    <q-card-section style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">
        Настройки
      </div>
    </q-card-section>
    <q-splitter v-model="settingSplitterTab" style="height: 100%;">
      <template v-slot:before>
        <q-tabs v-model="settingsTab" dense class="text-grey" no-caps active-color="white" indicator-color="white"
          align="left" vertical>
          <q-tab name="settingsGenerate">
            <div class="text-h6">Подбор ЩУ</div>
          </q-tab>
          <q-tab name="settingsLaboriousness">
            <div class="text-h6">Трудозатраты</div>
          </q-tab>
          <q-tab name="settingsMaterials">
            <div class="text-h6">Комплектующие</div>
          </q-tab>
          <q-tab name="settingsSync1С">
            <div class="text-h6">Синхронизация с 1С</div>
          </q-tab>
          <q-tab name="settingsZModbusParser">
            <div class="text-h6">Парсер переменных Zentec</div>
          </q-tab>
        </q-tabs>
      </template>
      <template v-slot:after>
        <q-tab-panels v-model="settingsTab" animated vertical keep-alive style="background-color: rgb(60, 60, 60);">
          <q-tab-panel name="settingsGenerate">
            <q-card-section class="text-black row justify-center">
              <div class="col-6">
                <q-input ref="refCostOneHourWorker" dark v-model="inputCostOneHourWorker" @blur="syncData"
                  @keydown.enter.prevent="syncData" class="text-h6" outlined label="Стоимость 1ч" type="number"
                  :rules="[val => val && (val >= 1) && (+val <= 9999) || 'Введите корректные данные от 1 руб до 9999 руб']"
                  suffix="руб." />
                <q-input ref="refPercentOfMaterials" dark v-model="inputPercentOfMaterials" @blur="syncData"
                  @keydown.enter.prevent="syncData" class="text-h6" outlined label="Процент от материалов" type="number"
                  :rules="[val => val && (val >= 0) && (+val <= 100) || 'Введите корректные данные от 0% до 100%']"
                  suffix="%" />
                <q-input ref="refKPrice" dark v-model="inputKPrice" @blur="syncData" @keydown.enter.prevent="syncData"
                  class="text-h6" outlined label="Коэффициент стоимости ЩУ" type="number"
                  :rules="[val => (val >= 1) && (+val <= 999) || 'Введите корректные данные от 1 до 999']" />
                <q-input ref="refCurrentDefaultKG" dark v-model="inputCurrentDefaultKG" @blur="syncData"
                  @keydown.enter.prevent="syncData" class="text-h6" outlined label="Ток нагрузки периметрального обогрева"
                  type="number"
                  :rules="[val => (val >= 0.001) && (+val <= 999) || 'Введите корректные данные от 0.001 A до 999 A']"
                  suffix="А" />
                <q-input ref="refCurrentDefaultUnitACDC" dark v-model="inputCurrentDefaultUnitACDC" @blur="syncData"
                  @keydown.enter.prevent="syncData" class="text-h6" outlined label="Ток нагрузки приводов AC/DC"
                  type="number"
                  :rules="[val => (val >= 0.001) && (+val <= 999) || 'Введите корректные данные от 0.001 A до 999 A']"
                  suffix="А" />
                <q-select dark class="text-h6" label="Категория автоматических выключателей"
                  options-selected-class="text-h6 text-grey" label-active-class="text-red" popup-content-class="text-h6"
                  outlined :options="materialsCategories" option-value="id" v-model="selectorCategoryAutoSwitch"
                  @update:model-value="syncData">
                  <template v-slot:selected>
                    <div class="text-white text-h6">
                      {{ selectorCategoryAutoSwitch.name }}
                    </div>
                  </template>
                </q-select>
              </div>
            </q-card-section>
          </q-tab-panel>
          <q-tab-panel name="settingsLaboriousness">
            <StringTable name="Виды трудозатрат в зависимости от опций" :columnsDef="[
              {
                name: 'name',
                required: true,
                label: 'Наименование',
                align: 'left',
                field: (row) => row.display_name,
                format: (val) => `${val}`,
                sortable: true,
                edit: false,
              },
              {
                name: 'time',
                align: 'left',
                label: 'Трудозатраты, ч',
                field: 'time',
                type: 'number',
                sortable: true,
                edit: true,
                changeText: 'Изменить трудозатраты',
              },
            ]" tableName="LaborCost" />
          </q-tab-panel>
          <q-tab-panel name="settingsMaterials">
            <q-tabs v-model="settingsTabMaterials" dense class="text-grey text-h8" no-caps active-color="white"
              indicator-color="white" align="left">
              <q-tab name="settingsMaterialsAll">
                <div>Роли</div>
              </q-tab>
              <q-tab name="settingsMaterialsAutoSwitches">
                <div>Авт. выключатели</div>
              </q-tab>
              <q-tab name="settingsMaterialsContactors">
                <div>Контакторы</div>
              </q-tab>
              <q-tab name="settingsMaterialsThermorelays">
                <div>Тепловые реле</div>
              </q-tab>
              <q-tab name="settingsMaterialsSSR">
                <div>Твердотельные реле</div>
              </q-tab>
              <q-tab name="settingsMaterialsBuses">
                <div>Шины</div>
              </q-tab>
              <q-tab name="settingsMaterialsBlockSupply">
                <div>Блоки питания DC24В</div>
              </q-tab>
              <q-tab name="settingsMaterialsBoxes">
                <div>Корпуса</div>
              </q-tab>
              <q-tab name="settingsMaterialsTerminals">
                <div>Однорядные клеммы</div>
              </q-tab>
            </q-tabs>
            <q-tab-panels v-model="settingsTabMaterials" animated keep-alive style="background-color: rgb(60, 60, 60);">
              <q-tab-panel name="settingsMaterialsAll">
                <q-input dark dense class="text-h6" v-model="searchRole" outlined label="Поиск по ролям:" type="text"
                  clearable @clear="() => {
                    searchRole = '';
                  }" />
                <ScrollBar styleContent="margin-top: 10px; padding-right: 20px; height: 70vh;">
                  <q-list>
                    <template v-for="element in settingsMaterialsAllArray" :key="element">
                      <MaterialSelected v-if="element.name.indexOf(searchRole) != -1" :materialName="element.name"
                        :parameterSettings="element.parameter" :typeSelected="element.single ? 'single' : 'multiply'" />
                    </template>

                  </q-list>
                </ScrollBar>
              </q-tab-panel>
              <q-tab-panel name="settingsMaterialsAutoSwitches">
                <MaterialTable name="Автоматические выключатели" tableName="AutoSwitch" :columnsDef="[
                  {
                    name: 'name',
                    required: true,
                    label: 'Автоматический выключатель',
                    align: 'left',
                    field: (row) => row.name,
                    format: (val) => `${val}`,
                    sortable: true,
                    required: true,
                    style: 'min-width: 500px',
                    changeText: 'Изменить наименование',
                    edit: false,
                  },
                  {
                    name: 'voltage',
                    align: 'left',
                    label: 'Номинальное напряжение, В',
                    field: 'voltage',
                    options: options.valuesVoltage,
                    format: (val) => `${getObject(options.valuesVoltage, 'id', val).label}`,
                    sortable: true,
                    defaultValue: 0,
                    type: 'selector',
                    changeText: 'Изменить напряжение',
                    edit: true,
                  },
                  {
                    name: 'current_nom',
                    align: 'left',
                    label: 'Номинальный ток, А',
                    field: 'current_nom',
                    format: (val) => `${Number(val)}`,
                    sortable: true,
                    defaultValue: 0,
                    type: 'number',
                    changeText: 'Изменить номинальный ток',
                    edit: true,
                  },
                  {
                    name: 'current_nom_inductive',
                    align: 'left',
                    label: 'Ток для индуктивной нагрузки, А',
                    field: 'current_nom_inductive',
                    format: (val) => `${Number(val)}`,
                    sortable: true,
                    defaultValue: 0,
                    type: 'number',
                    changeText: 'Изменить ток для индуктивной нагрузки',
                    edit: true,
                  },
                  {
                    name: 'current_nom_resistive',
                    align: 'left',
                    label: 'Ток для резистивной нагрузки, А',
                    field: 'current_nom_resistive',
                    format: (val) => `${Number(val)}`,
                    defaultValue: 0,
                    sortable: true,
                    type: 'number',
                    changeText: 'Изменить ток для резистивной нагрузки',
                    edit: true,
                  },
                ]" />
              </q-tab-panel>
              <q-tab-panel name="settingsMaterialsContactors">
                <MaterialTable name="Контакторы" tableName="Contactor" :columnsDef="[
                  {
                    name: 'name',
                    required: true,
                    label: 'Контактор',
                    align: 'left',
                    field: (row) => row.name,
                    format: (val) => `${val}`,
                    sortable: true,
                    required: true,
                    style: 'min-width: 500px',
                    changeText: 'Изменить наименование',
                    edit: false,
                  },
                  {
                    name: 'voltage',
                    align: 'left',
                    label: 'Номинальное напряжение, В',
                    field: 'voltage',
                    options: options.valuesVoltage,
                    format: (val) => `${getObject(options.valuesVoltage, 'id', val).label}`,
                    sortable: true,
                    defaultValue: 0,
                    type: 'selector',
                    changeText: 'Изменить напряжение',
                    edit: true,
                  },
                  {
                    name: 'current_nom_inductive',
                    align: 'left',
                    label: 'Ток для индуктивной нагрузки, А',
                    field: 'current_nom_inductive',
                    format: (val) => `${Number(val)}`,
                    sortable: true,
                    defaultValue: 0,
                    type: 'number',
                    changeText: 'Изменить ток для индуктивной нагрузки',
                    edit: true,
                  },
                  {
                    name: 'current_nom_resistive',
                    align: 'left',
                    label: 'Ток для резистивной нагрузки, А',
                    field: 'current_nom_resistive',
                    format: (val) => `${Number(val)}`,
                    defaultValue: 0,
                    sortable: true,
                    type: 'number',
                    changeText: 'Изменить ток для резистивной нагрузки',
                    edit: true,
                  },
                ]" />
              </q-tab-panel>
              <q-tab-panel name="settingsMaterialsThermorelays">
                <MaterialTable name="Тепловые реле" tableName="Thermorelay" :columnsDef="[
                  {
                    name: 'name',
                    required: true,
                    label: 'Тепловое реле',
                    align: 'left',
                    field: (row) => row.name,
                    format: (val) => `${val}`,
                    sortable: true,
                    required: true,
                    style: 'min-width: 500px',
                    changeText: 'Изменить наименование',
                    edit: false,
                  },
                  {
                    name: 'current',
                    align: 'left',
                    label: 'Номинальный ток, А',
                    field: 'current',
                    format: (val) => `${Number(val)}`,
                    sortable: true,
                    defaultValue: 0,
                    type: 'number',
                    changeText: 'Изменить номинальный ток',
                    edit: true,
                  },
                ]" />
              </q-tab-panel>
              <q-tab-panel name="settingsMaterialsSSR">
                <MaterialTable name="Твердотельные реле" tableName="SSRRelay" :columnsDef="[
                  {
                    name: 'name',
                    required: true,
                    label: 'Твердотельное реле',
                    align: 'left',
                    field: (row) => row.name,
                    format: (val) => `${val}`,
                    sortable: true,
                    required: true,
                    style: 'min-width: 500px',
                    changeText: 'Изменить наименование',
                    edit: false,
                  },
                  {
                    name: 'voltage',
                    align: 'left',
                    label: 'Номинальное напряжение, В',
                    field: 'voltage',
                    options: options.valuesVoltage,
                    format: (val) => `${getObject(options.valuesVoltage, 'id', val).label}`,
                    sortable: true,
                    defaultValue: 0,
                    type: 'selector',
                    changeText: 'Изменить напряжение',
                    edit: true,
                  },
                  {
                    name: 'current',
                    align: 'left',
                    label: 'Номинальный ток, А',
                    field: 'current',
                    format: (val) => `${Number(val)}`,
                    sortable: true,
                    defaultValue: 0,
                    type: 'number',
                    changeText: 'Изменить номинальный ток',
                    edit: true,
                  },
                ]" />
              </q-tab-panel>
              <q-tab-panel name="settingsMaterialsBoxes">
                <MaterialTable name="Корпуса" tableName="Box" :columnsDef="[
                  {
                    name: 'name',
                    required: true,
                    label: 'Корпус',
                    align: 'left',
                    field: (row) => row.name,
                    format: (val) => `${val}`,
                    sortable: true,
                    required: true,
                    style: 'min-width: 500px',
                    changeText: 'Изменить наименование',
                    edit: false,
                  },
                  {
                    name: 'material',
                    align: 'left',
                    label: 'Материал корпуса',
                    field: 'material',
                    options: options.valuesBoxMaterial,
                    format: (val) => `${getObject(options.valuesBoxMaterial, 'id', val).label}`,
                    sortable: true,
                    defaultValue: 0,
                    type: 'selector',
                    changeText: 'Изменить материал корпуса',
                    edit: true,
                  },
                  {
                    name: 'allow_size_for_autoswitches',
                    align: 'left',
                    label: 'Максимальная допустимая ширина автоматного ряда, мм',
                    field: 'allow_size_for_autoswitches',
                    format: (val) => `${Number(val)}`,
                    sortable: true,
                    defaultValue: 0,
                    type: 'number',
                    changeText: 'Изменить ширину',
                    edit: true,
                  },
                  {
                    name: 'allow_size_for_terminals',
                    align: 'left',
                    label: 'Максимальная допустимая ширина клеммного ряда, мм',
                    field: 'allow_size_for_terminals',
                    format: (val) => `${Number(val)}`,
                    defaultValue: 0,
                    sortable: true,
                    type: 'number',
                    changeText: 'Изменить ширину',
                    edit: true,
                  },
                ]" />
              </q-tab-panel>
              <q-tab-panel name="settingsMaterialsBuses">
                <MaterialTable name="Шины" tableName="Bus" :columnsDef="[
                  {
                    name: 'name',
                    required: true,
                    label: 'Шина',
                    align: 'left',
                    field: (row) => row.name,
                    format: (val) => `${val}`,
                    sortable: true,
                    required: true,
                    style: 'min-width: 500px',
                    changeText: 'Изменить наименование',
                    edit: false,
                  },
                  {
                    name: 'current',
                    align: 'left',
                    label: 'Номинальный ток нагрузки, А',
                    field: 'current',
                    format: (val) => `${Number(val)}`,
                    sortable: true,
                    defaultValue: 0,
                    type: 'number',
                    changeText: 'Изменить ток',
                    edit: true,
                  },
                  {
                    name: 'countPE',
                    align: 'left',
                    label: 'Количество подключений PE',
                    field: 'countPE',
                    format: (val) => `${Number(val)}`,
                    defaultValue: 0,
                    sortable: true,
                    type: 'number',
                    changeText: 'Изменить количество',
                    edit: true,
                  },
                  {
                    name: 'countN',
                    align: 'left',
                    label: 'Количество подключений N',
                    field: 'countN',
                    format: (val) => `${Number(val)}`,
                    defaultValue: 0,
                    sortable: true,
                    type: 'number',
                    changeText: 'Изменить количество',
                    edit: true,
                  },
                ]" />
              </q-tab-panel>
              <q-tab-panel name="settingsMaterialsBlockSupply">
                <MaterialTable name="Блоки питания DC24В" tableName="DCPowerSupply" :columnsDef="[
                  {
                    name: 'name',
                    required: true,
                    label: 'Блок питания',
                    align: 'left',
                    field: (row) => row.name,
                    format: (val) => `${val}`,
                    sortable: true,
                    required: true,
                    style: 'min-width: 500px',
                    changeText: 'Изменить наименование',
                    edit: false,
                  },
                  {
                    name: 'current',
                    align: 'left',
                    label: 'Выходной ток, А',
                    field: 'current',
                    format: (val) => `${Number(val)}`,
                    sortable: true,
                    defaultValue: 0,
                    type: 'number',
                    changeText: 'Изменить выходной ток',
                    edit: true,
                  },
                ]" />
              </q-tab-panel>
              <q-tab-panel name="settingsMaterialsTerminals">
                <MaterialTable name="Клеммы однорядные" tableName="Terminal" :columnsDef="[
                  {
                    name: 'name',
                    required: true,
                    label: 'Клемма',
                    align: 'left',
                    field: (row) => row.name,
                    format: (val) => `${val}`,
                    sortable: true,
                    required: true,
                    style: 'min-width: 500px',
                    changeText: 'Изменить наименование',
                    edit: false,
                  },
                  {
                    name: 'current',
                    align: 'left',
                    label: 'Ток нагрузки, А',
                    field: 'current',
                    format: (val) => `${Number(val)}`,
                    sortable: true,
                    defaultValue: 0,
                    type: 'number',
                    changeText: 'Изменить ток',
                    edit: true,
                  },
                ]" />
              </q-tab-panel>
            </q-tab-panels>
          </q-tab-panel>
          <q-tab-panel name="settingsSync1С">
            <q-table class="m-table text-white cursor-pointer" dark dense flat :rows="rowsMaterialsWithCode" :columns="[
              {
                name: 'name',
                required: true,
                label: 'Материал',
                align: 'left',
                field: (row) => row.name,
                format: (val) => `${val}`,
                sortable: true,
                required: true,
                style: 'min-width: 500px',
                edit: false,
              },
              {
                name: 'code',
                align: 'left',
                label: 'Код 1C',
                field: 'code',
                format: (val) => `${val}`,
                sortable: true,
                defaultValue: 0,
                type: 'text',
                changeText: 'Изменить код',
                edit: true,
              },
              {
                name: 'status',
                align: 'left',
                label: 'Статус',
                field: 'status',
                format: (val) => `${val}`,
                sortable: true,
                defaultValue: 0,
                type: 'text',
                edit: true,
              },
            ]" row-key="id" virtual-scroll :hide-selected-banner="true" selection="none" binary-state-sort
              :hide-pagination="true" v-model:pagination="pagination" separator="cell" :rows-per-page-options="[1]"
              wrap-cells style="background-color: rgb(60, 60, 60);" grid-header no-data-label="Нет данных">
              <template v-slot:top>
                <q-card-actions class="fit" style="background-color: rgb(60, 60, 60);">
                  <q-btn color='dark-grey' label="Загрузить файл синхронизации" icon='upload' @click="() => {
                    dialog = true;
                    completeLoad = '';
                  }" />
                </q-card-actions>
              </template>
              <template v-slot:pagination>
                <div class="text-h6">
                  {{ selected.length === 0 ? `Всего объектов: ${rows.length}` : `Объектов выбрано:
                  ${selected.length} из ${rows.length}` }}
                </div>
              </template>
              <template v-slot:header-cell="props">
                <q-th :props="props" style="background-color: rgb(60, 60, 60);">
                  <div class="text-h6">{{ props.col.label }}</div>
                </q-th>
              </template>
              <template v-slot:body-cell="props">
                <q-td :props="props">
                  <div class="text-h6">
                    {{ props.value }}
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <div :class="`text-h6 ${props.value == 'Готово' ? 'text-green' : 'text-red'}`">
                    {{ props.value }}
                  </div>
                </q-td>
              </template>
            </q-table>
            <q-dialog v-model="dialog" persistent>
              <q-card class="text-white q-pt-none"
                style="width: 900px; max-width: 95vw; background-color: rgb(60, 60, 60);">
                <q-bar>
                  <div class="text-h6">Загрузка файла .xlsx для обработки</div>
                  <q-space />
                  <q-btn dense flat icon="close" v-close-popup>
                    <q-tooltip class="bg-grey text-white">Закрыть</q-tooltip>
                  </q-btn>
                </q-bar>
                <q-card-section class="row items-center q-pa-md">
                  <q-uploader class="full-width" dark :url="`${host}/upload_excel`" multiple max-files="1"
                    :headers="[{ name: 'X-Custom-Timestamp', value: 1550240306080 }]" @uploaded="uploadComplete"
                    @removed="removedFiles" @failed="uploadError" style="background-color: rgb(60, 60, 60);">
                    <template v-slot:header="scope">
                      <div class="row items-center q-pa-sm q-gutter-xs" style="background-color: rgb(80, 80, 80);">
                        <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all" @click="scope.removeUploadedFiles"
                          round dense flat>
                          <q-tooltip>Убрать загруженные файлы</q-tooltip>
                        </q-btn>
                        <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                        <div class="col">
                          <div>
                            Максимальный размер: 5МБ
                          </div>
                          <div class="text-h8">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
                        </div>
                        <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
                          <q-uploader-add-trigger />
                          <q-tooltip>Выбрать файл</q-tooltip>
                        </q-btn>
                        <q-btn v-if="scope.canUpload" icon="upload" @click="scope.upload" round dense flat>
                          <q-tooltip>Загрузить файлы</q-tooltip>
                        </q-btn>
                        <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat>
                          <q-tooltip>Отменить загрузку</q-tooltip>
                        </q-btn>
                        <q-btn v-if="scope.queuedFiles.length > 0" icon="delete" @click="scope.removeQueuedFiles" round
                          dense flat>
                          <q-tooltip>Очистить список</q-tooltip>
                        </q-btn>
                      </div>
                    </template>
                  </q-uploader>
                  <q-list separator>
                    <q-item class="text-red text-h6" v-for="element in errorsLoad" :key="element">
                      {{ element.message }}
                    </q-item>
                  </q-list>
                  <q-card-section class="text-h6 text-green">
                    {{ completeLoad }}
                  </q-card-section>
                </q-card-section>
              </q-card>
            </q-dialog>
          </q-tab-panel>
          <q-tab-panel name="settingsZModbusParser">
            <Hiearchy ref="hiearchyZModbus" :data="hiearchyData" @click="hiearchyClick"/>
            <q-table class="m-table text-white cursor-pointer" dark dense flat :rows="rowsZVariables" :columns="[
              {
                name: 'name',
                required: true,
                label: 'Наименование',
                align: 'left',
                field: (row) => row.name,
                format: (val) => `${val}`,
                sortable: true,
                required: true,
                style: 'min-width: 500px',
                edit: false,
              },
              {
                name: 'address',
                align: 'left',
                label: 'Адрес',
                field: 'address',
                format: (val) => `${Number(val)}`,
                sortable: true,
                defaultValue: 0,
                type: 'text',
                changeText: 'Изменить код',
                edit: true,
              },
              {
                name: 'type',
                align: 'left',
                label: 'Тип',
                field: 'type',
                format: (val) => `${val}`,
                sortable: true,
                defaultValue: 0,
                type: 'text',
                edit: true,
              },
              {
                name: 'function',
                align: 'left',
                label: 'Функция',
                field: 'function',
                format: (val) => `${val}`,
                sortable: true,
                defaultValue: 0,
                type: 'text',
                edit: true,
              },
              {
                name: 'access',
                align: 'left',
                label: 'Доступ',
                field: 'access',
                format: (val) => `${val}`,
                sortable: true,
                defaultValue: 0,
                type: 'text',
                edit: true,
              },
            ]" row-key="id" virtual-scroll :hide-selected-banner="true" selection="none" binary-state-sort
              :hide-pagination="true" v-model:pagination="pagination" separator="cell" :rows-per-page-options="[1]"
              wrap-cells style="background-color: rgb(60, 60, 60);" grid-header no-data-label="Нет данных"
              :filter="filterZVariables">
              <template v-slot:top>
                <q-card-actions class="fit" style="background-color: rgb(60, 60, 60);">
                  <q-btn color='dark-grey' label="Загрузить файл переменных" icon='upload' @click="() => {
                    dialogZModbusParser = true;
                    completeLoad = '';
                  }" />
                  <q-btn v-if="rowsZVariables.length > 0" color='dark-grey' label="Скопировать как JSON"
                    icon='content_copy' @click="copyJSON" />
                  <q-space />
                  <q-input dark class="text-h6" outlined dense debounce="300" v-model="filterZVariables" clearable
                    placeholder="Поиск" style="margin: 10px;">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </q-card-actions>
              </template>
              <template v-slot:pagination>
                <div class="text-h6">
                  {{ selected.length === 0 ? `Всего объектов: ${rows.length}` : `Объектов выбрано:
                  ${selected.length} из ${rows.length}` }}
                </div>
              </template>
              <template v-slot:header-cell="props">
                <q-th :props="props" style="background-color: rgb(60, 60, 60);">
                  <div class="text-h6">{{ props.col.label }}</div>
                </q-th>
              </template>
              <template v-slot:body-cell="props">
                <q-td :props="props">
                  <div class="text-h6">
                    {{ props.value }}
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <div :class="`text-h6 ${props.value == 'Готово' ? 'text-green' : 'text-red'}`">
                    {{ props.value }}
                  </div>
                </q-td>
              </template>
            </q-table>
            <q-dialog v-model="dialogZModbusParser" persistent>
              <q-card class="text-white q-pt-none"
                style="width: 900px; max-width: 95vw; background-color: rgb(60, 60, 60);">
                <q-bar>
                  <div class="text-h6">Загрузка файла .mbm для обработки</div>
                  <q-space />
                  <q-btn dense flat icon="close" v-close-popup>
                    <q-tooltip class="bg-grey text-white">Закрыть</q-tooltip>
                  </q-btn>
                </q-bar>
                <q-card-section class="row items-center q-pa-md">
                  <q-uploader class="full-width" dark :url="`${host}/upload_zmodbus`" multiple max-files="1"
                    :headers="[{ name: 'X-Custom-Timestamp', value: 1550240306080 }]" @uploaded="uploadCompleteZModbus"
                    @removed="removedFiles" @failed="uploadError" style="background-color: rgb(60, 60, 60);">
                    <template v-slot:header="scope">
                      <div class="row items-center q-pa-sm q-gutter-xs" style="background-color: rgb(80, 80, 80);">
                        <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all" @click="scope.removeUploadedFiles"
                          round dense flat>
                          <q-tooltip>Убрать загруженные файлы</q-tooltip>
                        </q-btn>
                        <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                        <div class="col">
                          <div>
                            Максимальный размер: 5МБ
                          </div>
                          <div class="text-h8">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
                        </div>
                        <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
                          <q-uploader-add-trigger />
                          <q-tooltip>Выбрать файл</q-tooltip>
                        </q-btn>
                        <q-btn v-if="scope.canUpload" icon="upload" @click="scope.upload" round dense flat>
                          <q-tooltip>Загрузить файлы</q-tooltip>
                        </q-btn>
                        <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat>
                          <q-tooltip>Отменить загрузку</q-tooltip>
                        </q-btn>
                        <q-btn v-if="scope.queuedFiles.length > 0" icon="delete" @click="scope.removeQueuedFiles" round
                          dense flat>
                          <q-tooltip>Очистить список</q-tooltip>
                        </q-btn>
                      </div>
                    </template>
                  </q-uploader>
                  <q-list separator>
                    <q-item class="text-red text-h6" v-for="element in errorsLoad" :key="element">
                      {{ element.message }}
                    </q-item>
                  </q-list>
                  <q-card-section class="text-h6 text-green">
                    {{ completeLoad }}
                  </q-card-section>
                </q-card-section>
              </q-card>
            </q-dialog>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-page>
</template>

<script>
import {
  ref, defineComponent, inject, onMounted,
} from 'vue';
import ScrollBar from 'src/components/ScrollBar.vue';
import Hiearchy from 'src/components/Hiearchy.vue';
import MaterialSelected from 'src/pages/services/genprice/materialSelected.vue';
import MaterialTable from 'src/pages/services/genprice/materialTable.vue';
import StringTable from 'src/pages/services/genprice/stringTable.vue';
import {
  options,
} from 'src/pages/services/productoptions/structuresDefault.js';
import axios from 'axios';

export default defineComponent({
  name: 'Settings',
  components: {
    ScrollBar,
    MaterialSelected,
    MaterialTable,
    StringTable,
    Hiearchy,
  },
  setup() {
    document.title = 'Настройки';
    const { host, validationNumberNoZero, getObject } = inject('store');
    const refCostOneHourWorker = ref(null);
    const inputCostOneHourWorker = ref(0);
    const inputPercentOfMaterials = ref(0);
    const refPercentOfMaterials = ref(null);
    const inputKPrice = ref(0);
    const refKPrice = ref(null);
    const inputCurrentDefaultKG = ref(0);
    const refCurrentDefaultKG = ref(null);
    const inputCurrentDefaultUnitACDC = ref(0);
    const refCurrentDefaultUnitACDC = ref(null);
    const settingSplitterTab = ref(28);
    const settingsTab = ref('settingsGenerate');
    const settingsTabMaterials = ref('settingsMaterialsAll');
    const searchRole = ref('');
    const settings = [];
    const materials = [];
    const materialsCategories = ref([]);
    const selectorCategoryAutoSwitch = ref({});
    const dialog = ref(false);
    const rowsMaterialsWithCode = ref([]);
    const errorsLoad = ref([]);
    const completeLoad = ref('');
    const rowsMaterialsDefault = ref([
      {
        name: 'Авт выкл',
        count: 1,
      },
    ]);
    const dialogZModbusParser = ref(false);
    const rowsZVariables = ref([]);
    const filterZVariables = ref('');

    // дерево
    const hiearchyZModbus = ref(null);
    const hiearchyData = ref([]);
    function getMaterialsFromSettings(parameter) {
      return JSON.parse(getObject(settings, 'name', parameter).value);
    }
    function getOptionsAllMaterials() {
      return materials;
    }
    const settingsMaterialsAllArray = ref([]);
    function syncData() {
      if (refCostOneHourWorker.value.validate()) {
        axios.post(`${host}/services/genprice/settings/costOneHourWorker`, {
          value: Number(inputCostOneHourWorker.value),
        });
      } else {
        inputCostOneHourWorker.value = Number(getObject(settings, 'name', 'costOneHourWorker').value);
      }
      if (refPercentOfMaterials.value.validate()) {
        axios.post(`${host}/services/genprice/settings/percentOfMaterials`, {
          value: Number(inputPercentOfMaterials.value),
        });
      } else {
        inputPercentOfMaterials.value = Number(getObject(settings, 'name', 'percentOfMaterials').value);
      }
      if (refKPrice.value.validate()) {
        axios.post(`${host}/services/genprice/settings/kPrice`, {
          value: Number(inputKPrice.value),
        });
      } else {
        inputKPrice.value = Number(getObject(settings, 'name', 'kPrice').value);
      }
      if (refCurrentDefaultKG.value.validate()) {
        axios.post(`${host}/services/genprice/settings/currentDefaultKG`, {
          value: Number(inputCurrentDefaultKG.value),
        });
      } else {
        inputCurrentDefaultKG.value = Number(getObject(settings, 'name', 'currentDefaultKG').value);
      }
      if (refCurrentDefaultUnitACDC.value.validate()) {
        axios.post(`${host}/services/genprice/settings/currentDefaultUnitACDC`, {
          value: Number(inputCurrentDefaultUnitACDC.value),
        });
      } else {
        inputCurrentDefaultUnitACDC.value = Number(getObject(settings, 'name', 'currentDefaultUnitACDC').value);
      }
      axios.post(`${host}/services/genprice/settings/categoryAutoSwitch`, {
        value: Number(selectorCategoryAutoSwitch.value.id),
      });
    }
    onMounted(() => {
      axios
        .get(`${host}/services/genprice/Material`).then((responsMaterials) => {
          responsMaterials.data.forEach((element) => {
            materials.push(element);
          });
          axios
            .get(`${host}/services/genprice/MaterialCategory`).then((responsMaterialsCategory) => {
              responsMaterialsCategory.data.forEach((element) => {
                element.label = element.name;
                materialsCategories.value.push(element);
              });
              axios
                .get(`${host}/services/genprice/Setting`).then((responseM) => {
                  responseM.data.forEach((parameter) => {
                    settings.push(parameter);
                  });
                  inputCostOneHourWorker.value = Number(getObject(settings, 'name', 'costOneHourWorker').value);
                  inputPercentOfMaterials.value = Number(getObject(settings, 'name', 'percentOfMaterials').value);
                  inputKPrice.value = Number(getObject(settings, 'name', 'kPrice').value);
                  inputCurrentDefaultKG.value = Number(getObject(settings, 'name', 'currentDefaultKG').value);
                  inputCurrentDefaultUnitACDC.value = Number(getObject(settings, 'name', 'currentDefaultUnitACDC').value);
                  selectorCategoryAutoSwitch.value = getObject(materialsCategories.value, 'id', Number(getObject(settings, 'name', 'categoryAutoSwitch').value));
                  [
                    {
                      name: 'пульт Зентек',
                      parameter: 'PZ_ZENTEC_ID',
                    },
                    {
                      name: 'материалы для пульта управления PU',
                      parameter: 'PU_BOX_2_ID',
                    },
                    {
                      name: 'панель Elhart',
                      parameter: 'PANEL_ELHART_ID',
                    },
                    {
                      name: 'основной контроллер',
                      parameter: 'CONTROLLER_MASTER_ID',
                      single: true,
                    },
                    {
                      name: 'материалы для контроллера-модуля расширения',
                      parameter: 'CONTROLLER_SLAVE_ID',
                    },
                    {
                      name: 'доп. контакт для ВА-101',
                      parameter: 'AUTO_SWITCH_CONTACT_ID',
                    },
                    {
                      name: 'трансформатор',
                      parameter: 'TRANSFOMATOR_ID',
                    },
                    {
                      name: 'блок распределительный для автоматов от 160А до 250А',
                      parameter: 'POLYBLOCK_250A_ID',
                    },
                    {
                      name: 'двухрядная клемма',
                      parameter: 'TERMINAL_4_ID',
                    },
                    {
                      name: 'ограничитель на дин рейку',
                      parameter: 'TERMINAL_LIMIT',
                      single: true,
                    },
                    {
                      name: 'торцевой изолятор для клемм однорядных до 16А',
                      parameter: 'TERMINAL_FLANGE_2',
                    },
                    {
                      name: 'торцевой изолятор для клемм двухрядных',
                      parameter: 'TERMINAL_FLANGE_4',
                    },
                    {
                      name: 'предохранитель 0,5 А',
                      parameter: 'FUSE_05_ID',
                    },
                    {
                      name: 'кнопка врезная зелёная с подсветкой',
                      parameter: 'BTN_GREEN_ID',
                    },
                    {
                      name: 'кнопка КМУ',
                      parameter: 'KMU_GREEN_RED_LIGHT_ID',
                    },
                    {
                      name: 'врезная зеленая лампа',
                      parameter: 'LAMP_GREEN_ID',
                    },
                    {
                      name: 'врезная жёлтая лампа',
                      parameter: 'LAMP_YELLOW_ID',
                    },
                    {
                      name: 'врезная красная лампа',
                      parameter: 'LAMP_RED_ID',
                    },
                    {
                      name: 'врезной переключатель 3 пол.',
                      parameter: 'SWITCH_MODULE_3POS_ID',
                    },
                    {
                      name: 'реле 2СО 24В',
                      parameter: 'RELAY_2CO_24_ID',
                    },
                    {
                      name: 'реле 2СО 220В',
                      parameter: 'RELAY_2CO_220_ID',
                    },
                    {
                      name: 'реле 4СО 220В',
                      parameter: 'RELAY_4CO_220_ID',
                    },
                    {
                      name: 'реле перепада давления',
                      parameter: 'RPD_500_ID',
                    },
                    {
                      name: 'датчик температуры канальный',
                      parameter: 'K_NTC10K_ID',
                    },
                    {
                      name: 'датчик температуры уличный',
                      parameter: 'U_PT1000_ID',
                    },
                    {
                      name: 'датчик температуры накладной',
                      parameter: 'N_PT1000_ID',
                    },
                    {
                      name: 'датчик влажности канальный',
                      parameter: 'DPDC112000_ID',
                    },
                    {
                      name: 'датчик влажности в помещение',
                      parameter: 'RHS410R_ID',
                    },
                    {
                      name: 'датчик давления',
                      parameter: 'DPT2500_R8_ID',
                    },
                    {
                      name: 'датчик скорости',
                      parameter: 'AVT_D_ID',
                    },
                    {
                      name: 'датчик СО2 канальный',
                      parameter: 'RCD200_ID',
                    },
                    {
                      name: 'датчик СО2 в помещение',
                      parameter: 'RCD210_ID',
                    },
                    {
                      name: 'датчик СО в помещение',
                      parameter: 'RGI_CO0_L42M_ID',
                    },
                    {
                      name: 'материалы для 1Ф силового реле',
                      parameter: 'RELAY_FORCE_220_ID',
                    },
                    {
                      name: 'радиатор для твердотельного реле',
                      parameter: 'RADIATOR_3SSR_ID',
                      single: true,
                    },
                    {
                      name: '1Ф регулятор скорости до 0,8 кВт',
                      parameter: 'SIMISTOR_2_5_ID',
                    },
                    {
                      name: '1Ф регулятор скорости свыше 0,8 кВт (включительно)',
                      parameter: 'SIMISROR_5_ID',
                    },
                    // {
                    //   name: 'кросс-модуль 100А',
                    //   parameter: 'PZ_ZENTEC_ID',
                    // },
                    // {
                    //   name: 'кросс-модуль 125А',
                    //   parameter: 'PZ_ZENTEC_ID',
                    // },
                    // {
                    //   name: 'авт. выкл. 1Ф 3А',
                    //   parameter: 'PZ_ZENTEC_ID',
                    // },
                    // {
                    //   name: 'авт. выкл. 1Ф 2А',
                    //   parameter: 'PZ_ZENTEC_ID',
                    // },
                    // {
                    //   name: 'контактор 6А',
                    //   parameter: 'PZ_ZENTEC_ID',
                    // },
                  ].forEach((element) => {
                    settingsMaterialsAllArray.value.push(element);
                  });
                });
            });
        });
    });
    function uploadComplete(info) {
      rowsMaterialsWithCode.value.length = 0;
      const materialsLoad = JSON.parse(info.xhr.response);
      console.log(materialsLoad);
      let countOk = 0;
      materialsLoad.message.sort((a, b) => (a.status < b.status ? -1 : 1)).forEach((element) => {
        rowsMaterialsWithCode.value.push({
          name: element.name,
          code: element.id,
          status: element.status,
        });
        if (element.status === 'Готово') {
          countOk += 1;
        }
      });
      completeLoad.value = `Обновлено: ${countOk} материалов из ${materialsLoad.message.length} (${Number((countOk * 100) / materialsLoad.message.length).toFixed(0)}%)`;
    }
    function uploadError(error) {
      console.log(JSON.parse(error.xhr.response));
      errorsLoad.value.push(JSON.parse(error.xhr.response));
    }
    function uploadCompleteZModbus(info) {
      const vars = JSON.parse(info.xhr.response);
      console.log(vars);
      hiearchyData.value.length = 0;
      hiearchyData.value.push(vars.message);
    }
    function hiearchyClick() {
      console.log(hiearchyZModbus.value.selected());
    }
    // function uploadCompleteZModbus(info) {
    //   const vars = JSON.parse(info.xhr.response);
    //   rowsZVariables.value.length = 0;
    //   vars.message.forEach((element) => {
    //     rowsZVariables.value.push(element);
    //   });
    // }
    function removedFiles() {
      completeLoad.value = '';
      errorsLoad.value.length = 0;
    }
    function copyJSON() {
      navigator.clipboard.writeText(JSON.stringify(rowsZVariables.value))
        .then(() => console.log('Done!'))
        .catch((err) => console.error(err));
    }
    return {
      syncData,
      uploadComplete,
      uploadError,
      refCostOneHourWorker,
      inputCostOneHourWorker,
      refPercentOfMaterials,
      inputPercentOfMaterials,
      refKPrice,
      inputKPrice,
      refCurrentDefaultKG,
      inputCurrentDefaultKG,
      refCurrentDefaultUnitACDC,
      inputCurrentDefaultUnitACDC,
      validationNumberNoZero,
      host,
      settingSplitterTab,
      settingsTab,
      settingsTabMaterials,
      rowsMaterialsDefault,
      settingsMaterialsAllArray,
      searchRole,
      getMaterialsFromSettings,
      getOptionsAllMaterials,
      getObject,
      options,
      materialsCategories,
      selectorCategoryAutoSwitch,
      dialog,
      errorsLoad,
      completeLoad,
      removedFiles,
      rowsMaterialsWithCode,
      pagination: ref({
        rowsPerPage: 0,
      }),
      rowsZVariables,
      dialogZModbusParser,
      uploadCompleteZModbus,
      copyJSON,
      filterZVariables,
      hiearchyData,
      hiearchyZModbus,
      hiearchyClick,
    };
  },
});
</script>
