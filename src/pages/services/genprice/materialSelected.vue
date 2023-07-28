<template>
  <q-expansion-item dense expand-separator :header-style="{ backgroundColor: 'rgb(80, 80, 80)' }"
    expand-icon-class="text-white" @show="show">

    <template v-slot:header>
      <q-card-section class="text-white full-width">
        <div class="text-h6">
          {{ materialName }}
        </div>
      </q-card-section>
    </template>
    <q-table dark dense flat class="q-pa-md q-ma-md" :rows="rows" :columns="columnsAddBuffer" row-key="name"
      virtual-scroll :hide-selected-banner="true" :hide-pagination="true" selection="none" separator="cell" wrap-cells
      :rows-per-page-options="[1]" v-model:pagination="pagination"
      style="background-color: rgb(60, 60, 60); margin-left: 60px;" no-data-label="Нет материалов" @row-click="openEdit">
      <template v-slot:top>
        <q-card-actions class="fit">
          <q-btn color='dark-grey' icon="edit" @click="openEdit" :loading="load" />
        </q-card-actions>
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
        </q-td>
      </template>
    </q-table>
    <AddMaterials ref="refAddMaterials" />
  </q-expansion-item>
</template>

<script>
import {
  defineComponent, ref, inject, onMounted,
} from 'vue';
import AddMaterials from 'src/components/dialogs/addMaterials.vue';
import axios from 'axios';

export default defineComponent({
  name: 'MaterialSelected',
  components: {
    AddMaterials,
  },
  props: {
    materialName: {
      type: String,
      default: '',
    },
    parameterSettings: {
      type: String,
      default: '',
    },
    typeSelected: {
      type: String,
      default: 'multiply',
    },
  },
  setup(props) {
    const refAddMaterials = ref(null);
    const rows = ref([]);
    const load = ref(true);
    const {
      host,
      getObject,
    } = inject('store');
    const columnsAddBuffer = ref([{
      name: 'name',
      required: true,
      label: 'Наименование',
      align: 'left',
      field: (row) => row.name,
      format: (val) => `${val}`,
      sortable: true,
    }]);
    if (props.typeSelected === 'multiply') {
      columnsAddBuffer.value.push({
        name: 'count',
        align: 'center',
        label: 'Количество',
        field: 'count',
        sortable: true,
      });
    }
    function openEdit() {
      axios
        .get(`${host}/services/genprice/Material`).then((responseMaterials) => {
          refAddMaterials.value.setName(`Добавить материалы для: ${props.materialName}`);
          refAddMaterials.value.setColumnAdd([{
            name: 'name',
            required: true,
            label: 'Материал',
            align: 'left',
            field: (row) => row.name,
            format: (val) => `${val}`,
            sortable: false,
          }]);
          refAddMaterials.value.setColumnAddBuffer(columnsAddBuffer.value);
          refAddMaterials.value.setSplitter(50);
          refAddMaterials.value.setAllMaterials(responseMaterials.data);
          refAddMaterials.value.setBufferMaterials(rows.value);
          refAddMaterials.value.setType(props.typeSelected);
          refAddMaterials.value.show(true);
          refAddMaterials.value.exitAndSave = (materialsAdd) => {
            rows.value.length = 0;
            materialsAdd.forEach((element) => {
              rows.value.push(element);
            });
            const data = [];
            rows.value.forEach((element) => {
              data.push({
                id: element.id,
                count: element.count,
              });
            });
            axios.post(`${host}/services/genprice/settings/${props.parameterSettings}`, {
              value: JSON.stringify(data),
            });
          };
        });
    }
    function show() {
      load.value = true;
      rows.value.length = 0;
      axios
        .get(`${host}/services/genprice/Material`).then((responseMaterials) => {
          axios
            .get(`${host}/services/genprice/Setting`).then((responseSet) => {
              JSON.parse(getObject(responseSet.data, 'name', props.parameterSettings).value).forEach((element) => {
                rows.value.push({
                  id: element.id,
                  name: getObject(responseMaterials.data, 'id', element.id).name,
                  count: element.count,
                });
              });
              load.value = false;
            });
        });
    }
    onMounted(() => {
    });
    return {
      show,
      openEdit,
      refAddMaterials,
      columnsAddBuffer,
      pagination: ref({
        rowsPerPage: 0,
      }),
      rows,
      load,
    };
  },
});
</script>
