<template>
  <q-hierarchy dark dense square flat :columns="columns" :data="data" :filter="filter"
    :binary-state-sort="false" :default-expand-all="true">
    <template v-slot:body="props">
      <td data-th="taskName" @click="click(props.item)"
        :class="`${select == props.item.taskId ? 'table-col-select' : 'table-col'}`">
        <div v-bind:style="props.setPadding(props.item)" :class="props.iconName(props.item) != 'done' ? 'q-pl-lg' : ''">
          <q-btn @click="() => {
            props.toggle(props.item);
            select = '';
          }" v-if="props.iconName(props.item) != 'done'" :icon="props.iconName(props.item)" flat dense>
          </q-btn>
          <span>{{ props.item.taskName }} </span>
        </div>
      </td>
      <td @click="click(props.item)" :class="`${select == props.item.taskId ? 'table-col-select' : 'table-col'}`">
        <span>{{ props.item.taskId }}</span>
      </td>
    </template>
    <template v-slot:header="props">
      <th v-for="col in props.columns" :key="col" @click="col.sortable ? props.sortBy(col) : null"
        :class="'text-' + col.align" class="table-col">
        {{ col.label }}
        <q-icon v-if="col.sorted" :name="col.sortDirection == 'asc' ? 'arrow_upward' : 'arrow_downward'"></q-icon>
      </th>
    </template>
  </q-hierarchy>
</template>

<script setup>
import { ref } from 'vue';

const columns = [

  {
    name: 'taskName',
    required: true,
    label: 'Задача',
    align: 'left',
    field: 'taskName',
    sortable: true,
    filterable: true,
  },
  {
    name: 'taskId',
    label: '№',
    sortable: true,
    field: 'taskId',
    align: 'left',
    filterable: false,
  },
];
const select = ref('');
const data = ref([
  {
    taskId: '0',
    taskName: 'Создать что то',
    children: [
      {
        taskId: '1',
        taskName: '1 этап',
      },
      {
        taskId: '2',
        taskName: '2 этап',
      },
      {
        taskId: '3',
        taskName: '3 этап',
      },
    ],
  },
]);
function click(row) {
  console.log(row);
  select.value = row.taskId;
}
</script>

<style scoped>
.table-col {
  background-color: rgb(60, 60, 60);
  cursor: pointer;
  font-size: medium;

}

.table-col-select {
  font-size: medium;
  background-color: rgb(90, 90, 90);
}

* {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
