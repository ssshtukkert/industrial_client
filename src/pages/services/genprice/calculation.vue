<template>
  <q-page class="text-white" padding style="background-color: rgb(60, 60, 60);">
    <q-card-section style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">
        Расчет {{ name }} от {{ updatedAt }}
        <a v-show="change"> *
          <q-tooltip :delay="800">
            * - означает что внесены изменения, для сохранения изменений необходимо "Записать" расчет в базу данных
          </q-tooltip>
        </a>
      </div>
      Номер расчёта: {{ id }}
    </q-card-section>
    <q-card-actions class="text-black">
      <q-btn color='dark-grey' icon="arrow_back" label='' @click="exit">
      </q-btn>
      <DialogConfirm ref="dex">
        <template v-slot:buttons>
          <q-btn color='red' label="Не сохранять и выйти" @click="confirmExit" />
          <q-btn color='green' label="Сохранить и выйти" @click="confirmExitAndSave" />
          <q-btn color='primary' label="Отмена" v-close-popup />
        </template>
      </DialogConfirm>
      <q-btn color='dark-grey' :disabled="!change" icon="save" label='' @click="writeDatabase">
      </q-btn>
      <q-btn color='dark-grey' v-show="change" icon="cancel" label='' @click="resetChange">
      </q-btn>
      <q-btn-dropdown color='dark-grey' icon="download" label="" :disable="change">
        <q-list>
          <q-item class="dark-grey text-white" clickable v-close-popup :href="downloadPDF" target="_self"
            style="background-color: rgb(60, 60, 60);">
            <q-item-section avatar>
              <q-avatar icon="picture_as_pdf" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Отчёт в PDF</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="dark-grey text-white" clickable v-close-popup :href="downloadEXCEL"
            style="background-color: rgb(60, 60, 60);">
            <q-item-section avatar>
              <q-avatar icon="download" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Спецификация в EXCEL</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-card-actions>
    <q-expansion-item class="q-pa-sm fit" dense expand-separator :header-style="{ backgroundColor: 'rgb(80, 80, 80)' }"
      expand-icon-class="text-white">
      <template v-slot:header>
        <div class="full-width text-h6">
          Себестоимость: {{ getDisplayCostAll() }}
          <q-tooltip :delay="800">
            Расчетная себестоимость:
            <br />
            стоимость материалов + % расходников + количество часов * стоимость 1ч. работы.
            <br />
            Пересчитывается автоматически
          </q-tooltip>
        </div>
      </template>
      <div class="row">
        <q-card-section class="text-h6 col-6">
          <div>
            Стоимость материалов: {{ cost }} руб.
            <q-tooltip :delay="800">
              Суммарная стоимость материалов во вкладке "Материалы"
            </q-tooltip>
          </div>
          <div class="row">
            Трудоёмкость: {{ inputLaboriousnes }} ч.
            <q-tooltip :delay="800">
              Суммарное количество трудозатрат во вкладке "Трудозатраты"
            </q-tooltip>
          </div>
          <div>
            Стоимость 1ч: {{ costOneHourWorker }} руб.
            <q-tooltip :delay="800">
              Стоимость работ электромонтажных и проверочных работ, выполненных за 1 час
            </q-tooltip>
          </div>
        </q-card-section>
        <q-card-section class="text-h6 col-6">
          <div>
            Габариты: {{ wh[0] }} х {{ wh[1] }} мм
            <q-tooltip :delay="800">
              Максимальный габарит во вкладке Материалы
            </q-tooltip>
          </div>
          <div>
            Вес: {{ weight }} кг.
            <q-tooltip :delay="800">
              Общий вес всех материалов
            </q-tooltip>
          </div>
        </q-card-section>
      </div>
    </q-expansion-item>
    <q-tabs v-model="tab" class="q-pa-sm text-grey" no-caps align="justify" active-color="white" indicator-color="white">
      <q-tab name="materials">
        <div class="text-h6">Материалы ({{ getMaterialsCount() }})</div>
        <q-tooltip :delay="800">
          Вкладка для формирования спецификации для расчета
        </q-tooltip>
      </q-tab>
      <q-tab name="card">
        <div class="text-h6">Карточка</div>
        <q-tooltip :delay="800">
          Основная информация о расчете
        </q-tooltip>
      </q-tab>
      <q-tab name="laboriousness">
        <div class="text-h6">Трудоёмкость</div>
        <q-tooltip :delay="800">
          Вкладка для формирования трудозатрат
        </q-tooltip>
      </q-tab>
      <!-- <q-tab name="files">
            <div class="text-h6">Файлы</div>
            <q-tooltip :delay="800">
              Хранилище загруженный файлов
            </q-tooltip>
          </q-tab> -->
    </q-tabs>
    <q-tab-panels v-model="tab" animated keep-alive @transition="updateTabPanels"
      style="background-color: rgb(60, 60, 60);">
      <q-tab-panel name="card" style="min-height: 400px">
        <div class="row">
          <q-input dark v-model="inputDescript" class=" fit" clearable outlined label="Описание" type="textarea"
            @update:model-value="syncTableMaterials" :input-style="{ resize: 'none', height: '50vh' }" />
        </div>
      </q-tab-panel>
      <q-tab-panel name="materials" style="min-height: 400px">
        <Table dense dark :setChange="changeCount" :keyEnter="keyEnter" ref="tableMaterials" :columnsDef="columns"
          :rowsDef="rowsEntryMaterials" :updateSelected="updateSelectedTableMaterials"
          style="max-height: 55vh; background-color: rgb(60, 60, 60);">
          <template v-slot:actions>
            <q-btn color='dark-grey' icon="add" label="Добавить" @click="actionAddMaterial" />
            <q-btn v-show="removeMain" color='dark-grey' icon="delete" label="Исключить" @click="actionRemoveMaterial" />
            <q-btn v-show="removeMain" color='dark-grey' icon="edit" label="Заменить" @click="actionReplaceMaterial" />
            <q-dialog v-model="dialogAddMaterials" persistent transition-show="scale" transition-hide="scale">
              <q-card style="min-width: 95vw; background-color: rgb(60, 60, 60);">
                <q-bar class="row text-white" style="background-color: rgb(80, 80, 80);">
                  <div class="text-h6">Добавить материалы для: {{ name }}</div>
                  <q-space />
                  <q-btn dense icon="close" v-close-popup @click="updateSearch" />
                </q-bar>
                <q-card-section class="text-h6 q-pt-none">
                  {{ text }}
                </q-card-section>
                <q-card-section>
                  <q-splitter v-model="splitterModel" style="height: 70vh">
                    <template v-slot:before>
                      <q-scroll-area visible :delay="0" style=" max-width: 100%; height: 100%;"
                        :vertical-thumb-style="{ right: '2px', borderRadius: '0px', background: 'grey', width: '15px', opacity: 1 }"
                        :horizontal-thumb-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', height: '15px', opacity: 1 }"
                        :vertical-bar-style="{ right: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, width: '15px' }"
                        :horizontal-bar-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, height: '15px' }">
                        <Table_v2 ref="tableAddMaterials" dense :columnsDef="columnsAddMaterials"
                          :rowsDef="rowsAllMaterials" style="height: 90vh;" :updateSelect="tableMaterialsUpdate"
                          :updateSearch="updateSearch" :actionRow="confirmAddMaterial" styleContent="max-height: 70vh;">
                          <template v-slot:actions>
                            <q-select outlined dense dark v-model="addMaterialsCategorySelector"
                              @update:model-value="addMaterialsCategoryUpdate" :options="addMaterialsCategorySelectorOp"
                              class="text-h6" options-selected-class="text-h6" popup-content-class="text-h6"
                              style="width: 220px; margin-left: 15px" />
                            <q-btn v-show="add" color='orange' label='В список' @click="confirmAddMaterial"
                              style="margin-left: 15px; margin-right: 15px;" />
                          </template>
                        </Table_v2>
                      </q-scroll-area>
                    </template>
                    <template v-slot:after>
                      <Table ref="tableAddMaterialsBuffer" dense dark :columnsDef="columnsAddMaterialsBuffer"
                        styleContent="max-height: 70vh; background-color: rgb(60, 60, 60);"
                        :rowsDef="rowsAddMaterialsBuffer" :hideShearch="true"
                        :updateSelected="updateSelectedTableMaterialsBuffer">
                        <template v-slot:actions>
                          <q-btn v-show="rowsAddMaterialsBuffer.length > 0" color='green' label='Обновить и закрыть'
                            @click="confirmAddEntryMaterial" style="margin-right: 15px;" />
                          <q-btn v-show="removeFromBuffer" color='red' label='Убрать' @click="actionRemoveBufferMaterial"
                            style="margin-right: 15px;" />
                        </template>
                      </Table>
                    </template>
                  </q-splitter>
                </q-card-section>
              </q-card>
            </q-dialog>
            <q-dialog v-model="dialogReplaceMaterials" persistent transition-show="scale" transition-hide="scale">
              <q-card style="min-width: 95vw; background-color: rgb(60, 60, 60);">
                <q-card-section class="row text-white" style="background-color: rgb(80, 80, 80);">
                  <div class="text-h6">Заменить материал</div>
                  <q-space />
                  <q-btn dense icon="close" v-close-popup @click="updateSearch" />
                </q-card-section>
                <q-card-section class="text-h6 q-pt-none">
                  {{ text }}
                </q-card-section>
                <Table_v2 ref="tableAddMaterials" dense :columnsDef="columnsAddMaterials" :rowsDef="rowsAllMaterials"
                  style="height: 90vh;" :updateSelect="tableMaterialsUpdate" :updateSearch="updateSearch"
                  :actionRow="confirmAddMaterial" selection="single" styleContent="max-height: 70vh;">
                  <template v-slot:actions>
                    <q-select outlined dense dark v-model="addMaterialsCategorySelector"
                      @update:model-value="addMaterialsCategoryUpdate" :options="addMaterialsCategorySelectorOp"
                      class="text-h6" options-selected-class="text-h6" popup-content-class="text-h6"
                      style="width: 220px; margin-left: 15px" />
                    <q-btn v-show="add" color='orange' label='Заменить' @click="confirmReplaceMaterial"
                      style="margin-left: 15px; margin-right: 15px;" />
                  </template>
                </Table_v2>
              </q-card>
            </q-dialog>
          </template>
        </Table>
        <DialogConfirm ref="dc">
          <template v-slot:buttons>
            <q-btn v-show="tableMaterials.selected[0].count > 1 || tableMaterials.selected.length > 1" color='red'
              label="Удалить все" @click="confirmDeleteAction(true)" />
            <q-btn v-show="tableMaterials.selected.length === 1" color='orange' label="Удалить"
              @click="confirmDeleteAction(false)" />
            <q-btn color='primary' label="Отмена" v-close-popup />
          </template>
        </DialogConfirm>
      </q-tab-panel>
      <q-tab-panel name="laboriousness" style="min-height: 600px">
        <q-input dark v-model="inputLaboriousnes" @update:model-value="syncTableMaterials" class="text-h6" outlined
          label="Трудозатраты" type="number" :rules="validationNumberNoZero" suffix="ч." style="width: 160px;"
          auto-save />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import {
  ref, defineComponent, inject, onMounted, watch,
} from 'vue';
import Table from 'src/components/tables/table_simple.vue';
import Table_v2 from 'src/components/tables/table_simple_v2.vue';
import DialogConfirm from 'src/components/dialogs/confirm.vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'GenPricePage',
  components: {
    Table,
    Table_v2,
    DialogConfirm,
  },
  setup() {
    const {
      host, getProp, getObject, validationNumberNoZero,
    } = inject('store');
    const path = `${host}/services/genprice/calculation/pdf/`;
    const pathExcel = `${host}/services/genprice/calculation/excel/`;
    const downloadPDF = ref(host);
    const downloadEXCEL = ref(host);
    const route = useRoute();
    const router = useRouter();
    const { id } = route.params;
    const tab = ref('materials');
    const tableMaterials = ref(null);
    const tableAddMaterials = ref(null);
    const tableAddMaterialsBuffer = ref(null);
    const inputDescript = ref(null);
    const inputLaboriousnes = ref(10);
    const change = ref(false);
    const add = ref(false);
    const addMaterialsCategorySelector = ref(null);
    const addMaterialsCategorySelectorOp = ref([]);
    const removeFromBuffer = ref(false);
    const removeBuffer = ref(false);
    const dc = ref(null);
    const dex = ref(null);
    const removeMain = ref(false);
    const dialogAddMaterials = ref(false);
    const dialogReplaceMaterials = ref(false);
    const cost = ref(0);
    const wh = ref([0, 0]);
    const weight = ref(0);
    const costAll = ref(0);
    const costOneHourWorker = ref(0);
    const percentOfMaterials = ref(0);
    const columns = [
      {
        name: 'name',
        required: true,
        label: 'Наименование',
        align: 'left',
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'count',
        align: 'center',
        label: 'Количество',
        field: 'count',
        sortable: true,
      },
      {
        name: 'cost',
        align: 'center',
        label: 'Цена за 1 ед., руб',
        field: 'cost',
        sortable: true,
      },
    ];
    const columnsAddMaterials = [{
      name: 'name',
      required: true,
      label: 'Материал',
      align: 'left',
      field: (row) => row.name,
      format: (val) => `${val}`,
      sortable: false,
    }];
    const columnsAddMaterialsBuffer = [
      {
        name: 'name',
        required: true,
        label: 'Наименование',
        align: 'left',
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'count',
        align: 'center',
        label: 'Количество',
        field: 'count',
        sortable: true,
      },
      {
        name: 'meas',
        align: 'center',
        label: 'Ед. изм',
        field: 'meas',
        sortable: true,
      },
    ];
    const allMaterials = [];
    const allMaterialCaterories = [];
    const allMaterialMeasures = [];
    const rowsEntryMaterials = ref([]);
    const rowsAllMaterials = ref([]);
    const rowsAddMaterialsBuffer = ref([]);
    function getPathList() {
      return '/services/genprice/calculations';
    }
    function getQueryAll() {
      return `${host}/services/genprice/Calculation`;
    }
    const name = ref('');
    const updatedAt = ref('');
    function getQueryUpdate() {
      return `${getQueryAll()}/update`;
    }
    function updateTabPanels(val) {
      console.log(val);
    }
    let object = null;
    const syncObject = ref(null);
    function getEntryMaterials() {
      const mat = [];
      for (let index = 0; index < rowsEntryMaterials.value.length; index += 1) {
        const element = rowsEntryMaterials.value[index];
        mat.push({
          id: Number(element.id),
          count: Number(element.count),
          meas: element.meas,
        });
      }
      return mat;
    }
    function getCost(listMaterials) {
      let sum = 0;
      for (let index = 0; index < listMaterials.length; index += 1) {
        const element = listMaterials[index];
        sum += Number(getProp(allMaterials, element.id, 'cost') || 0) * element.count;
      }
      return sum.toFixed(2);
    }
    function getWeight(listMaterials) {
      let sum = 0;
      for (let index = 0; index < listMaterials.length; index += 1) {
        const element = listMaterials[index];
        sum += Number(getProp(rowsAllMaterials.value, element.id, 'weight') || 0);
      }
      return sum.toFixed(2);
    }
    function getWidthHeight(listMaterials) {
      if (listMaterials.length > 0) {
        const sumWidth = [];
        const sumHeight = [];
        for (let index = 0; index < listMaterials.length; index += 1) {
          const element = listMaterials[index];
          sumWidth.push(Number(getProp(rowsAllMaterials.value, element.id, 'width') || 0));
          sumHeight.push(Number(getProp(rowsAllMaterials.value, element.id, 'height') || 0));
        }
        const maxWidth = Math.max.apply(null, sumWidth);
        const maxHeight = Math.max.apply(null, sumHeight);
        return [maxWidth, maxHeight];
      } return [0, 0];
    }
    function getCostAll(costMaterials, laboriousness) {
      let sum = 0;
      if (costMaterials > 0) {
        sum = costMaterials * (percentOfMaterials.value / 100 + 1) + laboriousness * costOneHourWorker.value;
      }
      return sum.toFixed(2);
    }
    function updateSelectedTableMaterials(newSelected) {
      removeMain.value = newSelected.length > 0;
    }
    function updateSelectedTableMaterialsBuffer(newSelected) {
      removeFromBuffer.value = newSelected.length > 0;
    }
    function syncTableMaterials() {
      object.descript = inputDescript.value;
      object.materials = getEntryMaterials();
      cost.value = getCost(object.materials);
      costAll.value = getCostAll(cost.value, inputLaboriousnes.value);
      object.cost = costAll.value;
      object.laboriousness = inputLaboriousnes.value;
      syncObject.value = JSON.stringify(object);
    }
    function changeCount(value) {
      tableMaterials.value.selected[0].count = value;
      syncTableMaterials();
    }
    function resetSelectTableAddMaterials() {
      if (tableAddMaterials.value) {
        tableAddMaterials.value.selected.length = 0;
      }
    }
    function update(callback) {
      // запрос метаданных из справочника материалов
      rowsAllMaterials.value.length = 0;
      allMaterials.length = 0;
      allMaterialCaterories.length = 0;
      addMaterialsCategorySelectorOp.value.length = 0;
      addMaterialsCategorySelectorOp.value.push('Все');
      const selectDefault = addMaterialsCategorySelectorOp.value[0];
      addMaterialsCategorySelector.value = selectDefault;
      axios
        .get(`${host}/services/genprice/MaterialMeasure`).then((responseME) => {
          allMaterialMeasures.length = 0;
          responseME.data.forEach((element) => {
            allMaterialMeasures.push(element);
          });
          axios
            .get(`${host}/services/genprice/MaterialCategory`).then((responseC) => {
              for (let index = 0; index < responseC.data.length; index += 1) {
                const m = responseC.data[index];
                allMaterialCaterories.push(m);
                addMaterialsCategorySelectorOp.value.push(m.name);
              }
              axios
                .get(`${host}/services/genprice/Material`).then((responseM) => {
                  for (let index = 0; index < responseM.data.length; index += 1) {
                    const m = responseM.data[index];
                    rowsAllMaterials.value.push(m);
                    allMaterials.push(m);
                  }
                  rowsEntryMaterials.value.length = 0;
                  axios.get(`${getQueryAll()}/${id}`)
                    .then((res) => {
                      if (res.data.result === 'ok') {
                        object = res.data.data;
                        name.value = object.name;
                        document.title = object.name;
                        updatedAt.value = object.updatedAt;
                        inputDescript.value = object.descript;
                        const materialsEntry = JSON.parse(object.materials);
                        for (let index = 0; index < materialsEntry.length; index += 1) {
                          const element = materialsEntry[index];
                          rowsEntryMaterials.value.push({
                            id: Number(element.id),
                            name: getProp(rowsAllMaterials.value, element.id, 'name'),
                            count: Number(element.count),
                            cost: Number(getProp(rowsAllMaterials.value, element.id, 'cost')),
                            meas: getProp(responseME.data, getProp(allMaterials, element.id, 'measure'), 'name'),
                            status: getProp(allMaterials, element.id, 'status'),
                          });
                        }
                        axios
                          .get(`${host}/services/genprice/Setting`).then((responseS) => {
                            costOneHourWorker.value = Number(getObject(responseS.data, 'name', 'costOneHourWorker').value);
                            percentOfMaterials.value = Number(getObject(responseS.data, 'name', 'percentOfMaterials').value);
                            inputLaboriousnes.value = object.operations;
                            cost.value = getCost(materialsEntry);
                            weight.value = getWeight(materialsEntry);
                            wh.value = getWidthHeight(materialsEntry);
                            costAll.value = getCostAll(cost.value, inputLaboriousnes.value);
                            if (callback) {
                              callback();
                            }
                            const query = {
                              name: encodeURIComponent(object.name),
                              wh: wh.value,
                              weight: weight.value,
                            };
                            downloadPDF.value = `${path}${object.id}/${JSON.stringify(query)}`;
                            downloadEXCEL.value = `${pathExcel}${object.id}/${JSON.stringify(query)}`;
                          });
                      }
                    });
                });
            });
        });
    }
    function resetChange() {
      update(
        () => {
          syncTableMaterials();
          change.value = false;
        },
      );
    }
    function writeDatabase() {
      const query = object;
      query.descript = inputDescript.value;
      query.cost = costAll.value;
      query.materials = JSON.stringify(getEntryMaterials());
      query.operations = inputLaboriousnes.value;
      axios.post(`${getQueryUpdate()}/${object.id}`, query).then((res) => {
        if (res.data.result === 'ok') {
          object = res.data.data;
          update();
          change.value = false;
        }
      });
    }
    function confirmExit() {
      router.push('/services/genprice/calculations');
    }
    function confirmExitAndSave() {
      writeDatabase();
      confirmExit();
    }
    function exit() {
      if (change.value) {
        dex.value.setName('Подтверждение');
        dex.value.setText('Данные не сохранены, покинуть страницу?');
        dex.value.show();
      } else {
        confirmExit();
      }
    }
    window.addEventListener('beforeunload', (e) => {
      if (change.value) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'handler.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(`key=${encodeURIComponent('Hi')}`);

        e.preventDefault();
        console.log(e);
        const confirmationMessage = '';
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      }
      return true;
    }, { passive: true });
    onMounted(() => {
      update();
    });
    function tableMaterialsUpdate(selected) {
      add.value = selected.length > 0;
    }
    function updateRowsAllMaterials() {
      resetSelectTableAddMaterials();
      rowsAllMaterials.value.length = 0;
      for (let index = 0; index < allMaterials.length; index += 1) {
        const element = allMaterials[index];
        if (getProp(allMaterialCaterories, element.category, 'name') === addMaterialsCategorySelector.value
          || addMaterialsCategorySelector.value === 'Все') {
          rowsAllMaterials.value.push(element);
        }
      }
      add.value = false;
    }
    function actionAddMaterial() {
      addMaterialsCategorySelector.value = 'Все';
      updateRowsAllMaterials();
      rowsAddMaterialsBuffer.value.length = 0;
      for (let index = 0; index < rowsEntryMaterials.value.length; index += 1) {
        const element = rowsEntryMaterials.value[index];
        rowsAddMaterialsBuffer.value.push(element);
      }
      dialogAddMaterials.value = true;
    }
    function actionReplaceMaterial() {
      const cat = getObject(allMaterials, 'id', tableMaterials.value.selected[0].id).category;
      updateRowsAllMaterials();
      rowsAllMaterials.value.length = 0;
      for (let index = 0; index < allMaterials.length; index += 1) {
        const element = allMaterials[index];
        if (element.category === cat) {
          rowsAllMaterials.value.push(element);
        }
      }
      dialogReplaceMaterials.value = true;
      addMaterialsCategorySelector.value = getObject(allMaterialCaterories, 'id', cat).name;
    }
    function addMaterialsCategoryUpdate() {
      updateRowsAllMaterials();
    }
    function actionRemoveMaterial() {
      const arr = tableMaterials.value.selected;
      let objectsNames = arr[0].name;
      for (let index = 1; index < arr.length; index += 1) {
        const element = arr[index];
        objectsNames += `, ${element.name}`;
      }
      dc.value.setName('Удаление');
      dc.value.setText(`Удалить "${objectsNames}"?`);
      dc.value.show();
    }
    function actionRemoveBufferMaterial() {
      for (let i = 0; i < tableAddMaterialsBuffer.value.selected.length; i += 1) {
        let ind = -1;
        for (let index = 0; index < rowsAddMaterialsBuffer.value.length; index += 1) {
          if (rowsAddMaterialsBuffer.value[index].id === tableAddMaterialsBuffer.value.selected[i].id) {
            ind = index;
            break;
          }
        }
        rowsAddMaterialsBuffer.value.splice(ind, 1);
      }
      tableAddMaterialsBuffer.value.selected.length = 0;
      updateSelectedTableMaterialsBuffer(tableAddMaterialsBuffer.value.selected);
    }
    function confirmAddMaterial() {
      for (let i = 0; i < tableAddMaterials.value.selected.length; i += 1) {
        let addMaterial = true;
        for (let index = 0; index < rowsAddMaterialsBuffer.value.length; index += 1) {
          const element = rowsAddMaterialsBuffer.value[index];
          if (element.id === tableAddMaterials.value.selected[i].id) {
            const sum = Number(element.count) + 1;
            element.count = sum;
            addMaterial = false;
          }
        }
        if (addMaterial) {
          const material = {
            id: tableAddMaterials.value.selected[i].id,
            name: tableAddMaterials.value.selected[i].name,
            count: 1,
            meas: getObject(allMaterialMeasures, 'id', getObject(allMaterials, 'id', tableAddMaterials.value.selected[i].id).measure).name,
          };
          rowsAddMaterialsBuffer.value.push(material);
        }
      }
    }
    function confirmReplaceMaterial() {
      let i = -1;
      let obj = null;
      const replaceObj = getObject(allMaterials, 'id', tableAddMaterials.value.selected[0].id);

      const isElementInEntryMaterials = getObject(rowsEntryMaterials.value, 'id', replaceObj.id);
      if (isElementInEntryMaterials == null) {
        for (let index = 0; index < rowsEntryMaterials.value.length; index += 1) {
          const element = rowsEntryMaterials.value[index];
          if (tableMaterials.value.selected[0].id === element.id) {
            i = index;
            obj = element;
            obj = {
              id: replaceObj.id,
              count: element.count,
              cost: replaceObj.cost,
              name: replaceObj.name,
              meas: getProp(allMaterialMeasures, getProp(allMaterials, element.id, 'measure'), 'name'),
            };
            break;
          }
        }
        if (i !== -1 && obj !== null) {
          rowsEntryMaterials.value.splice(i, 1);
          rowsEntryMaterials.value.push(obj);
        }
      } else {
        const objCurrent = getObject(rowsEntryMaterials.value, 'id', tableMaterials.value.selected[0].id);
        for (let index = 0; index < rowsEntryMaterials.value.length; index += 1) {
          const element = rowsEntryMaterials.value[index];
          if (tableMaterials.value.selected[0].id === element.id) {
            i = index;
          }
        }
        isElementInEntryMaterials.count += objCurrent.count;
        if (i !== -1) {
          rowsEntryMaterials.value.splice(i, 1);
        }
      }
      dialogReplaceMaterials.value = false;
      syncTableMaterials();
    }
    function confirmAddEntryMaterial() {
      rowsEntryMaterials.value.length = 0;
      for (let index = 0; index < rowsAddMaterialsBuffer.value.length; index += 1) {
        const element = rowsAddMaterialsBuffer.value[index];
        element.cost = Number(getProp(allMaterials, element.id, 'cost'));
        rowsEntryMaterials.value.push(element);
      }
      syncTableMaterials();
      dialogAddMaterials.value = false;
    }
    function confirmDeleteAction(all) {
      for (let ind = 0; ind < tableMaterials.value.selected.length; ind += 1) {
        const material = tableMaterials.value.selected[ind];
        let i = -1;
        for (let index = 0; index < rowsEntryMaterials.value.length; index += 1) {
          const element = rowsEntryMaterials.value[index];
          if (element.id === material.id) {
            if (all) {
              i = index;
            } else {
              const sum = Number(element.count) - 1;
              element.count = sum;
              if (element.count === 0) {
                i = index;
              }
            }
            break;
          }
        }
        if (i !== -1) {
          rowsEntryMaterials.value.splice(i, 1);
        }
      }
      tableMaterials.value.selected.length = 0;
      updateSelectedTableMaterials(tableMaterials.value.selected);
      dc.value.hide();
      syncTableMaterials();
    }
    function updateSearch() {
      resetSelectTableAddMaterials();
      tableMaterialsUpdate(tableAddMaterials.value.selected.length);
    }
    function getMaterialsCount() {
      let materialsCount = 0;
      const materialsSorted = getEntryMaterials();
      for (let index = 0; index < materialsSorted.length; index += 1) {
        const element = materialsSorted[index];
        materialsCount += Number(element.count);
      }
      return materialsCount;
    }
    function getDisplayCostAll() {
      return new Intl.NumberFormat('ru', { style: 'currency', currency: 'RUB' }).format(Number(costAll.value));
    }
    watch(syncObject, (newValue, oldValue) => {
      change.value = (newValue !== oldValue);
    }, { flush: 'sync' });
    return {
      id,
      addMaterialsCategoryUpdate,
      addMaterialsCategorySelector,
      addMaterialsCategorySelectorOp,
      actionRemoveBufferMaterial,
      removeBuffer,
      confirmExitAndSave,
      columnsAddMaterialsBuffer,
      confirmExit,
      exit,
      downloadPDF,
      downloadEXCEL,
      costOneHourWorker,
      percentOfMaterials,
      syncTableMaterials,
      dc,
      dex,
      removeMain,
      validationNumberNoZero,
      tableMaterialsUpdate,
      updateSearch,
      add,
      removeFromBuffer,
      columnsAddMaterials,
      actionAddMaterial,
      actionRemoveMaterial,
      actionReplaceMaterial,
      tableAddMaterials,
      changeCount,
      change,
      rowsEntryMaterials,
      rowsAllMaterials,
      rowsAddMaterialsBuffer,
      writeDatabase,
      inputDescript,
      inputLaboriousnes,
      getPathList,
      name,
      updatedAt,
      getQueryAll,
      getQueryUpdate,
      Table,
      Table_v2,
      DialogConfirm,
      tableMaterials,
      tableAddMaterialsBuffer,
      updateTabPanels,
      tab,
      columns,
      dialogAddMaterials,
      dialogReplaceMaterials,
      confirmAddMaterial,
      confirmAddEntryMaterial,
      confirmReplaceMaterial,
      confirmDeleteAction,
      updateSelectedTableMaterials,
      updateSelectedTableMaterialsBuffer,
      cost,
      weight,
      wh,
      costAll,
      getDisplayCostAll,
      update,
      resetChange,
      splitterModel: ref(50),
      getMaterialsCount,
    };
  },
});
</script>
