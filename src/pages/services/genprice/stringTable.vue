<template>
  <q-table dark dense flat class="q-pa-md q-ma-md cursor-pointer" :columns="columnsDef" :rows="rows" row-key="name" :title="name"
    virtual-scroll :hide-selected-banner="true" :hide-pagination="true" selection="none" separator="cell" wrap-cells
    :rows-per-page-options="[1]" v-model:pagination="pagination" style="background-color: rgb(60, 60, 60);">
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
        <q-popup-edit dark v-if="props.col.edit" @save="save" label-cancel="Отмена" label-set="ОК"
          v-model="props.row[props.col.name]" :title="props.col.changeText" buttons v-slot="scope"
          :validate="(val) => val > 0" v-on:keyup.enter="keyEnter">
          <q-input v-if="props.col.type == 'number'" dark class="text-h6" type="number" v-model="scope.value" autofocus
            :rules="validationNumberNoZero" />
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
  onMounted,
} from 'vue';
import axios from 'axios';

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
  },
  setup(props) {
    const selector = ref('');
    const {
      host,
      getObject,
      validationNumberNoZero,
    } = inject('store');
    const rows = ref([]);
    function update() {
      axios
        .get(`${host}/services/genprice/${props.tableName}`).then((responseData) => {
          rows.value.length = 0;
          responseData.data.forEach((element) => {
            rows.value.push(element);
          });
        });
    }
    function save() {
      axios.get(`${host}/services_delete_all/genprice/${props.tableName}`).then((responseDelete) => {
        if (responseDelete.data.result === 'ok') {
          const query = [];
          rows.value.forEach((element) => {
            const newObj = {};
            // eslint-disable-next-line no-restricted-syntax, guard-for-in
            for (const key in element) {
              if (key !== 'createdAt' && key !== 'updatedAt') {
                newObj[key] = element[key];
              }
            }
            query.push(newObj);
          });
          axios.post(`${host}/services_put_all/genprice/${props.tableName}`, query).then(() => {
            update();
          });
        }
      });
    }
    onMounted(() => {
      update();
    });
    return {
      save,
      rows,
      pagination: ref({
        rowsPerPage: 0,
      }),
      validationNumberNoZero,
      getObject,
      selector,

    };
  },
});
</script>
