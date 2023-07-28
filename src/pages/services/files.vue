<template>
  <q-page class="justify-center full-width text-white" style="background-color: rgb(60, 60, 60);">
    <q-card-section style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Файлы</div>
      <!-- <div class="text-h8">Свободно: {{ free }} Мб/{{ total }} Мб</div> -->
      <q-linear-progress size="48px" stripe :value="progressValue / 100" color="green">
        <div class="absolute-full flex flex-center">
          <q-badge class="text-h6" color="grey-8" text-color="white"
            :label="`Свободно: ${`${progressValue.toFixed(2)} %`}`" />
        </div>
      </q-linear-progress>
    </q-card-section>
    <Table ref="table" :created="isPermissions('operationsWithFiles')" :deleted="isPermissions('operationsWithFiles')"
      :changed="isPermissions('operationsWithFiles')"
      :columnsDef="columns" createNewName="Новый файл" :queryAll="getQueryAll()"
      :queryUpdate="getQueryUpdate()" :queryDelete="getQueryDelete()" :queryCreate="getQueryCreate()"
      :actionRow="actionRow">
      <template v-slot:actions>
        <q-btn color='dark-grey' label='Открыть' icon="open_in_new" v-show="isOneSelect()" @click="goCalculation()" />
      </template>
    </Table>
    <q-dialog v-model="dialog" persistent>
      <q-card class="text-white q-pt-none" style="width: 900px; max-width: 95vw; background-color: rgb(60, 60, 60);">
        <q-bar>
          <div class="text-h6">{{ dialogName }}</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-grey text-white">Закрыть</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="row items-center q-pa-md">
          <q-uploader class="full-width" dark :url="`${host}/upload/disk`" multiple max-files="10"
            :headers="[{ name: 'X-Custom-Timestamp', value: 1550240306080 }]" @uploaded="uploadComplete"
            @failed="uploadError" style="background-color: rgb(60, 60, 60);">
            <template v-slot:header="scope">
              <div class="row items-center q-pa-sm q-gutter-xs" style="background-color: rgb(80, 80, 80);">
                <q-btn v-if="scope.queuedFiles.length > 0" icon="clear_all" @click="scope.removeQueuedFiles" round dense
                  flat>
                  <q-tooltip>Очистить список</q-tooltip>
                </q-btn>
                <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all" @click="scope.removeUploadedFiles" round
                  dense flat>
                  <q-tooltip>Убрать загруженные файлы</q-tooltip>
                </q-btn>
                <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                <div class="col">
                  <div>
                    Поддерживаемое расширение: *.pdf *.jpg *.png
                  </div>
                  <div>
                    Максимальный размер: 5МБ
                  </div>
                  <div class="text-h8">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
                </div>
                <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
                  <q-uploader-add-trigger />
                  <q-tooltip>Выбрать файл</q-tooltip>
                </q-btn>
                <q-btn v-if="scope.canUpload" icon="cloud_upload" @click="scope.upload" round dense flat>
                  <q-tooltip>Загрузить файлы</q-tooltip>
                </q-btn>
                <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat>
                  <q-tooltip>Отменить загрузку</q-tooltip>
                </q-btn>
              </div>
            </template>
          </q-uploader>
        </q-card-section>
      </q-card>

    </q-dialog>
  </q-page>
</template>

<script>
import {
  ref, defineComponent, inject, onMounted, computed,
} from 'vue';
import Table from 'src/components/tables/table.vue';
import axios from 'axios';

export default defineComponent({
  name: 'GenPricePage',
  components: {
    Table,
  },
  setup() {
    document.title = 'Файлы';
    const { host, isPermissions } = inject('store');
    const table = ref(null);
    const dialog = ref(false);
    const dialogName = ref('');
    const createInputName = ref('');
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
        name: 'size',
        align: 'left',
        label: 'Размер',
        field: 'size',
        sortable: true,
        format: (val) => `${val} Мб`,
      },
      {
        name: 'createdAt',
        align: 'left',
        label: 'Дата создания',
        field: 'createdAt',
        sortable: true,
      },
      {
        name: 'updatedAt',
        align: 'left',
        label: 'Дата изменения',
        field: 'updatedAt',
        sortable: true,
      },
    ];
    const total = ref(0);
    const free = ref(0);
    function getName() {
      if (table.value) {
        if (table.value.getSelect().length > 0) {
          return table.value.getSelect()[0].name;
        }
      }
      return '';
    }
    function getQueryAll() {
      return `${host}/services/files/all`;
    }
    function getQueryDelete() {
      return `${host}/services/files/delete`;
    }
    function getQueryUpdate() {
      return `${host}/services/files/rename`;
    }
    function getQueryCreate() {
      return `${getQueryAll()}/create`;
    }
    function goCalculationName(id) {
      window.open(`${host}/services/files/view/${id}`, '_blank');
    }
    function goCalculation() {
      window.open(`${host}/services/files/view/${getName()}`, '_blank');
    }
    onMounted(() => {
      table.value.update = (callback) => {
        axios.get(`${host}/services/files/max_size`)
          .then((r) => {
            free.value = (r.data.maxSize - r.data.totalSize).toFixed(1);
            total.value = r.data.maxSize.toFixed(1);
            const query_rows = [];
            axios
              .get(getQueryAll()).then((response) => {
                for (let index = 0; index < response.data.length; index += 1) {
                  const m = response.data[index];
                  query_rows.push(m);
                }
                table.value.setRows(query_rows);
                if (callback) {
                  callback();
                }
              });
          });
      };
      table.value.update();
      table.value.createAction = () => {
        dialog.value = true;
        dialogName.value = 'Загрузить файлы';
      };
      table.value.createConfirmAction = () => {
        const query = table.value.getQueryData();
        query.cost = 0;
        query.materials = '[]';
        query.operations = 7.5;
        query.descript = '';
        axios.post(getQueryCreate(), query)
          .then((res) => {
            if (res.data.result === 'ok') {
              table.value.update(() => {
                table.value.hideDialog();
              });
            } else if (res.data.data === 'name must be unique') {
              table.value.showError(`Расчет "${query.name}" уже существует в базе данных`);
            }
          });
      };
      table.value.deleteConfirmAction = () => {
        for (let index = 0; index < table.value.getSelect().length; index += 1) {
          const element = table.value.getSelect()[index];
          axios.get(`${getQueryDelete()}/${element.name}`)
            .then((res) => {
              if (res.data.result === 'ok') {
                table.value.update(() => {
                  table.value.hideDCDialog();
                  table.value.resetSelect();
                });
              } else if (res.data.result === 'error') {
                table.value.hideDCDialog();
                table.value.showError(res.data.data);
              }
            });
        }
      };
      table.value.changeConfirmAction = () => {
        const query = {};
        query.name = table.value.getNewName();
        axios.post(`${getQueryUpdate()}/${table.value.getSelect()[0].name}`, query)
          .then((res) => {
            if (res.data.result === 'ok') {
              table.value.update(() => {
                table.value.hideDialog();
              });
            } else if (res.data.data === 'name must be unique') {
              console.log('Ошибка, файл уже сущестует в БД');
              table.value.hideDialog();
            }
          });
      };
    });
    function actionRow(event, row) {
      goCalculationName(row.name);
    }
    function isOneSelect() {
      if (table.value != null) {
        return table.value.isOneSelect();
      }
      return false;
    }
    function uploadComplete(info) {
      console.log(JSON.parse(info.xhr.response));
      table.value.update();
    }
    function uploadError(error) {
      console.log(JSON.parse(error.xhr.response));
    }
    return {
      actionRow,
      goCalculationId: goCalculationName,
      goCalculation,
      getQueryAll,
      getQueryDelete,
      getQueryUpdate,
      getQueryCreate,
      isPermissions,
      Table,
      table,
      isOneSelect,
      dialog,
      dialogName,
      createInputName,
      columns,
      uploadComplete,
      uploadError,
      host,
      total,
      free,
      progressValue: computed(() => (free.value * 100) / total.value),
    };
  },
});
</script>
