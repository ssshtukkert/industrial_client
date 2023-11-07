<template >
  <q-page class="text-white text-h6" style="background-color: rgb(60, 60, 60); overflow-y: hidden;">
    <q-card-section style="background-color: rgb(80, 80, 80);">
      <div>Менеджер испытаний</div>
    </q-card-section>
    <q-card-section class="q-pa-none fit">
      <q-table ref="table" class="my-sticky-header-table" dark dense :rows="tests" :columns="columnsTests" row-key="end"
        virtual-scroll selection="single" v-model:selected="selectedTests" :hide-selected-banner="true"
        binary-state-sort no-data-label="Испытания отсутствуют" :rows-per-page-options="[0]"
        @update:selected="updateSelectRow" v-model:pagination="pagination" @row-click="selectRow" separator="cell"
        style="background-color: rgb(60, 60, 60);">
        <template v-slot:pagination>
          <div class="text-h6 text-grey">
            {{ getSelectedString() }}
          </div>
        </template>
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <div class="text-h6">
              {{ props.value }}
            </div>
          </q-td>
        </template>
        <template v-slot:header-cell="props">
          <q-th :props="props">
            <div class="text-h6">
              {{ props.col.label }}
            </div>
          </q-th>
        </template>
        <template v-slot:bottom>
          <div class="text-white text-h6" style="height: 200px;">
            <q-card-section v-if="selectedTests.length > 0">
              Наименование: {{ selectedTests[0].name }}
              <div v-if="measures > 0">
                Количество замеров: {{ measures }}
              </div>
            </q-card-section>
            <q-card-section v-else>
              Выберите элемент
            </q-card-section>
            <q-card-actions v-if="selectedTests.length > 0 && measures > 0">
              <q-btn :disable="dateStart == ''" color="teal" icon="download" label="Загрузить данные в excel"
                target="_self" :href="getRouteOrder" />
              <q-btn color="teal" icon="edit" label="Переименовать" target="_self" @click="rename" />
              <q-btn color="teal" icon="delete" label="Удалить данные" target="_self" @click="enterPassword(remove)" />
            </q-card-actions>
          </div>
        </template>
      </q-table>
    </q-card-section>
    <q-dialog v-model="renameDialog" persistent>
      <q-card class="text-white q-pt-none" style="width: 900px; max-width: 95vw; background-color: rgb(60, 60, 60);">
        <q-bar>
          <div class="text-h6">Переименовать</div>
        </q-bar>
        <q-card-section class="text-black">
          <q-card-section class="row">
            <q-input dark class="fit text-h6" v-model="createInputName" clearable outlined label="Наименование"
              lazy-rules :rules="validationName" />
          </q-card-section>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn color="dark-grey" label="Готово" @click="confirmRename" :disabled="!createInputName" />
          <q-btn color="primary" label="Отмена" v-close-popup @click="cancelConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  inject, ref, onMounted, onBeforeUnmount,
} from 'vue';
import axios from 'axios';

export default {
  name: 'ManagerTests',
  setup() {
    document.title = 'Менеджер испытаний';
    const table = ref(null);
    const renameDialog = ref(false);
    const createInputName = ref('');
    const changeDialog = ref(false);
    const errorPasswordDialog = ref(false);
    let password = localStorage.getItem('passwordLab') || '';
    const inputPassword = ref(password);
    const comp_inputPassword = ref(null);
    const confirmPass = ref(null);
    const {
      WebSocket_Create, WebSocket_Listen, WebSocket_Close, TRUE_PASSWORD, host,
    } = inject('store');
    const columnsTests = [{
      name: 'name',
      required: true,
      label: 'Наименование',
      align: 'left',
      field: (row) => row.name,
      format: (val) => `${val}`,
      sortable: false,
    },
    {
      name: 'start',
      align: 'left',
      label: 'Время старта',
      field: 'start',
      sortable: true,
    },
    {
      name: 'end',
      required: true,
      label: 'Время завершения',
      align: 'left',
      field: 'end',
      sortable: true,
      sortOrder: 'da',
    },
    ];
    const tests = ref([]);
    const selectedTests = ref([]);
    const measures = ref(0);
    const getRouteOrder = ref('');
    const getRouteOrderRemove = ref('');
    function listen(json) {
      const mes = json.message;
      if (json.id === 2) {
        console.log(mes);
      }
    }
    let varFunction = null;
    function enterPassword(action) {
      if (password !== TRUE_PASSWORD) {
        changeDialog.value = true;
        inputPassword.value = '';
        varFunction = action;
      } else {
        localStorage.setItem('passwordLab', password);
        action();
      }
    }
    function confirmPassword() {
      if (inputPassword.value === TRUE_PASSWORD) {
        password = inputPassword.value;
        console.log(password);
        changeDialog.value = false;
        varFunction();
      } else {
        errorPasswordDialog.value = true;
      }
    }
    function querT(row) {
      if (row) {
        measures.value = 0;
        axios
          .get(`${host}/testrecup/get_all_from_start/${row.start}`).then((responseC) => {
            measures.value = responseC.data[0].countMeasures;
            getRouteOrder.value = `${host}/testrecup/download/get_all_from_start/${responseC.data[0].start}`;
            getRouteOrderRemove.value = `${host}/testrecup/remove_all_from_start/${responseC.data[0].start}`;
          });
      }
    }
    function selectRow(event, row) {
      selectedTests.value.length = 0;
      selectedTests.value.push(row);
      querT(row);
    }
    function updateSelectRow(row) {
      querT(row[0]);
    }
    function update() {
      selectedTests.value.length = 0;
      tests.value.length = 0;
      axios
        .get(`${host}/testrecup/get_all_tests`).then((responseC) => {
          for (let index = responseC.data.length - 1; index >= 0; index -= 1) {
            const test = responseC.data[index];
            axios.get(`${host}/testrecup/names/${test.end_test}`).then((responseN) => {
              let name = 'без наименования';
              if (responseN.data.length > 0) {
                name = responseN.data[0].name;
              }
              tests.value.push({
                name,
                start: test.start_test,
                end: test.end_test,
              });
            });
          }
          table.value.sort('end');
        });
    }
    function confirmRename() {
      const query = {};
      query.name = createInputName.value;
      axios.post(`${host}/testrecup/rename/${selectedTests.value[0].end}`, query)
        .then((res) => {
          if (res.data.result === 'ok') {
            console.log('OK');
          } else if (res.data.data === 'name must be unique') {
            console.log('ERROR');
          }
          renameDialog.value = false;
          update();
        });
    }
    function rename() {
      renameDialog.value = true;
      createInputName.value = selectedTests.value[0].name;
    }
    function remove() {
      axios.get(getRouteOrderRemove.value).then(() => {
        update();
      });
    }
    onMounted(() => {
      update();
      // написать удаление элементов при размонтировании образа
      WebSocket_Create('recup', { getMain: 1 });
      WebSocket_Listen('recup', listen);
    });
    onBeforeUnmount(() => {
      WebSocket_Close('recup');
    });
    return {
      confirmPassword,
      enterPassword,
      changeDialog,
      renameDialog,
      errorPasswordDialog,
      inputPassword,
      comp_inputPassword,
      createInputName,
      confirmPass,
      rename,
      confirmRename,
      //
      columnsTests,
      tests,
      selectedTests,
      selectRow,
      updateSelectRow,
      measures,
      getRouteOrder,
      getRouteOrderRemove,
      remove,
      table,
      pagination: ref({
        rowsPerPage: 0,
      }),
      getSelectedString() {
        return selectedTests.value.length === 0 ? `Всего объектов: ${tests.value.length}` : `Объектов выбрано: ${selectedTests.value.length} из ${tests.value.length}`;
      },
    };
  },
};
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
