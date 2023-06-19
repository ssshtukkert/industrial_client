<template>
  <q-dialog class="text-white text-h6" v-model="dialog" persistent>
    <q-card style="min-width: 95vw; background-color: rgb(60, 60, 60);">
      <q-bar class="row" style="background-color: rgb(80, 80, 80);">
        <div>{{ name }}</div>
        <q-space />
        <q-btn dense icon="close" v-close-popup />
      </q-bar>
      <q-card-section>
        <q-splitter v-model="splitter" style="height: 70vh">
          <template v-slot:before>
            <Table_v2 ref="refAddMaterials" dense :columnsDef="columnsAdd" :rowsDef="rowsAdd" style="height: 90vh;"
              styleContent="max-height: 70vh;" :updateSearch="updateSearch" :actionRow="addMaterialsForBuffer">
              <template v-slot:actions>
                <q-btn v-show="isAddMaterial()" color='orange' label='В список' @click="addMaterialsForBuffer"
                  style="margin-left: 15px; margin-right: 15px;" />
              </template>
            </Table_v2>
          </template>
          <template v-slot:after>
            <Table ref="refAddMaterialsBuffer" dense dark :columnsDef="columnsAddBuffer"
              styleContent="max-height: 70vh; background-color: rgb(60, 60, 60);" :rowsDef="rowsAddBuffer"
              :hideShearch="true">
              <template v-slot:actions>
                <q-btn v-show="isAddMaterialBuffer()" color='red' label='Убрать' @click="removeMaterialsFromBuffer"
                  style="margin-right: 15px;" />
              </template>
            </Table>
          </template>
        </q-splitter>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn color='green' label='Обновить и закрыть' @click="() => {
          exitAndSave(rowsAddBuffer);
          dialog = false;
        }" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import {
  defineComponent, ref, onMounted, inject,
} from 'vue';
import Table from 'src/components/tables/table_simple.vue';
import Table_v2 from 'src/components/tables/table_simple_v2.vue';

export default defineComponent({
  name: 'DialogAddMaterials',
  components: {
    Table,
    Table_v2,
  },
  setup() {
    const dialog = ref(false);
    const rowsAdd = ref([]);
    const rowsAddBuffer = ref([]);
    const name = ref('');
    const splitter = ref(70);
    const columnsAdd = ref([]);
    const columnsAddBuffer = ref([]);
    const materials = ref([]);
    const refAddMaterials = ref(null);
    const refAddMaterialsBuffer = ref(null);
    const {
      host,
    } = inject('store');
    function openEdit() {
      materials.value.length = 0;
      console.log(host);
    }
    function setSplitter(value) {
      splitter.value = value;
    }
    function show(value) {
      dialog.value = value;
    }
    function setName(value) {
      name.value = String(value);
    }
    function updateRows() {
      rowsAdd.value.length = 0;
      for (let index = 0; index < materials.value.length; index += 1) {
        const element = materials.value[index];
        rowsAdd.value.push(element);
      }
    }
    function setColumnAdd(list) {
      columnsAdd.value.length = 0;
      list.forEach((element) => {
        columnsAdd.value.push(element);
      });
    }
    function setColumnAddBuffer(list) {
      columnsAddBuffer.value.length = 0;
      list.forEach((element) => {
        columnsAddBuffer.value.push(element);
      });
    }
    function setAllMaterials(list) {
      materials.value.length = 0;
      list.forEach((element) => {
        materials.value.push(element);
      });
      updateRows();
    }
    function setBufferMaterials(list) {
      rowsAddBuffer.value.length = 0;
      list.forEach((element) => {
        rowsAddBuffer.value.push(element);
      });
    }
    // служебные
    function updateSearch() {
      refAddMaterials.value.resetSelect();
    }
    function isAddMaterial() {
      if (refAddMaterials.value) {
        return refAddMaterials.value.getSelect().length > 0;
      }
      return false;
    }
    function isAddMaterialBuffer() {
      if (refAddMaterialsBuffer.value) {
        return refAddMaterialsBuffer.value.getSelect().length > 0;
      }
      return false;
    }
    function addMaterialsForBuffer() {
      for (let i = 0; i < refAddMaterials.value.getSelect().length; i += 1) {
        let addMaterial = true;
        refAddMaterials.value.getSelect();
        for (let index = 0; index < rowsAddBuffer.value.length; index += 1) {
          if (rowsAddBuffer.value[index].id === refAddMaterials.value.getSelect()[i].id) {
            const sum = Number(rowsAddBuffer.value[index].count) + 1;
            rowsAddBuffer.value[index].count = sum;
            addMaterial = false;
          }
        }
        if (addMaterial) {
          const material = {
            id: refAddMaterials.value.getSelect()[i].id,
            name: refAddMaterials.value.getSelect()[i].name,
            count: 1,
          };
          rowsAddBuffer.value.push(material);
        }
      }
    }
    function removeMaterialsFromBuffer() {
      for (let i = 0; i < refAddMaterialsBuffer.value.getSelect().length; i += 1) {
        let ind = -1;
        for (let index = 0; index < rowsAddBuffer.value.length; index += 1) {
          if (rowsAddBuffer.value[index].id === refAddMaterialsBuffer.value.getSelect()[i].id) {
            ind = index;
            break;
          }
        }
        rowsAddBuffer.value.splice(ind, 1);
      }
      refAddMaterialsBuffer.value.getSelect().length = 0;
    }
    function exitAndSave(buffer) {
      console.log(buffer);
    }
    onMounted(() => {

    });
    return {
      openEdit,
      dialog,
      rowsAdd,
      rowsAddBuffer,
      name,
      show,
      setName,
      setAllMaterials,
      setBufferMaterials,
      updateRows,
      setColumnAdd,
      setColumnAddBuffer,
      setSplitter,
      updateSearch,
      isAddMaterial,
      isAddMaterialBuffer,
      addMaterialsForBuffer,
      removeMaterialsFromBuffer,
      exitAndSave,
      pagination: ref({
        rowsPerPage: 0,
      }),
      splitter,
      columnsAdd,
      columnsAddBuffer,
      materials,
      refAddMaterials,
      refAddMaterialsBuffer,
    };
  },

});
</script>
