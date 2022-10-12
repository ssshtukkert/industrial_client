<template>
  <q-table class="window-height fit" :rows="rows" :columns="columns" row-key="name" :filter="filter"
    :filter-method="find" virtual-scroll :selected-rows-label="getSelectedString" selection="multiple"
    v-model:selected="selected" binary-state-sort v-model:pagination="pagination" :rows-per-page-options="[1]"
    :no-results-label="`По запросу '${filter}' ничего не найдено`"
    grid-header wrap-cells :no-data-label="noDataText"
    @update:selected="updateSelected"
    @row-click="selectRow">
    <template v-slot:top>
      <q-card-actions class="fit">
        <slot name="actions" />
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
    <template v-slot:body-cell-name="props">
      <q-td key="name" :props="props">
        <div class="text-h6">{{ props.row.name }}</div>
      </q-td>
    </template>
    <template v-slot:body-cell-count="props">
      <q-td key="count" :props="props">
        <div class="text-h6">{{ props.row.count }}</div>
        <q-popup-edit @save="setChange" label-cancel="Отмена" label-set="Установить" v-model="props.row.count" title="Изменить количество"
           buttons v-slot="scope" :validate="(val) => val > 0" >
          <q-input class="text-h6" type="number" v-model="scope.value" autofocus :rules="validationNumberNoZero"/>
        </q-popup-edit>
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
    setChange: {
      type: Function,
      default() {
      },
    },
    updateSelected: {
      type: Function,
      default() {
      },
    },
  },
  setup(props) {
    const { validationName, validationNumberNoZero } = inject('store');
    const rows = ref(props.rowsDef);
    const selected = ref([]);
    const filter = ref('');
    const action = ref(0);
    const dialogName = ref('');
    const createInputName = ref(props.createNewName);

    function getSelect() {
      return selected.value;
    }
    function isOneSelect() {
      return getSelect().length === 1;
    }
    function selectRow(event, row) {
      selected.value.length = 0;
      selected.value.push(row);
      props.updateSelected(selected.value);
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
    function getQueryData() {
      return {
        name: createInputName.value,
      };
    }
    return {
      selectRow,
      getSelect,
      isOneSelect,
      getQueryData,
      action,
      validationName,
      validationNumberNoZero,
      createInputName,
      dialogName,
      find,
      getSelectedString,
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
