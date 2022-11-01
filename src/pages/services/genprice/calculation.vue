<template>
  <q-page padding>
    <q-card class="bg-white">
      <q-card-section class="bg-secondary">
        <q-btn color='orange' label='< Назад к списку' style="margin-right: 15px;" @click="exit">
          <q-tooltip>
            Вернуться к списку расчетов
          </q-tooltip>
        </q-btn>
        <DialogConfirm ref="dex">
          <template v-slot:buttons>
            <q-btn color='red' label="Не сохранять и выйти" @click="confirmExit" />
            <q-btn color='green' label="Сохранить и выйти" @click="confirmExitAndSave" />
            <q-btn color='primary' label="Отмена" v-close-popup />
          </template>
        </DialogConfirm>
        <q-btn color='primary' :disabled="!change" label='Записать' @click="writeDatabase" style="margin-right: 15px;">
          <q-tooltip>
            Сохранить расчет в базе данных
          </q-tooltip>
        </q-btn>
        <q-btn color='primary' v-show="change" label='Отменить изменения' @click="resetChange"
          style="margin-right: 15px;">
          <q-tooltip v-if="change">
            Обновить содержимое
          </q-tooltip>
        </q-btn>
        <q-btn color='primary' :disable="change" label='Экспорт в PDF' :href="downloadPDF" target="_self"
          style="margin-right: 15px;">
          <q-tooltip>
            Скачать данные в pdf файле
          </q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section class="text-black">
        <div class="text-h6">
          Расчет {{ name }} от {{ updatedAt }}
          <a v-show="change"> *
            <q-tooltip>
              * - означает что внесены изменения, для сохранения изменений необходимо "Записать" расчет в базу данных
            </q-tooltip>
          </a>
        </div>
      </q-card-section>
      <div class="row">
        <q-card-section class="text-h6 col-6">
          <div>
            Стоимость материалов: {{ cost }} руб.
            <q-tooltip>
              Суммарная стоимость материалов во вкладке "Материалы"
            </q-tooltip>
          </div>
          <div class="row">
            Трудоёмкость: {{ inputLaboriousnes }} ч.
            <q-tooltip>
              Суммарное количество трудозатрат во вкладке "Трудозатраты"
            </q-tooltip>
          </div>
          <div>
            Стоимость 1ч: {{ costOneHourWorker }} руб.
            <q-tooltip>
              Стоимость работ электромонтажных и проверочных работ, выполненных за 1 час
            </q-tooltip>
          </div>
          <q-badge color="primary" class="text-h6">
            Себестоимость: {{ costAll }} руб.
            <q-tooltip>
              Расчетная себестоимость:
              <br />
              стоимость материалов + % расходников + количество часов * стоимость 1ч. работы.
              <br />
              Пересчитывается автоматически
            </q-tooltip>
          </q-badge>
        </q-card-section>
        <q-card-section class="text-h6 col-6">
          <div>
            Габариты: {{ wh[0] }} х {{ wh[1] }} мм
            <q-tooltip>
              Максимальный габарит во вкладке Материалы
            </q-tooltip>
          </div>
          <div>
            Вес: {{ weight }} кг.
            <q-tooltip>
              Общий вес всех материалов
            </q-tooltip>
          </div>
        </q-card-section>
      </div>
      <div class="bg-white text-h6">
        <q-tabs v-model="tab" class="text-black" no-caps align="justify" active-color="teal" indicator-color="teal">
          <q-tab name="card">
            <div class="text-h6">Карточка</div>
            <q-tooltip>
              Основная информация о расчете
            </q-tooltip>
          </q-tab>
          <q-tab name="materials">
            <div class="text-h6">Материалы ({{ getMaterialsCount() }})</div>
            <q-tooltip>
              Вкладка для формирования спецификации для расчета
            </q-tooltip>
          </q-tab>
          <q-tab name="laboriousness">
            <div class="text-h6">Трудоёмкость</div>
            <q-tooltip>
              Вкладка для формирования трудозатрат
            </q-tooltip>
          </q-tab>
          <q-tab name="files">
            <div class="text-h6">Файлы</div>
            <q-tooltip>
              Хранилище загруженный файлов
            </q-tooltip>
          </q-tab>
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated keep-alive @transition="updateTabPanels">
          <q-tab-panel name="card" style="min-height: 400px">
            <div class="row">
              <q-input v-model="inputDescript" class="text-h6 fit" clearable outlined label="Описание" type="textarea"
                @update:model-value="syncTableMaterials" :input-style="{resize: 'none', height: '50vh' }" />
            </div>
          </q-tab-panel>
          <q-tab-panel name="materials" style="min-height: 400px">
            <Table :setChange="changeCount" :keyEnter="keyEnter" ref="tableMaterials" :columnsDef="columns" :rowsDef="rowsEntryMaterials"
              :updateSelected="updateSelectedTableMaterials">
              <template v-slot:actions>
                <q-btn color='primary' label='Добавить' @click="actionAddMaterial" />
                <q-btn v-show="removeMain" color='primary' label='Удалить' @click="actionRemoveMaterial" />
                <q-dialog v-model="dialogAddMaterials" persistent transition-show="scale" transition-hide="scale">
                  <q-card style="min-width: 95vw;">
                    <q-card-section class="row bg-teal text-white">
                      <div class="text-h6">Добавить материалы</div>
                      <q-space />
                      <q-btn color='primary' label="Закрыть" v-close-popup @click="updateSearch" />
                    </q-card-section>
                    <q-card-section class="bg-white text-h6 q-pt-none">
                      {{ text }}
                    </q-card-section>
                    <q-card-section>
                      <q-splitter v-model="splitterModel" style="height: 70vh">
                        <template v-slot:before>
                          <Table_v2 ref="tableAddMaterials" :columnsDef="columnsAddMaterials"
                            :rowsDef="rowsAllMaterials" style="height: 90vh;" :updateSelect="tableMaterialsUpdate"
                            :updateSearch="updateSearch" :actionRow="confirmAddMaterial"
                            styleContent="max-height: 70vh;">
                            <template v-slot:actions>
                              <q-select outlined dense v-model="addMaterialsCategorySelector"
                                @update:model-value="addMaterialsCategoryUpdate"
                                :options="addMaterialsCategorySelectorOp" class="text-h6"
                                options-selected-class="text-h6" popup-content-class="text-h6"
                                style="width: 220px; margin-left: 15px" />
                              <q-btn v-show="add" color='orange' label='В список' @click="confirmAddMaterial"
                                style="margin-left: 15px; margin-right: 15px;" />
                            </template>
                          </Table_v2>
                        </template>
                        <template v-slot:after>
                          <Table ref="tableAddMaterialsBuffer" :columnsDef="columnsAddMaterialsBuffer"
                            styleContent="max-height: 70vh;" :rowsDef="rowsAddMaterialsBuffer" :hideShearch="true"
                            :updateSelected="updateSelectedTableMaterialsBuffer">
                            <template v-slot:actions>
                              <q-btn v-show="rowsAddMaterialsBuffer.length > 0" color='green' label='Обновить и закрыть'
                                @click="confirmAddEntryMaterial" style="margin-right: 15px;" />
                              <q-btn v-show="removeFromBuffer" color='red' label='Убрать'
                                @click="actionRemoveBufferMaterial" style="margin-right: 15px;" />
                            </template>
                          </Table>
                        </template>
                      </q-splitter>
                    </q-card-section>
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
            <q-input v-model="inputLaboriousnes" @update:model-value="syncTableMaterials" class="text-h6" outlined
              label="Трудозатраты" type="number" :rules="validationNumberNoZero" suffix="ч." style="width: 160px;"
              auto-save />
          </q-tab-panel>
          <q-tab-panel name="files" style="min-height: 400px">
            <div class="q-pa-md">
              <q-uploader url="http://10.154.152.88:3001/upload/disk"
                :headers="[{name: 'X-Custom-Timestamp', value: 1550240306080}]" style="max-width: 300px" />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>
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
    const { host, getProp, validationNumberNoZero } = inject('store');
    const path = `${host}/services/genprice/calculation/pdf/`;
    const downloadPDF = ref(host);
    const route = useRoute();
    const router = useRouter();
    const { id } = route.params;
    const tab = ref('card');
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
        align: 'left',
        label: 'Количество',
        field: 'count',
        sortable: true,
      },
      {
        name: 'cost',
        align: 'left',
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
        align: 'left',
        label: 'Количество',
        field: 'count',
        sortable: true,
      },
    ];
    const allMaterials = [];
    const allMaterialCaterories = [];
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
        });
      }
      return mat;
    }
    function getCost(listMaterials) {
      let sum = 0;
      for (let index = 0; index < listMaterials.length; index += 1) {
        const element = listMaterials[index];
        sum += Number(getProp(rowsAllMaterials.value, element.id, 'cost') || 0) * element.count;
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
      tableAddMaterials.value.selected.length = 0;
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
                      });
                    }
                    axios
                      .get(`${host}/services/genprice/Setting`).then((responseS) => {
                        costOneHourWorker.value = responseS.data[0].value;
                        percentOfMaterials.value = responseS.data[1].value;
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
                      });
                  }
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
    }, false);
    onMounted(() => {
      update();
    });
    function tableMaterialsUpdate(selected) {
      add.value = selected.length > 0;
    }
    function updateRowsAllMaterials() {
      rowsAllMaterials.value.length = 0;
      for (let index = 0; index < allMaterials.length; index += 1) {
        const element = allMaterials[index];
        if (getProp(allMaterialCaterories, element.category, 'name') === addMaterialsCategorySelector.value
          || addMaterialsCategorySelector.value === 'Все') {
          rowsAllMaterials.value.push(element);
        }
      }
    }
    function actionAddMaterial() {
      updateRowsAllMaterials();
      rowsAddMaterialsBuffer.value.length = 0;
      for (let index = 0; index < rowsEntryMaterials.value.length; index += 1) {
        const element = rowsEntryMaterials.value[index];
        rowsAddMaterialsBuffer.value.push(element);
      }
      dialogAddMaterials.value = true;
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
          };
          rowsAddMaterialsBuffer.value.push(material);
        }
      }
    }
    function confirmAddEntryMaterial() {
      rowsEntryMaterials.value.length = 0;
      for (let index = 0; index < rowsAddMaterialsBuffer.value.length; index += 1) {
        const element = rowsAddMaterialsBuffer.value[index];
        element.cost = Number(getProp(rowsAllMaterials.value, element.id, 'cost'));
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
    watch(syncObject, (newValue, oldValue) => {
      change.value = (newValue !== oldValue);
    }, { flush: 'sync' });
    return {
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
      confirmAddMaterial,
      confirmAddEntryMaterial,
      confirmDeleteAction,
      updateSelectedTableMaterials,
      updateSelectedTableMaterialsBuffer,
      cost,
      weight,
      wh,
      costAll,
      update,
      resetChange,
      splitterModel: ref(50),
      getMaterialsCount,
    };
  },
});
</script>
