<template>
  <q-table dark dense flat :rows="rows" class="m-table" :columns="columns" row-key="idTable" :filter="filter"
    :filter-method="find" virtual-scroll :hide-selected-banner="true" selection="multiple" v-model:selected="selected"
    binary-state-sort v-model:pagination="pagination" :rows-per-page-options="[1]"
    :no-results-label="`По запросу '${filter}' ничего не найдено`" grid-header wrap-cells :no-data-label="noDataText"
    @update:selected="updateSelected" @row-click="selectRow" :style="styleContent" @row-dblclick="actionRow">
    <template v-slot:top>
      <q-card-actions class="fit">
        <slot name="actions" />
        <q-space v-show="!hideShearch" />
        <div v-show="!hideShearch">
          <q-input dark class="text-h6" outlined dense debounce="300" v-model="filter" clearable placeholder="Поиск"
            style="margin: 10px;">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
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
      <slot name="cell" :arg="props"/>
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
    hideShearch: {
      type: Boolean,
      default: false,
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
    keyEnter: {
      type: Function,
      default() {
        console.log('press enter');
      },
    },
    styleContent: {
      type: String,
      default: '',
    },
    actionRow: {
      type: Function,
      default() {
      },
    },
  },
  setup(props) {
    const { validationName, validationNumberNoZero, newObjectCalculation } = inject('store');
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
      const newObj = newObjectCalculation;
      newObj.name = createInputName.value;
      return newObj;
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
