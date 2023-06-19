<template>
  <q-page class="justify-center full-width text-white"  style="background-color: rgb(60, 60, 60);">
      <q-card-section  style="background-color: rgb(80, 80, 80);">
        <div class="text-h6">Единицы измерения материалов</div>
      </q-card-section>
      <Table ref="table"
      :columnsDef="columns"
      :rowsDef="rows"
      createNewName="Новая единица измерений"
      :queryAll="getQueryAll()"
      :queryUpdate="getQueryUpdate()"
      :queryDelete="getQueryDelete()"
      :queryCreate="getQueryCreate()">
      </Table>
  </q-page>
</template>

<script>
import {
  ref, defineComponent, inject,
} from 'vue';
import Table from 'src/components/tables/table.vue';

export default defineComponent({
  name: 'GenPricePage',
  components: {
    Table,
  },
  setup() {
    document.title = 'Единицы измерений';
    const { host } = inject('store');
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
    ];
    function getQueryAll() {
      return `${host}/services/genprice/MaterialMeasure`;
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
    return {
      getQueryAll,
      getQueryDelete,
      getQueryUpdate,
      getQueryCreate,
      Table,
      table,
      dialog,
      dialogName,
      columns,
    };
  },
});
</script>
