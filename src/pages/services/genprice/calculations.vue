<template>
  <q-page class="justify-center full-width text-white" style="background-color: rgb(60, 60, 60);">
    <q-card-section style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Расчеты</div>
    </q-card-section>
    <Table ref="table" :columnsDef="columns" :rowsDef="rows" createNewName="Новый расчет себестоимости"
      :queryAll="getQueryAll()" :queryUpdate="getQueryUpdate()" :queryDelete="getQueryDelete()"
      :queryCreate="getQueryCreate()" :actionRow="actionRow" :deleted="isPermissions('deleteCalculate')"
      :changed="isPermissions('editCalculate')" :created="isPermissions('createCalculate')" :renderRow="renderRow">
      <template v-slot:actions>
        <q-btn color='dark-grey' label='Открыть' icon="open_in_new" v-show="isOneSelect()" @click="goCalculation"
        v-if="!isPermissions('openCalculate')" />
        <q-btn color='dark-grey' label='Скопировать' icon="content_copy" v-show="isOneSelect()" @click="copy"
          v-if="!isPermissions('copyCalculate')" />
        <q-btn color='dark-grey' label='Обновить' icon="update" v-show="isOneSelect()" @click="updateCalc" />
      </template>
    </Table>
    <q-dialog v-model="dialog" persistent>
      <q-card class="text-white q-pt-none" style="width: 900px; max-width: 95vw; background-color: rgb(60, 60, 60);">
        <q-bar>
          <div class="text-h6">{{ dialogName }}</div>
        </q-bar>
        <q-card-section class="bg-white text-black">
          <q-card-section class="row">
            <q-input class="fit text-h6" v-model="createInputName" clearable outlined label="Наименование" lazy-rules
              :rules="validationName" />
          </q-card-section>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn v-show="allowCopy()" color="dark-grey" label="Создать копию" @click="confirmCopy"
            :disabled="!createInputName" />
          <q-btn color="primary" label="Отмена" v-close-popup @click="cancelConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  ref, defineComponent, inject, onMounted,
} from 'vue';
import Table from 'src/components/tables/table.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'GenPricePage',
  components: {
    Table,
  },
  setup() {
    document.title = 'Расчеты';
    const {
      host, getProp, getRubFormat, getObject, isPermissions,
    } = inject('store');
    const router = useRouter();

    const table = ref(null);
    const dialog = ref(false);
    const dialogName = ref('');
    const createInputName = ref('');
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
      {
        name: 'cost',
        align: 'left',
        label: 'Себестоимость, руб',
        field: 'cost',
        sortable: true,
        format: (val) => getRubFormat().format(val),
      },
      {
        name: 'createdAt',
        align: 'left',
        label: 'Дата создания',
        field: 'createdAt',
        sortable: true,
      },
      {
        name: 'updatedAt',
        align: 'left',
        label: 'Дата изменения',
        field: 'updatedAt',
        sortable: true,
      },
    ];
    function getQueryAll() {
      return `${host}/services/genprice/Calculation`;
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
    function goCalculationId(id) {
      const routeGo = router.resolve({ path: `/services/genprice/calculations/${id}` });
      window.open(routeGo.href, '_blank');
    }
    function goCalculation() {
      router.push(`/services/genprice/calculations/${table.value.getSelect()[0].id}`);
    }
    function allowCopy() {
      return createInputName.value !== table.value.selected[0].name;
    }
    function copy() {
      dialog.value = true;
      dialogName.value = 'Наименование для копии щита';
      createInputName.value = table.value.selected[0].name;
    }
    // обновить расчёт в соответствии с текущими ценами
    function updateCalc() {
      axios
        .get(`${host}/services/genprice/Setting`).then((responseS) => {
          const costOneHourWorker = Number(getObject(responseS.data, 'name', 'costOneHourWorker').value);
          const percentOfMaterials = Number(getObject(responseS.data, 'name', 'percentOfMaterials').value);
          axios
            .get(`${host}/services/genprice/Calculation/${table.value.selected[0].id}`).then((responseC) => {
              const query = responseC.data.data;
              const cost = Number((query.cost).toFixed(0));
              const allMaterials = [];
              axios
                .get(`${host}/services/genprice/Material`).then((responseM) => {
                  for (let index = 0; index < responseM.data.length; index += 1) {
                    const m = responseM.data[index];
                    allMaterials.push(m);
                  }
                  const materials = JSON.parse(responseC.data.data.materials);
                  let sum = 0;
                  for (let index = 0; index < materials.length; index += 1) {
                    const element = materials[index];
                    sum += Number(getProp(allMaterials, element.id, 'cost') || 0) * element.count;
                  }
                  const summaryCost = (sum * (percentOfMaterials / 100 + 1) + Number(responseC.data.data.operations) * costOneHourWorker).toFixed(0);
                  if (cost !== summaryCost) {
                    query.cost = summaryCost;
                    axios.post(`${getQueryUpdate()}/${table.value.selected[0].id}`, query).then((res) => {
                      if (res.data.result === 'ok') {
                        table.value.update();
                      }
                    });
                  }
                });
            });
        });
    }
    function confirmCopy() {
      axios
        .get(`${host}/services/genprice/Calculation/${table.value.selected[0].id}`).then((responseC) => {
          const query = {};
          query.name = createInputName.value;
          query.cost = Number(responseC.data.data.cost);
          query.materials = responseC.data.data.materials;
          query.operations = responseC.data.data.operations;
          query.descript = responseC.data.data.descript;
          axios.post(getQueryCreate(), query)
            .then((res) => {
              if (res.data.result === 'ok') {
                table.value.update();
                dialog.value = false;
              } else if (res.data.data === 'name must be unique') {
                table.value.showError(`Расчет "${query.name}" уже существует в базе данных`);
              }
            });
        });
    }
    onMounted(() => {
      table.value.createConfirmAction = () => {
        const query = table.value.getQueryData();
        query.cost = 0;
        query.materials = '[]';
        query.operations = 7.5;
        query.descript = '';
        axios.post(getQueryCreate(), query)
          .then((res) => {
            if (res.data.result === 'ok') {
              table.value.update(() => {
                table.value.hideDialog();
              });
            } else if (res.data.data === 'name must be unique') {
              table.value.showError(`Расчет "${query.name}" уже существует в базе данных`);
            }
          });
      };
    });
    function actionRow(event, row) {
      goCalculationId(row.id);
    }
    function isOneSelect() {
      if (table.value != null) {
        return table.value.isOneSelect();
      }
      return false;
    }

    return {
      confirmCopy,
      allowCopy,
      actionRow,
      goCalculationId,
      goCalculation,
      getQueryAll,
      getQueryDelete,
      getQueryUpdate,
      getQueryCreate,
      isPermissions,
      Table,
      table,
      isOneSelect,
      dialog,
      dialogName,
      createInputName,
      columns,
      copy,
      updateCalc,
    };
  },
});
</script>
