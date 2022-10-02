<template>
  <q-page class="justify-center full-width">
    <q-card class="my-card bg-secondary text-white">
      <q-card-section>
        <div class="text-h6">Категории материалов</div>
      </q-card-section>
      <Table ref="table"
      :columnsDef="columns"
      :rowsDef="rows"
      createNewName="Новая категория"
      :queryAll="getQueryAll()"
      :queryUpdate="getQueryUpdate()"
      :queryDelete="getQueryDelete()"
      :queryCreate="getQueryCreate()">
      </Table>
    </q-card>

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
      return `${host}/services/genprice/MaterialCategory`;
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
    function createAction() {
      dialog.value = true;
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
      createAction,
      createInputNameRules: [
        (val) => (val && val.length > 0) || 'Введите наименование',
      ],
      columns,
    };
  },
});
</script>
<style lang="sass">
.my-sticky-header-column-table
  /* height or max-height is important */

  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: #fff

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:first-child th:first-child
    /* highest z-index */
    z-index: 3

  td:first-child
    z-index: 1

  td:first-child, th:first-child
    position: sticky
    left: 0
</style>
