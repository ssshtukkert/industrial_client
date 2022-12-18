<template>
  <q-page class="text-white" padding style="background-color: rgb(60, 60, 60);">
    <q-card class="" style="background-color: rgb(60, 60, 60);">
      <q-card-section style="background-color: rgb(80, 80, 80);">
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
      <q-card-actions class="text-black">
        <q-btn color='dark-grey' icon="arrow_back" @click="exit">
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
        <q-btn color='dark-grey' :disabled="!change" icon="save" @click="writeDatabase">
          <q-tooltip v-if="change" :delay="800">
            Сохранить конфигурацию в базе данных
          </q-tooltip>
        </q-btn>
        <q-btn color='dark-grey' v-show="change" label='Отменить изменения' @click="resetChange">
          <q-tooltip v-if="change" :delay="800">
            Отменить внесённые изменения
          </q-tooltip>
        </q-btn>
        <q-btn color='dark-grey' disable icon="picture_as_pdf" :href="downloadPDF" target="_self"
          style="margin-right: 15px;">
          <q-tooltip :delay="800">
            Скачать данные в pdf файле
          </q-tooltip>
        </q-btn>
      </q-card-actions>
      <div class="bg-white text-h6">
        <q-tabs dense v-model="tab" class="text-grey" no-caps align="justify" active-color="white"
          indicator-color="white" style="background-color: rgb(60, 60, 60);">
          <q-tab name="elements">
            <div class="text-h6">Конфигуратор</div>
            <q-tooltip :delay="800">
              Вкладка для формирования структуры установки
            </q-tooltip>
          </q-tab>
          <q-tab name="blockmanual">
            <div class="text-h6">Подбор автоматики</div>
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
          <q-tab name="files">
            <div class="text-h6">Файлы</div>
            <q-tooltip :delay="800">
              Вкладка хранения пользовательских файлов
            </q-tooltip>
          </q-tab>
        </q-tabs>
        <q-tab-panels v-model="tab" animated keep-alive @transition="updateTabPanels"
          style="background-color: rgb(60, 60, 60);">
          <q-tab-panel name="card" style="min-height: 100px">
            <div class="row">
              <q-input v-model="inputDescript" dark class="fit" clearable outlined label="Описание" type="textarea"
                @update:model-value="sync" :input-style="{ resize: 'none', height: '50vh' }" />
            </div>
          </q-tab-panel>
          <q-tab-panel class="q-pa-sm" name="elements" style="background-color: rgb(60, 60, 60);">
            <q-card-actions>
              <q-btn color='dark-grey' icon="edit" @click="openDialog('Изменить конфигурацию')">
                <q-tooltip :delay="800">
                  Изменить конфигурацию (добавить или исключить используемые узлы)
                </q-tooltip>
              </q-btn>
            </q-card-actions>

            <q-splitter dark vertical v-model="splitterModelMain" separator-class="bg-white"
              style="height: 70vh; background-color: rgb(60, 60, 60);">
              <template v-slot:before style="overflow: hidden;">
                <q-splitter dark horizontal v-model="splitterModelMainSettings" separator-class="bg-white"
                  style="background-color: rgb(60, 60, 60);">
                  <template v-slot:before>
                    <q-scroll-area visible :delay="0" style=" max-width: 100%; height: 100%;"
                      :vertical-thumb-style="{ right: '2px', borderRadius: '0px', background: 'grey', width: '15px', opacity: 1 }"
                      :horizontal-thumb-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', height: '15px', opacity: 1 }"
                      :vertical-bar-style="{ right: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, width: '15px' }"
                      :horizontal-bar-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, height: '15px' }">
                      <div class="grid-container">
                        <ImageElement v-for="element in initElements" :key="element" :id="element.id"
                          :class="`grid-item white ${element.class || ''}`" :name="element.name || ''"
                          :descript="element.description || ''" :size="element.size || 'small'"
                          :imageTop="loadImage(element.imageTop)" :imageBottom="loadImage(element.imageBottom)"
                          :clickSelect="openDialog" :idname="element.id" />
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
                    </q-scroll-area>
                  </template>
                  <template v-slot:after style="overflow: hidden;">
                    <q-scroll-area visible :delay="0" style=" max-width: 100%; height: 100%;"
                      :vertical-thumb-style="{ right: '2px', borderRadius: '0px', background: 'grey', width: '15px', opacity: 1 }"
                      :horizontal-thumb-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', height: '15px', opacity: 1 }"
                      :vertical-bar-style="{ right: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, width: '15px' }"
                      :horizontal-bar-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, height: '15px' }">
                      <q-card-section class="row">
                        <!-- <div class="text-white">
                        Тип системы: {{ confType.label }}
                      </div> -->
                        <q-select dark dense class="col-4 text-h6" label="Тип системы:" options-selected-class="text-h6"
                          popup-content-class="text-h6" outlined v-model="confType" :options="confTypeOptions"
                          option-value="id" @update:model-value="updateType"
                          popup-content-style="background-color: rgb(60, 60, 60); color:  white;">
                          <template v-slot:selected>
                            <div class="text-white">
                              {{ confType.label }}
                            </div>
                          </template>
                        </q-select>
                      </q-card-section>

                    </q-scroll-area>

                  </template>
                </q-splitter>
              </template>
              <template v-slot:after>
                <q-scroll-area visible :delay="0" style=" max-width: 100%; height: 100%;"
                  :vertical-thumb-style="{ right: '2px', borderRadius: '0px', background: 'grey', width: '15px', opacity: 1 }"
                  :horizontal-thumb-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', height: '15px', opacity: 1 }"
                  :vertical-bar-style="{ right: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, width: '15px' }"
                  :horizontal-bar-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, height: '15px' }">
                  <q-card-section>
                    Элемент
                  </q-card-section>
                </q-scroll-area>

              </template>
            </q-splitter>

            <Dialog v-model="elementDialog" :elementName="dialogName" styleContent="width: 70vw; max-width: 70vw;">
              <template v-slot:buttonsWindow>
                <q-btn dense flat icon="close" @click="closeAndConfirm" v-close-popup>
                  <q-tooltip class="bg-grey text-white">Закрыть</q-tooltip>
                </q-btn>
              </template>
              <template v-slot:content>
                <div v-if="dialogName == 'Выбор основных параметров'">
                  <q-card-section class="row">
                    <q-card-section class="col-4">

                    </q-card-section>
                    <q-card-section class="col-3">
                      <q-select dark v-if="confType.label === confTypeOptions[1].label" class="text-h6 fit"
                        label="Наличие рекуператора:" options-selected-class="text-h6" popup-content-class="text-h6"
                        outlined v-model="confRecup" :options="['Да', 'Нет']" label-color="grey"
                        popup-content-style="background-color: rgb(60, 60, 60); color:  white;">
                        <template v-slot:selected>
                          <div class="text-white">
                            {{ confRecup }}
                          </div>
                        </template>
                      </q-select>
                    </q-card-section>
                  </q-card-section>
                </div>
                <div v-else-if="dialogName == 'Изменить конфигурацию'">
                  <q-splitter dark v-model="splitterModelChangeConfigure"
                    style="height: 70vh; background-color: rgb(60, 60, 60);">
                    <template v-slot:before>
                      <q-scroll-area dark visible class="fit bg-dark text-white"
                        :vertical-thumb-style="{ right: '2px', borderRadius: '0px', background: 'grey', width: '15px', opacity: 1 }"
                        :horizontal-thumb-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', height: '15px', opacity: 1 }"
                        :vertical-bar-style="{ right: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, width: '15px' }"
                        :horizontal-bar-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, height: '15px' }">
                        <q-table dark :rows="rowsElements" :columns="columnsElements" row-key="name" :filter="filter"
                          :filter-method="find" virtual-scroll selection="multiply" v-model:selected="selectedElements"
                          @update:selected="updateRowElements" v-model:pagination="pagination"
                          :rows-per-page-options="[1]" grid-header wrap-cells :no-data-label="noDataText"
                          :hide-bottom="true" :hide-header="true" @row-click="selectRowElements" separator="none"
                          style="background-color: rgb(60, 60, 60);">
                          <template v-slot:body-selection="props">
                            <q-toggle class="fit" size="4em" v-model="props.selected" @update:model-value="sync"
                              @mouseover="overElement(props.row.id)" @mouseleave="leaveElement" />
                          </template>
                          <template v-slot:body-cell="props">
                            <q-td key="name" :props="props" @mouseover="overElement(props.row.id)"
                              @mouseleave="leaveElement">
                              <q-item class="row">
                                <img class="white" :src="loadImage(props.row.icon)"
                                  style="min-height: 50px; max-height: 50px;" />
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
                      </q-scroll-area>
                    </template>
                    <template v-slot:after>
                      <q-card-section class="text-h6 text-white">
                        {{ nameElement }}
                      </q-card-section>
                      <q-card-section class="text-h8 text-white" align="center">
                        {{ descriptElement }}
                      </q-card-section>
                    </template>
                  </q-splitter>
                </div>
                <div v-else>
                  <q-card-actions>
                    <q-btn color='primary' icon="delete">
                      <q-tooltip :delay="800">
                        Исключить элемент
                      </q-tooltip>
                    </q-btn>
                  </q-card-actions>
                </div>
              </template>
              <template v-slot:actions>
                <div>
                  <q-btn color='dark-grey' label="Ок" @click="closeAndConfirm" v-close-popup></q-btn>
                </div>
              </template>
            </Dialog>
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
import {
  defaultStructure,
  inflowOutflowStructure,
} from './structuresDefault';
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
        id: 'mix_inflow',
        imageTop: 'valve.svg',
        imageBottom: 'air.svg',
        name: 'Камера смешения',
        class: 'rotate90',
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
        description: 'Вентиляторы обеспечивают подачу свежего воздуха с улицы в помещение.',
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
        id: 'vvv1',
        imageTop: 'valve.svg',
        imageBottom: 'air.svg',
        name: 'Жалюзи вент вытяжки (осн)',
      },
      {
        id: 'vvv1r',
        imageTop: 'valve.svg',
        imageBottom: 'air.svg',
        name: 'Жалюзи вент вытяжки (рез)',
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
        class: 'rotate180',
      },
      {
        id: 'vf2',
        imageTop: 'filter.svg',
        imageBottom: 'air.svg',
        name: 'Фильтр вытяжки 2',
        class: 'rotate180',
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
        id: 'fnresoutv',
        imageBottom: 'fan_reserve.svg',
        size: 'large',
      },
      {
        id: 'fnresinv',
        imageBottom: 'fan_reserve.svg',
        size: 'large',
        class: 'scaleX',
      },
      {
        id: 'arrow1',
        imageBottom: 'arrow.svg',
        class: 'grey',
      },
      {
        id: 'arrow2',
        imageBottom: 'arrow.svg',
        class: 'grey',
      },
      {
        id: 'arrow3',
        imageBottom: 'arrow.svg',
        class: 'grey rotate180',
      },
      {
        id: 'arrow4',
        imageBottom: 'arrow.svg',
        class: 'grey rotate180',
      },
      {
        id: 'arrow5',
        imageBottom: 'arrow.svg',
        class: 'grey rotate270',
      },
      {
        id: 'wall1',
        imageBottom: 'wall.svg',
        class: 'grey',
      },
      {
        id: 'wall2',
        imageBottom: 'wall.svg',
        class: 'grey',
      },
      {
        id: 'wall3',
        imageBottom: 'wall.svg',
        class: 'grey',
      },
      {
        id: 'wall4',
        imageBottom: 'wall.svg',
        class: 'grey',
      },
      {
        id: 'wall5',
        imageBottom: 'wall.svg',
        class: 'grey',
      },
      {
        id: 'wall6',
        imageBottom: 'wall.svg',
        class: 'grey',
      },
      {
        id: 'wall7',
        imageBottom: 'wall.svg',
        class: 'grey',
      },
      {
        id: 'wall8',
        imageBottom: 'wall.svg',
        class: 'grey',
      },
      {
        id: 'wall9',
        imageBottom: 'wall.svg',
        class: 'grey',
      },
      {
        id: 'wall10',
        imageBottom: 'wall.svg',
        class: 'grey',
      },
      {
        id: 'wall11',
        imageBottom: 'wall.svg',
        class: 'grey',
      },
      {
        id: 'wall12',
        imageBottom: 'wall.svg',
        class: 'grey',
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
      // Для вытяжки
      {
        id: 'air27',
        imageBottom: 'air.svg',
      },
      {
        id: 'air28',
        imageBottom: 'air.svg',
      },
      {
        id: 'air29',
        imageBottom: 'air.svg',
      },
      {
        id: 'air30',
        imageBottom: 'air.svg',
      },
      {
        id: 'air31',
        imageBottom: 'air.svg',
      },
      {
        id: 'air32',
        imageBottom: 'air.svg',
      },
      {
        id: 'air33',
        imageBottom: 'air.svg',
      },
      {
        id: 'air34',
        imageBottom: 'air.svg',
      },
      {
        id: 'air35',
        imageBottom: 'air.svg',
      },
      {
        id: 'air36',
        imageBottom: 'air.svg',
      },
      {
        id: 'air37',
        imageBottom: 'air.svg',
      },
      {
        id: 'air38',
        imageBottom: 'air.svg',
      },
      {
        id: 'air39',
        imageBottom: 'air.svg',
      },
      {
        id: 'air40',
        imageBottom: 'air.svg',
      },
      {
        id: 'air41',
        imageBottom: 'air.svg',
      },
      {
        id: 'air42',
        imageBottom: 'air.svg',
      },
      {
        id: 'air43',
        imageBottom: 'air.svg',
        class: 'rotate90',
      },
      {
        id: 'air1_up_border',
        imageBottom: 'air_up_border.svg',
      },
      {
        id: 'air2_up_border',
        imageBottom: 'air_up_border.svg',
        class: 'rotate180',
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
    const confTypeOptions = [
      {
        id: 0,
        label: 'Приточная/Вытяжная',
      },
      {
        id: 1,
        label: 'Приточно - вытяжная',
      }];
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

    let structure = {};
    function sync() {
      object.descript = inputDescript.value;
      const writeStruct = {
        type: confType.value.id,
        elements: structure,
      };
      object.structure = writeStruct;
      syncObject.value = JSON.stringify(object);
    }
    function writeDatabase() {
      const query = object;
      query.descript = inputDescript.value;
      const writeStruct = {
        type: confType.value.id,
        elements: structure,
      };
      query.structure = JSON.stringify(writeStruct);
      axios.post(`${getQueryUpdate()}/${object.id}`, query).then((res) => {
        if (res.data.result === 'ok') {
          object = res.data.data;
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
    function build(struct) {
      visibleAllElements(false);
      for (let index = 0; index < struct.length; index += 1) {
        const element = struct[index];
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
    // включает или выключает все элементы в структуре
    function setEnable(struct, val) {
      for (let index = 0; index < struct.length; index += 1) {
        const element = struct[index];
        if (element.enabled) {
          element.enable = val;
        }
      }
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
      if (dialogName.value === 'Изменить конфигурацию') {
        setEnable(structure, false);
        for (let index = 0; index < selectedElements.value.length; index += 1) {
          const element = selectedElements.value[index];
          const elementStructure = getObject(structure, 'el', element.id);
          elementStructure.enable = true;
          if (elementStructure.enableElements) {
            for (let i = 0; i < elementStructure.enableElements.length; i += 1) {
              const val = elementStructure.enableElements[i];
              const enableEl = getObject(structure, 'el', val);
              enableEl.enable = true;
            }
          }
        }
      }
      // sync();
      build(structure);
    }
    function getElement(elId) {
      return getObject(structure, 'el', elId);
    }
    function resetSelect(elId) {
      removeElementInArray(selectedElements.value, 'id', elId);
      getElement(elId).enable = false;
    }
    function createListElements() {
      // очищает список
      rowsElements.value.length = 0;
      selectedElements.value.length = 0;
      getObjectsEnadledManualsInStrc(structure).forEach((elementStruct) => {
        let en = true;

        // if (!elementStruct.enable) {
        //   if (elementStruct.disableElements) {
        //     elementStruct.disableElements.forEach((elDisable) => {
        //       if (hideElements.indexOf(elementStruct.el) === -1) {
        //         hideElements.push(elDisable);
        //       }
        //     });
        //   }
        // }

        if (elementStruct.el === 'pf1') {
          if (!getElement('pf1').enable) {
            resetSelect('pf2');
            resetSelect('pf3');
          }
        }
        if (elementStruct.el === 'pf2') {
          if (!getElement('pf1').enable) {
            en = false;
            resetSelect('pf3');
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
        // вытяжка
        if (elementStruct.el === 'vv2') {
          if (getElement('vv1r').enable) {
            en = false;
          }
        }
        if (elementStruct.el === 'vv1r') {
          if (getElement('vv2').enable) {
            en = false;
          }
        }
        if (en) {
          const elementDOM = getObject(initElements.value, 'id', elementStruct.el);
          if (elementDOM.name) {
            const elem = {
              id: elementStruct.el,
              name: elementDOM.name,
              icon: elementDOM.imageTop,
            };
            rowsElements.value.push(
              elem,
            );
            if (elementStruct.enable) {
              selectedElements.value.push(elem);
            }
          }
        }
      });
    }
    function updateRowsElements(newSelected) {
      // console.log(newSelected);

      if (newSelected) { // если идёт обновление по изменению конфигурации
        getObjectsEnadledManualsInStrc(structure).forEach((elementStruct) => {
          elementStruct.enable = false;
        });
        newSelected.forEach((elementNewSelected) => {
          const sel = getObject(structure, 'el', elementNewSelected.id);
          sel.enable = true;
          console.log(sel);
          if (sel.el === 'pf1') {
            if (!getElement('pf1').enable) {
              resetSelect('pf2');
              resetSelect('pf3');
            }
          }
        });
      }
      // else {
      //   selectedElements.value.length = 0;
      // }
      createListElements();
    }
    function selectClickElement(elName) {
      const obj = getObject(initElements.value, 'id', elName);
      if (obj) {
        dialogName.value = obj.name;
      } else {
        dialogName.value = elName;
      }
      updateRowsElements();
      elementDialog.value = true;
    }
    function updateType(value) {
      if (value) {
        if (value.id === confTypeOptions[0].id) {
          structure = defaultStructure.elements;
          console.log(55);
        } else if (value.id === confTypeOptions[1].id) {
          structure = inflowOutflowStructure.elements;
          console.log(5);
        }
        setEnable(structure, false);
        build(structure);
        sync();
      }
    }
    function selectRowElements(event, row) {
      console.log(event, row);
      selectedElements.value.push(row);
    }

    function tableMaterialsUpdate(selected) {
      add.value = selected.length > 0;
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
    function update(callback) {
      axios.get(`${getQueryAll()}/${id}`)
        .then((res) => {
          if (res.data.result === 'ok') {
            object = res.data.data;
            name.value = object.name;
            document.title = object.name;
            updatedAt.value = object.updatedAt;
            inputDescript.value = object.descript;
            console.log(id, path);
            const readStruct = JSON.parse(object.structure);
            confType.value = confTypeOptions[readStruct.type];
            structure = readStruct.elements;
            // updateType(confTypeOptions[readStruct.type]);
            build(structure);
            // build(inflowOutflowStructure.elements);
            // setEnable(defaultStructure.elements, false);
            // build(defaultStructure.elements);
            axios
              .get(`${host}/services/genprice/Setting`).then((responseS) => {
                console.log(responseS);
                if (callback) {
                  callback();
                }
              });
          }
        });
    }
    function resetChange() {
      update(
        () => {
          sync();
          change.value = false;
        },
      );
    }
    onMounted(() => {
      for (let index = 0; index < initElements.value.length; index += 1) {
        const element = initElements.value[index];
        initElement(element.id);
      }

      // visibleAllElements(true);
      // initElement('rec');

      update();
    });
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
      sync,
      dc,
      dex,
      removeMain,
      validationNumberNoZero,
      tableMaterialsUpdate,
      updateSearch,
      add,
      removeFromBuffer,
      tableAddMaterials,
      change,
      writeDatabase,
      inputDescript,
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
      splitterModelMain: ref(70),
      splitterModelMainSettings: ref(65),
      splitterModelChangeConfigure: ref(60),
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
  margin: 5px;
  border: 1px solid grey;
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-template-columns: repeat(27, 1fr);
  grid-template-areas:
    ". . . . . . . . . . . . . . . . . . . . . . . ."
    "item1-1 item1-2 item1-3 item1-4 item1-5 item1-6 item1-7 item1-8 item1-9 item1-10 item1-11 item1-12 item1-13 item1-14 item1-15 item1-16 item1-17 item1-18 item1-19 item1-20 item1-21 item1-22 item1-23 item1-24 item1-25 item1-26 item1-27"
    "item2-1 item2-2 item2-3 item2-4 item2-5 item2-6 item2-7 item2-8 item2-9 item2-10 item2-11 item2-12 item2-13 item2-14 item2-15 item2-16 item2-17 item2-18 item2-19 item2-20 item2-21 item2-22 item2-23 item2-24 item2-25 item2-26 item2-27"
    "item3-1 item3-2 item3-3 item3-4 item3-5 item3-6 item3-7 item3-8 item3-9 item3-10 item3-11 item3-12 item3-13 item3-14 item3-15 item3-16 item3-17 item3-18 item3-19 item3-20 item3-21 item3-22 item3-23 item3-24 item3-25 item3-26 item3-27"
    "item4-1 item4-2 item4-3 item4-4 item4-5 item4-6 item4-7 item4-8 item4-9 item4-10 item4-11 item4-12 item4-13 item4-14 item4-15 item4-16 item4-17 item4-18 item4-19 item4-20 item4-21 item4-22 item4-23 item4-24 item4-25 item4-26 item4-27"
    "item5-1 item5-2 item5-3 item5-4 item5-5 item5-6 item5-7 item5-8 item5-9 item5-10 item5-11 item5-12 item5-13 item5-14 item5-15 item5-16 item5-17 item5-18 item5-19 item5-20 item5-21 item5-22 item5-23 item5-24 item5-25 item5-26 item5-27"
    ". . . . . . . . . . . . . . . . . . . . . . . .";
}

.grid-item {
  font-size: 2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
