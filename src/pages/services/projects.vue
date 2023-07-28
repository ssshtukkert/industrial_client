<template>
  <q-page dark class="justify-center full-width text-white" style="background-color: rgb(60, 60, 60);">
    <q-card-section style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Проекты</div>
    </q-card-section>
    <div class="q-pa-md q-gutter-sm">
      <q-splitter dark vertical v-model="projectsSplitter" separator-class="bg-white"
        style="height: 75vh; background-color: rgb(60, 60, 60);">
        <template v-slot:before style="overflow: hidden;">
          <q-scroll-area v-if="isTryPath()" id="field_tree" visible :delay="0" style=" max-width: 100%; height: 100%;"
            :vertical-thumb-style="{ right: '2px', borderRadius: '0px', background: 'grey', width: '15px', opacity: 1 }"
            :horizontal-thumb-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', height: '15px', opacity: 1 }"
            :vertical-bar-style="{ right: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, width: '15px' }"
            :horizontal-bar-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, height: '15px' }"
            @click="resetSelect" @mousedown.right="rightClick">
            <q-card-actions>
              <q-btn color='dark-grey' icon="refresh" @click="updateStructure(null, search)" />
              <q-btn color='dark-grey' icon="unfold_more" @click="projects.expandAll()" />
              <q-btn color='dark-grey' icon="unfold_less" @click="projects.collapseAll()" />
              <q-space />
              <q-input dark class="text-h6" outlined dense debounce="300" v-model="search"
                @update:model-value="searchValue" clearable placeholder="Поиск" style="margin: 10px;">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </q-card-actions>
            <div class="row">
              <q-tree class="col" dense ref="projects" :nodes="data" node-key="id" no-transition dark
                v-model:selected="selectedObjects" @update:selected="selectNode" no-selection-unset
                no-nodes-label="Объекты структуры отсутствуют">
                <template v-slot:default-header="prop">
                  <q-item dense :id="`node_${prop.node.id}`" class="fit" @dblclick="open(prop.node, true)">
                    <q-icon :name="getIcon(prop.node.type)" :color="prop.node.id === selectedObjects ? 'orange' : 'white'"
                      size="28px" class="q-mr-sm" />
                    <q-item-section :class="`text-${selectedObjects == prop.node.id ? 'orange' : 'grey-19'}`"
                      style="user-select: none;">
                      {{ getNodeObject(prop.node.type, prop.node.typeId).name }}
                    </q-item-section>
                    <q-item-section v-if="prop.node.type == TYPE_CALC_MANUAL"
                      :class="`text-${selectedObjects == prop.node.id ? 'orange' : 'white'}`" style="margin-right: 50px;">
                      {{ getDisplayCost(getNodeObject(prop.node.type, prop.node.typeId).cost) }}
                    </q-item-section>
                    <q-menu v-if="selectedObjects" dark touch-position context-menu>
                      <q-list dense style="min-width: 100px">
                        <template v-if="prop.node.type != TYPE_DIRECTORY">
                          <q-item @click="open(prop.node, false, true)" clickable v-close-popup>
                            <q-item-section>Открыть</q-item-section>
                          </q-item>
                        </template>
                        <template v-if="prop.node.type == TYPE_DIRECTORY">
                          <!-- <q-item clickable>
                            <q-item-section>Создать</q-item-section>
                            <q-item-section side>
                              <q-icon name="keyboard_arrow_right" />
                            </q-item-section>
                            <q-menu dark anchor="top end" self="top start">
                              <q-list dense style="min-width: 100px">
                                <template v-if="prop.node.type == TYPE_DIRECTORY">
                                  <q-item clickable v-close-popup @click="() => {
                                    dialogInputName = true; refDialogInputName.trigger = 'create';
                                    inputNameDirectoryValue = 'Новая папка';
                                  }">
                                    <q-item-section>Папку</q-item-section>
                                  </q-item>
                                  <q-item clickable v-close-popup@click="() => {
                                    dialogInputName = true; refDialogInputName.trigger = 'create';
                                    inputNameDirectoryValue = 'Новый расчёт себестоимости';
                                  }">
                                    <q-item-section>Расчёт себестоимости</q-item-section>
                                  </q-item>
                                </template>
                              </q-list>
                            </q-menu>
                          </q-item> -->
                          <q-item @click="open(prop.node, false, true)" clickable v-close-popup>
                            <q-item-section>Открыть в новой вкладке</q-item-section>
                          </q-item>
                          <q-item clickable v-close-popup @click="() => {
                            dialogInputName = true; refDialogInputName.trigger = 'create';
                            inputNameDirectoryValue = '';
                            refDialogInputName.name = 'Создание нового объекта';
                          }">
                            <q-item-section>Создать</q-item-section>
                          </q-item>
                          <q-item clickable v-close-popup @click="pasteFrom(prop.node)">
                            <q-item-section>Добавить из...</q-item-section>
                          </q-item>
                          <q-item clickable v-close-popup :disable="!bufferObject"
                            @click="pasteDirectoryFromBuffer(prop.node)">
                            <q-item-section>Вставить</q-item-section>
                          </q-item>
                        </template>
                        <q-item :disable="getCurrentNode().parentId == -1 || (search ? (search.length > 0) : false)"
                          clickable v-close-popup>
                          <q-item-section @click="cutObject(prop.node)">Вырезать</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="() => {
                          dialogInputName = true; refDialogInputName.trigger = 'change';
                          inputNameDirectoryValue = getNodeObject(getCurrentNode().type, getCurrentNode().typeId).name;
                          refDialogInputName.name = 'Переименование объекта';
                        }">
                          <q-item-section>Переименовать</q-item-section>
                        </q-item>
                        <q-item :disable="getCurrentNode().parentId == -1 || (search ? (search.length > 0) : false)"
                          clickable v-close-popup @click="() => {
                            showConfirm(`Удалить '${getNodeObject(getCurrentNode().type, getCurrentNode().typeId).name}'?`);
                          }">
                          <q-item-section>Удалить</q-item-section>
                        </q-item>
                        <q-separator />
                      </q-list>
                    </q-menu>
                  </q-item>
                </template>

                <template v-slot:default-body="prop">
                  <div v-if="prop.node.descript">
                    {{ prop.node.description }}
                  </div>
                </template>
              </q-tree>
            </div>
          </q-scroll-area>
          <div v-else>Ошибка при построении дерева проектов</div>
        </template>
        <template v-slot:after style="overflow: hidden;">
          <div v-if="selectedObjects">
            <q-card-actions>
              <!-- <q-btn color='dark-grey' label="Открыть" /> -->
            </q-card-actions>
            <q-card-section class="text-grey">
              Тип:
              <div class="text-h6 text-white">{{ getObject(typesNewObjects, 'id', getCurrentNode().type).label }}</div>
            </q-card-section>
            <q-card-section class="text-grey">
              Наименование:
              <div class="text-h6 text-white">
                {{ getNodeObjectKey(selectedObjects).name }}
              </div>
            </q-card-section>
            <q-card-section v-if="getCurrentNode().type == TYPE_CALC_MANUAL" class="text-grey">
              Себестоимость:
              <div class="text-h6 text-white">
                {{ getDisplayCost(getNodeObjectKey(selectedObjects).cost) }}
              </div>
            </q-card-section>
            <q-card-section class="text-grey">
              Описание:
              <div class="text-h6 text-white">
                {{ getNodeObjectKey(selectedObjects).descript }}
              </div>
            </q-card-section>
          </div>
        </template>
      </q-splitter>
    </div>
    <!-- Диалог создания нового объекта -->
    <q-dialog ref="refDialogInputName" v-model="dialogInputName" persistent>
      <q-card class="text-white q-pt-none" style="width: 900px; max-width: 95vw; background-color: rgb(60, 60, 60);">
        <q-bar style="background-color: rgb(80, 80, 80);">
          <div class="text-h6">{{ refDialogInputName.name }}</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-grey text-white">Закрыть</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-card-section v-if="refDialogInputName.trigger == 'create'" class="row">
            <q-select dark class="fit text-h6" label="Тип объекта:" options-selected-class="text-h6 text-grey"
              label-active-class="text-red" popup-content-class="text-h6" outlined :options="getOptionsNewObjects()"
              option-value="id" v-model="typeNewObject"
              popup-content-style="background-color: rgb(60, 60, 60); color:  white;">
              <template v-slot:selected>
                <q-icon :name="getIcon(typeNewObject.id)" color="white" size="28px" class="q-mr-sm" />
                <div class="text-white">
                  {{ typeNewObject.label }}
                </div>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon :name="getIcon(scope.opt.id)" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
          <q-card-section class="row">
            <q-input dark class="fit text-h6" v-model="inputNameDirectoryValue" clearable outlined label="Наименование"
              lazy-rules :rules="validationName" />
          </q-card-section>
          <slot name="content" />
        </q-card-section>
        <q-card-actions align="center" class="text-black" style="background-color: rgb(60, 60, 60);">
          <q-btn v-if="refDialogInputName.trigger == 'create'" color="dark-grey" label="Создать" @click="newObject"
            :disabled="!inputNameDirectoryValue" />
          <q-btn v-if="refDialogInputName.trigger == 'change'" color="dark-grey" label="Переименовать"
            @click="changeObject" :disabled="!inputNameDirectoryValue" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Диалог добавление объекта из -->
    <AddObjectFrom ref="refDialogAddObject" />
    <!-- Диалог ошибки -->
    <DialogError ref="de" />
    <DialogConfirm ref="dc">
      <template v-slot:buttons>
        <q-btn color="red" label="Да" @click="removeObject" />
        <q-btn color="dark-grey" label="Отмена" v-close-popup />
      </template>
    </DialogConfirm>
  </q-page>
</template>

<script>
import {
  ref, defineComponent, onMounted, inject,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import DialogError from 'src/components/dialogs/error.vue';
import DialogConfirm from 'src/components/dialogs/confirm.vue';
import AddObjectFrom from 'src/components/dialogs/addObjectFrom.vue';

export default defineComponent({
  name: 'Projects',
  components: {
    DialogError,
    DialogConfirm,
    AddObjectFrom,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    let { id } = route.params;
    if (id) {
      id = Number(id);
    } else {
      id = 'all';
    }
    const {
      host,
      getObject,
      validationName,
      newObjectCalculation,
    } = inject('store');

    const TYPE_DIRECTORY = 0;
    const TYPE_CALC_MANUAL = 1;
    const TYPE_FILE = 99;
    const calculations = [];
    const files = [];
    const folders = [];
    const structure = [];
    const bufferObject = ref(null);
    const projects = ref(null);
    const selectedObjects = ref(null);
    const data = ref([]);
    const dialogInputName = ref(false);
    const inputNameDirectoryValue = ref('Новая папка');
    const refDialogInputName = ref(null);
    const typesNewObjects = ref([
      {
        id: TYPE_DIRECTORY,
        label: 'Папка',
        tableName: 'Folder',
        icon: 'folder',
        newObject: {
          description: '',
        },
      },
      {
        id: TYPE_CALC_MANUAL,
        label: 'Расчёт себестоимости',
        tableName: 'Calculation',
        icon: 'list_alt',
        newObject: newObjectCalculation,
      },
      {
        id: TYPE_FILE,
        label: 'Файл',
        tableName: 'File',
        icon: 'text_snippet',
      },
    ]);
    const typeNewObject = ref(typesNewObjects.value[0]);
    const search = ref('');
    const de = ref(null);
    const dc = ref(null);
    const refDialogAddObject = ref(null);
    function getNodeObject(type, typeId) {
      if (type === TYPE_DIRECTORY) {
        return getObject(folders, 'id', typeId);
      } if (type === TYPE_CALC_MANUAL) {
        return getObject(calculations, 'id', typeId);
      } if (type === TYPE_FILE) {
        return getObject(files, 'id', typeId);
      }
      return null;
    }
    function getNodeObjectKey(nodeKey) {
      const node = projects.value.getNodeByKey(nodeKey);
      return getNodeObject(node.type, node.typeId);
    }
    function selectNode(nodeKey) {
      console.log(nodeKey);
    }
    function getIcon(type) {
      return getObject(typesNewObjects.value, 'id', type).icon;
    }
    function getCurrentNode() {
      return projects.value.getNodeByKey(selectedObjects.value);
    }
    function resetSelect(t) {
      if (t.target === document.getElementById('field_tree').children[0].firstChild) {
        selectedObjects.value = null;
      }
    }
    function pushChildren(parent, element) {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(element);
    }
    function showError(text) {
      de.value.setName('Ошибка');
      de.value.setText(text);
      de.value.show();
    }
    function showConfirm(text) {
      dc.value.setName('Подтверждение');
      dc.value.setText(text);
      dc.value.show();
    }
    function updateStructure(callback, filter) {
      folders.length = 0;
      calculations.length = 0;
      files.length = 0;
      structure.length = 0;
      data.value.length = 0;
      selectedObjects.value = null;
      axios.get(`${host}/services/genprice/Folder`).then((responseFolder) => {
        // console.log(responseFolder);
        for (let index = 0; index < responseFolder.data.length; index += 1) {
          const dir = responseFolder.data[index];
          dir.type = getObject(typesNewObjects.value, 'id', TYPE_DIRECTORY);
          folders.push(responseFolder.data[index]);
        }
        axios.get(`${host}/services/genprice/Calculation`).then((responseCalc) => {
          // console.log(responseCalc);
          for (let index = 0; index < responseCalc.data.length; index += 1) {
            const calc = responseCalc.data[index];
            calc.type = getObject(typesNewObjects.value, 'id', TYPE_CALC_MANUAL);
            calculations.push(responseCalc.data[index]);
          }
          axios.get(`${host}/services/files/all`).then((responseFile) => {
            // console.log(responseFile);
            for (let index = 0; index < responseFile.data.length; index += 1) {
              const file = responseFile.data[index];
              file.type = getObject(typesNewObjects.value, 'id', TYPE_FILE);
              files.push(responseFile.data[index]);
            }
            axios.get(`${host}/services/genprice/StructureProject`).then((responseStructure) => {
              // console.log(responseStructure);
              const struct = responseStructure.data.reverse();
              for (let index = 0; index < struct.length; index += 1) {
                structure.push(struct[index]);
              }
              try {
                if (!filter) {
                  const root = (id === 'all') ? getObject(struct, 'parentId', -1) : getObject(struct, 'id', id);
                  const objectRoot = getNodeObject(root.type, root.typeId);
                  document.title = objectRoot.name;
                  data.value.push({
                    typeId: root.typeId,
                    type: root.type,
                    id: root.id,
                    parentId: root.parentId,
                  });
                }
                const tempStructure = structure.slice();
                while (tempStructure.length > 0) {
                  const element = tempStructure[0];
                  const searchNode = getNodeObject(element.type, element.typeId).name.indexOf(filter) !== -1;
                  if (!filter || searchNode) {
                    const parent = projects.value.getNodeByKey(element.parentId);
                    if (parent) {
                      pushChildren(parent, {
                        typeId: element.typeId,
                        type: element.type,
                        id: element.id,
                        parentId: element.parentId,
                      });
                    } else if (getObject(tempStructure, 'id', element.parentId) !== null) {
                      tempStructure.push(element);
                    } else if (searchNode) {
                      if (!projects.value.getNodeByKey(element.id)) {
                        data.value.push({
                          typeId: element.typeId,
                          type: element.type,
                          id: element.id,
                        });
                      }
                    }
                  }
                  tempStructure.shift();
                }
                if (filter) {
                  projects.value.expandAll();
                }
              } catch (err) {
                document.title = 'Не найден';
              }
              if (callback) {
                callback();
                console.log('Обновлено', data.value);
              }
            });
          });
        });
      });
    }
    function changeObject() {
      const node = getCurrentNode();
      const name = inputNameDirectoryValue.value;
      const chgObject = getNodeObject(node.type, node.typeId);
      chgObject.name = name;
      axios.post(`${host}/services/genprice/${getObject(typesNewObjects.value, 'id', node.type).tableName}/update/${chgObject.id}`, chgObject).then((resChangeObject) => {
        if (resChangeObject.data.result === 'ok') {
          updateStructure(() => {
            console.log('Переименовано');
            selectedObjects.value = node.id;
            dialogInputName.value = false;
          });
        } else if (resChangeObject.data.data === 'name must be unique') {
          showError(`${typeNewObject.value.label} "${name}" уже существует в базе данных`);
        }
      });
    }
    function newObject() {
      const node = getCurrentNode();
      const name = inputNameDirectoryValue.value;
      typeNewObject.value.newObject.name = name;
      axios.post(`${host}/services/genprice/${typeNewObject.value.tableName}/create`, typeNewObject.value.newObject).then((resNewObject) => {
        if (resNewObject.data.result === 'ok') {
          const structureObject = {
            type: typeNewObject.value.id,
            typeId: resNewObject.data.data.id,
            parentId: node.id,
          };
          axios.post(`${host}/services/genprice/StructureProject/create`, structureObject).then((resStructure) => {
            if (resStructure.data.result === 'ok') {
              structureObject.id = resStructure.data.data.id;
              console.log('Создано', structureObject);
              updateStructure(() => {
                projects.value.setExpanded(node.id, true);
                selectedObjects.value = structureObject.id;
                dialogInputName.value = false;
              });
            }
          });
        } else if (resNewObject.data.data === 'name must be unique') {
          showError(`${typeNewObject.value.label} "${name}" уже существует в базе данных`);
        }
      });
    }
    function pasteDirectoryFromBuffer(node) {
      if (bufferObject.value) {
        selectedObjects.value = null;
        const structureObject = {
          id: bufferObject.value.id,
          type: bufferObject.value.type,
          typeId: bufferObject.value.typeId,
          parentId: node.id,
        };
        axios.post(`${host}/services/genprice/StructureProject/create`, structureObject).then((resStructure) => {
          if (resStructure.data.result === 'ok') {
            console.log('Вставлено', structureObject);
            updateStructure(() => {
              projects.value.setExpanded(node.id, true);
              selectedObjects.value = structureObject.id;
            });
          }
        });
        bufferObject.value = null;
      }
    }
    function pasteFrom(node) {
      refDialogAddObject.value.setName(`Добавить объект для ${getNodeObject(node.type, node.typeId).name}`);
      const columns = [{
        name: 'name',
        required: true,
        label: 'Наименование',
        align: 'left',
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Тип',
        align: 'left',
        field: (row) => row.type.label,
        format: (val) => `${val}`,
        sortable: true,
      }];
      refDialogAddObject.value.setColumnAdd(columns);
      refDialogAddObject.value.setColumnAddBuffer(columns);
      refDialogAddObject.value.setSplitter(50);
      refDialogAddObject.value.setBufferMaterials([]);
      const allObjects = [].concat(folders, files, calculations);
      let cid = 0;
      allObjects.forEach((element) => {
        element.idTable = cid;
        cid += 1;
      });
      refDialogAddObject.value.setAllObjects(allObjects);
      refDialogAddObject.value.show(true);
      refDialogAddObject.value.exitAndSave = (objects) => {
        let add = true;
        objects.forEach((object) => {
          if (object.id === node.typeId && node.type === object.type.id) {
            add = false;
          }
        });
        if (add) {
          structure.forEach((element) => {
            if (element.type === node.type && element.typeId === node.typeId) {
              objects.forEach((object) => {
                const structureObject = {
                  type: object.type.id,
                  typeId: object.id,
                  parentId: element.id,
                };
                axios.post(`${host}/services/genprice/StructureProject/create`, structureObject).then((resStructure) => {
                  if (resStructure.data.result === 'ok') {
                    console.log('Вставлено', structureObject);
                  }
                });
              });
            }
          });
          updateStructure(() => {
            projects.value.setExpanded(node.id, true);
            selectedObjects.value = node.id;
          });
        } else {
          showError('Ошибка рекурсии!');
        }
      };
    }
    function cutObject(node) {
      bufferObject.value = node;
      selectedObjects.value = null;
      const parentNode = node.parentId;
      axios.get(`${host}/services/genprice/StructureProject/cut/${node.id}`)
        .then((resStruct) => {
          if (resStruct.data.result === 'ok') {
            console.log('Вырезано в буфер обмена', resStruct.data);
            updateStructure(() => {
              projects.value.setExpanded(parentNode, true);
              selectedObjects.value = parentNode;
            });
          }
        });
    }
    function removeObject() {
      const node = getCurrentNode();
      const parentNode = node.parentId;
      axios.get(`${host}/services/genprice/StructureProject/delete/${node.id}`)
        .then((resStruct) => {
          if (resStruct.data.result === 'ok') {
            axios.get(`${host}/services/genprice/${getObject(typesNewObjects.value, 'id', node.type).tableName}/delete/${node.typeId}`)
              .then((resObject) => {
                if (resObject.data.result === 'ok') {
                  console.log('Удалено', resStruct.data);
                  updateStructure(() => {
                    projects.value.setExpanded(parentNode, true);
                    selectedObjects.value = parentNode;
                    dc.value.hide();
                  });
                }
              });
          } else if (resStruct.data.result === 'error') {
            dc.value.hide();
            showError(resStruct.data.data);
          }
        });
    }
    function open(node, dbclick, openStat) {
      if (node.type === TYPE_CALC_MANUAL) {
        const routePath = router.resolve({ path: `/services/genprice/calculations/${node.typeId}` });
        window.open(routePath.href, '_blank');
      } else if (node.type === TYPE_DIRECTORY) {
        if (dbclick) {
          projects.value.setExpanded(selectedObjects.value, openStat || !projects.value.isExpanded(selectedObjects.value));
        } else {
          const routePath = router.resolve({ path: `/services/project/${node.id}` });
          window.open(routePath.href, '_blank');
        }
      }
    }
    function searchValue(value) {
      updateStructure(null, value);
    }
    function isTryPath() {
      return !Number.isNaN(id);
    }
    function getDisplayCost(value) {
      return new Intl.NumberFormat('ru', { style: 'currency', currency: 'RUB' }).format(Number(value));
    }
    function getOptionsNewObjects() {
      const newObjects = [];
      typesNewObjects.value.forEach((element) => {
        if (element.newObject) {
          newObjects.push(element);
        }
      });
      return newObjects;
    }
    function rightClick(target) {
      if (target.target.parentNode.id) {
        const nodeId = Number(String(target.target.parentNode.id).replace('node_', ''));
        selectedObjects.value = nodeId;
      }
    }
    onMounted(() => {
      updateStructure();
      document.getElementById('field_tree').oncontextmenu = function () {
        return false;
      };
    });
    return {
      projects,
      dialogInputName,
      refDialogInputName,
      search,
      de,
      dc,
      inputNameDirectoryValue,
      projectsSplitter: ref(60),
      selectedObjects,
      bufferObject,
      getObject,
      refDialogAddObject,
      pasteFrom,
      selectNode,
      getDisplayCost,
      getIcon,
      resetSelect,
      getNodeObject,
      newObject,
      getNodeObjectKey,
      removeObject,
      cutObject,
      changeObject,
      pasteDirectoryFromBuffer,
      open,
      searchValue,
      showConfirm,
      getCurrentNode,
      updateStructure,
      isTryPath,
      getOptionsNewObjects,
      typeNewObject,
      typesNewObjects,
      data,
      validationName,
      TYPE_DIRECTORY,
      TYPE_CALC_MANUAL,
      rightClick,
    };
  },
});
</script>

<style scoped></style>
