<template>
  <q-table dark dense flat class="m-table"  :rows="rows" :columns="columns" row-key="name" :filter="filter"
      :filter-method="find" virtual-scroll :hide-selected-banner="true" selection="multiple" v-model:selected="selected"
      binary-state-sort v-model:pagination="pagination" :rows-per-page-options="[1]"
      :no-results-label="`По запросу '${filter}' ничего не найдено`" grid-header wrap-cells :no-data-label="noDataText"
      @row-click="selectRow" @row-dblclick="actionRow" style="max-height: 87vh; background-color: rgb(60, 60, 60);">
      <template v-slot:top>
        <q-card-actions v-show="!hideButtons" class="fit">
          <q-btn color='dark-grey' v-if="!created" label="" icon="add" @click="createAction">
            <q-tooltip :delay="800">
              Создать новую запись
            </q-tooltip>
          </q-btn>
          <q-btn color='dark-grey' v-if="!changed" label="Редактировать" icon="edit" v-show="isOneSelect()" @click="changeAction(selected)">
            <q-tooltip :delay="800">
              Редактировать запись
            </q-tooltip>
          </q-btn>
          <q-btn color='dark-grey' v-if="!deleted" label="Удалить" icon="delete" v-show="selected.length > 0" @click="deleteAction(selected)">
            <q-tooltip :delay="800">
              Удалить запись/записи
            </q-tooltip>
          </q-btn>
          <slot name="actions" />
          <q-space />
          <q-input dark class="text-h6" outlined dense debounce="300" v-model="filter" clearable
            placeholder="Поиск" style="margin: 10px;">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-card-actions>
      </template>
      <template v-slot:pagination>
        <div class="text-h6">
          {{ getSelectedString() }}
        </div>
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
    </q-table>
  <q-dialog v-model="dialog" persistent>
    <q-card class="text-white q-pt-none" style="width: 900px; max-width: 95vw; background-color: rgb(60, 60, 60);">
      <q-bar style="background-color: rgb(80, 80, 80);">
        <div class="text-h6">{{ dialogName }}</div>
      </q-bar>
      <q-card-section>
        <q-card-section class="row">
          <q-input dark class="fit text-h6" v-model="createInputName" clearable outlined label="Наименование" lazy-rules
            :rules="validationName" />
        </q-card-section>
        <slot name="content" />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn v-show="action === 0" color="dark-grey" label="Создать" @click="createConfirmAction"
          :disabled="!createInputName" />
        <q-btn v-show="action === 1" color="dark-grey" label="Изменить" @click="changeConfirmAction"
          :disabled="!createInputName" />
        <q-btn color="dark-grey" label="Отмена" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <DialogError ref="de" />
  <DialogConfirm ref="dc">
    <template v-slot:buttons>
      <q-btn color='orange' label="Да" @click="deleteConfirmAction" />
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
  name: 'TableUniversal',
  components: {
    DialogError,
    DialogConfirm,
  },
  props: {
    hideButtons: {
      type: Boolean,
      default: false,
    },
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
    actionRow: {
      type: Function,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    changed: {
      type: Boolean,
      default: false,
    },
    created: {
      type: Boolean,
      default: false,
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
    function hideDialog() {
      dialog.value = false;
    }
    function hideDCDialog() {
      dc.value.hide();
    }
    function hideDEDialog() {
      de.value.hide();
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
    function getSelect() {
      return selected.value;
    }
    function isOneSelect() {
      return getSelect().length === 1;
    }
    function selectRow(_event, row) {
      selected.value.length = 0;
      selected.value.push(row);
    }
    function changeAction(select) {
      const object = select[0];
      dialog.value = true;
      dialogName.value = 'Изменение';
      createInputName.value = object.name;
      action.value = 1;
    }
    function getSelectedString() {
      return selected.value.length === 0 ? `Всего объектов: ${rows.value.length}` : `Объектов выбрано: ${selected.value.length} из ${rows.value.length}`;
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
    function getQueryData() {
      return {
        name: createInputName.value,
      };
    }
    function showError(text) {
      de.value.setName('Ошибка');
      de.value.setText(text);
      de.value.show();
    }
    function createConfirmAction() {
      const query = getQueryData();
      axios.post(props.queryCreate, query)
        .then((res) => {
          if (res.data.result === 'ok') {
            update(() => { hideDialog(); });
          } else if (res.data.data === 'name must be unique') {
            showError(`Наименование "${query.name}" уже существует в базе данных`);
          }
        });
    }
    function getNewName() {
      return String(createInputName.value);
    }
    function changeConfirmAction() {
      const query = {};
      query.name = getNewName();
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
            } else if (res.data.result === 'error') {
              dc.value.hide();
              showError(res.data.data);
            }
          });
      }
    }
    onMounted(() => {
      update();
    });
    return {
      selectRow,
      getSelect,
      isOneSelect,
      hideDialog,
      hideDCDialog,
      hideDEDialog,
      getQueryData,
      showError,
      resetSelect,
      action,
      validationName,
      createInputName,
      getNewName,
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
      update,
    };
  },

});
</script>
<style>
.scroll::-webkit-scrollbar {
  width: 10px;
  background: rgb(90, 90, 90);
  opacity: 0.3 !important;
  width: 15px;
}

.scroll::-webkit-scrollbar-thumb {
  background: grey;
}

.scroll:hover::-webkit-scrollbar-thumb {
  background: grey;
}

.scroll::-webkit-scrollbar-thumb:hover {
  background: grey;
}
</style>
