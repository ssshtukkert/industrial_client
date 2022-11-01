<template>
  <q-page class="justify-center full-width">
    <q-card class="my-card bg-secondary text-white">
      <q-card-section>
        <div class="text-h6">Материалы</div>
      </q-card-section>
      <q-table class="my-sticky-header-table window-height" :rows="rows" :columns="columns" row-key="name"
        :filter="filter" :filter-method="find" virtual-scroll :selected-rows-label="getSelectedString"
        selection="multiple" v-model:selected="selected" binary-state-sort v-model:pagination="pagination"
        :rows-per-page-options="[1]" style="max-height: 87vh"
        :no-results-label="`По запросу '${filter}' ничего не найдено`" grid-header wrap-cells @row-click="selectRow">
        <template v-slot:top>
          <q-card-actions class="fit">
            <q-btn color='primary' label='Создать' @click="createAction" />
            <q-btn color='primary' label='Изменить' v-show="selected.length === 1" @click="changeAction(selected)" />
            <q-btn color='primary' label='Удалить' v-show="selected.length > 0" @click="deleteAction(selected)" />
            <q-space />
            <q-select outlined dense v-model="filterOptions" :options="op" class="text-h6"
              options-selected-class="text-h6" popup-content-class="text-h6" style="width: 220px; margin-right: 10px" />
            <q-input class="text-h6" outlined dense debounce="300" color="primary" v-model="filter" clearable
              placeholder="Поиск">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-card-actions>
        </template>
        <template v-slot:header-cell="props">
          <q-th :props="props">
            <div class="text-h6">{{ props.col.label }}</div>
          </q-th>
        </template>
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <div class="text-h6">
              {{ props.value }}
            </div>
            <q-tooltip v-if="props.row.descript" :delay="800">
              <template v-slot:default>
                <div v-if="props.row.descript.length > 0">
                  <p style="white-space: pre;">
                    {{ props.row.descript }}
                  </p>
                </div>
              </template>
            </q-tooltip>
          </q-td>
        </template>
        <template v-slot:body-cell-category="props">
          <q-td :props="props">
            <q-badge color="primary">
              <div class="text-h6">{{ props.row.category }}</div>
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-measure="props">
          <q-td :props="props">
            <q-badge color="primary">
              <div class="text-h6">{{ props.row.measure }}</div>
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </q-card>
    <q-dialog v-model="dialog" persistent>
      <q-card class="bg-secondary text-white q-pt-none" style="width: 900px; max-width: 95vw;">
        <q-card-section>
          <div class="text-h6">{{ dialogName }}</div>
        </q-card-section>
        <q-card-section class="bg-white text-black">
          <q-card-section class="row">
            <q-input class="fit text-h6" v-model="inputName" clearable outlined label="Наименование" lazy-rules
              :rules="validationName" />
          </q-card-section>
          <q-card-section class="row" style="padding: 0px;">
            <q-card-section class="col-3">
              <q-input class="text-h6" v-model.number="inputCost" type="number" label="Цена" suffix="руб." outlined
                lazy-rules :rules="createInputRealValueRules" />
            </q-card-section>
            <q-card-section class="col-3">
              <q-input class="text-h6" v-model.number="inputWeight" type="number" label="Вес" suffix="кг." outlined
                lazy-rules :rules="createInputRealValueRules" />
            </q-card-section>
            <q-card-section class="col-3">
              <q-input class="text-h6" v-model.number="inputWidth" type="number" label="Ширина" suffix="мм." outlined
                lazy-rules :rules="createInputRealValueRules" />
            </q-card-section>
            <q-card-section class="col-3">
              <q-input class="text-h6" v-model.number="inputHeight" type="number" label="Высота" suffix="мм." outlined
                lazy-rules :rules="createInputRealValueRules" />
            </q-card-section>
          </q-card-section>
          <q-card-section class="row" style="padding: 0px;">
            <q-card-section class="col-4">
              <q-select class="text-h6" label="Категория" options-selected-class="text-h6" popup-content-class="text-h6"
                outlined v-model="categoryOptions" :options="categoryOp" />
            </q-card-section>
            <q-card-section class="col-4">
              <q-select class="text-h6" label="Ед. измерения" options-selected-class="text-h6"
                popup-content-class="text-h6" outlined v-model="measureOptions" :options="measureOp" />
            </q-card-section>
            <q-card-section class="col-4">
              <q-input class="fit text-h6" v-model="inputArticle" clearable outlined label="Артикул" />
            </q-card-section>
          </q-card-section>
          <q-card-section class="row">
            <q-input class="text-h6 fit" v-model="inputDescript" outlined label="Описание" type="textarea" />
          </q-card-section>
        </q-card-section>
        <q-card-actions align="right" class="bg-grey-4 text-black">
          <q-btn v-show="action === 0" class="bg-teal text-white" label="Создать" @click="createConfirmAction"
            :disabled="isValidationConfirm()" />
          <q-btn v-show="action === 1" class="bg-teal text-white" label="Изменить" @click="changeConfirmAction"
            :disabled="isValidationConfirm()" />
          <q-btn class="bg-teal text-white" label="Отмена" v-close-popup @click="cancelConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <DialogError ref="de" />
    <DialogConfirm ref="dc">
      <template v-slot:buttons>
        <q-btn color='primary' label="Да" @click="deleteConfirmAction" />
        <q-btn color='primary' label="Отмена" v-close-popup />
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
  name: 'GenPricePage',
  components: {
    DialogError,
    DialogConfirm,
  },
  setup() {
    document.title = 'Материалы';
    const {
      host, getProp, getId, validationName,
    } = inject('store');
    const de = ref(null);
    const dc = ref(null);
    const dialog = ref(false);
    const dialogName = ref('');
    const nameDefault = 'Новый материал';
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
    const categoryOptions = ref('');
    const measureOptions = ref('');
    const selected = ref([]);
    const action = ref(0);
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
        name: 'cost',
        align: 'left',
        label: 'Цена, руб',
        field: 'cost',
        sortable: true,
      },
      {
        name: 'category',
        align: 'left',
        label: 'Категория',
        field: 'category',
        sortable: true,
      },
      {
        name: 'measure',
        align: 'left',
        label: 'Ед. измерения',
        field: 'measure',
        sortable: true,
      },
      {
        name: 'article',
        align: 'left',
        label: 'Артикул',
        field: 'article',
        sortable: true,
      },
      {
        name: 'weight',
        align: 'left',
        label: 'Вес, кг',
        field: 'weight',
        sortable: true,
      },
    ];
    function resetSelect() {
      selected.value.length = 0;
    }
    function getQueryAll() {
      return `${host}/services/genprice/Material`;
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
      categoryOptions.value = getProp(categoryOptions, object.category, 'name');
      measureOptions.value = getProp(measureOptions, object.measure, 'name');
      action.value = 1;
    }
    const rows = ref([]);
    function update() {
      axios
        .get(`${host}/services/genprice/MaterialMeasure`).then((responseMe) => {
          measures.length = 0;
          measureOp.value.length = 0;
          for (let index = 0; index < responseMe.data.length; index += 1) {
            const m = responseMe.data[index];
            measures.push(m);
            measureOp.value.push(m.name);
          }
          axios
            .get(`${host}/services/genprice/MaterialCategory`).then((responseC) => {
              categories.length = 0;
              categoryOp.value.length = 0;
              for (let index = 0; index < responseC.data.length; index += 1) {
                const m = responseC.data[index];
                categories.push(m);
                categoryOp.value.push(m.name);
              }
              rows.value.length = 0;
              axios
                .get(`${host}/services/genprice/Material`).then((responseM) => {
                  for (let index = 0; index < responseM.data.length; index += 1) {
                    const m = responseM.data[index];
                    rows.value.push({
                      id: m.id,
                      name: m.name,
                      category: getProp(categories, m.category, 'name'),
                      categoryId: m.category,
                      cost: m.cost,
                      weight: m.weight,
                      measure: getProp(measures, m.measure, 'name'),
                      measureId: m.measure,
                      width: m.width,
                      height: m.height,
                      descript: m.descript,
                      article: m.article,
                    });
                  }
                  resetSelect();
                });
            });
        });
    }
    function createConfirmAction() {
      const query = {};
      query.name = inputName.value;
      query.article = inputArticle.value;
      query.cost = inputCost.value;
      query.weight = inputWeight.value;
      query.measure = 0;
      query.width = inputWidth.value;
      query.height = inputHeight.value;
      query.category = 0;
      query.descript = inputDescript.value;
      query.status = 0;

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
      query.status = 0;

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
      selectRow,
      op,
      filterOptions,
      find,
      filter,
      rows,
      columns,
      pagination: ref({
        rowsPerPage: 0,
      }),
      selected,
      getSelectedString() {
        return selected.value.length === 0 ? '' : `Объектов выбрано: ${selected.value.length} из ${rows.value.length}`;
      },
    };
  },
});
</script>
<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: white

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
