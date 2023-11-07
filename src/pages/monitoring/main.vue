<template>
  <q-page class="justify-center full-width text-white" style="background-color: rgb(60, 60, 60);">
    <q-card-section style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">База мониторинга</div>
    </q-card-section>
    <Table ref="table" :columnsDef="columns" createNewName="Новый объект мониторинга" :queryAll="getQueryAll()"
      :queryUpdate="getQueryUpdate()" :queryDelete="getQueryDelete()" :queryCreate="getQueryCreate()"
      :actionRow="actionRow" :deleted="isPermissions('deleteConfiguration')" :changed="isPermissions('editConfiguration')"
      :created="isPermissions('createConfiguration')">
      <template v-slot:actions>
        <q-btn color='dark-grey' label='Открыть' icon="open_in_new" v-show="isOneSelect()" @click="goCalculation()" />
        <q-btn color='dark-grey' label='Скачать руководство' icon="download" target="_self"
          :href="`${host}/download/disk/Operating instructions manual v1.0.1.pdf`" />
        <q-btn v-if=" !isPermissions('copyConfiguration') " color='dark-grey' label='Скопировать' icon="content_copy"
          v-show=" isOneSelect() " @click="copy()" />
        <q-btn v-if=" !isPermissions('viewLogs') " color='dark-grey' icon="summarize" label="Логи" @click="
          () => {
            openLogs();
            dialogLog.show();
          }
        " />
      </template>
    </Table>
    <q-dialog v-model=" dialog " persistent>
      <q-card class="text-white q-pt-none" style="width: 900px; max-width: 95vw; background-color: rgb(60, 60, 60);">
        <q-bar>
          <div class="text-h6">{{ dialogName }}</div>
        </q-bar>
        <q-card-section class="text-white" style="background-color: rgb(60, 60, 60);">
          <q-card-section class="row">
            <q-input dark class="fit text-h6" v-model=" createInputName " clearable outlined label="Наименование" lazy-rules
              :rules=" validationName " />
          </q-card-section>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn v-show=" allowCopy() " color="dark-grey" label="Создать копию" @click=" confirmCopy "
            :disabled=" !createInputName " />
          <q-btn color='dark-grey' label="Отмена" v-close-popup @click=" cancelConfirm " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <Dialog width="95vw" name-def="Просмотр логов всех систем" ref="dialogLog">
      <template v-slot:content>
        <TableLog keyFilter="Событие" :columns="
          [
            {
              name: 'time',
              label: 'Дата/Время',
              align: 'left',
              field: 'time',
              style: 'min-width: 300px',
              format: (val) => `${val}`,
              sortable: true,
            },
            {
              name: 'system',
              label: 'Система',
              align: 'left',
              field: 'system',
              format: (val) => `${val}`,
              sortable: true,
            },
            {
              name: 'user',
              label: 'Пользователь',
              align: 'left',
              field: 'user',
              format: (val) => `${val}`,
              sortable: true,
            },
            {
              name: 'event',
              align: 'left',
              label: 'Событие',
              field: 'event',
              format: (val) => `${val}`,
              sortable: true,
              style: 'min-width: 200px',
            },
          ]
        " :rows=" logs ">
        </TableLog>
      </template>
    </Dialog>
  </q-page>
</template>

<script>
import {
  ref, defineComponent, inject, onMounted,
} from 'vue';
import Table from 'src/components/tables/table.vue';
import TableLog from 'src/components/Table.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Dialog from 'src/components/dialogs/standart.vue';

export default defineComponent({
  name: 'GenPricePage',
  components: {
    Table,
    Dialog,
    TableLog,
  },
  setup() {
    document.title = 'База мониторинга';
    const {
      host, isPermissions, getObject,
    } = inject('store');
    const router = useRouter();

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
        name: 'ip',
        align: 'left',
        label: 'IP адрес:',
        field: 'ip',
        sortable: true,
        format: (val) => `${val}`,
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
    const logs = ref([]);
    function getQueryAll() {
      return `${host}/monitoring/table/SystemConf`;
    }
    function getQueryDelete() {
      return `${getQueryAll()}/delete`;
    }
    function getQueryUpdate() {
      return `${getQueryAll()}/update`;
    }
    function getQueryCreate() {
      return `${getQueryAll()}/create`;
    }
    function goCalculationId(id) {
      const routeGo = router.resolve({ path: `/monitoring/configuration/${id}` });
      window.open(routeGo.href, '_blank');
    }
    function goCalculation() {
      router.push(`/monitoring/configuration/${table.value.getSelect()[0].id}`);
    }
    function copy() {
      console.log(1);
      dialog.value = true;
      dialogName.value = 'Наименование для копии объекта';
      createInputName.value = table.value.selected[0].name;
    }
    function allowCopy() {
      return createInputName.value !== table.value.selected[0].name;
    }
    function confirmCopy() {
      console.log(`${host}/monitoring/table/SystemConf/${table.value.getSelect()[0].id}`);
      axios
        .get(`${host}/monitoring/table/SystemConf/${table.value.getSelect()[0].id}`).then((responseC) => {
          console.log(responseC);
          const query = {};
          query.name = createInputName.value;
          query.ip = '';
          query.id_addr = responseC.data.data.id_addr;
          query.port = responseC.data.data.port;
          query.timeout = responseC.data.data.timeout;
          query.period = responseC.data.data.period;
          query.orderBytes = responseC.data.data.orderBytes;
          query.place = responseC.data.data.place;
          query.place_holder = responseC.data.data.place_holder;
          query.connection = responseC.data.data.connection;
          query.configuration = responseC.data.data.configuration;
          query.period_of_storage = 0;
          axios.post(getQueryCreate(), query)
            .then((res) => {
              if (res.data.result === 'ok') {
                table.value.update();
                dialog.value = false;
              } else if (res.data.data === 'name must be unique') {
                table.value.showError(`Объект "${query.name}" уже существует в базе данных`);
              }
            });
        });
    }
    onMounted(() => {
      table.value.createConfirmAction = () => {
        const query = table.value.getQueryData();
        query.ip = '';
        query.id_addr = 1;
        query.port = 502;
        query.timeout = 1000;
        query.period = 5;
        query.orderBytes = '1234';
        query.place = '';
        query.place_holder = '';
        query.connection = '';
        query.period_of_storage = 0;
        query.configuration = JSON.stringify({
          settings: {
            registers: [{
              id: 'status',
              name: 'Статус',
              enable: true,
              adress: 5623,
              quantity: 1,
              function: 'FC1',
            },
            {
              id: 'onof',
              name: 'Запуск/Останов',
              enable: true,
              adress: 5623,
              quantity: 1,
              function: 'FC1',
            },
            {
              id: 'setpointTemp',
              name: 'Уставка температуры',
              enable: true,
              adress: 6233,
              quantity: 1,
              function: 'FC1',
            },
            {
              id: 'mode',
              name: 'Режим управления:',
              enable: true,
              adress: 6233,
              quantity: 1,
              function: 'FC1',
            },
            {
              id: 'season',
              name: 'Сезон',
              enable: true,
              adress: 6233,
              quantity: 1,
              function: 'FC1',
            },
            {
              id: 'wear',
              name: 'Наработка',
              enable: true,
              adress: 5233,
              quantity: 2,
              function: 'FC3',
            },
            {
              id: 'alarm_reset',
              name: 'Сброс аварии',
              enable: false,
              adress: 6233,
              quantity: 1,
              function: 'FC1',
            },
            {
              id: 'wear_reset',
              name: 'Сброс наработки',
              enable: false,
              adress: 6233,
              quantity: 1,
              function: 'FC1',
            },
            ],
          },
        });
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
    });
    function actionRow(event, row) {
      goCalculationId(row.id);
    }
    function isOneSelect() {
      if (table.value != null) {
        return table.value.isOneSelect();
      }
      return false;
    }
    function openLogs() {
      logs.value.length = 0;
      axios.get(`${host}/monitoring/table/SystemLog`).then((logData) => {
        logData.data.forEach((log) => {
          logs.value.push({
            id: log.id,
            time: log.createdAt,
            user: log.user,
            event: log.event,
            system: getObject(table.value.rows, 'id', log.id_system).name,
          });
        });
      });
    }
    return {
      actionRow,
      goCalculationId,
      goCalculation,
      getQueryAll,
      getQueryDelete,
      getQueryUpdate,
      getQueryCreate,
      copy,
      confirmCopy,
      allowCopy,
      isPermissions,
      Table,
      table,
      isOneSelect,
      dialog,
      dialogName,
      dialogLog: ref(null),
      createInputName,
      columns,
      logs,
      openLogs,
      host,
    };
  },
});
</script>
