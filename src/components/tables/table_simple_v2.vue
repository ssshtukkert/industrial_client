<template>
  <q-table class="fit" :rows="rows" :columns="columns" row-key="name" :filter="filter" :filter-method="find"
    virtual-scroll selection="multiply" v-model:selected="selected" v-model:pagination="pagination"
    :rows-per-page-options="[1]" grid-header wrap-cells :no-data-label="noDataText" :hide-bottom="true"
    :hide-header="true" @update:selected="updateSelect" @row-click="selectRow" @row-dblclick="actionRow" :style="styleContent">
    <template v-slot:top>
      <q-card-actions class="fit" style="min-height: 10px;">
        <q-input class="text-h6" @update:model-value="updateSearch" outlined dense debounce="300" color="primary"
          v-model="filter" clearable placeholder="Поиск">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <slot name="actions" />
      </q-card-actions>
    </template>
    <template v-slot:header-cell="props">
      <q-th :props="props">
        <div class="text-h6">{{ props.col.label }}</div>
      </q-th>
    </template>
    <template v-slot:body-cell-name="props">
      <q-td key="name" :props="props">
        <div class="text-h6">{{ props.row.name }}</div>
          <q-tooltip v-if="props.row.descript.length > 0" :delay="800">
            <template v-slot:default>
            <p style="white-space: pre;">
              {{ props.row.descript }}
            </p>
          </template>
          </q-tooltip>
      </q-td>
    </template>
  </q-table>
</template>
<script>

import {
  defineComponent, ref, inject,
} from 'vue';

export default defineComponent({
  name: 'TableSimple',
  components: {
  },
  props: {
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
    updateSelect: {
      type: Function,
      default() {
      },
    },
    updateSearch: {
      type: Function,
    },
    hideSelection: {
      type: Boolean,
      default: false,
    },
    actionRow: {
      type: Function,
    },
    styleContent: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { validationName } = inject('store');
    const rows = ref(props.rowsDef);
    const filter = ref('');
    const action = ref(0);
    const dialogName = ref('');
    const createInputName = ref(props.createNewName);
    const selected = ref([]);
    function selectRow(event, row) {
      selected.value.length = 0;
      selected.value.push(row);
      props.updateSelect(selected.value);
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
    return {
      selectRow,
      action,
      validationName,
      createInputName,
      dialogName,
      find,
      rows,
      columns: props.columnsDef,
      pagination: ref({
        rowsPerPage: 0,
      }),
      selected,
      filter,
    };
  },

});
</script>
