<template>
  <q-page class="justify-center full-width text-white" style="background-color: rgb(60, 60, 60);">
    <q-card class="" style="background-color: rgb(60, 60, 60);">
      <q-card-section style="background-color: rgb(80, 80, 80);">
        <div class="text-h6">Конфигурации</div>
      </q-card-section>
      <Table ref="table" :columnsDef="columns" :rowsDef="rows" createNewName="Новая конфигурация"
        :queryAll="getQueryAll()" :queryUpdate="getQueryUpdate()" :queryDelete="getQueryDelete()"
        :queryCreate="getQueryCreate()" :actionRow="actionRow">
        <template v-slot:actions>
          <q-btn color='dark-grey' icon="open_in_new" v-show="isOneSelect()" @click="goRoot" />
          <q-btn color='dark-grey' icon="content_copy" v-show="isOneSelect()" @click="copy" />
        </template>
      </Table>
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
            <slot name="content" />
          </q-card-section>
          <q-card-actions align="right" class="bg-grey-4 text-black">
            <q-btn v-show="allowCopy()" color="dark-grey" label="Создать копию" @click="confirmCopy"
              :disabled="!createInputName" />
            <q-btn color="dark-grey" label="Отмена" v-close-popup @click="cancelConfirm" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-page>
</template>

<script>
import {
  ref, defineComponent, inject, onMounted,
} from 'vue';
import Table from 'src/components/tables/table.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import {
  defaultStructure,
} from './structuresDefault';

export default defineComponent({
  name: 'GenPricePage',
  components: {
    Table,
  },
  setup() {
    document.title = 'Конфигурации';
    const { host } = inject('store');
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
    function getQueryAll() {
      return `${host}/services/productoptions/Configuration`;
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
      const route = router.resolve({ path: `/services/productoptions/configurations/${id}` });
      window.open(route.href, '_blank');
    }
    function goRoot() {
      router.push(`/services/productoptions/configurations/${table.value.getSelect()[0].id}`);
    }
    function allowCopy() {
      return createInputName.value !== table.value.selected[0].name;
    }
    function copy() {
      dialog.value = true;
      dialogName.value = 'Наименование для копии конфигурации';
      createInputName.value = table.value.selected[0].name;
    }
    function confirmCopy() {
      const query = {};
      query.name = createInputName.value;
      query.cost = table.value.selected[0].cost;
      query.materials = table.value.selected[0].materials;
      query.operations = table.value.selected[0].operations;
      query.descript = table.value.selected[0].descript;
      axios.post(getQueryCreate(), query)
        .then((res) => {
          if (res.data.result === 'ok') {
            table.value.update();
            dialog.value = false;
          } else if (res.data.data === 'name must be unique') {
            table.value.showError(`Расчет "${query.name}" уже существует в базе данных`);
          }
        });
    }
    onMounted(() => {
      table.value.createConfirmAction = () => {
        const query = table.value.getQueryData();
        query.structure = JSON.stringify(defaultStructure);
        query.descript = '';
        axios.post(getQueryCreate(), query)
          .then((res) => {
            if (res.data.result === 'ok') {
              table.value.update(() => {
                table.value.hideDialog();
              });
            } else if (res.data.data === 'name must be unique') {
              table.value.showError(`Конфигурация "${query.name}" уже существует в базе данных`);
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

    return {
      confirmCopy,
      allowCopy,
      actionRow,
      goCalculationId,
      goRoot,
      getQueryAll,
      getQueryDelete,
      getQueryUpdate,
      getQueryCreate,
      Table,
      table,
      isOneSelect,
      dialog,
      dialogName,
      createInputName,
      columns,
      copy,
    };
  },
});
</script>
