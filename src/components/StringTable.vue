<template>
  <q-table dark dense flat class="q-pa-md q-ma-md cursor-pointer m-table" :columns="columnsDef" :rows="rows" row-key="id"
    :title="name" virtual-scroll :hide-selected-banner="true" :hide-pagination="true" selection="multiple"
    separator="cell" wrap-cells :rows-per-page-options="[1]" v-model:pagination="pagination"
    style="background-color: rgb(60, 60, 60); height: 400px;" v-model:selected="selection">
    <template v-slot:top>
      <q-btn v-if="add" color="dark-grey" label="" icon="add" @click="pushUnique" />
      <q-btn v-if="remove && selection.length > 0" color="dark-grey" label="" icon="delete" @click="deleteFrom" />
    </template>
    <template v-slot:header-cell="props">
      <q-th :props="props">
        <div class="text-h6">{{ props.col.label }}</div>
      </q-th>
    </template>
    <template v-slot:body-cell="props">
      <q-td :props="props">
        <div class="text-h6">
          {{ props.value }}
        </div>
        <q-popup-edit v-if="props.col.edit" dark @save="saveRows()" label-cancel="Отмена" label-set="ОК" v-model="props.row[props.col.name]"
          title="Изменить значение" buttons v-slot="scope" :validate="(val) => val" v-on:keyup.enter="save">
          <q-input dark class="text-h6" :type="props.col.type" v-model="scope.value" autofocus />
        </q-popup-edit>
      </q-td>
    </template>
  </q-table>
</template>

<script>
import {
  defineComponent,
  ref,
  inject,
} from 'vue';

export default defineComponent({
  name: 'StringTable',
  props: {
    name: {
      type: String,
      default: '',
    },
    tableName: {
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
    save: {
      type: Function,
      default(_rows) {
        console.log(_rows);
      },
    },
    add: {
      type: Boolean,
      default: true,
    },
    remove: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const selector = ref('');
    const {
      getObject,
    } = inject('store');
    const rows = ref(props.rowsDef);
    const selection = ref([]);
    function pushUnique() {
      selection.value.length = 0;
      function isContains(check, prop) {
        return rows.value.find((element) => element[prop] === check);
      }
      function getUniquieCNT(prop) {
        let cnt = 0;
        while (isContains(cnt, prop)) {
          cnt += 1;
        }
        return cnt;
      }
      rows.value.push({
        id: Number(getUniquieCNT('id')),
        num: Number(getUniquieCNT('num')),
        value: 'Новое значение',
      });
    }
    function deleteFrom() {
      selection.value.forEach((element) => {
        rows.value.splice(rows.value.findIndex((item) => (item.id === element.id)), 1);
      });
    }
    function saveRows() {
      rows.value.forEach((element) => {
        element.num = Number(element.num);
      });
      props.save(rows);
    }
    return {
      deleteFrom,
      pushUnique,
      saveRows,
      rows,
      selection,
      pagination: ref({
        rowsPerPage: 0,
      }),
      getObject,
      selector,
    };
  },
});
</script>
