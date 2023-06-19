<template>
  <q-page class="text-white" padding style="background-color: rgb(60, 60, 60);">
    <q-card-section style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">
        Настройки
      </div>
    </q-card-section>
    <q-splitter v-model="settingSplitterTab" style="height: 100%;">
      <template v-slot:before>
        <q-tabs v-model="settingsTab" class="text-grey" no-caps active-color="white" indicator-color="white" align="left"
          vertical>
          <q-tab name="settingsGenerate">
            <div class="text-h6">Подбор ЩУ</div>
          </q-tab>
          <q-tab name="settingsLaboriousness">
            <div class="text-h6">Трудозатраты</div>
          </q-tab>
          <q-tab name="settingsMaterials">
            <div class="text-h6">Комплектующие</div>
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
            <q-tabs v-model="settingsTabMaterials" class="text-grey text-h8" no-caps active-color="white"
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
                <ScrollBar styleContent="margin-top: 10px; padding-right: 20px; height: 70vh;">
                  <q-list>
                    <MaterialSelected v-for="element in settingsMaterialsAllArray" :key="element"
                      :materialName="element.name" :parameterSettings="element.parameter" />
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
    const settingSplitterTab = ref(20);
    const settingsTab = ref('settingsGenerate');
    const settingsTabMaterials = ref('settingsMaterialsAll');
    const settings = [];
    const materials = [];

    const rowsMaterialsDefault = ref([
      {
        name: 'Авт выкл',
        count: 1,
      },
    ]);
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
    }
    onMounted(() => {
      axios
        .get(`${host}/services/genprice/Material`).then((responsMaterials) => {
          responsMaterials.data.forEach((element) => {
            materials.push(element);
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
                  name: 'материалы для контроллера основного',
                  parameter: 'CONTROLLER_MASTER_ID',
                },
                {
                  name: 'материалы для контроллера-модуля расширения',
                  parameter: 'CONTROLLER_SLAVE_ID',
                },
                {
                  name: 'доп. контакт для ВА-101',
                  parameter: 'AUTO_SWITCH_CONTACT_ID',
                },
                // ================================================
                {
                  name: 'двухрядная клемма',
                  parameter: 'TERMINAL_4_ID',
                },
                {
                  name: 'трансформатор АС',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'полиблок',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'ограничитель на дин рейку',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'фланцевый изолятор для клемм 1 рядных',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'фланцевый изолятор для клемм 2 рядных',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'врезная зеленая лампа',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'врезная жёлтая лампа',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'врезная красная лампа',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'врезной переключатель 3 пол.',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'врезной переключатель 2 пол.',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'кнопка КМУ',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'переключатель модульный',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'реле 2СО 24В',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'реле 4СО 220В',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'контактор 6А',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'авт. выкл. 1Ф 3А',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'авт. выкл. 1Ф 2А',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'реле перепада давления',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'датчик температуры канальный',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'датчик температуры накладной',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'датчик температуры в помещении',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'датчик влажности канальный',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'материалы для 1Ф силового реле',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: '1Ф регулятор скорости до 0,8 кВт',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: '1Ф регулятор скорости свыше 0,8 кВт (включительно)',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'радиатор для 3Ф твердотельного реле',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'предохранитель 0,5 А',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'клемма держатель для предохранителя',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'кросс-модуль 100А',
                  parameter: 'PZ_ZENTEC_ID',
                },
                {
                  name: 'кросс-модуль 125А',
                  parameter: 'PZ_ZENTEC_ID',
                },
              ].forEach((element) => {
                settingsMaterialsAllArray.value.push(element);
              });
            });
        });
    });

    return {
      syncData,
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
      getMaterialsFromSettings,
      getOptionsAllMaterials,
      getObject,
      options,
    };
  },
});
</script>
