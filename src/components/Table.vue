<template>
  <q-table class="m-table text-white cursor-pointer " dark dense flat :rows="rows" :columns="columns" row-key="id"
    virtual-scroll :hide-selected-banner="true" selection="none" binary-state-sort :hide-pagination="true"
    v-model:pagination="pagination" separator="cell" :rows-per-page-options="[1]" wrap-cells
    style="background-color: rgb(60, 60, 60);" grid-header no-data-label="Нет данных" :filter="filter"
    :filter-method="find" v-model:selected="selected" @row-click="selectRow">
    <template v-slot:top>
      <q-card-actions class="fit" style="background-color: rgb(60, 60, 60);">
        <slot name="actions" />
        <q-space />
        <q-input dark class="text-h6" outlined dense debounce="300" v-model="filter" clearable placeholder="Поиск"
          style="margin: 10px;">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-actions>
    </template>
    <template v-slot:pagination>
      <div class="text-h6">
        {{ selected.length === 0 ? `Всего объектов: ${rows.length}` : `Объектов выбрано:
        ${selected.length} из ${rows.length}` }}
      </div>
    </template>
    <template v-slot:header-cell="props">
      <q-th :props="props" style="background-color: rgb(60, 60, 60);">
        <div class="text-h6">{{ props.col.label }}</div>
      </q-th>
    </template>
    <template v-slot:body-cell="props">
      <q-td :props="props">
        <div class="text-h6">
          {{ props.value }}
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DatePicker',
  props: {
    keyFilter: {
      type: String,
      default: 'time',
    },
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    rows: {
      type: Array,
      default() {
        return [];
      },
    },
    action: {
      type: Function,
      default() {
      },
    },
  },
  methods: {
    setName(newName) {
      this.name = newName;
    },
    setText(newText) {
      this.text = newText;
    },

  },
  setup(props) {
    const filter = ref('');
    const selected = ref([]);
    function selectRow(_event, row) {
      selected.value.length = 0;
      selected.value.push(row);
    }
    function getIndexColumnOfSelected(value) {
      let index = -1;
      props.columns.forEach((element) => {
        if (element.label === value) {
          index = props.columns.indexOf(element);
        }
      });
      return index;
    }
    function find(rows_, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : '';
      return rows_.filter((row) => [cols[getIndexColumnOfSelected(props.keyFilter)]].some(
        (col) => ((`${cellValue(col, row)}`).toLowerCase().indexOf(lowerTerms) !== -1),
      ));
    }
    return {
      filter,
      find,
      selected,
      selectRow,
      pagination: ref({
        rowsPerPage: 0,
      }),
    };
  },

});
</script>
