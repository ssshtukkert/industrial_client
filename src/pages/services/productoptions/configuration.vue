<template>
  <q-page class="text-white" padding style="background-color: rgb(60, 60, 60);">
    <q-card class="" style="background-color: rgb(60, 60, 60);">
      <q-card-section style="background-color: rgb(80, 80, 80);">
        <div class="text-h6 text-weight-bolder text-white">
          Конфигурация {{ name }} от {{ updatedAt }}
          <a v-show="change"> *
            <q-tooltip :delay="800">
              * - означает что внесены изменения, для сохранения изменений необходимо "Записать" конфигурацию в базу
              данных
            </q-tooltip>
          </a>
        </div>
        Номер конфигурации: {{ id }}
        <div v-if="defaultStructure.version == version" class="text-green">
          Версия конфигуратора: {{ version }}
        </div>
        <div v-if="defaultStructure.version != version" class="text-red">
          Несоответствие версий структуры: {{ defaultStructure.version }} и {{ version }} !
        </div>
      </q-card-section>
      <q-card-actions class="text-black">
        <q-btn color='dark-grey' label="Назад" icon="arrow_back" @click="exit">
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
        <q-btn color='dark-grey' label="Сохранить" :disable="!change" icon="save" @click="writeDatabase">
        </q-btn>
        <q-btn color='dark-grey' v-show="change" label='Отменить изменения' @click="resetChange">
        </q-btn>
        <q-btn color='dark-grey' label="Скачать отчёт в PDF" :disable="change || (errors.length > 0 || !boxControl.mark)"
          icon="picture_as_pdf" :href="downloadPDF" target="_self" style="margin-right: 15px;">
        </q-btn>
      </q-card-actions>
      <div class="bg-white text-h6">
        <q-tabs dense v-model="tab" class="text-grey" no-caps align="justify" active-color="white" indicator-color="white"
          style="background-color: rgb(60, 60, 60);">
          <q-tab name="elements">
            <div class="text-h6">Конфигуратор</div>
          </q-tab>
          <q-tab name="blockmanual">
            <div class="text-h6">Подбор автоматики</div>
          </q-tab>
          <q-tab name="card">
            <div class="text-h6">Описание</div>
          </q-tab>
        </q-tabs>
        <q-tab-panels v-model="tab" keep-alive style="background-color: rgb(60, 60, 60);">
          <q-tab-panel name="card">
            <div class="row">
              <q-input v-model="inputDescript" dark class="fit" clearable outlined label="Описание" type="textarea"
                @update:model-value="sync" :input-style="{ resize: 'none', height: '55vh' }" />
            </div>
          </q-tab-panel>
          <q-tab-panel class="q-pa-sm" name="elements" style="background-color: rgb(60, 60, 60);">
            <q-card-actions>
              <q-btn class="full-height" color='dark-grey' label="Изменить состав системы" icon="edit"
                @click="openDialog('Изменить конфигурацию')">
              </q-btn>
              <q-btn class="full-height" color='dark-grey' label="Подобрать управление" icon="published_with_changes"
                @click="writeDatabase(); tab = 'blockmanual'; updateAutomatics()">
              </q-btn>
              <q-space />
              <q-btn class="full-height" color='dark-grey' label="Сбросить конфигурацию" icon="delete" @click="resetConf">
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
                      1.Структура
                      <div class="grid-container" @click="clickEmpty" style="min-width: 960px;">
                        <ImageElement v-for="element in initElements" :key="element" :id="element.id"
                          :class="`grid-item white ${element.class || ''}`" :name="element.name || ''"
                          :descript="element.description || ''" :size="element.size || 'small'"
                          :imageTop="loadImage(element.imageTop)" :imageBottom="loadImage(element.imageBottom)"
                          :text="element.text" :clickSelect="openDialog" :idname="element.id" />
                      </div>
                    </q-scroll-area>
                  </template>
                  <template v-slot:after style="overflow: hidden;">
                    <q-scroll-area visible :delay="0" style=" max-width: 100%; height: 100%;"
                      :vertical-thumb-style="{ right: '2px', borderRadius: '0px', background: 'grey', width: '15px', opacity: 1 }"
                      :horizontal-thumb-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', height: '15px', opacity: 1 }"
                      :vertical-bar-style="{ right: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, width: '15px' }"
                      :horizontal-bar-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, height: '15px' }">
                      2.Дополнительные настройки
                      <q-card-section class="row">
                        <div class="col-3">
                          <q-select dark class="text-h8" label="Материал корпуса ЩУ:"
                            options-selected-class="text-h8 text-grey" label-active-class="text-red"
                            popup-content-class="text-h8" outlined :options="confBoxMaterialOptions" option-value="id"
                            v-model="confBoxMaterial"
                            @update:model-value="updateSettings('box_material', confBoxMaterial)"
                            popup-content-style="background-color: rgb(60, 60, 60); color:  white;"
                            style="padding-right: 5px;">
                            <template v-slot:selected>
                              <div class="text-white">
                                {{ confBoxMaterial.label }}
                              </div>
                            </template>
                          </q-select>
                        </div>
                        <div class="col-3">
                          <q-select dark class="text-h8" label="Тип управления:"
                            options-selected-class="text-h8 text-grey" label-active-class="text-red"
                            popup-content-class="text-h8" outlined :options="confManualOptions" option-value="id"
                            @update:model-value="sync" v-model="confManual"
                            popup-content-style="background-color: rgb(60, 60, 60); color:  white;"
                            style="padding-right: 5px;">
                            <template v-slot:selected>
                              <div class="text-white">
                                {{ confManual.label }}
                              </div>
                            </template>
                          </q-select>
                        </div>
                        <div class="col-3">
                          <q-select dark class="text-h8" label="Пульт управления:"
                            options-selected-class="text-h8 text-grey" label-active-class="text-red"
                            popup-content-class="text-h8" outlined :options="confPUOptions" option-value="id"
                            @update:model-value="sync" v-model="confPU"
                            popup-content-style="background-color: rgb(60, 60, 60); color:  white;"
                            style="padding-right: 5px;">
                            <template v-slot:selected>
                              <div class="text-white">
                                {{ confPU.label }}
                              </div>
                            </template>
                          </q-select>
                        </div>
                      </q-card-section>
                      <q-item>
                        <q-item-section class="text-h6">
                          <div class="text-white">Освещение внутри секций</div>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-toggle v-model="lum" dark color="green" @update:model-value="updateSettings" />
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section class="text-h6">
                          <div class="text-white">Поддержание комнатной температуры</div>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-toggle v-model="troom" dark color="green" @update:model-value="updateSettings('troom')" />
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section class="text-h6">
                          <div class="text-white">Уличное исполнение ЩУ</div>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-toggle disable v-model="clima" dark color="green" @update:model-value="updateSettings" />
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section class="text-h6">
                          <div class="text-white">Диспетчеризация Modbus</div>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-toggle v-model="modbus" dark color="green" @update:model-value="updateSettings" />
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section class="text-h6">
                          <div :class="`${!(!isCO2() || cav || vav) ? 'text-white' : 'text-grey'}`">Запуск по дискретному
                            сигналу с газоанализатора (угарный газ)</div>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-toggle :disable="!isCO2() || cav || vav" v-model="co" dark color="green"
                            @update:model-value="updateSettings('co')" />
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section class="text-h6">
                          <div :class="`${!(!isCO2() || cav || co) ? 'text-white' : 'text-grey'}`">Функция поддержания
                            переменного расхода воздуха (VAV)</div>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-toggle :disable="!isCO2() || cav || co" v-model="vav" dark color="green"
                            @update:model-value="updateSettings('vav')" />
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section class="text-h6">
                          <div :class="`${!(!isCO2() || vav || co) ? 'text-white' : 'text-grey'}`"> Функция поддержания
                            постоянного расхода воздуха (CAV)</div>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-toggle :disable="!isCO2() || vav || co" v-model="cav" dark color="green"
                            @update:model-value="updateSettings('cav')" />
                        </q-item-section>
                      </q-item>

                    </q-scroll-area>
                  </template>
                </q-splitter>
              </template>
              <template v-slot:after>
                <q-scroll-area v-if="elementSelected" visible :delay="0" style=" max-width: 100%; height: 100%;"
                  :vertical-thumb-style="{ right: '2px', borderRadius: '0px', background: 'grey', width: '15px', opacity: 1 }"
                  :horizontal-thumb-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', height: '15px', opacity: 1 }"
                  :vertical-bar-style="{ right: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, width: '15px' }"
                  :horizontal-bar-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, height: '15px' }">
                  <q-card-actions align="left" v-if="showButtonDelete">
                    <q-space />
                    <q-btn color='dark-grey' icon="delete" label="Исключить" @click="enableElement">
                    </q-btn>
                  </q-card-actions>
                  <q-card-section>
                    <q-input dark class="q-ma-sm" v-model="inputsOptionsElements['elementSelectedName']" color="grey"
                      input-class="text-h6 text-white" outlined label-color="grey" type="text"
                      label="Наименование элемента" @update:model-value="updateElementSelectedName" />
                    <template v-for="order in getElement(elementSelected.id).orders" :key="order">
                      <template v-if="getElement(elementSelected.id).references">
                        <template v-for="index in getElement(elementSelected.id).references" :key="index">
                          <template v-if="index.enable && index.name === order">
                            <q-select :disable="index.values.length == 1 || index.disable" dark class="q-ma-sm text-h6"
                              :label="index.label" options-selected-class="text-h6 text-grey"
                              popup-content-class="text-h6" outlined v-model="selectorsOptionsElements[index.name]"
                              :options="getOptions(index)" @update:model-value="updateUnitsElementSelector"
                              option-value="id" popup-content-style="background-color: rgb(60, 60, 60); color:  white;">
                            </q-select>
                            <template v-if="index.referencesValueId">
                              <div v-for="indexRef in index.referencesValueId" :key="indexRef">
                                <div v-if="indexRef.valueId == index.valueId">
                                  <div v-if="indexRef.references">
                                    <div v-for="indexRefReferences in indexRef.references" :key="indexRefReferences">
                                      <q-select v-if="indexRefReferences.enable"
                                        :disable="indexRefReferences.values.length == 1 || indexRefReferences.disable"
                                        dark class="q-ma-sm text-h6" :label="indexRefReferences.label"
                                        options-selected-class="text-h6 text-grey" popup-content-class="text-h6" outlined
                                        v-model="selectorsOptionsElements[indexRefReferences.name]"
                                        :options="getOptions(indexRefReferences)"
                                        @update:model-value="updateUnitsElementSelectorEntry(index.name, indexRefReferences, selectorsOptionsElements[indexRefReferences.name])"
                                        option-value="id"
                                        popup-content-style="background-color: rgb(60, 60, 60); color:  white;">
                                      </q-select>
                                      <div v-if="indexRefReferences.referencesValueId">
                                        <div v-for="indexRefRef in indexRefReferences.referencesValueId"
                                          :key="indexRefRef">
                                          <div v-if="indexRefRef.valueId == indexRefReferences.valueId">
                                            <div v-if="indexRefRef.inputs">
                                              <div v-for="indexRefRefInputs in indexRefRef.inputs"
                                                :key="indexRefRefInputs">
                                                <q-input v-if="indexRefRefInputs.enable" dark class="q-ma-sm"
                                                  v-model="inputsOptionsElements[indexRefRefInputs.name]" color="grey"
                                                  input-class="text-h6 text-white" outlined label-color="grey"
                                                  :type="indexRefRefInputs.type" :label="indexRefRefInputs.label"
                                                  @update:model-value="updateUnitsElementSelectorEntryEntry(index.name, indexRefRefInputs, inputsOptionsElements[indexRefRefInputs.name])"
                                                  :rules="[(val) => {
                                                    if (indexRefRefInputs.type == 'number' && indexRefRefInputs.rules) {
                                                      return val >= indexRefRefInputs.rules.min && +val <= indexRefRefInputs.rules.max || indexRefRefInputs.rules.errorMessage
                                                    }
                                                  }]" />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div v-if="indexRef.inputs">
                                    <div v-for="indexRefInputs in indexRef.inputs" :key="indexRefInputs">
                                      <q-input v-if="indexRefInputs.enable" dark class="q-ma-sm"
                                        :disable="indexRefInputs.disable"
                                        v-model="inputsOptionsElements[indexRefInputs.name]" color="grey"
                                        @update:model-value="updateUnitsElementSelectorEntry(index.name, indexRefInputs, inputsOptionsElements[indexRefInputs.name])"
                                        input-class="text-h6 text-white" outlined label-color="grey"
                                        :type="indexRefInputs.type" :label="indexRefInputs.label" :rules="[(val) => {
                                          if (indexRefInputs.type == 'number' && indexRefInputs.rules) {
                                            return val >= indexRefInputs.rules.min && +val <= indexRefInputs.rules.max || indexRefInputs.rules.errorMessage
                                          }
                                        }]" />
                                    </div>
                                  </div>
                                  <div v-if="indexRef.switches">
                                    <q-item v-for="indexRefSwitches in indexRef.switches" :key="indexRefSwitches">
                                      <q-item-section v-if="indexRefSwitches.enable" class="text-h6">
                                        <div class="text-white">{{ indexRefSwitches.label }}</div>
                                      </q-item-section>
                                      <q-item-section v-if="indexRefSwitches.enable" avatar>
                                        <q-toggle :id="indexRefSwitches.name" dark color="green"
                                          v-model="switchesOptionsElements[indexRefSwitches.name]"
                                          @click="updateUnitsElementSelectorEntry(index.name, indexRefSwitches)" />
                                      </q-item-section>
                                    </q-item>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </template>
                        </template>
                      </template>
                      <template v-if="getElement(elementSelected.id).inputs">
                        <template v-for="index in getElement(elementSelected.id).inputs" :key="index">
                          <q-input v-if="index.enable && index.name === order" dark class="q-ma-sm"
                            v-model="inputsOptionsElements[index.name]" color="grey" input-class="text-h6 text-white"
                            outlined label-color="grey" :type="index.type" :label="index.label"
                            @update:model-value="updateUnitsElementInput(inputsOptionsElements[index.name], index)"
                            :rules="[(val) => {
                              if (index.type == 'number' && index.rules) {
                                return val >= index.rules.min && +val <= index.rules.max || index.rules.errorMessage
                              }
                            }]" />
                        </template>
                      </template>
                      <template v-if="getElement(elementSelected.id).switches">
                        <template v-for="index in getElement(elementSelected.id).switches" :key="index">
                          <q-item v-if="index.enable && index.name === order">
                            <q-item-section class="text-h6">
                              <div class="text-white">{{ index.label }}</div>
                            </q-item-section>
                            <q-item-section avatar>
                              <q-toggle :id="index.name" dark color="green" v-model="switchesOptionsElements[index.name]"
                                @click="updateUnitsElementSwitch(index)" />
                            </q-item-section>
                          </q-item>

                        </template>
                      </template>
                    </template>
                  </q-card-section>
                </q-scroll-area>
                <q-card-section v-else>
                  Выберите элемент для настройки
                </q-card-section>
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
                          :rows-per-page-options="[1]" grid-header wrap-cells :hide-bottom="true" :hide-header="true"
                          @row-click="selectRowElements" separator="none" style="background-color: rgb(60, 60, 60);">
                          <template v-slot:body-selection="props">
                            <q-toggle class="fit" size="4em" v-model="props.selected"
                              @mouseover="overElement(props.row.id)" @mouseleave="leaveElement"
                              @update:model-value="selectFlags" />
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
                                  <!-- <div class="text-h8 text-grey">
                                    {{ props.row.name }}
                                  </div> -->
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
                      <img v-if="idElement == 'mix_inflow'" src="./recircle.png" style="width: 260px;" />
                      <q-card-section class="text-h8 text-grey" align="center">
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
                  <q-btn color='dark-grey' label="Ок" @click="closeAndConfirm" v-close-popup></q-btn>
                </div>
              </template>
            </Dialog>
          </q-tab-panel>
          <q-tab-panel name="blockmanual">
            <q-card-action>
              <q-btn class="full-height" :disable="change" color='dark-grey' label="Обновить" icon="update"
                @click="updateAutomatics">
              </q-btn>
            </q-card-action>
            <q-card-section style="height: 67vh;">
              <div v-if="boxControl.mark">
                <div v-if="!errors[0]">
                  <q-tabs v-model="tabAutomatics" class="text-white" no-caps>
                    <q-tab name="data" label="Данные" />
                    <q-tab name="spec" label="Спецификация" />
                    <q-tab name="kip" label="КИПиА" />
                    <q-tab name="operations" label="Трудоёмкость" />
                    <q-tab name="logs" label="Лог подбора" />
                  </q-tabs>
                  <q-tab-panels v-model="tabAutomatics" style="background-color: rgb(60, 60, 60);">
                    <q-tab-panel name="data" style="height: 57vh;">
                      <q-card-section class="col text-h6 col-6">
                        <q-badge v-if="boxControl.mark != ''" class="text-h6" style="background-color: rgb(80, 80, 80);">
                          Номенклатура: {{ boxControl.mark }}
                        </q-badge>
                        <div v-if="boxControl.DO > 0">
                          Дискретных выходов: {{ boxControl.DO }}
                        </div>
                        <div v-if="boxControl.DI > 0">
                          Дискретных входов: {{ boxControl.DI }}
                        </div>
                        <div v-if="boxControl.AO > 0">
                          Аналоговых выходов: {{ boxControl.AO }}
                        </div>
                        <div v-if="boxControl.AI > 0">
                          Аналоговых входов: {{ boxControl.AI }}
                        </div>
                        <div v-if="boxControl.countPE > 0">
                          Подключений к заземляющей шине: {{ boxControl.countPE }}
                        </div>
                        <div>
                          Номинальное напряжение: {{ boxControl.voltage }} В
                        </div>
                        <div>
                          Расчётная мощность: {{ boxControl.powerA }} кВт
                        </div>
                        <div>
                          Расчётный ток: {{ Number(boxControl.currentA).toFixed(2) }} А
                        </div>
                      </q-card-section>
                      <q-card-section class="col text-h6 col-6">
                        <q-badge class="text-h6" style="background-color: rgb(80, 80, 80);">
                          Себестоимость: {{ Number(boxControl.costNet).toFixed(2) }} руб
                        </q-badge>
                        <div>
                          Стоимость материалов по спецификации: {{ Number(boxControl.costAllMaterials).toFixed(2) }} руб.
                        </div>
                        <div>
                          Стоимость c учётом расходников: {{ Number(boxControl.costWithСonsumable).toFixed(2) }} руб.
                        </div>
                        <div>
                          Трудозатраты: {{ Number(boxControl.laboriousness).toFixed(2) }} ч.
                        </div>
                        <div>
                          Стоимость работ: {{ Number(boxControl.costLaboriousness).toFixed(2) }} руб.
                        </div>
                      </q-card-section>
                    </q-tab-panel>
                    <q-tab-panel name="spec">
                      <q-table class="my-sticky-header-table" dark dense :rows="boxControlMaterials"
                        :columns="boxControlColumns" row-key="name" virtual-scroll selection="none"
                        :hide-selected-banner="true" binary-state-sort no-data-label="Материалы отсутствуют"
                        :rows-per-page-options="[0]" separator="cell"
                        style="background-color: rgb(60, 60, 60); height: 57vh;">
                        <template v-slot:pagination>
                        </template>
                        <template v-slot:body-cell="props">
                          <q-td :props="props">
                            <div class="text-h6">
                              {{ props.value }}
                            </div>
                          </q-td>
                        </template>
                        <template v-slot:header-cell="props">
                          <q-th :props="props">
                            <div class="text-h6">
                              {{ props.col.label }}
                            </div>
                          </q-th>
                        </template>
                      </q-table>
                    </q-tab-panel>
                    <q-tab-panel name="kip">
                      <q-table class="my-sticky-header-table" dark dense :rows="boxControlMaterialsKip"
                        :columns="boxControlColumnsKip" row-key="number" virtual-scroll selection="none"
                        :hide-selected-banner="true" binary-state-sort no-data-label="Материалы отсутствуют"
                        :rows-per-page-options="[0]" separator="cell"
                        style="background-color: rgb(60, 60, 60); height: 57vh;">
                        <template v-slot:pagination>
                        </template>
                        <template v-slot:body-cell="props">
                          <q-td :props="props">
                            <div class="text-h6">
                              {{ props.value }}
                            </div>
                          </q-td>
                        </template>
                        <template v-slot:header-cell="props">
                          <q-th :props="props">
                            <div class="text-h6">
                              {{ props.col.label }}
                            </div>
                          </q-th>
                        </template>
                      </q-table>
                    </q-tab-panel>
                    <q-tab-panel name="operations">
                      <q-table class="my-sticky-header-table" dark dense :rows="boxControlMaterialsOperations"
                        :columns="boxControlColumnsOperations" row-key="number" virtual-scroll selection="none"
                        :hide-selected-banner="true" binary-state-sort no-data-label="Нет операций"
                        :rows-per-page-options="[0]" separator="cell"
                        style="background-color: rgb(60, 60, 60); height: 57vh;">
                        <template v-slot:pagination>
                        </template>
                        <template v-slot:body-cell="props">
                          <q-td :props="props">
                            <div class="text-h6">
                              {{ props.value }}
                            </div>
                          </q-td>
                        </template>
                        <template v-slot:header-cell="props">
                          <q-th :props="props">
                            <div class="text-h6">
                              {{ props.col.label }}
                            </div>
                          </q-th>
                        </template>
                      </q-table>
                      <!-- <q-table class="my-sticky-header-table" dark dense :rows="boxControlMaterialsOperations"
                        :columns="boxControlColumnsOperations" row-key="number" virtual-scroll selection="none"
                        :hide-selected-banner="true" binary-state-sort no-data-label="Нет операций"
                        :rows-per-page-options="[0]" separator="cell"
                        style="background-color: rgb(60, 60, 60); height: 57vh;">
                        <template v-slot:pagination>
                        </template>
                        <template v-slot:body-cell="props">
                          <q-td :props="props">
                            <div class="text-h6">
                              {{ props.value }}
                            </div>
                          </q-td>
                        </template>
                        <template v-slot:header-cell="props">
                          <q-th :props="props">
                            <div class="text-h6">
                              {{ props.col.label }}
                            </div>
                          </q-th>
                        </template>
                      </q-table> -->
                    </q-tab-panel>
                    <q-tab-panel name="logs">
                      <q-table class="my-sticky-header-table" dark dense :rows="boxControlMaterialsLog"
                        :columns="boxControlColumnsLog" row-key="number" virtual-scroll selection="none"
                        :hide-selected-banner="true" no-data-label="История отсутствует" :rows-per-page-options="[0]"
                        separator="cell" style="background-color: rgb(60, 60, 60); height: 57vh;">
                        <template v-slot:pagination>
                        </template>
                        <template v-slot:body-cell="props">
                          <q-td :props="props">
                            <div :class="`text-h6 ${(props.value.indexOf('Предупреждение') != -1
                                || props.value.indexOf('Процедура') != -1)
                                ? 'text-yellow' : 'text-white'}`">
                              {{ props.value }}
                            </div>
                          </q-td>
                        </template>
                        <template v-slot:header-cell="props">
                          <q-th :props="props">
                            <div class="text-h6">
                              {{ props.col.label }}
                            </div>
                          </q-th>
                        </template>
                      </q-table>
                    </q-tab-panel>
                  </q-tab-panels>
                </div>
                <div v-else>
                  <template v-for="err in errors" :key="err">
                    <div>
                      {{ err }}
                    </div>
                  </template>
                </div>
              </div>
              <div v-else>
                Обновите подбор для получения данных
              </div>
            </q-card-section>
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
  options,
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
    const path = `${host}/services/genprice/configuration/pdf/`;
    const downloadPDF = ref(host);
    const route = useRoute();
    const router = useRouter();
    const { id } = route.params;
    const tab = ref('elements');
    const tabAutomatics = ref('data');
    const inputDescript = ref(null);
    const change = ref(false);

    const dc = ref(null);
    const dex = ref(null);
    const removeMain = ref(false);
    // ссылки
    const initElements = ref([]);
    function createElements(name, image, cnt, cls) {
      for (let index = 1; index <= cnt; index += 1) {
        const o = {
          id: `${name}${index}`,
          imageBottom: image,
        };
        if (cls) {
          o.class = cls;
        }
        initElements.value.push(o);
      }
    }
    createElements('air', 'air.svg', 51);
    createElements('wall', 'wall.svg', 12, 'grey');

    [{
      id: 'pvlv1',
      imageTop: 'valve.svg',
      imageBottom: 'air.svg',
      name: 'Воздушный клапан притока 1',
    },
    {
      id: 'mix',
      imageTop: 'recircle.svg',
      imageBottom: 'air.svg',
      name: 'Заслонка рециркуляции',
    },
    {
      id: 'mix_inflow',
      imageTop: 'valve_analog.svg',
      imageBottom: 'air90.svg',
      name: 'Привод заслонки рециркуляции',
      description: 'Камера смешения позволяет подмешивать вытяжной воздух к приточному в случае, если суммарной мощности нагревательных приборов не хватает для достижения уставки.',
    },
    {
      id: 'pf1',
      imageTop: 'filter.svg',
      imageBottom: 'air.svg',
      name: 'Фильтр притока',
      description: 'Воздушный фильтр служит для очистки приточного (и вытяжного, если используется рекуперация) воздуха от пыли. При загрязнении фильтра его сопротивление потоку воздуха вырастает настолько, что срабатывает дифференциальное реле давления, контролирующее работу фильтра. Контроллер оповещает пользователя о необходимости замены фильтрующего элемента.',
    },
    {
      id: 'pbf',
      imageTop: 'bf.svg',
      imageBottom: 'air.svg',
      name: 'Бактерицидный фильтр',
      description: 'Бактерицидный фильтр',
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
      name: 'Вентилятор притока',
      description: 'Приточный вентилятор обеспечивает подачу свежего воздуха с улицы в помещение.',
    },
    {
      id: 'pvlv2',
      imageTop: 'valve.svg',
      imageBottom: 'air.svg',
      name: 'Воздушный клапан притока 2',
    },
    {
      id: 'vvlv1',
      imageTop: 'valve.svg',
      imageBottom: 'air.svg',
      name: 'Привод клапана вытяжки 1',
    },
    {
      id: 'vvlv2',
      imageTop: 'valve.svg',
      imageBottom: 'air.svg',
      name: 'Привод клапана вытяжки 2',
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
      imageTop: 'cooler_freon.svg',
      imageBottom: 'air.svg',
      name: 'Охладитель 1',
    },
    {
      id: 'toc2',
      imageTop: 'cooler_freon.svg',
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
      id: 'spd',
      imageTop: 'speed.svg',
      imageBottom: 'air.svg',
      name: 'Датчик скорости',
    },
    {
      id: 'co2',
      imageTop: 'co2.svg',
      imageBottom: 'air.svg',
      name: 'Датчик углекислого газа (канальный)',
    },
    {
      id: 'co2room',
      imageTop: 'co2.svg',
      name: 'Датчик углекислого газа (комнатный)',
    },
    {
      id: 'co',
      imageTop: 'co.svg',
      name: 'Датчик угарного газа',
    },
    {
      id: 'hummes',
      imageTop: 'humdity_meas.svg',
      imageBottom: 'air.svg',
      name: 'Датчик влажности (канальный)',
    },
    {
      id: 'hummesroom',
      imageTop: 'humdity_meas.svg',
      name: 'Датчик влажности (комнатный)',
    },
    {
      id: 'vv1',
      imageTop: 'fan.svg',
      imageBottom: 'air.svg',
      name: 'Вентилятор вытяжки',
      description: 'Приточный вентилятор обеспечивает подачу свежего воздуха с улицы в помещение.',
    },
    {
      id: 'vf1',
      imageTop: 'filter.svg',
      imageBottom: 'air.svg',
      name: 'Фильтр вытяжки',
      class: 'rotate180',
    },
    //
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
      id: 'air1_rotate90',
      imageBottom: 'air90.svg',
    },
    {
      id: 'air2_rotate90',
      imageBottom: 'air90.svg',
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
    {
      id: 'rec',
      imageTop: 'recup.svg',
      name: 'Рекуператор',
    },
    {
      id: 'noRecInflow',
      imageBottom: 'norecupinflow.svg',
    },
    {
      id: 'noRecInflowOutflow',
      imageBottom: 'norecupinflowoutflow.svg',
    },
    ].forEach((e) => {
      initElements.value.push(e);
    });
    const columnsElements = [{
      name: 'name',
      required: true,
      label: 'Материал',
      align: 'left',
      field: (row) => row.name,
      format: (val) => `${val}`,
      sortable: false,
    }];
    const elementSelected = ref(null);
    const rowsElements = ref([]);
    const selectedElements = ref([]);
    //
    const elementDialog = ref(false);
    const nameElement = ref('');
    const idElement = ref(null);
    const descriptDefault = 'Включите либо отключите необходимые узлы системы';
    const descriptElement = ref(descriptDefault);
    const dialogName = ref('');
    const confBoxMaterialOptions = [
      {
        id: 0,
        label: 'Пластик',
      },
      {
        id: 1,
        label: 'Металл',
      },
      {
        id: 2,
        label: 'Без корпуса (встроен в установку)',
      },
    ];
    const confBoxMaterial = ref(confBoxMaterialOptions[0]);
    const confManualOptions = [
      {
        id: 0,
        label: 'Контроллер',
      },
      {
        id: 1,
        label: 'Терморегулятор',
      },
      {
        id: 2,
        label: 'Вкл/Откл',
      },
    ];
    const confManual = ref(confManualOptions[0]);
    const confPUOptions = [
      {
        id: 0,
        label: 'Отсутствует',
      },
      {
        id: 1,
        label: 'Кнопочный пульт PU1',
      },
      {
        id: 2,
        label: 'Пульт Zentec',
      },
      {
        id: 3,
        label: 'Панель ELHART',
      },
    ];
    const confPU = ref(confPUOptions[0]);
    const lum = ref(false);
    const clima = ref(false);
    const modbus = ref(false);
    const co = ref(false);
    const vav = ref(false);
    const cav = ref(false);
    const troom = ref(false);
    const version = ref('');
    // переменные вкладки ПОДБОР АВТОМАТИКИ
    const boxControl = ref('');
    // таблица материалов
    const boxControlColumns = [
      {
        name: 'number',
        required: true,
        label: 'Поз',
        align: 'left',
        field: (row) => row.number + 1,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'name',
        align: 'left',
        label: 'Наименование',
        field: 'name',
        sortable: true,
      },
      {
        name: 'count',
        align: 'left',
        label: 'Кол',
        field: 'count',
        sortable: true,
      },
      {
        name: 'desc',
        align: 'left',
        label: 'Прим',
        field: 'desc',
        sortable: true,
      },
    ];
    const boxControlMaterials = ref([]);
    // лог подбора
    const boxControlColumnsLog = [
      {
        name: 'number',
        required: true,
        label: '№',
        align: 'left',
        field: (row) => row.number + 1,
        format: (val) => `${val}`,
        sortable: false,
      },
      {
        name: 'name',
        align: 'left',
        label: 'Событие',
        field: 'name',
        sortable: false,
      },
    ];
    const boxControlMaterialsLog = ref([]);
    // перечень КИП
    const boxControlColumnsKip = [
      {
        name: 'number',
        required: true,
        label: 'Поз',
        align: 'left',
        field: (row) => row.number + 1,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'name',
        align: 'left',
        label: 'Наименование',
        field: 'name',
        sortable: true,
      },
      {
        name: 'count',
        align: 'left',
        label: 'Кол',
        field: 'count',
        sortable: true,
      },
      {
        name: 'desc',
        align: 'left',
        label: 'Прим',
        field: 'desc',
        sortable: true,
      },
    ];
    const boxControlMaterialsKip = ref([]);
    // операции
    // const boxControlColumnsOperations = [
    //   {
    //     name: 'number',
    //     required: true,
    //     label: 'Поз',
    //     align: 'left',
    //     field: (row) => row.number + 1,
    //     format: (val) => `${val}`,
    //     sortable: true,
    //   },
    //   {
    //     name: 'name',
    //     align: 'left',
    //     label: 'Материал',
    //     field: 'name',
    //     sortable: true,
    //   },
    //   {
    //     name: 'count',
    //     align: 'left',
    //     label: 'Количество',
    //     field: 'count',
    //     sortable: true,
    //   },
    //   {
    //     name: 'time_run_up',
    //     align: 'left',
    //     label: 'Подготовка, мин',
    //     field: 'time_run_up',
    //     sortable: true,
    //   },
    //   {
    //     name: 'time_metalwork',
    //     align: 'left',
    //     label: 'Обработка, мин',
    //     field: 'time_metalwork',
    //     sortable: true,
    //   },
    //   {
    //     name: 'time_mount',
    //     align: 'left',
    //     label: 'Монтаж, мин',
    //     field: 'time_mount',
    //     sortable: true,
    //   },
    //   {
    //     name: 'time_commutation',
    //     align: 'left',
    //     label: 'Подключение, мин',
    //     field: 'time_commutation',
    //     sortable: true,
    //   },
    //   {
    //     name: 'time_pack',
    //     align: 'left',
    //     label: 'Упаковка, мин',
    //     field: 'time_pack',
    //     sortable: true,
    //   },
    //   {
    //     name: 'summ',
    //     align: 'left',
    //     label: 'Итого, мин',
    //     field: 'summ',
    //     sortable: true,
    //   },
    // ];
    const boxControlColumnsOperations = [
      {
        name: 'number',
        required: true,
        label: 'Поз',
        align: 'left',
        field: (row) => row.number + 1,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'operation',
        align: 'left',
        label: 'Операция',
        field: 'operation',
        sortable: true,
      },
    ];
    const boxControlMaterialsOperations = ref([]);
    const errors = ref([]);
    // опции модели элемента (обновляются динамически)
    const selectorsOptionsElements = ref({});
    const inputsOptionsElements = ref({});
    const switchesOptionsElements = ref({});
    const showButtonDelete = ref(false);
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
    let object = null;
    const syncObject = ref(null);

    let structure = {};
    function sync() {
      object.descript = inputDescript.value;
      const writeStruct = {
        pu: confPU.value.id,
        manual: confManual.value.id,
        box_material: confBoxMaterial.value.id,
        lum: lum.value,
        clima: clima.value,
        modbus: modbus.value,
        version: version.value,
        elements: structure,
      };
      object.structure = writeStruct;
      syncObject.value = JSON.stringify(object);
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
        objectInit.defaultImage = objectInit.imageTop;
      } else if (newObject) {
        newObject.id = elementName;
        newObject.element = element;
        initElements.value.push(newObject);
      }
      displayElement(element, false);
    }
    // скрывает все элементы
    function visibleAllElements(visible) {
      for (let index = 0; index < initElements.value.length; index += 1) {
        const { element } = initElements.value[index];
        displayElement(element, visible);
      }
    }
    function resetSelectElements() {
      initElements.value.forEach((el) => {
        // const obj = getObject(initElements.value, 'id', el.el);
        if (el.class) {
          if (el.class.indexOf(' green') !== -1) {
            const newclass = el.class.replaceAll(' green', '');
            el.class = newclass;
          }
        }
      });
      elementSelected.value = null;
    }
    function getElement(elId) {
      return getObject(structure, 'el', elId);
    }
    // формирует область объектов из структуры
    function build(struct) {
      visibleAllElements(false);
      for (let index = 0; index < struct.length; index += 1) {
        const element = struct[index];
        const elementDOM = getObject(initElements.value, 'id', element.el);
        if (!element.name) {
          if (elementDOM.name != null) {
            element.name = elementDOM.name;
          }
        }
        if (element.el === 'rec') {
          if (getElement('vv1').enable) {
            element.bottom = 'noRecInflowOutflow';
          } else {
            element.bottom = 'noRecInflow';
          }
        }
        if (element.inputs) {
          const elCount = getObject(element.inputs, 'name', 'count');
          if (elCount) {
            const count = Number(elCount.value);
            elementDOM.text = (count > 1) ? `x${count}` : '';
          }
        }
        if (element.icon) {
          elementDOM.imageTop = element.icon;
        } else {
          elementDOM.imageTop = elementDOM.defaultImage;
        }
        const elementDOMbottom = getObject(initElements.value, 'id', element.bottom);
        if (elementDOM != null) {
          if (!element.enabled) {
            moveElement(elementDOM.element, element.x, element.y, element.w || 1, element.h || 1);
          } else if (element.enable) {
            moveElement(elementDOM.element, element.x, element.y, element.w || 1, element.h || 1);
          } else if (element.bottom && elementDOMbottom != null) {
            if (element.bottom_w && element.bottom_h) {
              moveElement(elementDOMbottom.element, element.x, element.y, element.bottom_w || 1, element.bottom_h || 1);
            } else {
              moveElement(elementDOMbottom.element, element.x, element.y, element.w || 1, element.h || 1);
            }
          }
        }
      }
    }

    // включает или выключает все элементы в структуре
    function setEnable(struct, val) {
      for (let index = 0; index < struct.length; index += 1) {
        const element = struct[index];
        if (element.enabled && !element.enableManual) {
          element.enable = val;
          // ЧАСТНЫЕ СЛУЧАИ
          // если в списке выбранных привод для камеры смешения
          if (element.el === 'mix_inflow') {
            // то меняем иконку у привода на притоке, тк. тип привода поменяется на аналоговый
            const objStruct = getElement('pvlv1');
            const typeValve = getObject(objStruct.references, 'name', 'typeValve_pvlv1');
            const typeValveValue = getObject(typeValve.values, 'id', 0);
            if (typeValveValue) {
              if (typeValveValue.icon !== null) {
                objStruct.icon = typeValveValue.icon;
                getElement('vvlv1').icon = typeValveValue.icon;
              } else {
                delete objStruct.icon;
                delete getElement('vvlv1').icon;
              }
            }
          }
        } else {
          element.enable = val;
          if (element.isHideBottom) {
            if (getElement(element.isHideBottom.enable).enable) {
              element.bottom = element.isHideBottom.bottom;
            } else {
              element.bottom = '';
            }
          }
        }
      }
    }
    function getObjectsEnadledManualsInStrc(struct) {
      let objects = [];
      for (let index = 0; index < struct.length; index += 1) {
        const element = struct[index];
        if (element.enabled) {
          if (element.manual) {
            objects.push(element);
          }
        }
      }
      objects = objects.sort((a, b) => (a.name < b.name ? -1 : 1)); // сортирует список по наименованию
      return objects;
    }
    function closeAndConfirm() {
      if (dialogName.value === 'Изменить конфигурацию') {
        setEnable(structure, false);
        for (let index = 0; index < selectedElements.value.length; index += 1) {
          const element = selectedElements.value[index];
          const elementStructure = getObject(structure, 'el', element.id);
          elementStructure.enable = true;
          // ЧАСТНЫЕ СЛУЧАИ
          // если камера смешения включается то изменить иконку на привод с аналоговым управлением
          if (elementStructure.el === 'mix_inflow') {
            // то меняем иконку у привода на притоке, тк. тип привода поменяется на аналоговый
            const objStruct = getElement('pvlv1');
            const typeValve = getObject(objStruct.references, 'name', 'typeValve_pvlv1');
            const typeValveValue = getObject(typeValve.values, 'id', 2);
            if (typeValveValue.icon) {
              objStruct.icon = typeValveValue.icon;
              getElement('vvlv1').icon = typeValveValue.icon;
            } else {
              delete objStruct.icon;
              delete getElement('vvlv1').icon;
            }
          }
          if (elementStructure.enableElements) {
            for (let i = 0; i < elementStructure.enableElements.length; i += 1) {
              const val = elementStructure.enableElements[i];
              const enableEl = getObject(structure, 'el', val);
              enableEl.enable = true;
            }
          }
          // if (elementStructure.isEnable) {
          //   const enableEl = getObject(structure, 'el', elementStructure.isEnable);
          //   elementStructure.enable = !enableEl.enable;
          // }
        }
        build(structure);
        resetSelectElements();
      }
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
        if (elementStruct.el === 'toh1') {
          if (!getElement('toh1').enable) {
            resetSelect('toh2');
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
          if (!getElement('toh1').enable) {
            en = false;
          } else if (!getElement('toc1').enable) {
            resetSelect('toc2');
          }
        }
        if (elementStruct.el === 'toc2') {
          if (!getElement('toc1').enable) {
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
        // взаимная блокировка одновременного включения обоих датчиков СО2
        if (elementStruct.el === 'co2') {
          if (getElement('co2room').enable || cav.value || vav.value) {
            en = false;
          }
        } else if (elementStruct.el === 'co2room') {
          if (getElement('co2').enable || cav.value || vav.value) {
            en = false;
          }
        }
        // датчики влажности (канальный и комнатный) доступны для включения только если включен увлажнитель
        if (elementStruct.el === 'hummes') {
          en = !getElement('hummesroom').enable && getElement('hum').enable;
        }
        if (elementStruct.el === 'hummesroom') {
          en = !getElement('hummes').enable && getElement('hum').enable;
        }
        // вытяжка
        if (elementStruct.el === 'vf1') {
          if (!getElement('vv1').enable) {
            en = false;
          }
        }
        if (elementStruct.el === 'rec') {
          if (!getElement('vv1').enable) {
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
      if (newSelected) { // если идёт обновление по изменению конфигурации
        getObjectsEnadledManualsInStrc(structure).forEach((elementStruct) => {
          elementStruct.enable = false;
        });
        newSelected.forEach((elementNewSelected) => {
          const sel = getObject(structure, 'el', elementNewSelected.id);
          sel.enable = true;
        });
      }
      createListElements();
    }
    function getObjectElement() {
      return getObject(structure, 'el', elementSelected.value.id);
    }
    function openDialog(elName) {
      // общий алгоритм
      resetSelectElements();
      const obj = getObject(initElements.value, 'id', elName);
      if (obj) {
        // элемент найден и выбран
        dialogName.value = obj.name;
        obj.class = `${obj.class || ''} green`;
        elementSelected.value = obj;
        const objStruct = getElement(elName);
        if (objStruct.enableManual) {
          showButtonDelete.value = false;
        } else {
          showButtonDelete.value = objStruct.enabled;
        }
        switchesOptionsElements.value = {};
        selectorsOptionsElements.value = {};
        inputsOptionsElements.value = {};
        inputsOptionsElements.value.elementSelectedName = objStruct.name;
        if (objStruct.references) {
          for (let index = 0; index < objStruct.references.length; index += 1) {
            let objValueId = getObject(objStruct.references[index].values, 'id', objStruct.references[index].valueId);
            // частные случай
            // отключение настроек термоконтакта и регулировки скорости при включении типа вентилятора: ЕС
            // если выбран тип вентилятора EC для pv1, то блокируется регулировка скорости и включение термоконтакта
            if (objStruct.references[index].name === 'type_pv1') {
              getObject(objStruct.switches, 'name', 'thermocontact_pv1').enable = objStruct.references[index].valueId !== 1;
              getObject(objStruct.switches, 'name', 'speedmanual_pv1').enable = objStruct.references[index].valueId !== 1;
            }
            // если выбран тип вентилятора EC для vv1, то блокируется регулировка скорости и включение термоконтакта
            if (objStruct.references[index].name === 'type_vv1') {
              getObject(objStruct.switches, 'name', 'thermocontact_vv1').enable = objStruct.references[index].valueId !== 1;
              getObject(objStruct.switches, 'name', 'speedmanual_vv1').enable = objStruct.references[index].valueId !== 1;
            }

            // логика настройки главной заслонки PVLV1
            // зависимость от включённой камеры смешения
            if (objStruct.el === 'pvlv1') {
              // изменение списка приводов для главной заслонки при включении камеры смешения (заслонки рециркуляции)
              const mixInflowElement = getObject(structure, 'el', 'mix_inflow');
              // получаем объект справочника ТИП ПРИВОДА
              const pvlv1ElementType = getObject(objStruct.references, 'name', 'typeValve_pvlv1');
              // получаем объект справочника НАПРЯЖЕНИЕ ПРИВОДА
              const pvlv1ElementVoltage = getObject(objStruct.references, 'name', 'voltageValve_pvlv1');
              // получаем объект справочника РОД ТОКА ПРИВОДА
              const pvlv1ElementTypePower = getObject(objStruct.references, 'name', 'typePower_pvlv1');
              // если камера смешения активна
              if (mixInflowElement.enable) {
                if (objStruct.references[index].name === 'typeValve_pvlv1') {
                  // тогда у пользователя нет иного выбора как тип привода с аналоговым управлением
                  // изменяем общий список типов привода
                  pvlv1ElementType.values = [
                    // оставяем только тип привода с аналоговым управлением, т.е. с id = 2
                    options.valuesTypeValve[2],
                  ];
                  // выбираем принудительно данный тип управления если ранее он был не аналоговый
                  if (pvlv1ElementType.valueId !== 2) {
                    pvlv1ElementType.valueId = 2;
                    const option = getObject(pvlv1ElementType.values, 'id', pvlv1ElementType.valueId);
                    objValueId = option;
                  }
                }
                if (objStruct.references[index].name === 'voltageValve_pvlv1') {
                  // тогда у пользователя нет иного выбора как тип привода с напряжением 24В
                  pvlv1ElementVoltage.values = [
                    options.valuesVoltageValve[1],
                  ];
                  if (pvlv1ElementVoltage.valueId !== 1) {
                    pvlv1ElementVoltage.valueId = 1;
                    const option = getObject(pvlv1ElementVoltage.values, 'id', pvlv1ElementVoltage.valueId);
                    objValueId = option;
                  }
                }
              } else {
                // если камера смешения не активна то список доступных типов привода РАСШИРЕННЫЙ
                pvlv1ElementType.values = options.valuesTypeValve;
                if (objStruct.references[index].name === 'typeValve_pvlv1') {
                  // если тип привода с аналоговым управлением то он не должен быть 220
                  if (pvlv1ElementType.valueId === 2) {
                    pvlv1ElementVoltage.values = [
                      options.valuesVoltageValve[1],
                    ];
                    if (pvlv1ElementVoltage.valueId !== 1) {
                      pvlv1ElementVoltage.valueId = 1;
                      // const option = getObject(pvlv1ElementVoltage.values, 'id', pvlv1ElementVoltage.valueId);
                      // objValueId = option;
                    }
                  } else {
                    pvlv1ElementVoltage.values = options.valuesVoltageValve;
                  }
                }
              }
              if (objStruct.references[index].name === 'typePower_pvlv1') {
                // если привод расчитан на напряжение 220 то тогда род тока будет исключительно AC
                if (pvlv1ElementVoltage.valueId === 0) {
                  pvlv1ElementTypePower.values = [
                    options.valuesValveTypePower[0],
                  ];
                  if (pvlv1ElementTypePower.valueId !== 0) {
                    pvlv1ElementTypePower.valueId = 0;
                    const option = getObject(pvlv1ElementTypePower.values, 'id', pvlv1ElementTypePower.valueId);
                    objValueId = option;
                  }
                } else {
                  pvlv1ElementTypePower.values = options.valuesValveTypePower;
                }
              }
            }

            selectorsOptionsElements.value[objStruct.references[index].name] = objValueId;
            if (objStruct.references[index].referencesValueId) {
              objStruct.references[index].referencesValueId.forEach((elementReference) => {
                if (elementReference.valueId === objStruct.references[index].valueId) {
                  if (elementReference.references) {
                    elementReference.references.forEach((elementReferenceRefs) => {
                      // частные случаи
                      // нагреватели
                      // метод заполняет все поля со ступенями
                      function fillStagesField() {
                        // получаем допустимый список ступеней
                        const stagesObject = getObject(elementReferenceRefs.values, 'id', elementReferenceRefs.valueId);
                        // получаем поле количество ступеней
                        const cntStageCur = getObject(elementReference.references, 'name', `count_stage_${objStruct.el}`);
                        // заполняем это поле длиной массива stagesObject, т.к. он указывает на количество ступеней
                        cntStageCur.valueId = getObject(cntStageCur.values, 'id', stagesObject.stages.length - 1).id;
                        // заполняем заблокированные поля для мощности ступеней
                        for (let i = 1; i <= stagesObject.stages.length; i += 1) {
                          const element = stagesObject.stages[i - 1];
                          getObject(elementReference.inputs, 'name', `power_stage${i}_${objStruct.el}`).value = element;
                        }
                      }
                      if (elementReferenceRefs.name === `power_220_${objStruct.el}`) {
                        const voltageTohObject = getObject(objStruct.references, 'name', `voltage_${objStruct.el}`);
                        const valueVoltageToh = Number(getObject(voltageTohObject.values, 'id', voltageTohObject.valueId).value);
                        elementReferenceRefs.enable = (valueVoltageToh === 220);
                        // fillStagesField(voltageTohObject.valueId);
                        if (elementReferenceRefs.enable) {
                          fillStagesField();
                        }
                      }
                      if (elementReferenceRefs.name === `power_380_${objStruct.el}`) {
                        const voltageTohObject = getObject(objStruct.references, 'name', `voltage_${objStruct.el}`);
                        const valueVoltageToh = Number(getObject(voltageTohObject.values, 'id', voltageTohObject.valueId).value);
                        elementReferenceRefs.enable = (valueVoltageToh !== 220);
                        if (elementReferenceRefs.enable) {
                          fillStagesField();
                        }
                      }
                      function isStageToh(nameToh) {
                        if (elementReferenceRefs.name === `count_stage_${nameToh}`) {
                          getObject(elementReference.inputs, 'name', `power_stage1_${nameToh}`).enable = true;
                          getObject(elementReference.inputs, 'name', `power_stage2_${nameToh}`).enable = elementReferenceRefs.valueId >= 1;
                          getObject(elementReference.inputs, 'name', `power_stage3_${nameToh}`).enable = elementReferenceRefs.valueId >= 2;
                          getObject(elementReference.inputs, 'name', `power_stage4_${nameToh}`).enable = elementReferenceRefs.valueId >= 3;
                          getObject(elementReference.inputs, 'name', `power_stage5_${nameToh}`).enable = elementReferenceRefs.valueId >= 4;
                        }
                      }
                      isStageToh('toh1');
                      isStageToh('toh2');
                      selectorsOptionsElements.value[elementReferenceRefs.name] = getObject(elementReferenceRefs.values, 'id', elementReferenceRefs.valueId);
                      if (elementReferenceRefs.referencesValueId) {
                        elementReferenceRefs.referencesValueId.forEach((elementReferenceRefsRefs) => {
                          if (elementReferenceRefsRefs.valueId === elementReferenceRefs.valueId) {
                            if (elementReferenceRefsRefs.inputs) {
                              elementReferenceRefsRefs.inputs.forEach((elementReferenceRefsRefsInputs) => {
                                inputsOptionsElements.value[elementReferenceRefsRefsInputs.name] = elementReferenceRefsRefsInputs.value;
                              });
                            }
                          }
                        });
                      }
                    });
                  }
                  if (elementReference.switches) {
                    elementReference.switches.forEach((elementReferenceSwitches) => {
                      switchesOptionsElements.value[elementReferenceSwitches.name] = elementReferenceSwitches.value;
                    });
                  }
                  if (elementReference.inputs) {
                    elementReference.inputs.forEach((elementReferenceInputs) => {
                      inputsOptionsElements.value[elementReferenceInputs.name] = elementReferenceInputs.value;
                    });
                  }
                }
              });
            }
          }
        }
        if (objStruct.switches) {
          for (let index = 0; index < objStruct.switches.length; index += 1) {
            switchesOptionsElements.value[objStruct.switches[index].name] = objStruct.switches[index].value;
            // частные случай
            // при выборе опции подогрева клапана появляется поле ввода мощности тэнов подогрева
            if (objStruct.switches[index].name === 'heat_valve_pvlv1') {
              getObject(objStruct.inputs, 'name', 'power_heat_valve').enable = objStruct.switches[index].value;
            }
          }
        }
        if (objStruct.inputs) {
          for (let index = 0; index < objStruct.inputs.length; index += 1) {
            inputsOptionsElements.value[objStruct.inputs[index].name] = objStruct.inputs[index].value;
          }
        }
        if (objStruct.banOnDeletionElement) {
          if (getElement(objStruct.banOnDeletionElement).enable) {
            showButtonDelete.value = false;
          }
        }
      } else if (elName === 'empty') {
        if (elementSelected.value != null) {
          resetSelectElements();
        }
      } else {
        dialogName.value = elName;
        updateRowsElements();
        elementDialog.value = true;
      }
    }

    function getOptions(obj) {
      obj.values.forEach((element) => {
        element.source = obj.name;
      });
      return obj.values;
    }
    function clickEmpty(event) {
      if (event.target.className === 'grid-container') {
        resetSelectElements();
      }
    }
    function updateSettings(par, value) {
      if (value) {
        if (par === 'type') {
          structure = defaultStructure.elements;
          setEnable(structure, false);
        }
      } else if (par === 'co') {
        getElement('co').enable = co.value;
        vav.value = false;
        cav.value = false;
      } else if (par === 'vav') {
        getElement('press').enable = vav.value;
        co.value = false;
        cav.value = false;
      } else if (par === 'cav') {
        getElement('spd').enable = cav.value;
        vav.value = false;
        co.value = false;
      } else if (par === 'troom') {
        getElement('troom').enable = troom.value;
      }
      build(structure);
      resetSelectElements();
      sync();
    }
    function resetConf() {
      structure = defaultStructure.elements;
      confPU.value = getObject(confPUOptions, 'id', defaultStructure.pu);
      confManual.value = getObject(confManualOptions, 'id', defaultStructure.manual);
      confBoxMaterial.value = getObject(confBoxMaterialOptions, 'id', defaultStructure.box_material);
      lum.value = defaultStructure.lum;
      clima.value = defaultStructure.clima;
      modbus.value = defaultStructure.modbus;
      co.value = defaultStructure.co;
      cav.value = defaultStructure.cav;
      vav.value = defaultStructure.vav;
      troom.value = defaultStructure.troom;
      version.value = defaultStructure.version;
      setEnable(structure, false);
      build(structure);
      resetSelectElements();
      sync();
    }
    function rules(rul, value) {
      if (value && rul) {
        return value >= rul.min && value <= rul.max;
      }
      return true;
    }
    function updateUnitsElementSelector(value) {
      if (value) {
        const objStruct = getElement(elementSelected.value.id);
        let buildForce = false;
        objStruct.references.forEach((tableObj) => {
          if (tableObj.name === value.source) {
            selectorsOptionsElements.value[objStruct.references.indexOf(tableObj)] = value;
            tableObj.valueId = value.id;
          }
        });

        // частный случай (изменение иконки)
        // для нагревателей
        if (objStruct.el === 'toh1' || objStruct.el === 'toh2') {
          const typeToh = getObject(objStruct.references, 'name', `type_${objStruct.el}`);
          const typeTohValue = getObject(typeToh.values, 'id', typeToh.valueId);
          if (typeTohValue.icon) {
            objStruct.icon = typeTohValue.icon;
          } else {
            delete objStruct.icon;
          }
          buildForce = true;
        }
        // для охладителей
        if (objStruct.el === 'toc1' || objStruct.el === 'toc2') {
          const typeToc = getObject(objStruct.references, 'name', `type_${objStruct.el}`);
          if (typeToc.valueId === 0) {
            delete objStruct.icon;
          } else {
            objStruct.icon = 'cooler.svg';
          }
          buildForce = true;
        }
        // для приводов с аналоговым управлением
        if (objStruct.el === 'pvlv1' || objStruct.el === 'mix_inflow') {
          const typeValve = getObject(objStruct.references, 'name', `typeValve_${objStruct.el}`);
          const typeValveValue = getObject(typeValve.values, 'id', typeValve.valueId);
          if (typeValveValue.icon) {
            objStruct.icon = typeValveValue.icon;
            getElement('vvlv1').icon = typeValveValue.icon;
          } else {
            delete objStruct.icon;
            delete getElement('vvlv1').icon;
          }
          buildForce = true;
        }
        sync();
        if (buildForce) {
          build(structure);
        }
        openDialog(elementSelected.value.id);
      }
    }
    function updateUnitsElementSelectorEntry(source, ind, value) {
      let reload = true;
      const objStruct = getElement(elementSelected.value.id);
      objStruct.references.forEach((tableObj) => {
        if (tableObj.name === source) {
          tableObj.referencesValueId.forEach((elementReference) => {
            if (elementReference.valueId === tableObj.valueId) {
              if (elementReference.switches) {
                const prevValue = getObject(elementReference.switches, 'name', ind.name);
                getObject(elementReference.switches, 'name', ind.name).value = !prevValue.value;
              }
              if (elementReference.inputs) {
                const objInput = getObject(elementReference.inputs, 'name', ind.name);
                if (objInput) {
                  if (rules(objInput.rules, value)) {
                    objInput.value = value;
                  } else {
                    reload = false;
                  }
                }
              }
              if (elementReference.references) {
                const objRef = getObject(elementReference.references, 'name', ind.name);
                if (objRef) {
                  objRef.valueId = value.id;
                }
              }
            }
          });
        }
      });
      if (reload) {
        sync();
        openDialog(elementSelected.value.id);
      }
    }
    function updateUnitsElementSelectorEntryEntry(source, ind, value) {
      let reload = true;
      const objStruct = getElement(elementSelected.value.id);
      objStruct.references.forEach((tableObj) => {
        if (tableObj.name === source) {
          tableObj.referencesValueId.forEach((elementReference) => {
            if (elementReference.valueId === tableObj.valueId) {
              if (elementReference.references) {
                const objRef = getObject(elementReference.references, 'name', ind.name);
                if (objRef) {
                  objRef.valueId = value.id;
                }
                elementReference.references.forEach((elementRef) => {
                  if (elementRef.referencesValueId) {
                    elementRef.referencesValueId.forEach((elementRefValueId) => {
                      if (elementRefValueId.valueId === elementRef.valueId) {
                        if (elementRefValueId.inputs) {
                          const objRefInputs = getObject(elementRefValueId.inputs, 'name', ind.name);
                          if (objRefInputs) {
                            if (rules(objRefInputs.rules, value)) {
                              objRefInputs.value = value;
                            } else {
                              reload = false;
                            }
                          }
                        }
                      }
                    });
                  }
                });
              }
            }
          });
        }
      });
      if (reload) {
        sync();
        openDialog(elementSelected.value.id);
      }
    }
    function updateUnitsElementSwitch(ind) {
      const objStruct = getElement(elementSelected.value.id);
      const prevValue = getObject(objStruct.switches, 'name', ind.name);
      getObject(objStruct.switches, 'name', ind.name).value = !prevValue.value;
      sync();
      openDialog(elementSelected.value.id);
    }
    function updateUnitsElementInput(value, ind) {
      function getParameterInObject(objStruct, par) {
        const obj = getObject(objStruct.references, 'name', par);
        return getObject(obj.values, 'id', obj.valueId);
      }
      const objStruct = getElement(elementSelected.value.id);
      const objInput = getObject(objStruct.inputs, 'name', ind.name);
      if (objInput.name === 'power_pv1') {
        axios.get(`${host}/services_get/productoption/Fan`)
          .then((res) => {
            const fans = res.data.sort((a, b) => (a.power < b.power ? -1 : 1)); // сортирует список по наименованию
            let fn = null;
            const type = Number(getParameterInObject(objStruct, `type_${objStruct.el}`).id);
            if (type === 0) {
              const voltage = Number(getParameterInObject(objStruct, `voltage_${objStruct.el}`).value);
              for (let index = 0; index < fans.length; index += 1) {
                const fan = fans[index];
                if (Number(fan.power) >= Number(value) && Number(fan.voltage) === voltage) {
                  fn = fan;
                  break;
                }
              }
            }
            if (fn !== null) {
              getObject(objStruct.inputs, 'name', `current_${objStruct.el}`).rules = {
                min: fn.currentMin,
                max: fn.currentMax,
                errorMessage: `Введите корректные данные от ${fn.currentMin} А до ${fn.currentMax} А`,
              };
              getObject(objStruct.inputs, 'name', `current_${objStruct.el}`).value = fn.currentMax;
            }
            if (rules(objInput.rules, value)) {
              objInput.value = value;
              sync();
              openDialog(elementSelected.value.id);
            }
          });
      } else if (rules(objInput.rules, value)) {
        objInput.value = value;
        sync();
      }
      build(structure);
    }
    function updateElementSelectedName(value) {
      const objStruct = getElement(elementSelected.value.id);
      objStruct.name = value;
      sync();
    }
    function selectFlags() {
      sync();
    }
    function enableElement() {
      const enableEl = getObject(structure, 'el', elementSelected.value.id);
      enableEl.enable = false;
      if (enableEl.enableElements) {
        enableEl.enableElements.forEach((element) => {
          getObject(structure, 'el', element).enable = false;
        });
      }
      if (enableEl.el === 'vv1') {
        getObject(structure, 'el', 'rec').enable = false;
        getObject(structure, 'el', 'tud').enable = false;
      }
      resetSelectElements();
      build(structure);
      sync();
    }
    function selectRowElements(event, row) {
      console.log(event, row);
      // selectedElements.value.push(row);
    }
    function overElement(val) {
      const obj = getObject(initElements.value, 'id', val);
      idElement.value = val;
      nameElement.value = obj.name;
      descriptElement.value = obj.description || '';
    }
    function leaveElement() {
      nameElement.value = '';
      idElement.value = null;
      descriptElement.value = descriptDefault;
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
            if (res.data.data) {
              object = res.data.data;
              name.value = object.name;
              document.title = object.name;
              updatedAt.value = object.updatedAt;
              inputDescript.value = object.descript;
              const readStruct = JSON.parse(object.structure);
              axios
                .get(`${host}/services/genprice/Setting`).then(() => {
                  if (callback) {
                    callback();
                  }
                  confPU.value = getObject(confPUOptions, 'id', readStruct.pu);
                  confManual.value = getObject(confManualOptions, 'id', readStruct.manual);
                  confBoxMaterial.value = getObject(confBoxMaterialOptions, 'id', readStruct.box_material);
                  lum.value = readStruct.lum;
                  clima.value = readStruct.clima;
                  modbus.value = readStruct.modbus;
                  co.value = readStruct.co;
                  cav.value = readStruct.cav;
                  vav.value = readStruct.vav;
                  troom.value = readStruct.troom;
                  structure = readStruct.elements;
                  console.log(readStruct);
                  version.value = readStruct.version;
                  build(structure);
                  resetSelectElements();
                  downloadPDF.value = `${path}${object.id}`;
                });
            } else {
              console.log(1);
            }
          }
        });
    }
    // метод возвращает ложь если используется хотя бы один датчик CO2
    function isCO2() {
      let res = true;
      ['co2', 'co2room'].forEach((element) => {
        if (getElement(element)) {
          if (getElement(element).enable) {
            res = false;
          }
        }
      });
      return res;
    }
    function getQuerySystemVent() {
      const query = object;
      query.descript = inputDescript.value;
      const writeStruct = {
        pu: confPU.value.id,
        manual: confManual.value.id,
        box_material: confBoxMaterial.value.id,
        lum: lum.value,
        clima: clima.value,
        modbus: modbus.value,
        co: co.value,
        cav: cav.value,
        vav: vav.value,
        troom: troom.value,
        version: version.value,
        elements: structure,
      };
      query.structure = JSON.stringify(writeStruct);
      return query;
    }
    function writeDatabase() {
      const query = getQuerySystemVent();
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
    function resetChange() {
      update(
        () => {
          sync();
          change.value = false;
        },
      );
    }
    // ------------------------------------------------------------------------------Функции вкладки подбор автоматики
    function updateAutomatics() {
      const query = getQuerySystemVent();
      axios.post(`${host}/api/v1/services_system_calc`, query).then((res) => {
        boxControl.value = res.data.structure.block_manual;
        // очищает список материалов
        boxControlMaterials.value.length = 0;
        for (let index = 0; index < res.data.structure.block_manual.assemblyList.length; index += 1) {
          const element = res.data.structure.block_manual.assemblyList[index];
          boxControlMaterials.value.push({
            number: index,
            name: element.name,
            count: element.count,
            desc: element.measure,
          });
        }
        // очищает перечень КИПиА
        boxControlMaterialsKip.value.length = 0;
        for (let index = 0; index < res.data.structure.block_manual.kipList.length; index += 1) {
          const element = res.data.structure.block_manual.kipList[index];
          boxControlMaterialsKip.value.push({
            number: index,
            name: element.name,
            count: element.count,
            desc: element.measure,
          });
        }
        // очищает список операций
        boxControlMaterialsOperations.value.length = 0;
        for (let index = 0; index < res.data.structure.block_manual.operationList.length; index += 1) {
          const element = res.data.structure.block_manual.operationList[index];
          boxControlMaterialsOperations.value.push({
            number: index,
            operation: element,
          });
        }
        // очищает список логов
        boxControlMaterialsLog.value.length = 0;
        for (let index = 0; index < res.data.debug.length; index += 1) {
          const element = res.data.debug[index];
          boxControlMaterialsLog.value.push({
            number: index,
            name: element,
          });
        }
        errors.value = res.data.errors;
        console.log(res.data);
      });
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
      id,
      // новые
      enableElement,
      idElement,
      Dialog,
      openDialog,
      elementDialog,
      getObjectElement,
      dialogName,
      confBoxMaterial,
      confBoxMaterialOptions,
      confPU,
      confPUOptions,
      confManual,
      confManualOptions,
      lum,
      clima,
      modbus,
      co,
      vav,
      cav,
      troom,
      boxControl,
      boxControlMaterials,
      boxControlColumns,
      paginationTableBoxControl: ref({
        rowsPerPage: 0,
      }),
      boxControlColumnsLog,
      boxControlMaterialsLog,
      boxControlColumnsKip,
      boxControlMaterialsKip,
      boxControlColumnsOperations,
      boxControlMaterialsOperations,
      errors,
      updateSettings,
      selectFlags,
      updateRowElements: updateRowsElements,
      // список элементов для таблицы выбора при добавлении
      initElements,
      rowsElements,
      columnsElements,
      selectedElements,
      selectRowElements,
      loadImage,
      //
      confirmExitAndSave,
      confirmExit,
      exit,
      downloadPDF,
      sync,
      dc,
      dex,
      removeMain,
      validationNumberNoZero,
      change,
      writeDatabase,
      inputDescript,
      getPathList,
      name,
      updatedAt,
      getQueryAll,
      getQueryUpdate,
      DialogConfirm,
      tab,
      tabAutomatics,
      resetChange,
      splitterModelMain: ref(70),
      splitterModelMainSettings: ref(57),
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
      elementSelected,
      clickEmpty,
      getElement,
      // опции для элементов
      selectorsOptionsElements,
      inputsOptionsElements,
      switchesOptionsElements,
      showButtonDelete,
      updateUnitsElementSelector,
      updateUnitsElementSelectorEntry,
      updateUnitsElementSelectorEntryEntry,
      updateUnitsElementInput,
      updateUnitsElementSwitch,
      updateElementSelectedName,
      getObject,
      getOptions,
      resetConf,
      // вкладка "Подбор автоматики"
      updateAutomatics,
      isCO2,
      version,
      defaultStructure,
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
  grid-template-columns: repeat(30, 1fr);
  grid-template-areas:
    ". . . . . . . . . . . . . . . . . . . . . . . ."
    "item1-1 item1-2 item1-3 item1-4 item1-5 item1-6 item1-7 item1-8 item1-9 item1-10 item1-11 item1-12 item1-13 item1-14 item1-15 item1-16 item1-17 item1-18 item1-19 item1-20 item1-21 item1-22 item1-23 item1-24 item1-25 item1-26 item1-27 item1-28 item1-29 item1-30"
    "item2-1 item2-2 item2-3 item2-4 item2-5 item2-6 item2-7 item2-8 item2-9 item2-10 item2-11 item2-12 item2-13 item2-14 item2-15 item2-16 item2-17 item2-18 item2-19 item2-20 item2-21 item2-22 item2-23 item2-24 item2-25 item2-26 item2-27 item2-28 item2-29 item2-30"
    "item3-1 item3-2 item3-3 item3-4 item3-5 item3-6 item3-7 item3-8 item3-9 item3-10 item3-11 item3-12 item3-13 item3-14 item3-15 item3-16 item3-17 item3-18 item3-19 item3-20 item3-21 item3-22 item3-23 item3-24 item3-25 item3-26 item3-27 item3-28 item3-29 item3-30"
    "item4-1 item4-2 item4-3 item4-4 item4-5 item4-6 item4-7 item4-8 item4-9 item4-10 item4-11 item4-12 item4-13 item4-14 item4-15 item4-16 item4-17 item4-18 item4-19 item4-20 item4-21 item4-22 item4-23 item4-24 item4-25 item4-26 item4-27 item4-28 item4-29 item4-30"
    "item5-1 item5-2 item5-3 item5-4 item5-5 item5-6 item5-7 item5-8 item5-9 item5-10 item5-11 item5-12 item5-13 item5-14 item5-15 item5-16 item5-17 item5-18 item5-19 item5-20 item5-21 item5-22 item5-23 item5-24 item5-25 item5-26 item5-27 item5-28 item5-29 item5-30"
    ". . . . . . . . . . . . . . . . . . . . . . . .";
}

.grid-item {
  font-size: 2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.my-sticky-header-table {
  /* height or max-height is important */
  height: 100%;
  /* this is when the loading indicator appears */
}

.my-sticky-header-table .q-table__top,
.my-sticky-header-table .q-table__bottom,
.my-sticky-header-table thead tr:first-child th {
  /* bg color is important for th; just specify one */
  background-color: rgb(60, 60, 60);
}

.my-sticky-header-table thead tr th {
  position: sticky;
  z-index: 1;
}

.my-sticky-header-table thead tr:first-child th {
  top: 0;
}

.my-sticky-header-table.q-table--loading thead tr:last-child th {
  /* height of all previous header rows */
  top: 48px;
}

.scroll::-webkit-scrollbar {
  width: 15px;
  background: rgb(60, 60, 60);
  opacity: 0 !important;
}

.scroll::-webkit-scrollbar-thumb {
  background: grey
}

.scroll:hover::-webkit-scrollbar-thumb {
  background: grey
}

.scroll::-webkit-scrollbar-thumb:hover {
  background: grey
}</style>
