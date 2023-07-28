<template>
  <span>
    <q-hierarchy ref="hiearchy" dark :columns="columns" classes="no-shadow bg-grey-10" :data="data">
    </q-hierarchy>
  </span>
</template>

<script>
import { defineComponent, ref } from 'vue';

const columns = [
  {
    name: 'Name',
    required: true,
    label: 'Наименование',
    align: 'left',
    field: 'Name',
    // (optional) tell QHierarchy you want this column sortable
    sortable: true,
    // If you want different sorting icon
    filterable: true,
  },
  {
    name: 'ID',
    label: 'ID',
    sortable: true,
    field: 'ID',
    align: 'center',
    filterable: false,
  },
];
export default defineComponent({
  name: 'Hierarchy',
  props: {
    data: {
      type: Array,
    },
  },
  setup() {
    const hiearchy = ref(null);
    function selected() {
      // console.log(hiearchy.value);
      return hiearchy.value;
    }
    return {
      hiearchy,
      columns,
      selected,
    };
  },
});
</script>

<style scoped></style>
