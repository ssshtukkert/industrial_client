<template>
  <q-page padding>
    <q-card class="bg-white">
      <q-card-section class="bg-secondary">
        <q-btn color='orange' label='< Назад к списку' :to="getPathList()" style="margin-right: 15px;">
          <q-tooltip>
            Вернуться к списку расчетов
          </q-tooltip>
        </q-btn>
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
        <q-btn color='primary' :disable="change"  label='Экспорт в PDF' :href="downloadPDF" target="_self"
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
      <q-card-section class="text-h6">
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
      <div class="bg-white text-h6">
        <q-tabs v-model="tab" class="text-black" no-caps align="justify" active-color="teal" indicator-color="teal">
          <q-tab name="card">
            <div class="text-h6">Карточка</div>
            <q-tooltip>
              Основная информация о расчете
            </q-tooltip>
          </q-tab>
          <q-tab name="materials">
            <div class="text-h6">Материалы</div>
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
            <Table :setChange="changeCount" ref="tableMaterials" :columnsDef="columns" :rowsDef="rowsEntryMaterials"
              :updateSelected="updateSelectedTableMaterials">
              <template v-slot:actions>
                <q-btn color='primary' label='Добавить' @click="actionAddMaterial" />
                <q-btn v-show="removeMain" color='primary' label='Удалить' @click="actionRemoveMaterial" />
                <q-dialog v-model="dialogAddMaterials" persistent transition-show="scale" transition-hide="scale">
                  <q-card style="min-width: 95vw;">
                    <q-card-section class="bg-teal text-white">
                      <div class="text-h6">Добавить материалы</div>
                    </q-card-section>
                    <q-card-section class="bg-white text-h6 q-pt-none">
                      {{ text }}
                    </q-card-section>
                    <q-card-section>
                      <Table_v2 ref="tableAddMaterials" :columnsDef="columnsAddMaterials" :rowsDef="rowsAllMaterials"
                        style="min-height: 90vh;" :updateSelect="tableMaterialsUpdate"
                        :updateSearch="updateSearch">
                        <template v-slot:actions>
                          <q-input v-show="add" v-model="inputCount" class="text-h6" outlined label="Количество"
                            type="number" :rules="validationNumberNoZero"
                            style="padding-left: 15px; padding-right: 15px; width: 160px;" />
                          <q-btn v-show="add && inputCount>0" color='orange' label='Добавить'
                            @click="confirmAddMaterial" />
                          <q-space />
                          <q-btn color='primary' label="Закрыть" v-close-popup @click="updateSearch" />
                        </template>
                      </Table_v2>
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
import { useRoute } from 'vue-router';
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
    const { id } = route.params;
    const tab = ref('card');
    const tableMaterials = ref(null);
    const tableAddMaterials = ref(null);
    const inputDescript = ref(null);
    const inputCount = ref(1);
    const inputLaboriousnes = ref(10);
    const change = ref(false);
    const add = ref(false);
    const dc = ref(null);
    const removeMain = ref(false);
    const dialogAddMaterials = ref(false);
    const cost = ref(0);
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
    const rowsEntryMaterials = ref([]);
    const rowsAllMaterials = ref([]);
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
    function getCostAll(costMaterials, laboriousness) {
      let sum = 0;
      sum = costMaterials * (percentOfMaterials.value / 100 + 1) + laboriousness * costOneHourWorker.value;
      return sum.toFixed(2);
    }
    function updateSelectedTableMaterials(newSelected) {
      removeMain.value = newSelected.length > 0;
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
      inputCount.value = 1;
    }
    function update(callback) {
      // запрос метаданных из справочника материалов
      rowsAllMaterials.value.length = 0;
      axios
        .get(`${host}/services/genprice/Material`).then((responseM) => {
          for (let index = 0; index < responseM.data.length; index += 1) {
            const m = responseM.data[index];
            rowsAllMaterials.value.push(m);
          }
          rowsEntryMaterials.value.length = 0;
          axios.get(`${getQueryAll()}/${id}`)
            .then((res) => {
              if (res.data.result === 'ok') {
                object = res.data.data;
                name.value = object.name;
                updatedAt.value = object.updatedAt;
                inputDescript.value = object.descript;
                const materialsEntry = JSON.parse(object.materials);
                for (let index = 0; index < materialsEntry.length; index += 1) {
                  const element = materialsEntry[index];
                  rowsEntryMaterials.value.push({
                    id: Number(element.id),
                    name: getProp(rowsAllMaterials.value, element.id, 'name'),
                    count: Number(element.count),
                  });
                }
                axios
                  .get(`${host}/services/genprice/Setting`).then((responseS) => {
                    costOneHourWorker.value = responseS.data[0].value;
                    percentOfMaterials.value = responseS.data[1].value;
                    inputLaboriousnes.value = object.operations;
                    cost.value = getCost(materialsEntry);
                    costAll.value = getCostAll(cost.value, inputLaboriousnes.value);
                    if (callback) {
                      callback();
                    }
                    downloadPDF.value = `${path}${object.id}`;
                  });
              }
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
    onMounted(() => {
      update();
    });
    function tableMaterialsUpdate(selected) {
      add.value = selected.length > 0;
    }
    function actionAddMaterial() {
      dialogAddMaterials.value = true;
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
    function confirmAddMaterial() {
      let addMaterial = true;
      for (let index = 0; index < rowsEntryMaterials.value.length; index += 1) {
        const element = rowsEntryMaterials.value[index];
        if (element.id === tableAddMaterials.value.selected[0].id) {
          const sum = Number(element.count) + Number(inputCount.value);
          element.count = sum;
          addMaterial = false;
        }
      }
      if (addMaterial) {
        const material = {
          id: tableAddMaterials.value.selected[0].id,
          name: tableAddMaterials.value.selected[0].name,
          count: inputCount.value,
        };
        rowsEntryMaterials.value.push(material);
      }
      syncTableMaterials();
      resetSelectTableAddMaterials();
      tableMaterialsUpdate(tableAddMaterials.value.selected);
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
    watch(syncObject, (newValue, oldValue) => {
      change.value = (newValue !== oldValue);
    }, { flush: 'sync' });
    return {
      downloadPDF,
      costOneHourWorker,
      percentOfMaterials,
      syncTableMaterials,
      dc,
      removeMain,
      validationNumberNoZero,
      tableMaterialsUpdate,
      updateSearch,
      add,
      columnsAddMaterials,
      actionAddMaterial,
      actionRemoveMaterial,
      tableAddMaterials,
      changeCount,
      change,
      rowsEntryMaterials,
      rowsAllMaterials,
      writeDatabase,
      inputDescript,
      inputCount,
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
      updateTabPanels,
      tab,
      columns,
      dialogAddMaterials,
      confirmAddMaterial,
      confirmDeleteAction,
      updateSelectedTableMaterials,
      cost,
      costAll,
      update,
      resetChange,
    };
  },
});
</script>
