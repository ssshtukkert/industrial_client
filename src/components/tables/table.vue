<template>
  <q-table class="window-height" :rows="rows" :columns="columns" row-key="name" :filter="filter" :filter-method="find"
    virtual-scroll :selected-rows-label="getSelectedString" selection="multiple" v-model:selected="selected"
    binary-state-sort v-model:pagination="pagination" :rows-per-page-options="[1]"
    :no-results-label="`По запросу '${filter}' ничего не найдено`" grid-header wrap-cells :no-data-label="noDataText">
    <template v-slot:top>
      <q-card-actions class="fit">
        <q-btn color='primary' label='Создать' @click="createAction" />
        <q-btn color='primary' label='Изменить' v-show="selected.length === 1" @click="changeAction(selected)" />
        <q-btn color='primary' label='Удалить' v-show="selected.length > 0" @click="deleteAction(selected)" />
        <q-space />
        <q-input class="text-h6" outlined dense debounce="300" color="primary" v-model="filter" clearable
          placeholder="Поиск" style="margin: 10px;">
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
      </q-td>
    </template>
  </q-table>
  <q-dialog v-model="dialog" persistent>
    <q-card class="bg-secondary text-white q-pt-none" style="width: 900px; max-width: 95vw;">
      <q-card-section>
        <div class="text-h6">{{ dialogName }}</div>
      </q-card-section>
      <q-card-section class="bg-white text-black">
        <q-card-section class="row">
          <q-input class="fit text-h6" v-model="createInputName" clearable outlined label="Наименование" lazy-rules
            :rules="validationName" />
        </q-card-section>
      </q-card-section>
      <q-card-actions align="right" class="bg-grey-4 text-black">
        <q-btn v-show="action === 0" class="bg-teal text-white" label="Создать" @click="createConfirmAction"
          :disabled="!createInputName" />
        <q-btn v-show="action === 1" class="bg-teal text-white" label="Изменить" @click="changeConfirmAction"
          :disabled="!createInputName" />
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
</template>
<script>
import {
  defineComponent, ref, inject, onMounted,
} from 'vue';
import axios from 'axios';
import DialogError from 'src/components/dialogs/error.vue';
import DialogConfirm from 'src/components/dialogs/confirm.vue';

export default defineComponent({
  name: 'Table',
  components: {
    DialogError,
    DialogConfirm,
  },
  props: {
    queryAll: {
      type: String,
      required: true,
    },
    queryUpdate: {
      type: String,
      required: true,
    },
    queryDelete: {
      type: String,
      required: true,
    },
    queryCreate: {
      type: String,
      required: true,
    },
    noDataText: {
      type: String,
      default: 'Нет данных',
    },
    createNewName: {
      type: String,
      default: '',
    },
    columnsDef: {
      type: Array,
      default() {
        return [];
      },
    },
    rowsDef: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  setup(props) {
    const { validationName } = inject('store');
    const rows = ref(props.rowsDef);
    const selected = ref([]);
    const filter = ref('');
    const dialog = ref(false);
    const de = ref(null);
    const dc = ref(null);
    const action = ref(0);
    const dialogName = ref('');
    const createInputName = ref(props.createNewName);
    // заменяет текущие элементы списка на новые
    function setRows(rows_) {
      rows.value.length = 0;
      for (let index = 0; index < rows_.length; index += 1) {
        const element = rows_[index];
        rows.value.push(element);
      }
    }
    // сбрасывает выделенные элементы
    function resetSelect() {
      selected.value.length = 0;
    }
    function update(callback) {
      const query_rows = [];
      axios
        .get(props.queryAll).then((response) => {
          for (let index = 0; index < response.data.length; index += 1) {
            const m = response.data[index];
            query_rows.push(m);
          }
          setRows(query_rows);
          if (callback) {
            callback();
          }
        });
    }
    function createAction() {
      dialog.value = true;
      createInputName.value = props.createNewName;
      dialogName.value = 'Создание';
      action.value = 0;
    }
    function deleteAction(select) {
      let objectsNames = select[0].name;
      for (let index = 1; index < select.length; index += 1) {
        const element = select[index];
        objectsNames += `, ${element.name}`;
      }
      dc.value.setName('Удаление');
      dc.value.setText(`Удалить "${objectsNames}"?`);
      dc.value.show();
    }
    function changeAction(select) {
      const object = select[0];
      dialog.value = true;
      dialogName.value = 'Изменение';
      createInputName.value = object.name;
      action.value = 1;
    }
    function getSelectedString() {
      return selected.value.length === 0 ? '' : `Объектов выбрано: ${selected.value.length} из ${rows.value.length}`;
    }
    function getIndexColumnOfSelected(value) {
      let index = -1;
      props.columnsDef.forEach((element) => {
        if (element.label === value) {
          index = props.columnsDef.indexOf(element);
        }
      });
      return index;
    }
    function find(rows_, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : '';
      return rows_.filter((row) => [cols[getIndexColumnOfSelected(props.columnsDef[0].label)]].some(
        (col) => ((`${cellValue(col, row)}`).toLowerCase().indexOf(lowerTerms) !== -1),
      ));
    }
    function createConfirmAction() {
      const query = {};
      query.name = createInputName.value;
      axios.post(props.queryCreate, query)
        .then((res) => {
          if (res.data.result === 'ok') {
            update(() => { dialog.value = false; });
          } else if (res.data.data === 'name must be unique') {
            de.value.setName('Ошибка');
            de.value.setText(`Наименование "${query.name}" уже существует в базе данных`);
            de.value.show();
          }
        });
    }
    function changeConfirmAction() {
      const query = {};
      query.name = createInputName.value;
      axios.post(`${props.queryUpdate}/${selected.value[0].id}`, query)
        .then((res) => {
          if (res.data.result === 'ok') {
            update(() => { dialog.value = false; });
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
        axios.get(`${props.queryDelete}/${element.id}`)
          .then((res) => {
            if (res.data.result === 'ok') {
              update(() => {
                dc.value.hide();
                resetSelect();
              });
            }
          });
      }
    }
    onMounted(() => {
      update();
    });
    return {
      action,
      validationName,
      createInputName,
      createAction,
      changeAction,
      deleteAction,
      dialog,
      dialogName,
      find,
      setRows,
      getSelectedString,
      rows,
      columns: props.columnsDef,
      pagination: ref({
        rowsPerPage: 0,
      }),
      selected,
      filter,
      createConfirmAction,
      deleteConfirmAction,
      changeConfirmAction,
      DialogError,
      DialogConfirm,
      de,
      dc,
    };
  },

});
</script>