<template>
  <q-page class="justify-center full-width">
    <q-card class="bg-secondary text-white">
      <q-card-section>
        <div class="text-h6">Расчеты</div>
      </q-card-section>
      <Table ref="table" :columnsDef="columns" :rowsDef="rows" createNewName="Новый расчет себестоимости"
        :queryAll="getQueryAll()" :queryUpdate="getQueryUpdate()" :queryDelete="getQueryDelete()"
        :queryCreate="getQueryCreate()">
        <template v-slot:actions>
          <q-btn color='orange' label='Открыть' v-show="isOneSelect()" @click="goCalculation"/>
        </template>
      </Table>
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

export default defineComponent({
  name: 'GenPricePage',
  components: {
    Table,
  },
  setup() {
    const { host } = inject('store');
    const router = useRouter();
    const table = ref(null);
    const dialog = ref(false);
    const dialogName = ref('');
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
        label: 'Себестоимость, руб',
        field: 'cost',
        sortable: true,
        format: (val) => val.toFixed(2),
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
      return `${host}/services/genprice/Calculation`;
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
    onMounted(() => {
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
    });
    function isOneSelect() {
      if (table.value != null) {
        return table.value.isOneSelect();
      }
      return false;
    }
    function goCalculation() {
      router.push(`/services/genprice/calculations/${table.value.getSelect()[0].id}`);
    }
    return {
      goCalculation,
      getQueryAll,
      getQueryDelete,
      getQueryUpdate,
      getQueryCreate,
      Table,
      table,
      isOneSelect,
      dialog,
      dialogName,
      columns,
    };
  },
});
</script>
