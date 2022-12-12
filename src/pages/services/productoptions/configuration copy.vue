<template>
  <q-page padding>
    <q-card class="bg-white">
      <q-card-section class="bg-secondary">
        <q-btn color='orange' label='< Назад к списку' style="margin-right: 15px;" @click="exit">
          <q-tooltip>
            Вернуться к списку конфигураций
          </q-tooltip>
        </q-btn>
        <DialogConfirm ref="dex">
          <template v-slot:buttons>
            <q-btn color='red' label="Не сохранять и выйти" @click="confirmExit" />
            <q-btn color='green' label="Сохранить и выйти" @click="confirmExitAndSave" />
            <q-btn color='primary' label="Отмена" v-close-popup />
          </template>
        </DialogConfirm>
        <q-btn color='primary' :disabled="!change" label='Записать' @click="writeDatabase" style="margin-right: 15px;">
          <q-tooltip>
            Сохранить конфигурацию в базе данных
          </q-tooltip>
        </q-btn>
        <q-btn color='primary' v-show="change" label='Отменить изменения' @click="resetChange"
          style="margin-right: 15px;">
          <q-tooltip v-if="change">
            Обновить содержимое
          </q-tooltip>
        </q-btn>
        <q-btn color='primary' disable label='Экспорт в PDF' :href="downloadPDF" target="_self"
          style="margin-right: 15px;">
          <q-tooltip>
            Скачать данные в pdf файле
          </q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section class="text-black">
        <div class="text-h6">
          Конфигурация {{ name }} от {{ updatedAt }}
          <a v-show="change"> *
            <q-tooltip>
              * - означает что внесены изменения, для сохранения изменений необходимо "Записать" конфигурацию в базу
              данных
            </q-tooltip>
          </a>
        </div>
      </q-card-section>
      <div class="row">
      </div>
      <div class="bg-white text-h6">
        <q-tabs v-model="tab" class="text-black" no-caps align="justify" active-color="teal" indicator-color="teal">
          <q-tab name="elements">
            <div class="text-h6">Конфигуратор</div>
            <q-tooltip>
              Вкладка для формирования структуры установки
            </q-tooltip>
          </q-tab>
          <q-tab name="card">
            <div class="text-h6">Карточка</div>
            <q-tooltip>
              Основная информация о конфигурации
            </q-tooltip>
          </q-tab>
          <q-tab name="kip">
            <div class="text-h6">Комплект КИПиА</div>
            <q-tooltip>
              Вкладка для формирования перечня контрольно-измерительных приборов и оборудования автоматики
            </q-tooltip>
          </q-tab>
          <q-tab name="blockmanual">
            <div class="text-h6">Подбор ЩУ</div>
            <q-tooltip>
              Подбирает маркировку и рассчитывает стоимость щита управления для выбранной конфигурации
            </q-tooltip>
          </q-tab>
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated keep-alive @transition="updateTabPanels">
          <q-tab-panel name="card" style="min-height: 100px">
            <div class="row">
              <q-input v-model="inputDescript" class="fit" clearable outlined label="Описание" type="textarea"
                @update:model-value="syncTableMaterials" :input-style="{ resize: 'none', height: '50vh' }" />
            </div>
          </q-tab-panel>
          <q-tab-panel class="q-pa-sm " name="elements">
            <q-card>
              <q-card-actions>
                <q-btn color='primary' label='Основные параметры' @click="openDialog('Выбор основных параметров')" />
                <q-btn color='primary' label='Добавить' @click="openDialog('Добавить новое оборудование')" />
              </q-card-actions>
              <div align="center">
                <div v-if="confType == 'Приточная'">
                  Приточная система
                </div>
                <div v-if="confType == 'Приточно - вытяжная'">
                  Приточно - вытяжная система
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="row fit">
                    <!-- <div class="col bg-light-blue-8" /> -->
                    <div class="col-1">
                      <ImageElement name="Жалюзи притока" :imageTop="require('./components/valve.svg')"
                        :clickSelect="openDialog" />
                    </div>
                    <div class="col-1">
                      <ImageElement name="Камера смешения" :imageTop="require('./components/recircle.svg')"
                        :clickSelect="openDialog" />
                    </div>
                    <div class="col">
                      <ImageElement />
                    </div>
                    <div class="col-1">
                      <ImageElement name="Фильтр притока 1" :imageTop="require('./components/filter.svg')"
                        :clickSelect="openDialog" />
                    </div>
                    <div class="col-1">
                      <ImageElement name="Фильтр притока 2" :imageTop="require('./components/filter.svg')"
                        :clickSelect="openDialog" />
                    </div>
                    <div class="col-1">
                      <ImageElement name="Фильтр притока 3" :imageTop="require('./components/filter.svg')"
                        :clickSelect="openDialog" />
                    </div>
                    <div class="col-1">
                      <ImageElement name="Преднагреватель" :imageTop="require('./components/heater.svg')"
                        :clickSelect="openDialog" />
                    </div>
                    <div class="col">
                      <ImageElement />
                    </div>
                  </div>
                  <div v-if="confType === 'Приточно - вытяжная'" class="row fit">
                    <!-- <div class="col-1 bg-light-blue-8" /> -->
                    <div class="col-1">
                      <ImageElement name="Жалюзи вытяжки" :imageTop="require('./components/valve.svg')"
                        :clickSelect="openDialog" />
                    </div>
                    <div class="col">
                      <ImageElement />
                    </div>
                  </div>
                </div>
                <!-- Рекуператор -->
                <div v-if="confType === 'Приточно - вытяжная' && confRecup == 'Да'" class="col-1 self-center" ref="rec">
                  <ImageElement name="Рекуператор" :imageTop="require('./components/recuperator.svg')" size="large"
                    :clickSelect="openDialog" />
                </div>
                <div class="col fit">
                  <div v-for="flow in orderFlows" :key="flow">
                    <div v-if="confType === 'Приточно - вытяжная' &&
                    flow === 'outflow'" class="row">
                      <div class="col">
                        <ImageElement />
                      </div>
                      <div class="col-1">
                        <div ref="vv2">
                          <ImageElement name="Вент вытяжки 2" :imageTop="require('./components/fan.svg')"
                            :clickSelect="openDialog" />
                        </div>
                      </div>
                      <div class="col-1">
                        <div ref="vv1">
                          <ImageElement name="Вент вытяжки 1" :imageTop="require('./components/fan.svg')"
                            :clickSelect="openDialog" />
                        </div>
                      </div>
                      <div class="col-1">
                        <ImageElement name="Фильтр вытяжки 2" :imageTop="require('./components/filter.svg')"
                          :clickSelect="openDialog" />
                      </div>
                      <div class="col-1">
                        <ImageElement name="Фильтр вытяжки 1" :imageTop="require('./components/filter.svg')"
                          :clickSelect="openDialog" />
                      </div>
                      <div class="col">
                        <ImageElement />
                      </div>
                      <!-- <div class="col bg-grey-9" /> -->
                    </div>
                    <div v-if="flow === 'inflow'" class="row">
                      <div class="col">
                        <ImageElement />
                      </div>
                      <div class="col-1">
                        <ImageElement name="Теплообменник 1" :imageTop="require('./components/heater.svg')"
                          :clickSelect="openDialog" />
                      </div>
                      <div class="col-1">
                        <ImageElement name="Теплообменник 2" :imageTop="require('./components/heater.svg')"
                          :clickSelect="openDialog" />
                      </div>
                      <div class="col-1">
                        <ImageElement name="Теплообменник 3" :imageTop="require('./components/heater.svg')"
                          :clickSelect="openDialog" />
                      </div>
                      <div class="col-1">
                        <ImageElement name="Охладитель 1" :imageTop="require('./components/cooler.svg')"
                          :clickSelect="openDialog" />
                      </div>
                      <div class="col-1">
                        <ImageElement name="Охладитель 2" :imageTop="require('./components/cooler.svg')"
                          :clickSelect="openDialog" />
                      </div>
                      <div class="col-1">
                        <ImageElement name="Увлажнитель" :imageTop="require('./components/humdity.svg')"
                          :clickSelect="openDialog" />
                      </div>
                      <div class="col-1">
                        <div class="row">
                          <ImageElement name="Вент притока 2" :imageTop="require('./components/fan.svg')"
                            :clickSelect="openDialog" />
                          <ImageElement name="Вент притока 2" :imageTop="require('./components/fan.svg')"
                            :clickSelect="openDialog" />
                        </div>
                      </div>
                      <div class="col fit">
                        <ImageElement />
                      </div>
                      <!-- <div class="col bg-grey-9" /> -->
                    </div>
                  </div>
                </div>
              </div>
              <Dialog v-model="elementDialog" :elementName="dialogName" style="width: 600px;">
                <template v-slot:content>
                  <div v-if="dialogName == 'Выбор основных параметров'">
                    <q-card-section class="row">
                      <q-card-section class="col-4">
                        <q-select class="text-h6" label="Тип системы:" options-selected-class="text-h6"
                          popup-content-class="text-h6" outlined v-model="confType" :options="confTypeOptions"
                          @update:model-value="updateType" />
                      </q-card-section>
                      <q-card-section class="col-3">
                        <q-select v-if="confType == 'Приточно - вытяжная'" class="text-h6" label="Наличие рекуператора:"
                          options-selected-class="text-h6" popup-content-class="text-h6" outlined v-model="confRecup"
                          :options="['Да', 'Нет']" @update:model-value="updateType" />
                      </q-card-section>
                    </q-card-section>
                  </div>
                  <div v-else-if="dialogName == 'Добавить новое оборудование'">
                    Добавление нового оборудования: клапан воздушный притока, теплообменник
                  </div>
                  <div v-else>
                  </div>
                  <div v-if="dialogName == 'Выбор основных параметров'">
                    <q-card-section class="row">
                      <q-card-section class="col-6">
                        <q-select class="text-h6 fit" label="Тип системы:" options-selected-class="text-h6"
                          popup-content-class="text-h6" outlined v-model="confType" :options="confTypeOptions"
                          @update:model-value="updateType" />
                      </q-card-section>
                      <q-card-section class="col-6">
                        <q-select v-if="confType == 'Приточно - вытяжная'" class="text-h6 fit"
                          label="Наличие рекуператора:" options-selected-class="text-h6" popup-content-class="text-h6"
                          outlined v-model="confRecup" :options="['Да', 'Нет']" @update:model-value="updateType" />
                      </q-card-section>
                    </q-card-section>
                  </div>
                  <div v-else-if="dialogName == 'Добавить новое оборудование'">
                    Добавление нового оборудования: клапан воздушный притока, теплообменник
                  </div>
                  <div v-else>
                  </div>
                </template>
              </Dialog>
            </q-card>
          </q-tab-panel>
          <q-tab-panel name="laboriousness" style="min-height: 600px">
            <q-input v-model="inputLaboriousnes" @update:model-value="syncTableMaterials" class="text-h6" outlined
              label="Трудозатраты" type="number" :rules="validationNumberNoZero" suffix="ч." style="width: 160px;"
              auto-save />
          </q-tab-panel>
          <q-tab-panel name="blockmanual" style="min-height: 100px">
            <div class="row">
              <q-card-section class="text-h6 col-6">
                <q-badge color="primary" class="text-h6">
                  Маркировка ЩУ: ABU-W-1-ZM
                </q-badge>
              </q-card-section>
            </div>
            <div class="row">
              <q-card-section class="text-h6 col-6">
                <q-badge color="primary" class="text-h6">
                  Себестоимость ЩУ: 0 руб
                </q-badge>
              </q-card-section>
            </div>
          </q-tab-panel>
          <q-tab-panel name="files" style="min-height: 400px">
            <div class="q-pa-md">
              <q-uploader url="http://10.154.152.88:3001/upload/disk"
                :headers="[{ name: 'X-Custom-Timestamp', value: 1550240306080 }]" style="max-width: 300px" />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import {
  ref, defineComponent, inject, onMounted, watch,
} from 'vue';

import DialogConfirm from 'src/components/dialogs/confirm.vue';
import ImageElement from 'src/pages/services/productoptions/components/imageElement.vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Dialog from './components/dialog.vue';

export default defineComponent({
  name: 'GenPricePage',
  components: {
    DialogConfirm,
    ImageElement,
    Dialog,
  },
  setup() {
    const { host, getProp, validationNumberNoZero } = inject('store');
    const path = `${host}/services/genprice/calculation/pdf/`;
    const downloadPDF = ref(host);
    const route = useRoute();
    const router = useRouter();
    const { id } = route.params;
    const tab = ref('elements');
    const tableMaterials = ref(null);
    const tableAddMaterials = ref(null);
    const tableAddMaterialsBuffer = ref(null);
    const inputDescript = ref(null);
    const inputLaboriousnes = ref(10);
    const change = ref(false);
    const add = ref(false);
    const addMaterialsCategorySelector = ref(null);
    const addMaterialsCategorySelectorOp = ref([]);
    const removeFromBuffer = ref(false);
    const removeBuffer = ref(false);
    const dc = ref(null);
    const dex = ref(null);
    const removeMain = ref(false);
    const dialogAddMaterials = ref(false);
    const cost = ref(0);
    const wh = ref([0, 0]);
    const weight = ref(0);
    const costAll = ref(0);
    const costOneHourWorker = ref(0);
    const percentOfMaterials = ref(0);

    // ссылки
    // const colorSelect = 'bg-teal';
    const refsElements = [];
    const vp1 = ref(null);
    refsElements.push(vp1);
    const vp2 = ref(null);
    refsElements.push(vp2);

    //
    const elementDialog = ref(false);
    const dialogName = ref('');
    const confTypeOptions = ['Приточная', 'Приточно - вытяжная'];
    const confType = ref(confTypeOptions[0]);
    const orderFlows = ref(['outflow', 'inflow']);
    const confRecup = ref('Нет');

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
        name: 'count',
        align: 'left',
        label: 'Количество',
        field: 'count',
        sortable: true,
      },
      {
        name: 'cost',
        align: 'left',
        label: 'Цена за 1 ед., руб',
        field: 'cost',
        sortable: true,
      },
    ];
    const columnsAddMaterials = [{
      name: 'name',
      required: true,
      label: 'Материал',
      align: 'left',
      field: (row) => row.name,
      format: (val) => `${val}`,
      sortable: false,
    }];
    const columnsAddMaterialsBuffer = [
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
        name: 'count',
        align: 'left',
        label: 'Количество',
        field: 'count',
        sortable: true,
      },
    ];
    const allMaterials = [];
    const allMaterialCaterories = [];
    const rowsEntryMaterials = ref([]);
    const rowsAllMaterials = ref([]);
    const rowsAddMaterialsBuffer = ref([]);
    // готовые
    function confirmExit() {
      router.push('/services/productoptions/configurations');
    }
    function getPathList() {
      return '/services/productoptions/configurations';
    }
    function getQueryAll() {
      return `${host}/services/productoptions/Configuration`;
    }
    const name = ref('');
    const updatedAt = ref('');
    function getQueryUpdate() {
      return `${getQueryAll()}/update`;
    }
    function updateTabPanels(val) {
      console.log(val);
    }
    let object = null;
    const syncObject = ref(null);
    //
    function getEntryMaterials() {
      const mat = [];
      for (let index = 0; index < rowsEntryMaterials.value.length; index += 1) {
        const element = rowsEntryMaterials.value[index];
        mat.push({
          id: Number(element.id),
          count: Number(element.count),
        });
      }
      return mat;
    }
    function getCost(listMaterials) {
      let sum = 0;
      for (let index = 0; index < listMaterials.length; index += 1) {
        const element = listMaterials[index];
        sum += Number(getProp(rowsAllMaterials.value, element.id, 'cost') || 0) * element.count;
      }
      return sum.toFixed(2);
    }
    function getWeight(listMaterials) {
      let sum = 0;
      for (let index = 0; index < listMaterials.length; index += 1) {
        const element = listMaterials[index];
        sum += Number(getProp(rowsAllMaterials.value, element.id, 'weight') || 0);
      }
      return sum.toFixed(2);
    }
    function getWidthHeight(listMaterials) {
      if (listMaterials.length > 0) {
        const sumWidth = [];
        const sumHeight = [];
        for (let index = 0; index < listMaterials.length; index += 1) {
          const element = listMaterials[index];
          sumWidth.push(Number(getProp(rowsAllMaterials.value, element.id, 'width') || 0));
          sumHeight.push(Number(getProp(rowsAllMaterials.value, element.id, 'height') || 0));
        }
        const maxWidth = Math.max.apply(null, sumWidth);
        const maxHeight = Math.max.apply(null, sumHeight);
        return [maxWidth, maxHeight];
      } return [0, 0];
    }
    function getCostAll(costMaterials, laboriousness) {
      let sum = 0;
      if (costMaterials > 0) {
        sum = costMaterials * (percentOfMaterials.value / 100 + 1) + laboriousness * costOneHourWorker.value;
      }
      return sum.toFixed(2);
    }
    function updateSelectedTableMaterials(newSelected) {
      removeMain.value = newSelected.length > 0;
    }
    function updateSelectedTableMaterialsBuffer(newSelected) {
      removeFromBuffer.value = newSelected.length > 0;
    }
    function syncTableMaterials() {
      object.descript = inputDescript.value;
      object.materials = getEntryMaterials();
      cost.value = getCost(object.materials);
      costAll.value = getCostAll(cost.value, inputLaboriousnes.value);
      object.cost = costAll.value;
      object.laboriousness = inputLaboriousnes.value;
      syncObject.value = JSON.stringify(object);
    }
    function changeCount(value) {
      tableMaterials.value.selected[0].count = value;
      syncTableMaterials();
    }
    function resetSelectTableAddMaterials() {
      tableAddMaterials.value.selected.length = 0;
    }
    function update(callback) {
      // запрос метаданных из справочника материалов
      rowsAllMaterials.value.length = 0;
      allMaterials.length = 0;
      allMaterialCaterories.length = 0;
      addMaterialsCategorySelectorOp.value.length = 0;
      addMaterialsCategorySelectorOp.value.push('Все');
      const selectDefault = addMaterialsCategorySelectorOp.value[0];
      addMaterialsCategorySelector.value = selectDefault;
      axios
        .get(`${host}/services/genprice/MaterialCategory`).then((responseC) => {
          for (let index = 0; index < responseC.data.length; index += 1) {
            const m = responseC.data[index];
            allMaterialCaterories.push(m);
            addMaterialsCategorySelectorOp.value.push(m.name);
          }
          axios
            .get(`${host}/services/genprice/Material`).then((responseM) => {
              for (let index = 0; index < responseM.data.length; index += 1) {
                const m = responseM.data[index];
                rowsAllMaterials.value.push(m);
                allMaterials.push(m);
              }
              rowsEntryMaterials.value.length = 0;
              axios.get(`${getQueryAll()}/${id}`)
                .then((res) => {
                  if (res.data.result === 'ok') {
                    object = res.data.data;
                    name.value = object.name;
                    document.title = object.name;
                    updatedAt.value = object.updatedAt;
                    inputDescript.value = object.descript;
                    const materialsEntry = JSON.parse(object.materials);
                    for (let index = 0; index < materialsEntry.length; index += 1) {
                      const element = materialsEntry[index];
                      rowsEntryMaterials.value.push({
                        id: Number(element.id),
                        name: getProp(rowsAllMaterials.value, element.id, 'name'),
                        count: Number(element.count),
                        cost: Number(getProp(rowsAllMaterials.value, element.id, 'cost')),
                      });
                    }
                    axios
                      .get(`${host}/services/genprice/Setting`).then((responseS) => {
                        costOneHourWorker.value = responseS.data[0].value;
                        percentOfMaterials.value = responseS.data[1].value;
                        inputLaboriousnes.value = object.operations;
                        cost.value = getCost(materialsEntry);
                        weight.value = getWeight(materialsEntry);
                        wh.value = getWidthHeight(materialsEntry);
                        costAll.value = getCostAll(cost.value, inputLaboriousnes.value);
                        if (callback) {
                          callback();
                        }
                        const query = {
                          name: encodeURIComponent(object.name),
                          wh: wh.value,
                          weight: weight.value,
                        };
                        downloadPDF.value = `${path}${object.id}/${JSON.stringify(query)}`;
                      });
                  }
                });
            });
        });
    }
    function resetChange() {
      update(
        () => {
          syncTableMaterials();
          change.value = false;
        },
      );
    }
    function writeDatabase() {
      const query = object;
      query.descript = inputDescript.value;
      query.cost = costAll.value;
      query.materials = JSON.stringify(getEntryMaterials());
      query.operations = inputLaboriousnes.value;
      axios.post(`${getQueryUpdate()}/${object.id}`, query).then((res) => {
        if (res.data.result === 'ok') {
          object = res.data.data;
          update();
          change.value = false;
        }
      });
    }

    function confirmExitAndSave() {
      writeDatabase();
      confirmExit();
    }
    function exit() {
      if (change.value) {
        dex.value.setName('Подтверждение');
        dex.value.setText('Данные не сохранены, покинуть страницу?');
        dex.value.show();
      } else {
        confirmExit();
      }
    }
    window.addEventListener('beforeunload', (e) => {
      if (change.value) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'handler.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(`key=${encodeURIComponent('Hi')}`);

        e.preventDefault();
        console.log(e);
        const confirmationMessage = '';
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      }
      return true;
    }, false);
    onMounted(() => {
      update();
    });
    function tableMaterialsUpdate(selected) {
      add.value = selected.length > 0;
    }
    function updateRowsAllMaterials() {
      rowsAllMaterials.value.length = 0;
      for (let index = 0; index < allMaterials.length; index += 1) {
        const element = allMaterials[index];
        if (getProp(allMaterialCaterories, element.category, 'name') === addMaterialsCategorySelector.value
          || addMaterialsCategorySelector.value === 'Все') {
          rowsAllMaterials.value.push(element);
        }
      }
    }
    function actionAddMaterial() {
      updateRowsAllMaterials();
      rowsAddMaterialsBuffer.value.length = 0;
      for (let index = 0; index < rowsEntryMaterials.value.length; index += 1) {
        const element = rowsEntryMaterials.value[index];
        rowsAddMaterialsBuffer.value.push(element);
      }
      dialogAddMaterials.value = true;
    }
    function addMaterialsCategoryUpdate() {
      updateRowsAllMaterials();
    }
    function actionRemoveMaterial() {
      const arr = tableMaterials.value.selected;
      let objectsNames = arr[0].name;
      for (let index = 1; index < arr.length; index += 1) {
        const element = arr[index];
        objectsNames += `, ${element.name}`;
      }
      dc.value.setName('Удаление');
      dc.value.setText(`Удалить "${objectsNames}"?`);
      dc.value.show();
    }
    function actionRemoveBufferMaterial() {
      for (let i = 0; i < tableAddMaterialsBuffer.value.selected.length; i += 1) {
        let ind = -1;
        for (let index = 0; index < rowsAddMaterialsBuffer.value.length; index += 1) {
          if (rowsAddMaterialsBuffer.value[index].id === tableAddMaterialsBuffer.value.selected[i].id) {
            ind = index;
            break;
          }
        }
        rowsAddMaterialsBuffer.value.splice(ind, 1);
      }
      tableAddMaterialsBuffer.value.selected.length = 0;
      updateSelectedTableMaterialsBuffer(tableAddMaterialsBuffer.value.selected);
    }
    function confirmAddMaterial() {
      for (let i = 0; i < tableAddMaterials.value.selected.length; i += 1) {
        let addMaterial = true;
        for (let index = 0; index < rowsAddMaterialsBuffer.value.length; index += 1) {
          const element = rowsAddMaterialsBuffer.value[index];
          if (element.id === tableAddMaterials.value.selected[i].id) {
            const sum = Number(element.count) + 1;
            element.count = sum;
            addMaterial = false;
          }
        }
        if (addMaterial) {
          const material = {
            id: tableAddMaterials.value.selected[i].id,
            name: tableAddMaterials.value.selected[i].name,
            count: 1,
          };
          rowsAddMaterialsBuffer.value.push(material);
        }
      }
    }
    function confirmAddEntryMaterial() {
      rowsEntryMaterials.value.length = 0;
      for (let index = 0; index < rowsAddMaterialsBuffer.value.length; index += 1) {
        const element = rowsAddMaterialsBuffer.value[index];
        element.cost = Number(getProp(rowsAllMaterials.value, element.id, 'cost'));
        rowsEntryMaterials.value.push(element);
      }
      syncTableMaterials();
      dialogAddMaterials.value = false;
    }
    function confirmDeleteAction(all) {
      for (let ind = 0; ind < tableMaterials.value.selected.length; ind += 1) {
        const material = tableMaterials.value.selected[ind];
        let i = -1;
        for (let index = 0; index < rowsEntryMaterials.value.length; index += 1) {
          const element = rowsEntryMaterials.value[index];
          if (element.id === material.id) {
            if (all) {
              i = index;
            } else {
              const sum = Number(element.count) - 1;
              element.count = sum;
              if (element.count === 0) {
                i = index;
              }
            }
            break;
          }
        }
        if (i !== -1) {
          rowsEntryMaterials.value.splice(i, 1);
        }
      }
      tableMaterials.value.selected.length = 0;
      updateSelectedTableMaterials(tableMaterials.value.selected);
      dc.value.hide();
      syncTableMaterials();
    }
    function updateSearch() {
      resetSelectTableAddMaterials();
      tableMaterialsUpdate(tableAddMaterials.value.selected.length);
    }
    function getMaterialsCount() {
      let materialsCount = 0;
      const materialsSorted = getEntryMaterials();
      for (let index = 0; index < materialsSorted.length; index += 1) {
        const element = materialsSorted[index];
        materialsCount += Number(element.count);
      }
      return materialsCount;
    }
    // оставить
    watch(syncObject, (newValue, oldValue) => {
      change.value = (newValue !== oldValue);
    }, { flush: 'sync' });
    // новые функции
    function selectClickElement(elName) {
      dialogName.value = elName;
      elementDialog.value = true;
    }
    function updateType() {
      if (confRecup.value === 'Нет') {
        orderFlows.value = ['inflow', 'outflow'];
      } else if (confRecup.value === 'Да') {
        orderFlows.value = ['outflow', 'inflow'];
      }
    }
    return {
      // новые
      Dialog,
      openDialog: selectClickElement,
      elementDialog,
      dialogName,
      confType,
      confTypeOptions,
      confRecup,
      orderFlows,
      updateType,
      addMaterialsCategoryUpdate,
      addMaterialsCategorySelector,
      addMaterialsCategorySelectorOp,
      actionRemoveBufferMaterial,
      removeBuffer,
      confirmExitAndSave,
      columnsAddMaterialsBuffer,
      confirmExit,
      exit,
      downloadPDF,
      costOneHourWorker,
      percentOfMaterials,
      syncTableMaterials,
      dc,
      dex,
      removeMain,
      validationNumberNoZero,
      tableMaterialsUpdate,
      updateSearch,
      add,
      removeFromBuffer,
      columnsAddMaterials,
      actionAddMaterial,
      actionRemoveMaterial,
      tableAddMaterials,
      changeCount,
      change,
      rowsEntryMaterials,
      rowsAllMaterials,
      rowsAddMaterialsBuffer,
      writeDatabase,
      inputDescript,
      inputLaboriousnes,
      getPathList,
      name,
      updatedAt,
      getQueryAll,
      getQueryUpdate,
      DialogConfirm,
      tableMaterials,
      tableAddMaterialsBuffer,
      updateTabPanels,
      tab,
      columns,
      dialogAddMaterials,
      confirmAddMaterial,
      confirmAddEntryMaterial,
      confirmDeleteAction,
      updateSelectedTableMaterials,
      updateSelectedTableMaterialsBuffer,
      cost,
      weight,
      wh,
      costAll,
      update,
      resetChange,
      splitterModel: ref(50),
      getMaterialsCount,
      //
      vp1,
      vp2,
      ImageElement,
    };
  },
});
</script>
