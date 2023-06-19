<template>
  <q-table class="m-table text-white" dark dense flat :rows="rows" :columns="columnsDef" row-key="id" virtual-scroll
    :hide-selected-banner="true" selection="none" binary-state-sort :hide-pagination="true"
    v-model:pagination="pagination" separator="cell" :rows-per-page-options="[1]" wrap-cells
    style="background-color: rgb(60, 60, 60);" grid-header>
    <template v-slot:top>
      <q-card-actions class="fit" style="background-color: rgb(60, 60, 60);">
        <q-btn color='dark-grey' icon='edit' @click="openEdit" />
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
        <q-popup-edit dark v-if="props.col.edit" @save="save" @cancel="cancel" label-cancel="Отмена" label-set="ОК"
          v-model="props.row[props.col.name]" :title="props.col.changeText" buttons v-slot="scope">
          <q-input v-if="props.col.type == 'number'" dark class="text-h6" type="number" v-model="scope.value" autofocus
            :rules="validationNumberNoZero" @keyup.enter="scope.set"/>
          <q-select v-if="props.col.type == 'selector'" dark class="text-h6" label="Выбор напряжения:"
            options-selected-class="text-h6 text-grey" label-active-class="text-red" popup-content-class="text-h6"
            outlined :options="props.col.options" option-value="id" v-model.number="scope.value" @update:model-value="(val) => {
              scope.value = val.id;
            }" popup-content-style="background-color: rgb(60, 60, 60); color:  white;" style="padding-right: 5px;" @keyup.enter="scope.set">
            <template v-slot:selected>
              <div class="text-white text-h6">
                {{ getObject(props.col.options, 'id', scope.value).label }}
              </div>
            </template>
          </q-select>
        </q-popup-edit>
      </q-td>
    </template>
  </q-table>
  <AddMaterials ref="refAddMaterials" />
</template>

<script>
import {
  defineComponent,
  ref,
  inject,
  onMounted,
} from 'vue';
import AddMaterials from 'src/components/dialogs/addMaterials.vue';
import axios from 'axios';

export default defineComponent({
  name: 'MaterialTable',
  components: {
    AddMaterials,
  },
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
    const refAddMaterials = ref(null);
    const rows = ref([]);
    const selector = ref('');
    const {
      host,
      getObject,
      validationNumberNoZero,
    } = inject('store');
    const modelValue = ref(null);
    function updateValue(value) {
      console.log(value.value);
    }
    function update() {
      axios
        .get(`${host}/services/genprice/Material`).then((responseMaterials) => {
          axios
            .get(`${host}/services/genprice/${props.tableName}`).then((responseData) => {
              rows.value.length = 0;
              responseData.data.forEach((element) => {
                element.name = getObject(responseMaterials.data, 'id', element.id).name;
                rows.value.push(element);
              });
            });
        });
    }
    function cancel() {
      console.log(1);
    }
    function save(val, init) {
      console.log(val, init);
      axios.get(`${host}/services_delete_all/genprice/${props.tableName}`).then((responseDelete) => {
        if (responseDelete.data.result === 'ok') {
          const query = [];
          rows.value.forEach((element) => {
            const newObj = {};
            newObj.id = element.id;
            // eslint-disable-next-line no-restricted-syntax, guard-for-in
            for (const key in element) {
              if (key !== 'id' && key !== 'count' && key !== 'name' && key !== 'createdAt' && key !== 'updatedAt') {
                newObj[key] = element[key];
              }
            }
            query.push(newObj);
          });
          console.log(query);
          axios.post(`${host}/services_put_all/genprice/${props.tableName}`, query).then(() => {
            update();
          });
        }
      });
    }
    function openEdit() {
      axios
        .get(`${host}/services/genprice/Material`).then((responseMaterials) => {
          refAddMaterials.value.setName(`Выбор материалов для: ${props.name}`);
          refAddMaterials.value.setColumnAdd([{
            name: 'name',
            required: true,
            label: 'Материал',
            align: 'left',
            field: (row) => row.name,
            format: (val) => `${val}`,
            sortable: false,
          }]);
          refAddMaterials.value.setColumnAddBuffer([
            {
              name: 'name',
              required: true,
              label: 'Наименование',
              align: 'left',
              field: (row) => row.name,
              format: (val) => `${val}`,
              sortable: true,
            },
          ]);
          refAddMaterials.value.setSplitter(50);
          refAddMaterials.value.setAllMaterials(responseMaterials.data);
          refAddMaterials.value.setBufferMaterials(rows.value);
          refAddMaterials.value.show(true);
          refAddMaterials.value.exitAndSave = (materialsAdd) => {
            rows.value.length = 0;
            materialsAdd.forEach((element) => {
              props.columnsDef.forEach((e) => {
                if (e.name !== 'name' && !element[e.name]) {
                  element[e.name] = e.defaultValue;
                }
              });
              rows.value.push(element);
            });
            save();
          };
        });
    }
    onMounted(() => {
      update();
    });
    return {
      save,
      cancel,
      refAddMaterials,
      openEdit,
      rows,
      pagination: ref({
        rowsPerPage: 0,
      }),
      validationNumberNoZero,
      getObject,
      selector,
      updateValue,
      modelValue,
    };
  },
});
</script>
