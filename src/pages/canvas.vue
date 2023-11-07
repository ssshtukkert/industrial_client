<template>
  <q-page class="flex-global-page text-white">
    <q-card-section class="text-h6 row">
      {{ name }}
      <q-space />
      <q-input dark square class="text-h6" outlined dense debounce="300" v-model="searchText" clearable
        placeholder="Поиск" style="margin: 10px;">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-card-section>
    <!-- Вкладки -->
    <q-tabs v-model="tabWorkspaces" dense class="text-grey" no-caps active-color="white" indicator-color="white"
      align="left" horizontal>
      <q-tab name="projects">
        <div class="text-h6">Проекты</div>
      </q-tab>
      <q-tab name="kanban">
        <div class="text-h6">Канбан</div>
      </q-tab>
    </q-tabs>
    <q-tab-panels v-model="tabWorkspaces" animated horizontal keep-alive>
      <!-- Панель проектов -->
      <q-tab-panel class="tab-panel" name="projects">
        <!-- Панель проектов - КНОПКИ -->
        <q-card-actions>
          <q-btn class="text-white" flat square dense label="Новая задача" icon="add" @click="addTaskTable" />
        </q-card-actions>
        <q-hierarchy dark square flat :columns="columns" :data="project" :filter="searchText" :binary-state-sort="false"
          :default-expand-all="true" separator="none">
          <template v-slot:body="props">
            <td data-th="name" @click="clickTable(props.item)"
              :class="`${select == props.item.id ? 'table-col-select' : 'table-col'}`">
              <div v-bind:style="props.setPadding(props.item)"
                :class="props.iconName(props.item) != 'done' ? 'q-pl-lg' : ''">
                <q-btn @click="props.toggle(props.item);" v-if="props.iconName(props.item) != 'done'"
                  :icon="props.iconName(props.item)" flat square dense>
                </q-btn>
                <span>{{ props.item.task.name }} </span>
              </div>
            </td>
            <td @click="clickTable(props.item)" :class="`${select == props.item.id ? 'table-col-select' : 'table-col'}`">
              <span>{{ props.item.id }}</span>
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
      </q-tab-panel>
      <!-- Панель канбан -->
      <q-tab-panel class="tab-panel" name="kanban">
        <q-card-action class="row">
        </q-card-action>
        <VueDraggableNext class="flex-global-page-container" fallback-class="drag" :force-fallback="true"
          :list="state.toolbars" :sort="true" ghost-class="ghost" :group="{ name: 'tollbars', pull: true, push: true }"
          handle=".handle" @end="logToolbar">
          <div class="flex-global-page-element" v-for="(toolbar) in state.toolbars" :key="toolbar">
            <div class="row items-center">
              <div class=" q-ma-sm text-h6 text-white" style="color: white; cursor: pointer; text-decoration: underline;"
                @click="openToolbar(toolbar)">
                {{ toolbar.name }}
              </div>
              <span class="text-h6">({{ toolbar.tasks.length }})</span>
              <q-space />
              <q-icon class="handle" name="reorder" size="32px" />
            </div>
            <q-btn v-show="toolbar.createTask" class="text-white" flat square label="" icon="add"
              @click="addTask(toolbar.tasks)" />
            <VueDraggableNext class="flex-page-container-area" fallback-class="drag" :force-fallback="true"
              :list="toolbar.tasks" :sort="true" @change="logTask" @start="logTask({ type: 'start', toolbar })"
              @end="logTask" :move="checkMove"
              :group="{ name: 'tasks', pull: toolbar.group.pull, push: toolbar.group.push }" ghost-class="ghost">
              <div v-for="(task) in toolbar.tasks" :key="task">
                <div class="flex-element" v-if="task.name.indexOf(searchText !== null ? searchText : '') !== -1">
                  <div class="flex-element-label" @click="openTask(toolbar, task)">
                    <p>
                      {{ task.name }}
                    </p>
                  </div>
                </div>
              </div>
            </VueDraggableNext>
            <!-- {{ index == state.toolbars.length - 1 }} -->
          </div>
          <q-btn class="flex-global-page-btn" flat square label="" icon="add" @click="addToolbar(state.toolbars)" />
        </VueDraggableNext>
        <!-- Окно настроек тулбара -->
        <q-dialog v-model="dialogToolbar" position="right" maximized persistent>

          <q-card square class="task-card">

            <div class="row">
              <q-btn dense icon="close" @click="closeToolbar(toolbarModel)" v-close-popup />
              <q-space />
              <q-btn dense icon="delete" @click="deleteToolbar(toolbarModel)" v-close-popup />
            </div>

            <q-card-section>
              <q-input class="text-h6" dark type="text" v-model="toolbarModel.name" color="white"
                input-class="text-h6 text-white" label-color="grey" stack-label label="Стадия:" />
              <q-list>
                <q-item>
                  <q-checkbox :disable="toolbarModel.deleteTask" dark color="grey-8" v-model="toolbarModel.createTask"
                    label="Разрешить создавать задачи" />

                </q-item>
                <q-item>
                  <q-checkbox :disable="toolbarModel.createTask" dark color="grey-8" v-model="toolbarModel.deleteTask"
                    label="Разрешить удалять задачи" />
                </q-item>
                <q-item>
                  <q-input class="text-h6" dark type="number" v-model="toolbarModel.maxTask" color="white"
                    input-class="text-h6 text-white" label-color="grey" stack-label label="Макс. количечество задач:" />

                </q-item>

              </q-list>
            </q-card-section>

          </q-card>
        </q-dialog>
        <!-- Окно настроек задачи -->
        <q-dialog v-model="dialogTask" position="right" maximized persistent>
          <q-card square class="task-card">
            <q-space />
            <q-btn dense icon="close" @click="closeTask(taskModel)" v-close-popup />
            <q-card-section>
              <div class="text-grey">
                Задача №: <span class="text-h6 text-white"> {{ taskModel.id }} </span>
              </div>
              <div class="text-h6 text-white">
                Стадия: {{ taskModel.toolbarName }}
              </div>
              <div class="text-grey">
                Создана: {{ taskModel.createdAt }}
              </div>
              <q-input class="text-h6" dark type="text" v-model="taskModel.name" color="white"
                input-class="text-h6 text-white" label-color="grey" stack-label label="Заголовок:" />
              <q-toggle v-model="taskModel.edit" label="Редактировать" color="grey-6" />
              <q-editor v-if="taskModel.edit" flat square dark v-model="taskModel.description" :toolbar="[
                ['bold', 'italic', 'underline'],
                ['unordered', 'ordered'],
                [{
                  label: 'Размер текста',
                  icon: $q.iconSet.editor.fontSize,
                  fixedLabel: true,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'size-1',
                    'size-2',
                    'size-3',
                    'size-4',
                    'size-5',
                    'size-6',
                    'size-7'
                  ]
                }],
              ]" :content-style="{ backgroundColor: 'rgb(60, 60, 60)' }" style="margin-top: 10px;" height="55vh"
                toolbar-bg="grey-9" />
              <div v-else>
                <q-card-section v-html="taskModel.description" />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-tab-panel>
    </q-tab-panels>

  </q-page>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import moment from 'moment';
import axios from 'axios';

const {
  getObject, host,
} = inject('store');
const name = ref('');
const tabWorkspaces = ref('projects');
const state = ref({});
const searchText = ref('');
const dialogToolbar = ref(false);
const dialogTask = ref(false);
const taskModel = ref({});
const toolbarModel = ref({});
const columns = [

  {
    name: 'name',
    required: true,
    label: 'Задача',
    align: 'left',
    field: 'name',
    sortable: true,
    filterable: true,
  },
  {
    name: 'id',
    label: '№',
    sortable: true,
    field: 'id',
    align: 'left',
    filterable: false,
  },
];
const select = ref('');
// eslint-disable-next-line no-unused-vars
const tasks = ref([
  {
    id: '0',
    name: 'Создать что то',
  },
  {
    id: '1',
    name: '1 этап',
  },
  {
    id: '2',
    name: '2 этап',
  },
  {
    id: '3',
    name: '3 этап',
  },
]);
const project = ref([
  {
    id: '0',
    task: {},
    children: [
      {
        id: '1',
        task: {},
        children: [],
      },
      {
        id: '2',
        task: {},
        children: [],
      },
      {
        id: '3',
        task: {},
        children: [],
      },
    ],
  },
]);
function writeDatabase() {
  axios.post(`${host}/project_manager/table/Workspace/update/1`, {
    name: name.value,
    configuration: JSON.stringify(state.value),
  }).then(() => {
    console.log('Сохранено');
  });
}

function syncProject() {
  function getTaskFromTasks(id) {
    return tasks.value.find((task) => String(task.id) === String(id));
  }
  function allDescendants(node) {
    node.task = getTaskFromTasks(node.id);
    if (node.children) {
      for (let i = 0; i < node.children.length; i += 1) {
        const child = node.children[i];
        allDescendants(child);
      }
    }
  }
  project.value.forEach((p) => {
    allDescendants(p);
  });
  console.log(project.value);
}

function readDatabase() {
  axios.get(`${host}/project_manager/table/Workspace/1`).then((res) => {
    name.value = res.data.data.name;
    syncProject();

    state.value = JSON.parse(res.data.data.configuration);
  });
}
function getNewId(list) {
  return list.reduce((prev, current) => {
    if (+current.id > +prev.id) {
      return current;
    }
    return prev;
  }).id + 1;
}
function getAllTasks() {
  const allTasks = [];
  state.value.toolbars.forEach((toolbar) => {
    allTasks.push(...toolbar.tasks);
  });
  return allTasks;
}
function addTask(list) {
  const newId = getNewId(getAllTasks());
  const time = moment();
  list.unshift({
    name: `Новая задача №${newId}`, id: newId, createdAt: time.format('DD-MM-YYYY HH:mm:ss'), description: '',
  });
  writeDatabase();
}
function addToolbar(list) {
  const newId = getNewId(state.value.toolbars);
  list.push({
    name: `Новая стадия №${newId}`,
    id: newId,
    maxTask: 99999,
    createTask: true,
    deleteTask: false,
    tasks: [
    ],
    group: { name: 'toolbars', pull: true, put: true },
  });
  writeDatabase();
}
function openTask(toolbar, task) {
  taskModel.value.toolbarName = toolbar.name;
  taskModel.value.toolbarId = toolbar.id;
  taskModel.value.name = task.name;
  taskModel.value.id = task.id;
  taskModel.value.createdAt = task.createdAt;
  taskModel.value.description = task.description || '';
  taskModel.value.edit = false;
  dialogTask.value = true;
}
function closeTask(model) {
  const toolbar = getObject(state.value.toolbars, 'id', model.toolbarId);
  const task = getObject(toolbar.tasks, 'id', model.id);
  task.name = model.name;
  task.description = model.description;
  writeDatabase();
  // const indexTask = toolbar.tasks.findIndex((tsk) => tsk.id === model.id);
}
function openToolbar(toolbar) {
  toolbarModel.value.id = toolbar.id;
  toolbarModel.value.name = toolbar.name || '';
  toolbarModel.value.createTask = toolbar.createTask || false;
  toolbarModel.value.deleteTask = toolbar.deleteTask || false;
  toolbarModel.value.maxTask = toolbar.maxTask || 9999;
  dialogToolbar.value = true;
}
function closeToolbar(model) {
  const toolbar = getObject(state.value.toolbars, 'id', model.id);
  toolbar.name = model.name;
  toolbar.createTask = toolbarModel.value.createTask;
  toolbar.deleteTask = toolbarModel.value.deleteTask;
  toolbar.maxTask = toolbarModel.value.maxTask;
  // если включено удаление задач
  if (toolbar.deleteTask) {
    toolbar.tasks.length = 0;
  }
  writeDatabase();
}
function deleteToolbar(model) {
  const indexToolbar = state.value.toolbars.findIndex((t) => t.id === model.id);
  if (state.value.toolbars[indexToolbar].tasks.length > 0) {
    console.log('Стадия не подлежит удалению, так как в ней находятся задачи');
  } else {
    state.value.toolbars.splice(indexToolbar, 1);
    writeDatabase();
  }
}
function getToolbarByIdTask(id) {
  let findToolbar = null;
  state.value.toolbars.forEach((toolbar) => {
    if (getObject(toolbar.tasks, 'id', id) !== null) {
      findToolbar = toolbar;
    }
  });
  return findToolbar;
}
// function getTaskFilter() {
//   // state.value.toolbars.forEach((toolbar) => {
//   //   const nA = toolbar.tasks
//   //     .filter((task) => task.name.indexOf(searchText.value !== null ? searchText.value : '') !== -1);
//   //   getObject(state.value.toolbars, 'id', toolbar.id).tasks = nA;
//   // });
// }
let fromToolbar = null;
function logTask(event) {
  if (event.type) {
    if (event.type === 'start') {
      fromToolbar = event.toolbar;
    } else if (event.type === 'end') {
      writeDatabase();
    }
  } else if (event.added) {
    const toToolbar = getToolbarByIdTask(event.added.element.id);
    if (toToolbar) {
      let deleteTask = false;
      let returnTask = false;
      if (toToolbar.deleteTask === true) {
        deleteTask = true;
      } else if (toToolbar.tasks.length > toToolbar.maxTask) {
        deleteTask = true;
        returnTask = true;
      }

      if (deleteTask) {
        toToolbar.tasks.splice(event.added.newIndex, 1);
      }
      if (!returnTask) {
        fromToolbar = null;
      }
    }
  } else if (event.removed) {
    if (fromToolbar !== null) {
      fromToolbar.tasks.splice(event.removed.oldIndex, 0, event.removed.element);
      writeDatabase();
    }
  }
}

function logToolbar(event) {
  if (event.type) {
    if (event.type === 'end') {
      writeDatabase();
    }
  }
}
// eslint-disable-next-line no-unused-vars
function checkMove(evt) {
  // console.log(`Future index: ${evt.draggedContext.futureIndex}`);
  // console.log(`element: ${evt.draggedContext.element.name}`);
}

// действия с таблицей
function clickTable(row) {
  if (row !== null) {
    console.log(row);
    select.value = row.id;
  } else {
    select.value = '';
  }
}
function addTaskTable() {
  tasks.value.push({
    id: '10',
    name: 'Новая',
  });
  project.value.push({
    id: '10',
    task: {},
    children: [],
  });
  syncProject();
  select.value = '10';
}
onMounted(() => {
  readDatabase();
});
</script>

<style scoped lang="scss">
.tab-panel {
  padding: 0px;
  background-color: rgb(60, 60, 60);
}

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

.ghost {
  opacity: 0.3;
  transform: rotate(0);
}

.drag {
  transform: rotate(-5deg);
}

.flex-global-page {
  background-color: rgb(60, 60, 60);
  padding: 2px;

  .flex-global-page-container {
    flex: 1;
    display: flex;
    flex-wrap: nowrap;
    align-content: stretch;
    overflow-x: auto;
    height: 75vh;
    padding: 2px;
    gap: 2px;

    .flex-global-page-element {
      display: flex;
      flex-direction: column;
      margin: 0px 0px 0px 0px;
      padding: 5px;
      min-width: 320px;
      max-width: 320px;
      background-color: rgb(80, 80, 80);
      color: #ffffff;

      .flex-page-container-area {
        height: 100%;
        overflow-y: auto;

        .flex-element {
          margin: 5px 10px 5px 5px;
          padding: 15px;
          height: 128px;
          background-color: rgb(60, 60, 60);
          cursor: move;

          .flex-element-label {
            color: white;
            cursor: pointer;
            // text-decoration: underline;
          }

          .flex-element-label p {
            margin: 0;
            -webkit-line-clamp: 3;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      }

      .flex-global-page-btn {
        display: flex;
        flex-direction: column;
        margin: 0px 0px 0px 0px;
        min-width: 32px;
        max-width: 32px;
      }

      .handle {
        cursor: move;
      }
    }
  }
}

.task-card {
  width: 60vw;
  height: 100vh;
  padding: 15px;
  color: white;
  background-color: rgb(50, 50, 50);
}

*::-webkit-scrollbar {
  height: 12px;
  margin: 5px;
  padding: 5px;
}

*::-webkit-scrollbar-track {
  background: rgb(80, 80, 80);
  margin: 5px;
  padding: 5px;
}

*::-webkit-scrollbar-thumb {
  background-color: rgb(59, 55, 55);
  margin: 5px;
  padding: 5px;
}
</style>
