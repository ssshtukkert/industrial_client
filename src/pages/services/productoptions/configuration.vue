<template>
  <q-page padding>
    <q-card class="bg-white">
      <q-card-section class="bg-secondary">
        <div class="text-h6 text-white">
          Конфигурация {{ name }} от {{ updatedAt }}
          <a v-show="change"> *
            <q-tooltip :delay="800">
              * - означает что внесены изменения, для сохранения изменений необходимо "Записать" конфигурацию в базу
              данных
            </q-tooltip>
          </a>
        </div>
      </q-card-section>
      <q-card-section class="text-black">
        <q-btn color='orange' label='< Назад к списку' style="margin-right: 15px;" @click="exit">
          <q-tooltip :delay="800">
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
        <q-btn color='primary' :disabled="!change" icon="save" @click="writeDatabase" style="margin-right: 15px;">
          <q-tooltip :delay="800">
            Сохранить конфигурацию в базе данных
          </q-tooltip>
        </q-btn>
        <q-btn color='primary' v-show="change" label='Отменить изменения' @click="resetChange"
          style="margin-right: 15px;">
          <q-tooltip v-if="change" :delay="800">
            Отменить внесённые изменения
          </q-tooltip>
        </q-btn>
        <q-btn color='primary' disable label='Экспорт в PDF' :href="downloadPDF" target="_self"
          style="margin-right: 15px;">
          <q-tooltip :delay="800">
            Скачать данные в pdf файле
          </q-tooltip>
        </q-btn>
      </q-card-section>
      <div class="row">
      </div>
      <div class="bg-white text-h6">
        <q-tabs v-model="tab" class="text-black" no-caps align="justify" active-color="teal" indicator-color="teal">
          <q-tab name="elements">
            <div class="text-h6">Конфигуратор</div>
            <q-tooltip :delay="800">
              Вкладка для формирования структуры установки
            </q-tooltip>
          </q-tab>
          <q-tab name="blockmanual">
            <div class="text-h6">Подбор ЩУ</div>
            <q-tooltip :delay="800">
              Подбирает маркировку и рассчитывает стоимость щита управления для выбранной конфигурации
            </q-tooltip>
          </q-tab>
          <q-tab name="card">
            <div class="text-h6">Карточка</div>
            <q-tooltip :delay="800">
              Основная информация о конфигурации
            </q-tooltip>
          </q-tab>
          <q-tab name="kip">
            <div class="text-h6">Комплект КИПиА</div>
            <q-tooltip :delay="800">
              Вкладка для формирования перечня контрольно-измерительных приборов и оборудования автоматики
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
                <q-btn color='primary' icon="settings" @click="openDialog('Выбор основных параметров')">
                  <q-tooltip :delay="800">
                    Выбор основных параметров
                  </q-tooltip>
                </q-btn>
                <q-btn color='primary' icon="edit" @click="openDialog('Изменить конфигурацию')">
                  <q-tooltip :delay="800">
                    Изменить конфигурацию (добавить или исключить используемые узлы)
                  </q-tooltip>
                </q-btn>
              </q-card-actions>
              <div align="center">
                <div v-if="confType == 'Приточная'">
                  Приточная/Вытяжная система
                </div>
                <div v-if="confType == 'Приточно - вытяжная'">
                  Приточно - вытяжная система
                </div>
              </div>
              <div class="row">
                <div class="grid-container">
                  <ImageElement v-for="element in initElements" :key="element" :id="element.id"
                    :class="`grid-item ${element.class || ''}`" :name="element.name || ''" :descript="element.description || ''"
                    :size="element.size || 'small'" :imageTop="loadImage(element.imageTop)"
                    :imageBottom="loadImage(element.imageBottom)" :clickSelect="openDialog" />
                  <!-- :imageTop="require(`./components/${element.imageTop}`)" -->
                  <!-- <ImageElement id="fnresinp" class="grid-item" :imageBottom="require('./components/fan_reserve.svg')"
                    size="large" />
                  <ImageElement id="fnresoutp" class="grid-item scaleX"
                    :imageBottom="require('./components/fan_reserve.svg')" size="large" />
                  <ImageElement id="rec" class="grid-item" name="Рекуператор"
                    :imageTop="require('./components/recuperator.svg')" :clickSelect="openDialog" /> -->

                  <!-- <ImageElement v-for="index in 23" :key="index" :id="`air${index}`" class="grid-item" />
                  <ImageElement v-for="index in 10" :key="index" :id="`wall${index}`" class="grid-item" /> -->

                </div>
              </div>
              <Dialog v-model="elementDialog" :elementName="dialogName" styleContent="width: 70vw; max-width: 70vw;">
                <template v-slot:buttonsWindow>
                  <q-btn dense flat icon="close" @click="closeAndConfirm" v-close-popup>
                    <q-tooltip class="bg-grey text-white">Закрыть</q-tooltip>
                  </q-btn>
                </template>
                <template v-slot:content>
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
                          outlined v-model="confRecup" :options="['Да', 'Нет']" />
                      </q-card-section>
                    </q-card-section>
                  </div>
                  <div v-else-if="dialogName == 'Изменить конфигурацию'">
                    <q-splitter v-model="splitterModel" style="height: 70vh">
                      <template v-slot:before>
                        <q-table class="fit" :rows="rowsElements" :columns="columnsElements" row-key="name"
                          :filter="filter" :filter-method="find" virtual-scroll selection="multiply"
                          v-model:selected="selectedElements" @update:selected="updateRowElements"
                          v-model:pagination="pagination" :rows-per-page-options="[1]" grid-header wrap-cells
                          :no-data-label="noDataText" :hide-bottom="true" :hide-header="true"
                          @row-click="selectRowElements" bordered separator="none">
                          <template v-slot:body-selection="props">
                            <q-toggle class="fit" size="4em" v-model="props.selected"
                              @mouseover="overElement(props.row.id)" @mouseleave="leaveElement" />
                          </template>
                          <template v-slot:body-cell="props">
                            <q-td key="name" :props="props" @mouseover="overElement(props.row.id)"
                              @mouseleave="leaveElement">
                              <q-item class="row">
                                <img :src="loadImage(props.row.icon)" style="min-height: 50px; max-height: 50px;" />
                                <div style="padding-left: 10px;">
                                  <div class="text-h6">
                                    {{ props.row.name }}
                                  </div>
                                  <div class="text-h8 text-grey">
                                    {{ props.row.name }}
                                  </div>
                                </div>
                              </q-item>
                            </q-td>
                          </template>
                        </q-table>
                      </template>
                      <template v-slot:after>
                        <q-card-section class="text-h6">
                          {{ nameElement }}
                        </q-card-section>
                        <q-card-section class="text-h8" align="center">
                          {{ descriptElement }}
                        </q-card-section>
                      </template>
                    </q-splitter>
                  </div>
                  <div v-else>
                  </div>
                </template>
                <template v-slot:actions>
                  <div>
                    <q-btn color='primary' label="Применить" @click="closeAndConfirm" v-close-popup></q-btn>
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
import ImageElement from 'src/pages/services/productoptions/components/imageElement.vue';
import DialogConfirm from 'src/components/dialogs/confirm.vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
// import Table_v2 from 'src/components/tables/table_simple_v2.vue';
import Dialog from './components/dialog.vue';

export default defineComponent({
  name: 'ProductOptionsPage',
  components: {
    DialogConfirm,
    Dialog,
    ImageElement,
  },
  setup() {
    const {
      host,
      // getProp,
      removeElementInArray,
      getObject,
      validationNumberNoZero, // removeElementInArray,
    } = inject('store');
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

    // ссылки
    const initElements = ref([
      {
        id: 'pvlv1',
        imageTop: 'valve.svg',
        imageBottom: 'air.svg',
        name: 'Жалюзи притока 1',
      },
      {
        id: 'mix',
        imageTop: 'recircle.svg',
        imageBottom: 'air.svg',
        name: 'Камера смешения',
      },
      {
        id: 'pf1',
        imageTop: 'filter.svg',
        imageBottom: 'air.svg',
        name: 'Фильтр притока 1',
      },
      {
        id: 'pf2',
        imageTop: 'filter.svg',
        imageBottom: 'air.svg',
        name: 'Фильтр притока 2',
      },
      {
        id: 'pf3',
        imageTop: 'filter.svg',
        imageBottom: 'air.svg',
        name: 'Фильтр притока 3',
      },
      {
        id: 'prhe',
        imageTop: 'heater.svg',
        imageBottom: 'air.svg',
        name: 'Преднагреватель',
      },
      {
        id: 'pv1',
        imageTop: 'fan.svg',
        imageBottom: 'air.svg',
        name: 'Вент притока 1',
        description: 'Вентиляторы обеспечивают подачу свежего воздуха с улицы в помещение и выброс отработанного воздуха за пределы помещения.',
      },
      {
        id: 'pv1r',
        imageTop: 'fan.svg',
        imageBottom: 'air.svg',
        name: 'Вент притока 1 (рез)',
      },
      {
        id: 'pv2',
        imageTop: 'fan.svg',
        imageBottom: 'air.svg',
        name: 'Вент притока 2',
        description: 'Осуществляет подачу свежего воздуха в помещение',
      },
      {
        id: 'pvlv2',
        imageTop: 'valve.svg',
        imageBottom: 'air.svg',
        name: 'Жалюзи притока 2',
      },
      {
        id: 'vpv1',
        imageTop: 'valve.svg',
        imageBottom: 'air.svg',
        name: 'Жалюзи вент притока (осн)',
      },
      {
        id: 'vpv1r',
        imageTop: 'valve.svg',
        imageBottom: 'air.svg',
        name: 'Жалюзи вент притока (рез)',
      },
      {
        id: 'vvlv1',
        imageTop: 'valve.svg',
        imageBottom: 'air.svg',
        name: 'Жалюзи вытяжки 1',
      },
      {
        id: 'vvlv2',
        imageTop: 'valve.svg',
        imageBottom: 'air.svg',
        name: 'Жалюзи вытяжки 2',
      },
      {
        id: 'toh1',
        imageTop: 'heater.svg',
        imageBottom: 'air.svg',
        name: 'Нагреватель 1',
      },
      {
        id: 'toh2',
        imageTop: 'heater.svg',
        imageBottom: 'air.svg',
        name: 'Нагреватель 2',
      },
      {
        id: 'toh3',
        imageTop: 'heater.svg',
        imageBottom: 'air.svg',
        name: 'Нагреватель 3',
      },
      {
        id: 'toc1',
        imageTop: 'cooler.svg',
        imageBottom: 'air.svg',
        name: 'Охладитель 1',
      },
      {
        id: 'toc2',
        imageTop: 'cooler.svg',
        imageBottom: 'air.svg',
        name: 'Охладитель 2',
      },
      {
        id: 'hum',
        imageTop: 'humdity.svg',
        imageBottom: 'air.svg',
        name: 'Увлажнитель',
      },
      {
        id: 'tkan',
        imageTop: 'temperature.svg',
        imageBottom: 'air.svg',
        name: 'Датчик температуры в канале',
      },
      {
        id: 'tud',
        imageTop: 'temperature.svg',
        imageBottom: 'air.svg',
        name: 'Датчик температуры удаляемого воздуха',
      },
      {
        id: 'tnar',
        imageTop: 'temperature.svg',
        name: 'Датчик температуры уличный',
      },
      {
        id: 'troom',
        imageTop: 'temperature.svg',
        name: 'Датчик температуры в помещении',
      },
      {
        id: 'press',
        imageTop: 'pressure.svg',
        imageBottom: 'air.svg',
        name: 'Датчик давления',
      },
      {
        id: 'co2',
        imageTop: 'co2.svg',
        imageBottom: 'air.svg',
        name: 'Датчик углекислого газа',
      },
      {
        id: 'hummes',
        imageTop: 'humdity_meas.svg',
        imageBottom: 'air.svg',
        name: 'Датчик влажности',
      },
      {
        id: 'vv1',
        imageTop: 'fan.svg',
        imageBottom: 'air.svg',
        name: 'Вент вытяжки 1',
        description: 'Осуществляет подачу свежего воздуха в помещение',
      },
      {
        id: 'vv1r',
        imageTop: 'fan.svg',
        imageBottom: 'air.svg',
        name: 'Вент вытяжки 1 (рез)',
      },
      {
        id: 'vv2',
        imageTop: 'fan.svg',
        imageBottom: 'air.svg',
        name: 'Вент вытяжки 2',
        description: 'Осуществляет подачу свежего воздуха в помещение',
      },
      {
        id: 'vf1',
        imageTop: 'filter.svg',
        imageBottom: 'air.svg',
        name: 'Фильтр вытяжки 1',
      },
      {
        id: 'vf2',
        imageTop: 'filter.svg',
        imageBottom: 'air.svg',
        name: 'Фильтр вытяжки 2',
      },
      {
        id: 'fnresoutp',
        imageBottom: 'fan_reserve.svg',
        size: 'large',
        class: 'scaleX',
      },
      {
        id: 'fnresinp',
        imageBottom: 'fan_reserve.svg',
        size: 'large',
      },
      {
        id: 'arrow1',
        imageBottom: 'arrow.svg',
      },
      {
        id: 'arrow2',
        imageBottom: 'arrow.svg',
      },
      {
        id: 'arrow3',
        imageBottom: 'arrow.svg',
      },
      {
        id: 'arrow4',
        imageBottom: 'arrow.svg',
        class: 'rotate180',
      },
      {
        id: 'wall1',
        imageBottom: 'wall.svg',
      },
      {
        id: 'wall2',
        imageBottom: 'wall.svg',
      },
      {
        id: 'wall3',
        imageBottom: 'wall.svg',
      },
      {
        id: 'wall4',
        imageBottom: 'wall.svg',
      },
      {
        id: 'wall5',
        imageBottom: 'wall.svg',
      },
      {
        id: 'wall6',
        imageBottom: 'wall.svg',
      },
      {
        id: 'wall7',
        imageBottom: 'wall.svg',
      },
      {
        id: 'wall8',
        imageBottom: 'wall.svg',
      },
      {
        id: 'wall9',
        imageBottom: 'wall.svg',
      },
      {
        id: 'wall10',
        imageBottom: 'wall.svg',
      },
      {
        id: 'air1',
        imageBottom: 'air.svg',
      },
      {
        id: 'air2',
        imageBottom: 'air.svg',
      },
      {
        id: 'air3',
        imageBottom: 'air.svg',
      },
      {
        id: 'air4',
        imageBottom: 'air.svg',
      },
      {
        id: 'air5',
        imageBottom: 'air.svg',
      },
      {
        id: 'air6',
        imageBottom: 'air.svg',
      },
      {
        id: 'air7',
        imageBottom: 'air.svg',
      },
      {
        id: 'air8',
        imageBottom: 'air.svg',
      },
      {
        id: 'air9',
        imageBottom: 'air.svg',
      },
      {
        id: 'air10',
        imageBottom: 'air.svg',
      },
      {
        id: 'air11',
        imageBottom: 'air.svg',
      },
      {
        id: 'air12',
        imageBottom: 'air.svg',
      },
      {
        id: 'air13',
        imageBottom: 'air.svg',
      },
      {
        id: 'air14',
        imageBottom: 'air.svg',
      },
      {
        id: 'air15',
        imageBottom: 'air.svg',
      },
      {
        id: 'air16',
        imageBottom: 'air.svg',
      },
      {
        id: 'air17',
        imageBottom: 'air.svg',
      },
      {
        id: 'air18',
        imageBottom: 'air.svg',
      },
      {
        id: 'air19',
        imageBottom: 'air.svg',
      },
      {
        id: 'air20',
        imageBottom: 'air.svg',
      },
      {
        id: 'air21',
        imageBottom: 'air.svg',
      },
      {
        id: 'air22',
        imageBottom: 'air.svg',
      },
      {
        id: 'air23',
        imageBottom: 'air.svg',
      },
      {
        id: 'air24',
        imageBottom: 'air.svg',
      },
      {
        id: 'air25',
        imageBottom: 'air.svg',
      },
      {
        id: 'air26',
        imageBottom: 'air.svg',
      },
    ]);
    // const elements = {};
    const columnsElements = [{
      name: 'name',
      required: true,
      label: 'Материал',
      align: 'left',
      field: (row) => row.name,
      format: (val) => `${val}`,
      sortable: false,
    }];
    const rowsElements = ref([]);
    const selectedElements = ref([]);
    //
    const elementDialog = ref(false);
    const nameElement = ref('');
    const descriptDefault = 'Включите либо отключите необходимые узлы системы';
    const descriptElement = ref(descriptDefault);
    const dialogName = ref('');
    const confTypeOptions = ['Приточная', 'Приточно - вытяжная'];
    const confType = ref(confTypeOptions[0]);
    const orderFlows = ref(['outflow', 'inflow']);
    const confRecup = ref('Да');

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

    function syncTableMaterials() {
      object.descript = inputDescript.value;
      object.laboriousness = inputLaboriousnes.value;
      syncObject.value = JSON.stringify(object);
    }

    function resetChange() {
      // update(
      //   () => {
      //     syncTableMaterials();
      //     change.value = false;
      //   },
      // );
    }
    function writeDatabase() {
      const query = object;
      query.descript = inputDescript.value;
      query.operations = inputLaboriousnes.value;
      axios.post(`${getQueryUpdate()}/${object.id}`, query).then((res) => {
        if (res.data.result === 'ok') {
          object = res.data.data;
          // update();
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
        const confirmationMessage = '';
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      }
      return true;
    }, false);
    function loadImage(file) {
      if (file) {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        return require(`./components/${file}`);
      }
      return '';
    }
    // функция перемещает элемент
    function moveElement(element, x, y, w, h) {
      if (w && h) {
        element.style = `grid-area: ${y} / ${x} / span ${h} / span ${w};`;
      } else {
        element.style = `grid-area: item${y}-${x};`;
      }
    }
    // функция задаёт видимость элементу
    function displayElement(element, visible) {
      if (!visible) {
        element.style.display = 'none';
      } else {
        element.style.display = 'true';
      }
    }

    // инициализирует элемент
    function initElement(elementName, newObject) {
      const element = document.getElementById(elementName);
      const objectInit = getObject(initElements.value, 'id', elementName);
      if (objectInit != null) {
        objectInit.element = element;
      } else if (newObject) {
        newObject.id = elementName;
        newObject.element = element;
        initElements.value.push(newObject);
      }
      displayElement(element, false);
    }
    // function setPropElement(elementName, prop, value) {
    //   const objectInit = getObject(initElements.value, elementName);
    //   objectInit[prop] = value;
    // }
    // скрывает все элементы
    function visibleAllElements(visible) {
      for (let index = 0; index < initElements.value.length; index += 1) {
        const { element } = initElements.value[index];
        displayElement(element, visible);
      }
    }
    // формирует область объектов из структуры
    function build(structure) {
      visibleAllElements(false);
      for (let index = 0; index < structure.length; index += 1) {
        const element = structure[index];
        const elementDOM = getObject(initElements.value, 'id', element.el);
        const elementDOMbottom = getObject(initElements.value, 'id', element.bottom);
        if (elementDOM != null) {
          if (!element.enabled) {
            moveElement(elementDOM.element, element.x, element.y, element.w || 1, element.h || 1);
          } else if (element.enable) {
            moveElement(elementDOM.element, element.x, element.y, element.w || 1, element.h || 1);
          } else if (element.bottom && elementDOMbottom != null) {
            moveElement(elementDOMbottom.element, element.x, element.y, 1, 1);
          }
        }
      }
    }
    function setEnable(structure, val) {
      for (let index = 0; index < structure.length; index += 1) {
        const element = structure[index];
        if (element.enabled) {
          element.enable = val;
        }
      }
      build(structure);
    }
    // добавляеь элемент в массив
    // function addElementInArray(array, el, x, y, w, h) {
    //   array.push({
    //     el,
    //     x,
    //     y,
    //     w,
    //     h,
    //   });
    // }
    const structure = [
      {
        el: 'wall1',
        x: 2,
        y: 1,
      },
      {
        el: 'wall2',
        x: 2,
        y: 3,
      },
      {
        el: 'wall3',
        x: 2,
        y: 5,
      },
      {
        el: 'pvlv1',
        x: 2,
        y: 2,
      },
      {
        el: 'mix',
        x: 3,
        y: 2,
      },
      {
        el: 'air3',
        x: 3,
        y: 4,
        w: 7,
        h: 1,
      },
      {
        el: 'pf1',
        x: 4,
        y: 2,
      },
      {
        el: 'pf2',
        x: 5,
        y: 2,
      },
      {
        el: 'pf3',
        x: 6,
        y: 2,
      },
      {
        el: 'prhe',
        x: 7,
        y: 2,
      },
      {
        el: 'rec',
        x: 8,
        y: 2,
        w: 2,
        h: 3,
      },
      {
        el: 'vv2',
        x: 11,
        y: 2,
      },
      {
        el: 'vv1',
        x: 12,
        y: 2,
      },
      {
        el: 'air3',
        x: 10,
        y: 2,
        w: 1,
        h: 1,
      },
      {
        el: 'air4',
        x: 15,
        y: 2,
        w: 10,
        h: 1,
      },
      {
        el: 'vf1',
        x: 13,
        y: 2,
      },
      {
        el: 'vf2',
        x: 14,
        y: 2,
      },
      {
        el: 'vvlv1',
        x: 2,
        y: 4,
      },
      {
        el: 'air5',
        x: 3,
        y: 4,
      },
      {
        el: 'toh1',
        x: 10,
        y: 4,
      },
      {
        el: 'toh2',
        x: 11,
        y: 4,
      },
      {
        el: 'toh3',
        x: 12,
        y: 4,
      },
      {
        el: 'toc1',
        x: 13,
        y: 4,
      },
      {
        el: 'toc2',
        x: 14,
        y: 4,
      },
      {
        el: 'hum',
        x: 15,
        y: 4,
      },
      {
        el: 'fnresinp',
        x: 16,
        y: 4,
        w: 1,
        h: 2,
      },
      {
        el: 'vpv1',
        x: 17,
        y: 4,
      },
      {
        el: 'vpv1r',
        x: 17,
        y: 5,
      },
      {
        el: 'pv1',
        x: 18,
        y: 4,
      },
      {
        el: 'pv1r',
        x: 18,
        y: 5,
      },
      {
        el: 'fnresoutp',
        x: 19,
        y: 4,
        w: 1,
        h: 2,
      },
      {
        el: 'pv2',
        x: 20,
        y: 4,
      },
      {
        el: 'tkan',
        x: 24,
        y: 4,
      },
      {
        el: 'tnar',
        x: 1,
        y: 3,
      },
      {
        el: 'tud',
        x: 3,
        y: 4,
      },
      {
        el: 'hummes',
        x: 21,
        y: 4,
      },
      {
        el: 'co2',
        x: 22,
        y: 4,
      },
      {
        el: 'troom',
        x: 25,
        y: 3,
      },
      {
        el: 'press',
        x: 23,
        y: 4,
      },
      // {
      //   el: 'air6',
      //   x: 19,
      //   y: 4,
      //   w: 5,
      //   h: 1,
      // },
      {
        el: 'air7',
        x: 4,
        y: 4,
        w: 4,
        h: 1,
      },
      {
        el: 'arrow1',
        x: 1,
        y: 2,
      },
      {
        el: 'arrow2',
        x: 25,
        y: 2,
      },
      {
        el: 'arrow3',
        x: 1,
        y: 4,
      },
      {
        el: 'arrow4',
        x: 25,
        y: 4,
      },
    ];
    const structureInflow = [
      {
        el: 'air12',
        x: 7,
        y: 2,
      },
      {
        el: 'air21',
        x: 14,
        y: 2,
        w: 2,
        h: 1,
      },
      {
        enabled: false,
        el: 'wall1',
        x: 2,
        y: 1,
      },
      {
        enabled: false,
        el: 'wall2',
        x: 2,
        y: 3,
      },
      {
        enabled: false,
        el: 'wall3',
        x: 2,
        y: 4,
      },
      {
        enabled: false,
        el: 'wall4',
        x: 2,
        y: 5,
      },
      {
        enabled: false,
        el: 'wall5',
        x: 2,
        y: 6,
      },
      {
        enabled: false,
        el: 'wall6',
        x: 26,
        y: 1,
      },
      {
        enabled: false,
        el: 'wall7',
        x: 26,
        y: 3,
      },
      {
        enabled: false,
        el: 'wall8',
        x: 26,
        y: 4,
      },
      {
        enabled: false,
        el: 'wall9',
        x: 26,
        y: 5,
      },
      {
        enabled: false,
        el: 'wall10',
        x: 26,
        y: 6,
      },
      {
        enabled: false,
        el: 'pvlv1',
        x: 2,
        y: 2,
      },
      {
        enabled: true,
        el: 'mix',
        manual: true,
        enable: true,
        bottom: 'air1',
        x: 3,
        y: 2,
      },
      {
        enabled: true,
        enable: false,
        manual: true,
        el: 'pf1',
        bottom: 'air13',
        x: 4,
        y: 2,
      },
      {
        enabled: true,
        el: 'pf2',
        manual: true,
        enable: true,
        bottom: 'air2',
        x: 5,
        y: 2,
      },
      {
        enabled: true,
        el: 'pf3',
        manual: true,
        enable: true,
        bottom: 'air3',
        x: 6,
        y: 2,
      },
      {
        enabled: true,
        enable: true,
        manual: true,
        el: 'toh1',
        bottom: 'air4',
        x: 8,
        y: 2,
      },
      {
        enabled: true,
        enable: true,
        manual: true,
        el: 'toh2',
        bottom: 'air5',
        x: 9,
        y: 2,
      },
      {
        enabled: true,
        enable: true,
        manual: true,
        el: 'toh3',
        bottom: 'air6',
        x: 10,
        y: 2,
      },
      {
        enabled: true,
        enable: true,
        manual: true,
        el: 'toc1',
        bottom: 'air7',
        x: 11,
        y: 2,
      },
      {
        enabled: true,
        enable: true,
        manual: true,
        el: 'toc2',
        bottom: 'air8',
        x: 12,
        y: 2,
      },
      {
        enabled: true,
        enable: true,
        manual: true,
        el: 'hum',
        bottom: 'air9',
        x: 13,
        y: 2,
      },
      {
        enabled: true,
        manual: false,
        enable: true,
        el: 'fnresinp',
        bottom: 'air10',
        x: 16,
        y: 2,
        w: 1,
        h: 2,
      },
      {
        enabled: true,
        manual: false,
        enable: true,
        el: 'vpv1',
        bottom: 'air11',
        x: 17,
        y: 2,
      },
      {
        enabled: true,
        manual: false,
        enable: true,
        el: 'vpv1r',
        x: 17,
        y: 3,
      },
      {
        enabled: false,
        el: 'pv1',
        x: 18,
        y: 2,
      },
      {
        enabled: true,
        enable: true,
        manual: true,
        el: 'pv1r',
        enableElements: ['vpv1r', 'vpv1', 'fnresoutp', 'fnresinp'],
        x: 18,
        y: 3,
      },
      {
        enabled: true,
        enable: true,
        manual: false,
        bottom: 'air14',
        el: 'fnresoutp',
        x: 19,
        y: 2,
        w: 1,
        h: 2,
      },

      {
        enabled: true,
        enable: true,
        manual: true,
        el: 'pv2',
        bottom: 'air15',
        x: 20,
        y: 2,
      },
      {
        enabled: true,
        enable: false,
        manual: true,
        el: 'tkan',
        bottom: 'air19',
        x: 25,
        y: 2,
      },
      {
        enabled: true,
        manual: true,
        enable: true,
        el: 'tnar',
        x: 1,
        y: 3,
      },
      {
        enabled: true,
        enable: true,
        manual: true,
        el: 'hummes',
        bottom: 'air16',
        x: 21,
        y: 2,
      },
      {
        enabled: true,
        enable: true,
        manual: true,
        bottom: 'air17',
        el: 'co2',
        x: 22,
        y: 2,
      },
      {
        el: 'air23',
        x: 23,
        y: 2,
      },
      {
        enabled: true,
        enable: true,
        manual: true,
        el: 'troom',
        x: 27,
        y: 3,
      },
      {
        enabled: true,
        enable: true,
        manual: true,
        el: 'press',
        bottom: 'air18',
        x: 24,
        y: 2,
      },
      {
        enabled: true,
        enable: false,
        el: 'pvlv2',
        manual: true,
        bottom: 'air22',
        x: 26,
        y: 2,
      },
      {
        enabled: false,
        el: 'arrow1',
        x: 1,
        y: 2,
      },
      {
        enabled: false,
        el: 'arrow2',
        x: 27,
        y: 2,
      },
    ];
    function updateType() {
      if (confType.value === 'Приточная') {
        setEnable(structureInflow, false);
      } else if (confType.value === 'Приточно - вытяжная') {
        build(structure);
      }
    }
    // function updateRowsElements(newSelected) {
    //   function getObjectsEnadledManualsInStrc(struct) {
    //     const objects = [];
    //     for (let index = 0; index < struct.length; index += 1) {
    //       const element = struct[index];
    //       if (element.enabled) {
    //         if (element.manual) {
    //           objects.push(element);
    //         }
    //       }
    //     }
    //     return objects;
    //   }
    //   // очищает список
    //   rowsElements.value.length = 0;
    //   console.log(newSelected);
    //   // если идёт обновление по изменению конфигурации
    //   if (newSelected) {
    //     getObjectsEnadledManualsInStrc(structureInflow).forEach((elementStruct) => {
    //       if (elementStruct.el === 'pf2') {
    //         console.log('pf1');
    //       }
    //       newSelected.forEach((elementNewSelected) => {
    //         console.log(elementStruct, elementNewSelected);
    //       });
    //     });
    //   } else { // если идёт обновление без изменения конфигурации
    //     for (let index = 0; index < structureInflow.length; index += 1) {
    //       const element = structureInflow[index];
    //       if (element.enabled) {
    //         if (element.manual) {
    //           const en = true;
    //           if (en) {
    //             const elementDOM = getObject(initElements.value, 'id', element.el);
    //             if (elementDOM.name) {
    //               rowsElements.value.push(
    //                 {
    //                   id: element.el,
    //                   name: elementDOM.name,
    //                   icon: elementDOM.imageTop,
    //                 },
    //               );
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    function getObjectsEnadledManualsInStrc(struct) {
      const objects = [];
      for (let index = 0; index < struct.length; index += 1) {
        const element = struct[index];
        if (element.enabled) {
          if (element.manual) {
            objects.push(element);
          }
        }
      }
      return objects;
    }
    function closeAndConfirm() {
      setEnable(structureInflow, false);
      for (let index = 0; index < selectedElements.value.length; index += 1) {
        const element = selectedElements.value[index];
        const elementStructure = getObject(structureInflow, 'el', element.id);
        elementStructure.enable = true;
        if (elementStructure.enableElements) {
          for (let i = 0; i < elementStructure.enableElements.length; i += 1) {
            const val = elementStructure.enableElements[i];
            const enableEl = getObject(structureInflow, 'el', val);
            enableEl.enable = true;
          }
        }
      }
      build(structureInflow);
    }
    function updateRowsElements(newSelected) {
      function getElement(elId) {
        return getObject(structureInflow, 'el', elId);
      }
      function resetSelect(elId) {
        if (newSelected) {
          removeElementInArray(newSelected, 'id', elId);
          getElement(elId).enable = false;
        }
      }
      // очищает список
      rowsElements.value.length = 0;
      // console.log(newSelected);

      if (newSelected) { // если идёт обновление по изменению конфигурации
        getObjectsEnadledManualsInStrc(structureInflow).forEach((elementStruct) => {
          elementStruct.enable = false;
        });
        newSelected.forEach((elementNewSelected) => {
          getObject(structureInflow, 'el', elementNewSelected.id).enable = true;
        });
      }
      getObjectsEnadledManualsInStrc(structureInflow).forEach((elementStruct) => {
        let en = true;
        if (elementStruct.el === 'pf1') {
          if (!getElement('pf1').enable) {
            resetSelect('pf2');
            resetSelect('pf3');
          }
        }
        if (elementStruct.el === 'pf2') {
          if (!getElement('pf1').enable) {
            en = false;
          }
        }
        if (elementStruct.el === 'pf3') {
          if (!getElement('pf2').enable) {
            en = false;
          }
        }
        if (elementStruct.el === 'toh1') {
          if (!getElement('toh1').enable) {
            resetSelect('toh2');
            resetSelect('toh3');
          }
        }
        if (elementStruct.el === 'toh2') {
          if (!getElement('toh1').enable) {
            en = false;
          }
        }
        if (elementStruct.el === 'toh3') {
          if (!getElement('toh2').enable) {
            en = false;
          }
        }
        if (elementStruct.el === 'toc1') {
          if (!getElement('toc1').enable) {
            resetSelect('toc2');
          }
        }
        if (elementStruct.el === 'toc2') {
          if (!getElement('toc1').enable) {
            en = false;
          }
        }
        if (elementStruct.el === 'pv2') {
          if (getElement('pv1r').enable) {
            en = false;
          }
        }
        if (elementStruct.el === 'pv1r') {
          if (getElement('pv2').enable) {
            en = false;
          }
        }
        if (elementStruct.el === 'tkan' || elementStruct.el === 'troom') {
          if (!getElement('toh1').enable) {
            resetSelect('tkan');
            resetSelect('troom');
            en = false;
          }
        }
        if (elementStruct.el === 'hummes') {
          if (!getElement('hum').enable) {
            en = false;
          }
        }
        if (en) {
          const elementDOM = getObject(initElements.value, 'id', elementStruct.el);
          if (elementDOM.name) {
            rowsElements.value.push(
              {
                id: elementStruct.el,
                name: elementDOM.name,
                icon: elementDOM.imageTop,
              },
            );
          }
        }
      });
      build(structureInflow);
    }
    function selectClickElement(elName) {
      dialogName.value = elName;
      updateRowsElements();
      elementDialog.value = true;
    }
    function update() {
      axios.get(`${getQueryAll()}/${id}`)
        .then((res) => {
          if (res.data.result === 'ok') {
            object = res.data.data;
            name.value = object.name;
            document.title = object.name;
            updatedAt.value = object.updatedAt;
            inputDescript.value = object.descript;
            console.log(id, path);
            axios
              .get(`${host}/services/genprice/Setting`).then((responseS) => {
                console.log(responseS);
              });
          }
        });
    }
    onMounted(() => {
      for (let index = 0; index < initElements.value.length; index += 1) {
        const element = initElements.value[index];
        initElement(element.id);
      }

      // visibleAllElements(true);
      // initElement('rec');

      updateType();
      update();
    });
    function selectRowElements(event, row) {
      console.log(event, row);
      // selectedElements.value.push(row);
    }

    function tableMaterialsUpdate(selected) {
      add.value = selected.length > 0;
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
    function overElement(val) {
      const obj = getObject(initElements.value, 'id', val);
      nameElement.value = obj.name;
      descriptElement.value = obj.description || '';
    }
    function leaveElement() {
      nameElement.value = '';
      descriptElement.value = descriptDefault;
    }
    function updateSearch() {
    }
    // оставить
    watch(syncObject, (newValue, oldValue) => {
      change.value = (newValue !== oldValue);
    }, { flush: 'sync' });
    // новые функции

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
      updateRowElements: updateRowsElements,
      // список элементов для таблицы выбора при добавлении
      initElements,
      rowsElements,
      columnsElements,
      selectedElements,
      selectRowElements,
      loadImage,
      //
      addMaterialsCategorySelector,
      addMaterialsCategorySelectorOp,
      removeBuffer,
      confirmExitAndSave,
      confirmExit,
      exit,
      downloadPDF,
      syncTableMaterials,
      dc,
      dex,
      removeMain,
      validationNumberNoZero,
      tableMaterialsUpdate,
      updateSearch,
      add,
      removeFromBuffer,
      actionRemoveMaterial,
      tableAddMaterials,
      change,
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
      dialogAddMaterials,
      resetChange,
      splitterModel: ref(60),
      closeAndConfirm,
      pagination: ref({
        rowsPerPage: 0,
      }),
      ImageElement,
      overElement,
      nameElement,
      descriptElement,
      leaveElement,
    };
  },
});
</script>
<style>
.grid-container {
  width: 100%;
  height: 100%;
  margin: 5px;
  border: 1px solid #212226;
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-template-columns: repeat(27, 1fr);
  grid-template-areas:
    ". . . . . . . . . . . . . . . . . . . . . . . ."
    "item1-1 item1-2 item1-3 item1-4 item1-5 item1-6 item1-7 item1-8 item1-9 item1-10 item1-11 item1-12 item1-13 item1-14 item1-15 item1-16 item1-17 item1-18 item1-19 item1-20 item1-21 item1-22 item1-23 item1-24 item1-25 item1-26 item1-27"
    "item2-1 item2-2 item2-3 item2-4 item2-5 item2-6 item2-7 item2-8 item2-9 item2-10 item2-11 item2-12 item2-13 item2-14 item2-15 item2-16 item2-17 item2-18 item2-19 item2-20 item2-21 item2-22 item2-23 item2-24 item2-25 item2-26 item2-27"
    "item3-1 item3-2 item3-3 item3-4 item3-5 item3-6 item3-7 item3-8 item3-9 item3-10 item3-11 item3-12 item3-13 item3-14 item3-15 item3-16 item3-17 item3-18 item3-19 item3-20 item3-21 item3-22 item3-23 item3-24 item3-25 item3-26 item3-27"
    "item4-1 item4-2 item4-3 item4-4 item4-5 item4-6 item4-7 item4-8 item4-9 item4-10 item4-11 item4-12 item4-13 item4-14 item4-15 item4-16 item4-17 item4-18 item4-19 item4-20 item4-21 item4-22 item4-23 item4-24 item4-25 item4-26 item4-27"
    ". . . . . . . . . . . . . . . . . . . . . . . .";
}

.recuperator {
  grid-area: 2 / 10 / span 3 / span 1;
}

.grid-item {
  font-size: 2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
