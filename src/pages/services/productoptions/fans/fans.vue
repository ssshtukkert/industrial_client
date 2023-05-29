<template>
  <q-page class="justify-center" style="background-color: rgb(60, 60, 60);">
    <q-card style="background-color: rgb(60, 60, 60);">
      <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
        <div class="text-h6">Вентиляторы</div>
      </q-card-section>
      <q-table class="my-sticky-header-table" dark dense :rows="rows" :columns="columns" row-key="id" virtual-scroll
        :filter="filter" :filter-method="find" :hide-selected-banner="true" selection="multiple"
        v-model:selected="selected" binary-state-sort v-model:pagination="pagination" :rows-per-page-options="[1]"
        style="background-color: rgb(60, 60, 60);" :no-results-label="`По запросу '${filter}' ничего не найдено`"
        grid-header @row-click="selectRow">
        <template v-slot:top>
          <q-card-actions class="fit" style="background-color: rgb(60, 60, 60);">
            <!-- <q-btn color='dark-grey' icon="add" label='Создать' @click="createAction" /> -->
            <!-- <q-btn color='dark-grey' icon='edit' label='Изменить' v-show="selected.length === 1"
              @click="changeAction(selected)" /> -->
            <!-- <q-btn color='dark-grey' icon="delete" label='Удалить' v-show="selected.length > 0"
              @click="deleteAction(selected)" disable /> -->
            <q-space />
            <q-select dark outlined dense v-model="filterOptions" :options="op" class="text-h6"
              options-selected-class="text-h6 text-grey" popup-content-class="text-h6"
              style="width: 220px; margin-right: 10px" />
            <q-input dark class="text-h6" outlined dense debounce="300" color="primary" v-model="filter" clearable
              placeholder="Поиск">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-card-actions>
        </template>
        <template v-slot:pagination>
          <div class="text-h6" style="background-color: rgb(60, 60, 60);">
            {{ getSelectedString() }}
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
        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <q-badge color="grey-8">
              <div class="text-h6">{{ props.row.type }}</div>
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-voltage="props">
          <q-td :props="props">
            <q-badge color="grey-8">
              <div class="text-h6">{{ props.row.voltage }}</div>
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </q-card>
    <q-dialog v-model="dialog" persistent>
      <q-card class="text-white q-pt-none" style="width: 900px; max-width: 95vw; background-color: rgb(60, 60, 60);">
        <q-card-section style="background-color: rgb(80, 80, 80);">
          <div class="text-h6">{{ dialogName }}</div>
        </q-card-section>
        <q-card-section class="text-white" style="background-color: rgb(60, 60, 60);">
          <q-card-section class="row">
            <q-input dark class="fit text-h6" v-model="inputName" clearable outlined label="Наименование" lazy-rules
              :rules="validationName" />
          </q-card-section>
          <q-card-section class="row" style="padding: 0px;">
            <q-card-section class="col-3">
              <q-input dark class="text-h6" v-model.number="inputCost" type="number" label="Цена" suffix="руб." outlined
                lazy-rules :rules="createInputRealValueRules" />
            </q-card-section>
            <q-card-section class="col-3">
              <q-input dark class="text-h6" v-model.number="inputWeight" type="number" label="Вес" suffix="кг." outlined
                lazy-rules :rules="createInputRealValueRules" />
            </q-card-section>
            <q-card-section class="col-3">
              <q-input dark class="text-h6" v-model.number="inputWidth" type="number" label="Ширина" suffix="мм." outlined
                lazy-rules :rules="createInputRealValueRules" />
            </q-card-section>
            <q-card-section class="col-3">
              <q-input dark class="text-h6" v-model.number="inputHeight" type="number" label="Высота" suffix="мм."
                outlined lazy-rules :rules="createInputRealValueRules" />
            </q-card-section>
          </q-card-section>
          <q-card-section class="row" style="padding: 0px;">
            <q-card-section class="col-3">
              <q-select dark class="text-h6" label="Категория" options-selected-class="text-h6 text-grey"
                popup-content-class="text-h6" outlined v-model="categoryOptions" :options="categoryOp" />
            </q-card-section>
            <q-card-section class="col-3">
              <q-select dark class="text-h6" label="Ед. измерения" options-selected-class="text-h6 text-grey"
                popup-content-class="text-h6" outlined v-model="measureOptions" :options="measureOp" />
            </q-card-section>
            <q-card-section class="col-3">
              <q-input dark class="fit text-h6" v-model="inputArticle" clearable outlined label="Артикул" />
            </q-card-section>
            <q-card-section class="col-3">
              <q-select dark class="text-h6" label="Статус" options-selected-class="text-h6 text-grey"
                popup-content-class="text-h6" outlined v-model="status" :options="statusOp" />
            </q-card-section>
          </q-card-section>
          <q-card-section class="row">
            <q-input dark class="text-h8 fit" v-model="inputDescript" outlined label="Описание" type="textarea" />
          </q-card-section>
        </q-card-section>
        <q-card-actions align="right" class="text-black" style="background-color: rgb(60, 60, 60);">
          <q-btn v-show="action === 0" color="dark-grey" class="text-white" label="Создать" @click="createConfirmAction"
            :disabled="isValidationConfirm()" />
          <q-btn v-show="action === 1" color="dark-grey" class="text-white" label="Изменить" @click="changeConfirmAction"
            :disabled="isValidationConfirm()" />
          <q-btn class="text-white" color="dark-grey" label="Отмена" v-close-popup @click="cancelConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <DialogError ref="de" />
    <DialogConfirm ref="dc">
      <template v-slot:buttons>
        <q-btn color='dark-grey' label="Да" @click="deleteConfirmAction" />
        <q-btn color='dark-grey' label="Отмена" v-close-popup />
      </template>
    </DialogConfirm>
  </q-page>
</template>

<script>
import {
  onMounted, ref, defineComponent, inject,
} from 'vue';
import axios from 'axios';
import DialogError from 'src/components/dialogs/error.vue';
import DialogConfirm from 'src/components/dialogs/confirm.vue';

export default defineComponent({
  name: 'FansPage',
  components: {
    DialogError,
    DialogConfirm,
  },
  setup() {
    document.title = 'Вентиляторы';
    const {
      host, getProp, getId, validationName, getStatusData,
    } = inject('store');
    const de = ref(null);
    const dc = ref(null);
    const dialog = ref(false);
    const dialogName = ref('');
    const nameDefault = 'Новый вентилятор';
    const inputName = ref(nameDefault);
    const inputArticle = ref('');
    const inputDescript = ref('');
    const inputCost = ref(0);
    const inputWeight = ref(0);
    const inputWidth = ref(0);
    const inputHeight = ref(0);
    const categories = [];
    const categoryOp = ref([]);
    const measures = [];
    const measureOp = ref([]);

    const statusOp = ref(getStatusData());
    const status = ref(statusOp.value[0]);
    const categoryOptions = ref('');
    const measureOptions = ref('');
    const selected = ref([]);
    const action = ref(0);
    const columns = [
      {
        name: 'power',
        required: true,
        label: 'Мощность, кВт',
        align: 'left',
        field: (row) => row.power,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'voltage',
        align: 'left',
        label: 'Напряжение, В',
        field: 'voltage',
        sortable: true,
      },
      {
        name: 'type',
        align: 'left',
        label: 'Тип',
        field: 'type',
        sortable: true,
      },
      {
        name: 'currentMin',
        align: 'left',
        label: 'Мин.ток, А',
        field: 'currentMin',
        sortable: true,
      },
      {
        name: 'currentMax',
        align: 'left',
        label: 'Макс.ток, А',
        field: 'currentMax',
        sortable: true,
      },
    ];
    function resetSelect() {
      selected.value.length = 0;
    }
    function getQueryAll() {
      return `${host}/services/productoptions/Fan`;
    }
    function getQueryDelete() {
      return `${getQueryAll()}/delete`;
    }
    function getQueryCreate() {
      return `${getQueryAll()}/create`;
    }
    function getQueryUpdate() {
      return `${getQueryAll()}/update`;
    }
    function isValidationConfirm() {
      return !inputName.value || inputCost.value < 0 || inputWeight.value < 0 || inputWidth.value < 0
        || inputHeight.value < 0;
    }
    function createAction() {
      dialog.value = true;
      dialogName.value = 'Создание нового материала';
      const n = categoryOp.value[0];
      categoryOptions.value = n;
      const m = measureOp.value[0];
      measureOptions.value = m;
      inputName.value = nameDefault;
      inputDescript.value = '';
      inputCost.value = 0;
      inputWeight.value = 0;
      inputWidth.value = 0;
      inputHeight.value = 0;
      inputArticle.value = '';
      action.value = 0;
    }
    function deleteAction(select) {
      let objectsNames = select[0].name;
      for (let index = 1; index < select.length; index += 1) {
        const element = select[index];
        objectsNames += `, ${element.name}`;
      }
      if (select.length > 1) {
        dc.value.setName('Удаление материалов');
      } else {
        dc.value.setName('Удаление материала');
      }
      dc.value.setText(`Удалить "${objectsNames}"?`);
      dc.value.show();
    }
    function changeAction(select) {
      dialog.value = true;
      dialogName.value = 'Изменение материала';
      const object = select[0];
      inputName.value = object.name;
      inputDescript.value = object.descript;
      inputCost.value = object.cost;
      inputWeight.value = object.weight;
      inputWidth.value = object.width;
      inputHeight.value = object.height;
      inputArticle.value = object.article;
      status.value = getProp(statusOp.value, object.status, 'label');
      categoryOptions.value = getProp(categoryOptions, object.category, 'name');
      measureOptions.value = getProp(measureOptions, object.measure, 'name');
      action.value = 1;
    }
    const rows = ref([]);
    function update() {
      axios
        .get(`${host}/services/productoptions/Fan`).then((responseM) => {
          for (let index = 0; index < responseM.data.length; index += 1) {
            const m = responseM.data[index];
            rows.value.push({
              id: m.id,
              power: m.power,
              voltage: m.voltage,
              type: (m.type === 0) ? 'Асинхронный' : 'EC',
              currentMin: m.currentMin,
              currentMax: m.currentMax,
            });
          }
          resetSelect();
        });
    }
    function createConfirmAction() {
      const query = {};
      query.name = inputName.value;
      query.article = inputArticle.value;
      query.cost = inputCost.value;
      query.weight = inputWeight.value;
      query.measure = getId(measures, 'name', measureOptions.value);
      query.status = 0;
      query.width = inputWidth.value;
      query.height = inputHeight.value;
      query.category = getId(categories, 'name', categoryOptions.value);
      query.descript = inputDescript.value;
      query.depth = 0;
      query.current_catalog_nom_inductive = 0;
      query.current_catalog_nom_resistive = 0;
      query.current_nom_inductive = 0;
      query.current_nom_resistive = 0;
      query.voltage = 0;
      query.article_server = 0;
      query.time_mount = 0;
      query.time_metalwork = 0;
      query.time_commutation = 0;
      query.time_pack = 0;
      query.time_run_up = 0;
      axios.post(getQueryCreate(), query)
        .then((res) => {
          if (res.data.result === 'ok') {
            update();
            dialog.value = false;
          } else if (res.data.data === 'name must be unique') {
            de.value.setName('Ошибка');
            de.value.setText(`Наименование "${query.name}" уже существует в базе данных`);
            de.value.show();
          }
        });
    }
    function changeConfirmAction() {
      const query = {};
      query.name = inputName.value;
      query.article = inputArticle.value;
      query.cost = inputCost.value;
      query.weight = inputWeight.value;
      query.measure = getId(measures, 'name', measureOptions.value);
      query.width = inputWidth.value;
      query.height = inputHeight.value;
      query.category = getId(categories, 'name', categoryOptions.value);
      query.descript = inputDescript.value;
      query.status = status.value.id;
      query.depth = 0;
      query.current_catalog_nom_inductive = 0;
      query.current_catalog_nom_resistive = 0;
      query.current_nom_inductive = 0;
      query.current_nom_resistive = 0;
      query.voltage = 0;
      query.article_server = 0;
      query.time_mount = 0;
      query.time_metalwork = 0;
      query.time_commutation = 0;
      query.time_pack = 0;
      query.time_run_up = 0;
      axios
        .post(`${getQueryUpdate()}/${selected.value[0].id}`, query)
        .then((res) => {
          if (res.data.result === 'ok') {
            update();
            dialog.value = false;
            resetSelect();
          } else if (res.data.data === 'name must be unique') {
            de.value.setName('Ошибка');
            de.value.setText(`Наименование "${query.name}" уже существует в базе данных`);
            de.value.show();
          }
        });
    }
    function deleteConfirmAction() {
      for (let index = 0; index < selected.value.length; index += 1) {
        const element = selected.value[index];
        axios.get(`${getQueryDelete()}/${element.id}`)
          .then((res) => {
            if (res.data.result === 'ok') {
              update();
              dc.value.hide();
            }
          });
      }
    }
    const op = [];
    for (let index = 0; index < columns.length; index += 1) {
      op.push(columns[index].label);
    }
    const filter = ref('');
    const filterOptions = ref(columns[0].label);
    function selectRow(event, row) {
      selected.value.length = 0;
      selected.value.push(row);
    }
    function getIndexColumnOfSelected(value) {
      let index = -1;
      columns.forEach((element) => {
        if (element.label === value) {
          index = columns.indexOf(element);
        }
      });
      return index;
    }
    function find(rows_, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : '';
      return rows_.filter((row) => [cols[getIndexColumnOfSelected(filterOptions.value)]].some(
        (col) => ((`${cellValue(col, row)}`).toLowerCase().indexOf(lowerTerms) !== -1),
      ));
    }
    onMounted(() => {
      update();
    });
    return {
      action,
      isValidationConfirm,
      de,
      dc,
      categoryOp,
      measureOp,
      categoryOptions,
      measureOptions,
      DialogError,
      DialogConfirm,
      dialog,
      dialogName,
      createAction,
      changeAction,
      deleteAction,
      inputName,
      inputArticle,
      validationName,
      createInputRealValueRules: [
        (val) => (val >= 0) || 'Введите корректное значение',
      ],
      inputDescript,
      inputCost,
      inputWeight,
      inputWidth,
      inputHeight,
      createConfirmAction,
      deleteConfirmAction,
      changeConfirmAction,
      getStatusData,
      selectRow,
      op,
      filterOptions,
      find,
      filter,
      rows,
      columns,
      status,
      statusOp,
      pagination: ref({
        rowsPerPage: 0,
      }),
      getColor(params) {
        return (params === 0) ? 'grey-8' : 'red';
      },
      selected,
      getSelectedString() {
        return selected.value.length === 0 ? `Всего объектов: ${rows.value.length}` : `Объектов выбрано: ${selected.value.length} из ${rows.value.length}`;
      },
    };
  },
});
</script>
<style>
.my-sticky-header-table {
  /* height or max-height is important */
  height: 87vh;
  /* this is when the loading indicator appears */
}

.my-sticky-header-table .q-table__top,
.my-sticky-header-table .q-table__bottom,
.my-sticky-header-table thead tr:first-child th {
  /* bg color is important for th; just specify one */
  background-color: rgb(60, 60, 60);
}

.my-sticky-header-table thead tr th {
  position: sticky;
  z-index: 1;
}

.my-sticky-header-table thead tr:first-child th {
  top: 0;
}

.my-sticky-header-table.q-table--loading thead tr:last-child th {
  /* height of all previous header rows */
  top: 48px;
}

.scroll::-webkit-scrollbar {
  width: 15px;
  background: rgb(60, 60, 60);
  opacity: 0 !important;
}

.scroll::-webkit-scrollbar-thumb {
  background: grey
}

.scroll:hover::-webkit-scrollbar-thumb {
  background: grey
}

.scroll::-webkit-scrollbar-thumb:hover {
  background: grey
}
</style>
