<template >
  <div class="mainCont">
    <div id="generalInfo" >
      <div>
        <div class="text-h6"><a :href="placeholder" style="color: rgb(175, 182, 245); font-size: large;">{{ sys_name }}</a> </div>
        <div>
          <div>
            Месторасположение: {{ place }}
            <br>
            Статус сервера: <span :class="`text-h6 text-${connect_color}`">{{ connect }}</span>
            <br>
            Серверное время: <span :class="`text-h6 text-white`">{{ time }}</span>
          </div>
        </div>
      </div>
      <q-toggle color="teal-7" :label="`Режим редактирования`" v-model="isActive" @click="changeMode" />

    </div>
    <div style="display: flex; flex-direction: row; justify-content:space-between">
      <div>
        <q-btn color='dark-grey' icon="arrow_back" label='' @click="exit"/>
      <q-btn color='dark-grey' icon="download" label="Графики"
      href="http://nsk-deb-tech:3001/monitoring/excel/save_chart/18" target="_self"/>
      <q-btn color='dark-grey' icon="summarize" label="Логи" />
      <q-btn color='dark-grey' icon="summarize" label="Расписание" />
      </div>
      <div>
        <q-btn color='dark-grey' icon="restart_alt" label="Перезагрузить"/>
        <q-btn color='dark-grey' icon="settings" label="Настройки" @click="() => {
        dialogSettingManual.show();
      }" />
      </div>

    </div>
    <div class="canvasCont" >
      <Dialog width="80vw" name-def="Настройки панели управления" ref="dialogSettingManual">
        <template v-slot:content>
          <q-item>
            <q-item-section>
              <q-input v-model="place" dark color="white" input-class="text-h6 text-white" label-color="grey" stack-label
                label="Месторасположение:" />
            </q-item-section>
            <q-item-section class="col-4">
              <q-input v-model="placeholder" dark color="white" input-class="text-h6 text-white" label-color="grey"
                stack-label label="Ссылка:" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="col-4">
              <q-input type="text" v-model="ip_addr" dark color="white" input-class="text-h6 text-white"
                label-color="grey" stack-label label="IP адрес: х.х.х.х" />
            </q-item-section>
            <q-item-section class="col-3">
              <q-input type="number" v-model="port" dark color="white" input-class="text-h6 text-white" label-color="grey"
                stack-label label="Порт:" />
            </q-item-section>
            <q-item-section>
              <q-select stack-label dark class="text-h6" label="Тип подключения:" options-selected-class="text-h6 text-grey"
                label-active-class="text-red" popup-content-class="text-h6" :options="['DEFAULT', 'TELNET']" label-color="grey"
                v-model="connectionType" popup-content-style="background-color: rgb(60, 60, 60); color:  white;">
              </q-select>
            </q-item-section>
          </q-item>
          <q-item>
            <q-card-section> <q-input type="number" v-model="id_addr" dark color="white" input-class="text-h6 text-white"
                label-color="grey" stack-label label="Адрес контроллера:" /></q-card-section>
            <q-item-section> <q-input type="number" v-model="timeout" dark color="white" input-class="text-h6 text-white"
                label-color="grey" stack-label label="Таймаут, мс:" /></q-item-section>
            <q-item-section> <q-input type="number" v-model="period" dark color="white" input-class="text-h6 text-white"
                label-color="grey" stack-label label="Период опроса, сек:" /></q-item-section>
            <q-item-section> <q-input type="number" v-model="periodOfStorage" dark color="white"
                input-class="text-h6 text-white" label-color="grey" stack-label
                label="Хранение данных, дней:" /></q-item-section>
            <q-item-section>
              <q-select stack-label dark class="text-h6" label-color="grey" label="Порядок битов:" options-selected-class="text-h6 text-grey"
                label-active-class="text-red" popup-content-class="text-h6" :options="['1234', '2143', '3412', '4321']"
                v-model="byteOrder" popup-content-style="background-color: rgb(60, 60, 60); color:  white;">
              </q-select>
            </q-item-section>
          </q-item>
          <q-item>
            <q-btn color="dark-grey" icon="add" label="Добавить пользователя" @click="() => {
              dialogAddUsers.show();
            }" />
          </q-item>
          <q-item>
            <q-chip dark v-for="user in allowUsers" :key="user" removable @remove="removeUser(user)" color="grey"
              text-color="white" icon="person">
              {{ user.name }}
            </q-chip>
          </q-item>
          <q-card-actions align="center">
            <q-btn color="dark-grey" label="Готово" @click="() => {
              createWS();
              writeDatabase();
              dialogSettingManual.hide();
            }" />
          </q-card-actions>
        </template>
      </Dialog>
      <q-splitter v-model="splitterModel" :limits="[13, 87]" style="height: 650px;">
        <template v-slot:before >
          <div style="padding: 0px">
            <q-scroll-area style="height: 650px;">
              <v-stage :config="configKonva">
                <v-layer>
                  <q-dialog v-model="chooseImage" persistent>
                    <q-card class="text-white bg-grey-9">
                      <q-card-section>
                        <q-item-section>
                      <q-item-label style="margin: 0 auto;">Выберите изображение</q-item-label>
                      <div class="q-gutter-md" id="imageChoose" style="padding-top: 10px">
                        <q-space />
                        <q-btn dark label="Выбор изображения">
                          <q-menu class="bg-grey-9 text-white">
                            <q-list>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Воздуховод(верх.)</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Воздуховод</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Воздуховод (верт.)</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Авария</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Стрелка</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Бактер.фильтр</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Календарь</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Фреон.охладитель</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Охладитель</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Вентилятор</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Фильтр</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Эл.нагреватель</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Нагреватель</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Измер.влажности</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Влажность</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Вкл-выкл</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Давление</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Рекуп.пластинч.</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Рекуп.роторный</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Скорость</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Температура</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Задвижка(аналог.)</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Задвижка</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-btn>
                      </div>

                    </q-item-section>
                      </q-card-section>
                    </q-card>
                  </q-dialog>
                  <div id="container" style="height: 650px; padding-top: 0" ></div>
                </v-layer>
              </v-stage>
              <div id="deleteIcon">
                <img src="../../components/components/myComps/recycle-bin.png" alt="" />
              </div>
            </q-scroll-area>
          </div>
        </template>

        <template v-slot:after>
          <div v-if="selected" class="rightMoveable fit" >
            <q-card>
              <q-tabs v-model="tab" dense class="text-white bg-grey-9 text-weight-bold" active-color="white"
                indicator-color="white" align="justify">
                <q-tab name="mails" label="Основные" class="text-white bg-grey-9" />
                <q-tab name="alarms" label="Данные" />
              </q-tabs>

              <q-separator/>

              <q-tab-panels v-model="tab" animated class="text-white bg-grey-9">
                <q-tab-panel name="mails" style="display: flex; flex-direction: column">
                  <q-item clickable v-ripple v-if="!img_edit_visible">
                    <q-item-section id="textItemText">
                      <q-item-label>Текст</q-item-label>
                      <q-input dark filled :disable="isTextDisabled" v-model="inputText" @update:model-value="updateName"
                        :dense="true" type="text" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple>
                    <q-item-section id="textItemColor">
                      <q-item-label>Цвет фона:</q-item-label>
                      <q-input dark filled v-model="color" class="my-input" dense>
                        <template v-slot:append>
                          <q-icon name="colorize" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-color v-model="color" />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="img_edit_visible">
                    <q-item-section>
                      <q-item-label>Изображение</q-item-label>
                      <div class="q-gutter-md" id="imageChoose" style="padding-top: 10px">
                        <q-btn v-bind:disabled="isImageDisabled" dark label="Выбор изображения">
                          <q-menu dark filled>
                            <q-list>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Воздуховод(верх.)</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Воздуховод</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Воздуховод (верт.)</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Авария</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Стрелка</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Бактер.фильтр</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Календарь</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Фреон.охладитель</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Охладитель</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Вентилятор</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Фильтр</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Эл.нагреватель</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Нагреватель</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Измер.влажности</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Влажность</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Вкл-выкл</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Давление</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Рекуп.пластинч.</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Рекуп.роторный</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Скорость</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Температура</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Задвижка(аналог.)</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="deliverData">
                                <q-item-section>Задвижка</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-btn>
                      </div>

                    </q-item-section>



                  </q-item>
                </q-tab-panel>

                <q-tab-panel square name="alarms" v-if="!img_edit_visible">
                  <div style="display: flex; justify-content: start;">
                    <q-btn @click="addTag" v-bind:disabled="counter >= 3">Добавить тег</q-btn>
                    <q-btn dark filled style="margin-left: 10px;" @click="changeTag(index)">Сохранить</q-btn>
                  </div>

                  <q-list v-for="(item, index) in items.slice(0, counter)" :key="index">
                    <q-expansion-item :label="`Тег ${index + 1} ${item.name}`">
                      <div class="forText">
                        <div>
                          <q-item clickable v-ripple style="display:  flex; flex-direction: column;">
                            <q-item-section>Наименование:</q-item-section>
                            <q-input dark filled v-model=item.name @update:model-value="updateVarName" dense
                              type="text" />
                          </q-item>

                          <q-item v-if="!img_edit_visible" clickable v-ripple
                            style="display:  flex; flex-direction: column;">
                            <q-item-section>Адрес:</q-item-section>
                            <q-input dark filled v-model=item.adress @update:model-value="updateVarAddr" :dense="true"
                              type="number" />
                          </q-item>
                          <q-item v-if="!img_edit_visible" clickable v-ripple
                            style="display:  flex; flex-direction: column;">
                            <q-item-section>Функция:</q-item-section>
                            <q-select dark filled :dense="true" :options="functionsOptions"
                              options-selected-class="text-white" option-value="label"
                              popup-content-style="background-color: rgb(60, 60, 60); color: white; "
                              style="padding-right: 5px;" v-model=item.function />
                          </q-item>
                          <q-item v-if="!img_edit_visible" clickable v-ripple
                            style="display:  flex; flex-direction: column;">
                            <q-item-section>Задержка, мс:</q-item-section>
                            <q-input dark filled v-model=item.timer @update:model-value="updateVarDelay" :dense="true"
                              type="number" />
                          </q-item>
                          <q-item v-if="!img_edit_visible" clickable v-ripple
                            style="display:  flex; flex-direction: column;">
                            <q-item-section>Количество байтов:</q-item-section>
                            <q-input dark filled v-model=item.length @update:model-value="updateVarBytes" :dense="true"
                              type="number" />
                          </q-item>
                          <q-item v-if="!img_edit_visible" clickable v-ripple
                            style="display:  flex; flex-direction: column;">
                            <q-item-section>Постфикс:</q-item-section>
                            <q-input dark filled v-model=item.postfix @update:model-value="updateVarPostfix" :dense="true"
                              type="text" />
                          </q-item>
                          <q-item v-if="!img_edit_visible" clickable v-ripple
                            style="display:  flex; flex-direction: column;">
                            <q-item-section>Тип данных:</q-item-section>
                            <q-select dark filled :dense="true" :options="dataTypesOptions"
                              options-selected-class="text-white" option-value="label"
                              popup-content-style="background-color: rgb(60, 60, 60); color: white;"
                              style="padding-right: 5px;" v-model=item.type />
                          </q-item>
                          <q-item
                            v-if="(item.type == 'Целое число' || item.type == 'Большое число' || item.type == 'Дробное число')"
                            clickable v-ripple style="display:  flex; flex-direction: column;">
                            <q-item-section>Делитель:</q-item-section>
                            <q-input dark filled v-model="item.divider"
                              :dense="true" type="number" />
                          </q-item>
                          <q-item
                            v-if="(item.type == 'Целое число' || item.type == 'Большое число' || item.type == 'Дробное число')"
                            clickable v-ripple style="display:  flex; flex-direction: column;">
                            <q-item-section>Множитель:</q-item-section>
                            <q-input dark filled v-model="item.multiplier"
                              :dense="true" type="number" />
                          </q-item>
                          <q-item v-if="(item.type == 'Дробное число')" clickable v-ripple
                            style="display:  flex; flex-direction: column;">
                            <q-item-section>Количество знаков после запятой:</q-item-section>
                            <q-input dark filled v-model="varSymAfterComma" @update:model-value="updateVarSymAfterComma"
                              :dense="true" type="number" />
                          </q-item>
                          <q-item v-if="!img_edit_visible" clickable v-ripple
                            style="display:  flex; flex-direction: column;">
                            <q-item-section>Отображение:</q-item-section>
                            <q-select dark filled :dense="true" :options="dataDisplayOptions"
                              options-selected-class="text-white" option-value="label"
                              popup-content-style="background-color: rgb(60, 60, 60); color: white;"
                              style="padding-right: 5px;" v-model=item.display />
                          </q-item>
                          <q-item v-if="(item.display == 'Соответствие бита значению из справочника')" clickable v-ripple
                            style="display:  flex; flex-direction: column;">
                            <q-item-section>Номер бита:</q-item-section>
                            <q-input dark filled v-model="varBitNumber" :dense="true" type="number" />
                          </q-item>
                          <q-item v-if="(item.display == 'Соответствие бита значению из справочника' || item.display == 'Соответствие значению из справочника' || item.display == 'Поиск бита из справочника')" style="display: flex; flex-direction: column;">
                          <q-item-section>Справочник:</q-item-section>
                          <q-item-section class="bg-grey-9"><StringTable1
                              ref="tableSettingsTagReference" name="Справочник:" :save="readSettingsTagReference"
                              :columnsDef="[
                                {
                                  name: 'num',
                                  required: true,
                                  label: 'Ключ',
                                  align: 'center',
                                  field: 'num',
                                  sortable: false,
                                  format: (val, row) => val,
                                  style: 'width: 50px',
                                  type: 'number',
                                  edit: true,
                                },
                                {
                                  name: 'value',
                                  align: 'left',
                                  label: 'Значение',
                                  field: 'value',
                                  format: (val, row) => val,
                                  type: 'text',
                                  sortable: false,
                                  edit: true,
                                },
                              ]" :rows-def="item.metadata">

                            </StringTable1></q-item-section>

                          </q-item>

                          <q-item v-if="!img_edit_visible" clickable v-ripple
                            style="display:  flex; flex-direction: column;">
                            <q-item-section>Оповещение:</q-item-section>
                            <q-checkbox dark filled v-model="messageOn" label="Активно" />
                          </q-item>
                          <q-item v-if="messageOn" clickable v-ripple
                            style="display:  flex; flex-direction: column;">
                            <q-item-section>Условие:</q-item-section>
                            <q-select dark filled :dense="true" :options="notifyConditionsOptions"
                              options-selected-class="text-white" option-value="label"
                              popup-content-style="background-color: rgb(60, 60, 60); color: white; "
                              style="padding-right: 5px;" v-model="item.condition" />
                          </q-item>
                          <q-item v-if="messageOn" clickable v-ripple
                            style="display:  flex; flex-direction: column;">
                            <q-item-section>Значение:</q-item-section>
                            <q-input dark filled v-model="item.conditionValue"
                              :dense="true" type="number" />
                          </q-item>
                          <q-item v-if="!img_edit_visible" clickable v-ripple
                            style="display:  flex; flex-direction: column;">
                            <q-item-section>Запись в базу данных:</q-item-section>
                            <q-checkbox dark filled v-model="item.writeDB" label="Активно" />
                          </q-item>
                          <q-item v-if="item.writeDB" clickable v-ripple
                            style="display:  flex; flex-direction: column;">
                            <q-item-section>Имя переменной:</q-item-section>
                            <q-input dark filled v-model="item.writeDBName"
                              :dense="true" type="text" />
                          </q-item>
                          <q-item v-if="item.writeDB" clickable v-ripple
                            style="display:  flex; flex-direction: column;">
                            <q-item-section>Имя для отображения:</q-item-section>
                            <q-input dark filled v-model="item.writeDBDisplayName"
                              :dense="true" type="text" />
                          </q-item>
                          <q-btn dense dark filled style="display: flex; margin: 0 auto; padding: 5px"
                            @click="deleteTag(index)">Удалить тег</q-btn>
                        </div>

                      </div>
                    </q-expansion-item>
                  </q-list>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </div>
          <div v-else style="
                color: white;
                padding-top: 32px;
                font-size: 16px;
                display: flex;
                justify-content: center;
              ">
            Выберите объект
          </div>

        </template>
      </q-splitter>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import Konva from 'konva';
import axios from 'axios';
// import Page from 'src/components/Page.vue';
// import Confirm from 'src/components/dialogs/confirm.vue';
// import Table from 'src/components/Table.vue';
// import ScrollBar from 'src/components/ScrollBar.vue';
// import StringTable from 'src/components/StringTable.vue';
// import ErrorAllow from 'src/components/ErrorAllow.vue';
// import Chart from 'src/components/charts/chart_v5.vue';
import Dialog from 'src/components/dialogs/standart.vue';
import StringTable1 from 'src/components/StringTable1.vue';
import { Fan, newElemFan } from '../../components/Konva-components/Fan';
import { Text, newElemText } from '../../components/Konva-components/Text';
import { Button, newElemButton } from '../../components/Konva-components/Button.js';
import { correctPosition } from '../../components/Konva-components/drag-rules.js';
import { addShadow, deleteShadow, createBorder } from '../../components/Konva-components/interaction.js';
import { addToJSON } from '../../components/Konva-components/JSONcreate';
import { upload } from '../../components/Konva-components/JSONload';
import { changeJSON } from '../../components/Konva-components/JSONchange';
import { modeChanger } from '../../components/Konva-components/switchMode';
import { imagePicker } from '../../components/Konva-components/image-picker';




const { // eslint-disable-line
  host, getObject, // eslint-disable-line
} = inject('store'); // eslint-disable-line
const dialogSettingManual = ref(null);
const system = ref({});
const splitterModel = ref(70);
const width = 1200;
const height = 750;
const stage = ref(null);
const layer = ref(null);
const toolbar = ref(null);
const canva = ref(null);
const toolbarTitle = ref();
const airUpBorder = ref(new Image());
const air = ref(new Image());
const air90 = ref(new Image());
const alarm = ref(new Image());
const arrow = ref(new Image());
const bf = ref(new Image());
const calendar = ref(new Image());
const coolerFreon = ref(new Image());
const cooler = ref(new Image());
const fanIm = ref(new Image());
const filter = ref(new Image());
const heaterElectric = ref(new Image());
const heater = ref(new Image());
const humdityMeas = ref(new Image());
const humdity = ref(new Image());
const onOff = ref(new Image());
const pressure = ref(new Image());
const recup = ref(new Image());
const recupP = ref(new Image());
const recupR = ref(new Image());
const recupR1 = ref(new Image());
const speed = ref(new Image());
const temperature = ref(new Image());
const valveAnalog = ref(new Image());
const valve = ref(new Image());
const sys_name = ref();
const ip_addr = ref();
const period = ref();
const port = ref();
const id_addr = ref();
const timeout = ref();
const place = ref();
const placeholder = ref();
const byteOrder = ref();
const connectionType = ref();
const periodOfStorage = ref();
const customItem = ref(new Image());
const chooseImage = ref(false);

let fan;
let button;
let text;
let btn;
let btnGrid;
let layerGrid;
let xBorder;
let yBorder;

const isDragEnd = ref(false);
const color = '#424242';

const toolbarWIdth = 200;
const toolbarHeight = 640;
const canvasWidth = 960;
const canvasHeigth = 640;
const layerScale = 32;

// let canvasLeftX = 20 + toolbarWIdth + 10;
const canvasRightX = 20 + toolbarWIdth + 10 + canvasWidth;
// let canvasTopY = 20;
const canvasBottomY = 20 + canvasHeigth;
let inters;
const editable = ref({});

const idsArr = ref([]);
const added = ref([]);
const foundObj = ref();
let isNew;
const selected = ref(false);
const isTextDisabled = ref(true);
const isImageDisabled = ref(true);
const elemID = ref({});
const isActive = ref(true);
const inputText = ref('');
let isButtonClicked = true;
let configuration; // eslint-disable-line
const text_edit_visible = ref(false);
const img_edit_visible = ref(false);
const tab = ref('mails');
const functionsOptions = ref(['FC1', 'FC2', 'FC3', 'FC4', 'FC5', 'FC6', 'FC16']);
const dataTypesOptions = ref(['Сырые данные', 'Байт', 'Целое число', 'Большое число', 'Дробное число']);
const notifyConditionsOptions = ref(['==', '>=', '<=', '>', '<', '!=']);

// const dataTypesOptionss = ref();
const map = new Map([
  ['none', 'Сырые данные'],
  ['byte', 'Байт'],
  ['integer', 'Целое число'],
  ['long', 'Большое число'],
  ['float', 'Дробное число']
]);
const map1 = new Map([
  ['none', 'Без преобразований'],
  ['reference', 'Соответствие значению из справочника'],
  ['reference_single_bit', 'Поиск бита из справочника'],
  ['reference_bit', 'Соответствие бита значению из справочника']
]);
const dataDisplayOptions = ref(['Без преобразований', 'Соответствие значению из справочника', 'Поиск бита из справочника', 'Соответствие бита значению из справочника']);

const messageOn = ref(false);
const messageOn1 = ref(false);
const messageOn2 = ref(false);
const dbWriteOn = ref(false);
const dbWriteOn1 = ref(false);
const dbWriteOn2 = ref(false);

const tagsModelElementFunction = ref({});
const tagsModelElementName = ref({});
const tagsModelElementAdress = ref({});
const tagsModelElementLength = ref({});
const tagsModelElementPostfix = ref({});
const tagsModelElementTimer = ref({});
const tagsModelDataType = ref({});
const tagsModelDataDisplay = ref({});
const tagsModelMetadata = ref({});
const tagsModelDivider = ref();
const tagsModelMultiplier = ref();
const tagsModelElementCondition = ref('>');
const tagsModelElementConditionValue = ref();
const tagsModelElementWriteDB = ref(false);
const tagsModelElementWriteDBName = ref();
const tagsModelElementWriteDBDisplayName = ref();
const tagsModelElementBitNumber = ref(0);

const tagsModelElementFunction1 = ref({});
const tagsModelElementName1 = ref({});
const tagsModelElementAdress1 = ref({});
const tagsModelElementLength1 = ref({});
const tagsModelElementPostfix1 = ref({});
const tagsModelElementTimer1 = ref({});
const tagsModelDataType1 = ref({});
const tagsModelDataDisplay1 = ref({});
const tagsModelMetadata1 = ref({});
const tagsModelDivider1 = ref();
const tagsModelMultiplier1 = ref();
const tagsModelElementCondition1 = ref('>');
const tagsModelElementConditionValue1 = ref();
const tagsModelElementWriteDB1 = ref(false);
const tagsModelElementWriteDBName1 = ref();
const tagsModelElementWriteDBDisplayName1 = ref();
const tagsModelElementBitNumber1 = ref(0);

const tagsModelElementFunction2 = ref({});
const tagsModelElementName2 = ref({});
const tagsModelElementAdress2 = ref({});
const tagsModelElementLength2 = ref({});
const tagsModelElementPostfix2 = ref({});
const tagsModelElementTimer2 = ref({});
const tagsModelDataType2 = ref({});
const tagsModelDataDisplay2 = ref({});
const tagsModelMetadata2 = ref({});
const tagsModelDivider2 = ref();
const tagsModelMultiplier2 = ref();
const tagsModelElementCondition2 = ref('>');
const tagsModelElementConditionValue2 = ref();
const tagsModelElementWriteDB2 = ref(false);
const tagsModelElementWriteDBName2 = ref();
const tagsModelElementWriteDBDisplayName2 = ref();
const tagsModelElementBitNumber2 = ref(0);
const connect = ref('');
const connect_color = ref('white');

// let ws;
// function deleteWS() {
//       if (ws) {
//         ws.close();
//         ws = null;
//       }
//     }

// function createWS() {
//   deleteWS();
//       setInterval(() => {
//         connect.value = 'Подключение...';
//         connect_color.value = 'yellow';
//         if (ws) {
//           if (ws.readyState === WebSocket.OPEN) {
//             connect.value = 'Подключен';
//             connect_color.value = 'green';
//           } else if (ws.readyState === WebSocket.CLOSED) {
//             connect.value = 'Ошибка подключения';
//             connect_color.value = 'red';
//           }
//         }
//       }, 500);
//       const connectWs = setInterval(() => {
//         if (ip_addr.value !== '') {
//           ws = new WebSocket(`ws://10.154.40.12:3001/monitoring`);
//           ws.onopen = () => {
//             console.log('Веб сокет подключен');
//           };
//           ws.onclose = () => {
//             console.log('Веб сокет отключён');
//           };
//         }
//       })
// }


const items = ref([
  { function: tagsModelElementFunction, name: tagsModelElementName, adress: tagsModelElementAdress, length: tagsModelElementLength, postfix: tagsModelElementPostfix, timer: tagsModelElementTimer, type: tagsModelDataType, display: tagsModelDataDisplay, metadata: tagsModelMetadata, divider: tagsModelDivider, multiplier: tagsModelMultiplier, condition:  tagsModelElementCondition, conditionValue: tagsModelElementConditionValue, writeDB: tagsModelElementWriteDB, writeDBName: tagsModelElementWriteDBName, writeDBDisplayName: tagsModelElementWriteDBDisplayName, notify: messageOn, bitNumber : tagsModelElementBitNumber},
  { function: tagsModelElementFunction1, name: tagsModelElementName1, adress: tagsModelElementAdress1, length: tagsModelElementLength1, postfix: tagsModelElementPostfix1, timer: tagsModelElementTimer1, type: tagsModelDataType1, display: tagsModelDataDisplay1, metadata: tagsModelMetadata1, divider: tagsModelDivider1, multiplier: tagsModelMultiplier1, condition:  tagsModelElementCondition1, conditionValue: tagsModelElementConditionValue1, writeDB: tagsModelElementWriteDB1, writeDBName: tagsModelElementWriteDBName1, writeDBDisplayName: tagsModelElementWriteDBDisplayName1,notify: messageOn1, bitNumber : tagsModelElementBitNumber1 },
  { function: tagsModelElementFunction2, name: tagsModelElementName2, adress: tagsModelElementAdress2, length: tagsModelElementLength2, postfix: tagsModelElementPostfix2, timer: tagsModelElementTimer2, type: tagsModelDataType2, display: tagsModelDataDisplay2, metadata: tagsModelMetadata2, divider: tagsModelDivider2, multiplier: tagsModelMultiplier2, condition:  tagsModelElementCondition2, conditionValue: tagsModelElementConditionValue2, writeDB: tagsModelElementWriteDB2, writeDBName: tagsModelElementWriteDBName2, writeDBDisplayName: tagsModelElementWriteDBDisplayName2, notify: messageOn2, bitNumber : tagsModelElementBitNumber2 },
]);
function isContains(array, check, prop) {
      return array.find((element) => element[prop] === check);
    }
function getUniquieCNT(array, prefix, prop) {
      let cnt = 0;
      while (isContains(array, `${prefix}${cnt}`, prop)) {
        cnt += 1;
      }
      return cnt;
    }
function addTagElement(editableEl) {
      editableEl.attrs.tags.push({
        id: `tag${getUniquieCNT(editableEl.attrs.tags, 'tag', 'id')}`,
        name: '',
        adress: 9999,
        quantity: 1,
        type: 'integer', // 'float', 'refer' (метадата из справочника value>label)
        divider: 1,
        metadata: [],
        function: 'FC1',
        position: 'top',
        postfix: '',
      });
    }
const counter = ref();
function addTag() {
  items.value.forEach((element) => {
    if (typeof element.function === 'object') {
      element.function = ''
    }
    if (typeof element.name === 'object') {
      element.name = ''
    }
    if (typeof element.adress === 'object') {
      element.adress = ''
    }
    if (typeof element.length === 'object') {
      element.length = ''
    }
    if (typeof element.postfix === 'object') {
      element.postfix = ''
    }
    if (typeof element.timer === 'object') {
      element.timer = ''
    }
    if (typeof element.type === 'object') {
      element.type = ''
    }
    if (typeof element.display === 'object') {
      element.display = ''
    }
    if (typeof element.divider === 'object') {
      element.divider = ''
    }
  })


    addTagElement(editable.value);

  if (counter.value < 3) {
    counter.value++ // eslint-disable-line
  }

  changeJSON(editable.value, configuration.structure, xBorder, yBorder);
}
function updateVarName() {
}
function deliverData(event) {
  if (chooseImage.value){
    imagePicker(event.srcElement.firstChild.data, foundObj.value, configuration.structure, airUpBorder, air, air90, alarm, arrow, bf, calendar, coolerFreon, cooler, fanIm, filter, heaterElectric, heater, humdityMeas, humdity, onOff, pressure, recupP, recupR, recupR1, speed, temperature, valveAnalog, valve, layer);
    chooseImage.value = false;
  }
  else{
    imagePicker(event.srcElement.firstChild.data, editable.value, configuration.structure, airUpBorder, air, air90, alarm, arrow, bf, calendar, coolerFreon, cooler, fanIm, filter, heaterElectric, heater, humdityMeas, humdity, onOff, pressure, recupP, recupR, recupR1, speed, temperature, valveAnalog, valve, layer);
  }
}
function setMap(object, targetMap, targetVar, targetAttr, targetVar1, targetAttr1, targetVar2, targetAttr2) {
  if (object.attrs.tags.length == '1') { // eslint-disable-line
    if (object.attrs.tags[0] && typeof (object.attrs.tags[0].type) !== "undefined") {
      targetMap.forEach((value, key) => {
        if (targetAttr === key) {
          targetVar.value = value;
        }
      })
    }
    else {
      targetVar.value = '';
    }
  }
  if (object.attrs.tags.length == '2') { // eslint-disable-line
    // console.log(object)
    targetMap.forEach((value, key) => {
      if (targetAttr === key) {
        targetVar.value = value;
      }
      if (typeof targetAttr == 'undefined') { // eslint-disable-line
        targetVar.value = "";
      }

    })

    targetMap.forEach((value, key) => {
      if (targetAttr1 === key) {
        targetVar1.value = value;
      }
      if (typeof targetAttr1 == 'undefined') { // eslint-disable-line
        targetVar1.value = "";
      }
    })
  }

  if (object.attrs.tags.length == '3') { // eslint-disable-line
    // console.log(object)
    targetMap.forEach((value, key) => {
      if (targetAttr === key) {
        targetVar.value = value;
      }
      if (typeof targetAttr == 'undefined') { // eslint-disable-line
        targetVar.value = "";
      }

    })

    targetMap.forEach((value, key) => {
      if (targetAttr1 === key) {
        targetVar1.value = value;
      }
      if (typeof targetAttr1 == 'undefined') { // eslint-disable-line
        targetVar1.value = "";
      }
    })

    targetMap.forEach((value, key) => {
      if (targetAttr1 === key) {
        targetVar1.value = value;
      }
      if (typeof targetAttr2 == 'undefined') { // eslint-disable-line
        targetVar2.value = "";
      }
    })
  }
}
function makeSideMenu(object) {
  isTextDisabled.value = false;
  text_edit_visible.value = true;
  img_edit_visible.value = false;
  isImageDisabled.value = true;
  if (object.value.attrs.type === 'input' || object.value.attrs.type === 'button') {
    isTextDisabled.value = false;
    text_edit_visible.value = true;
    img_edit_visible.value = false;
    isImageDisabled.value = true;


    inputText.value = object.value.children[1].attrs.text;



    if (object.value.attrs.tags.length == '1') { // eslint-disable-line
      counter.value = 1;
      tagsModelDataDisplay.value = object.value.attrs.tags[0].display || '';
      tagsModelElementName.value = object.value.attrs.tags[0].name || '';
      tagsModelElementAdress.value = object.value.attrs.tags[0].adress;
      tagsModelElementFunction.value = object.value.attrs.tags[0].function;
      tagsModelElementTimer.value = object.value.attrs.tags[0].timer;
      tagsModelElementPostfix.value = object.value.attrs.tags[0].postfix;
      tagsModelElementLength.value = object.value.attrs.tags[0].quantity;
      tagsModelMetadata.value = object.value.attrs.tags[0].metadata
      messageOn.value = object.value.attrs.tags[0].notify || false;
      dbWriteOn.value = object.value.attrs.tags[0].writedb || false;
      tagsModelDivider.value = object.value.attrs.tags[0].divider || '';
      tagsModelMultiplier.value = object.value.attrs.tags[0].multiplier || '';
      tagsModelElementCondition.value = object.value.attrs.tags[0].condition || '';
      tagsModelElementConditionValue.value = object.value.attrs.tags[0].condition_value || '';
      tagsModelElementWriteDB.value = object.value.attrs.tags[0].writedb || false;
      tagsModelElementWriteDBName.value = object.value.attrs.tags[0].writedbname || "";
      tagsModelElementWriteDBDisplayName.value = object.value.attrs.tags[0].writedbdisplayname || "";
      tagsModelElementBitNumber.value = object.value.attrs.tags[0].bit_number || ""

      setMap(object.value, map, tagsModelDataType, object.value.attrs.tags[0].type);
      setMap(object.value, map1, tagsModelDataDisplay, object.value.attrs.tags[0].convert);
    }
    if (object.value.attrs.tags.length == '2') { // eslint-disable-line
      counter.value = 2;
      tagsModelDataDisplay.value = object.value.attrs.tags[0].display || '';
      tagsModelElementName.value = object.value.attrs.tags[0].name || '';
      tagsModelElementAdress.value = object.value.attrs.tags[0].adress;
      tagsModelElementFunction.value = object.value.attrs.tags[0].function;
      tagsModelElementTimer.value = object.value.attrs.tags[0].timer;
      tagsModelElementPostfix.value = object.value.attrs.tags[0].postfix;
      tagsModelElementLength.value = object.value.attrs.tags[0].quantity;
      messageOn.value = object.value.attrs.tags[0].notify || false;
      dbWriteOn.value = object.value.attrs.tags[0].writedb || false;
      tagsModelMetadata.value = object.value.attrs.tags[0].metadata;
      tagsModelDivider.value = object.value.attrs.tags[0].divider || '';
      tagsModelMultiplier.value = object.value.attrs.tags[0].multiplier || '';
      tagsModelElementCondition.value = object.value.attrs.tags[0].condition || '';
      tagsModelElementConditionValue.value = object.value.attrs.tags[0].condition_value || '';
      tagsModelElementWriteDB.value = object.value.attrs.tags[0].writedb || false;
      tagsModelElementWriteDBName.value = object.value.attrs.tags[0].writedbname || "";
      tagsModelElementWriteDBDisplayName.value = object.value.attrs.tags[0].writedbdisplayname || "";
      tagsModelElementBitNumber.value = object.value.attrs.tags[0].bit_number || ""

      tagsModelDataDisplay1.value = object.value.attrs.tags[1].display || '';
      tagsModelElementName1.value = object.value.attrs.tags[1].name || '';
      tagsModelElementAdress1.value = object.value.attrs.tags[1].adress;
      tagsModelElementFunction1.value = object.value.attrs.tags[1].function;
      tagsModelElementTimer1.value = object.value.attrs.tags[1].timer;
      tagsModelElementPostfix1.value = object.value.attrs.tags[1].postfix;
      tagsModelElementLength1.value = object.value.attrs.tags[1].quantity;
      messageOn1.value = object.value.attrs.tags[1].notify || false;
      dbWriteOn1.value = object.value.attrs.tags[1].writedb || false;
      tagsModelMetadata1.value = object.value.attrs.tags[1].metadata;
      tagsModelDivider.value = object.value.attrs.tags[1].divider || '';
      tagsModelMultiplier.value = object.value.attrs.tags[1].multiplier || '';
      tagsModelElementCondition1.value = object.value.attrs.tags[1].condition || '';
      tagsModelElementConditionValue1.value = object.value.attrs.tags[1].condition_value || '';
      tagsModelElementWriteDB1.value = object.value.attrs.tags[1].writedb || false;
      tagsModelElementWriteDBName1.value = object.value.attrs.tags[1].writedbname || "";
      tagsModelElementWriteDBDisplayName1.value = object.value.attrs.tags[1].writedbdisplayname || "";
      tagsModelElementBitNumber1.value = object.value.attrs.tags[1].bit_number || ""


      setMap(object.value, map, tagsModelDataType, object.value.attrs.tags[0].type, tagsModelDataType1, object.value.attrs.tags[1].type);
      setMap(object.value, map1, tagsModelDataDisplay, object.value.attrs.tags[0].convert, tagsModelDataDisplay1, object.value.attrs.tags[1].convert);
    }

    if (object.value.attrs.tags.length == '3') { // eslint-disable-line
      counter.value = 3;
      tagsModelDataDisplay.value = object.value.attrs.tags[0].display || '';
      tagsModelElementName.value = object.value.attrs.tags[0].name || '';
      tagsModelElementAdress.value = object.value.attrs.tags[0].adress;
      tagsModelElementFunction.value = object.value.attrs.tags[0].function;
      tagsModelElementTimer.value = object.value.attrs.tags[0].timer;
      tagsModelElementPostfix.value = object.value.attrs.tags[0].postfix;
      tagsModelElementLength.value = object.value.attrs.tags[0].quantity;
      messageOn.value = object.value.attrs.tags[0].notify || false;
      dbWriteOn.value = object.value.attrs.tags[0].writedb || false;
      tagsModelMetadata.value = object.value.attrs.tags[0].metadata;
      tagsModelDivider.value = object.value.attrs.tags[0].divider || '';
      tagsModelMultiplier.value = object.value.attrs.tags[0].multiplier || '';
      tagsModelElementCondition.value = object.value.attrs.tags[0].condition || '';
      tagsModelElementConditionValue.value = object.value.attrs.tags[0].condition_value || '';
      tagsModelElementWriteDB.value = object.value.attrs.tags[0].writedb || false;
      tagsModelElementWriteDBName.value = object.value.attrs.tags[0].writedbname || "";
      tagsModelElementWriteDBDisplayName.value = object.value.attrs.tags[0].writedbdisplayname || "";
      tagsModelElementBitNumber.value = object.value.attrs.tags[0].bit_number || ""

      tagsModelDataDisplay1.value = object.value.attrs.tags[1].display || '';
      tagsModelElementName1.value = object.value.attrs.tags[1].name || '';
      tagsModelElementAdress1.value = object.value.attrs.tags[1].adress;
      tagsModelElementFunction1.value = object.value.attrs.tags[1].function;
      tagsModelElementTimer1.value = object.value.attrs.tags[1].timer;
      tagsModelElementPostfix1.value = object.value.attrs.tags[1].postfix;
      tagsModelElementLength1.value = object.value.attrs.tags[1].quantity;
      messageOn1.value = object.value.attrs.tags[1].notify || false;
      dbWriteOn1.value = object.value.attrs.tags[1].writedb || false;
      tagsModelMetadata1.value = object.value.attrs.tags[1].metadata;
      tagsModelDivider1.value = object.value.attrs.tags[1].divider || '';
      tagsModelMultiplier1.value = object.value.attrs.tags[1].multiplier || '';
      tagsModelElementCondition1.value = object.value.attrs.tags[1].condition || '';
      tagsModelElementConditionValue1.value = object.value.attrs.tags[1].condition_value || '';
      tagsModelElementWriteDB1.value = object.value.attrs.tags[1].writedb || false;
      tagsModelElementWriteDBName1.value = object.value.attrs.tags[1].writedbname || "";
      tagsModelElementWriteDBDisplayName1.value = object.value.attrs.tags[1].writedbdisplayname || "";
      tagsModelElementBitNumber1.value = object.value.attrs.tags[1].bit_number || ""

      tagsModelDataDisplay2.value = object.value.attrs.tags[2].display || '';
      tagsModelElementName2.value = object.value.attrs.tags[2].name || '';
      tagsModelElementAdress2.value = object.value.attrs.tags[2].adress;
      tagsModelElementFunction2.value = object.value.attrs.tags[2].function;
      tagsModelElementTimer2.value = object.value.attrs.tags[2].timer;
      tagsModelElementPostfix2.value = object.value.attrs.tags[2].postfix;
      tagsModelElementLength2.value = object.value.attrs.tags[2].quantity;
      messageOn2.value = object.value.attrs.tags[2].notify || false;
      dbWriteOn2.value = object.value.attrs.tags[2].writedb || false;
      tagsModelMetadata2.value = object.value.attrs.tags[2].metadata;
      tagsModelDivider2.value = object.value.attrs.tags[2].divider || '';
      tagsModelMultiplier2.value = object.value.attrs.tags[2].multiplier || '';
      tagsModelElementCondition2.value = object.value.attrs.tags[2].condition || '';
      tagsModelElementConditionValue2.value = object.value.attrs.tags[2].condition_value || '';
      tagsModelElementWriteDB2.value = object.value.attrs.tags[2].writedb || false;
      tagsModelElementWriteDBName2.value = object.value.attrs.tags[2].writedbname || "";
      tagsModelElementWriteDBDisplayName2.value = object.value.attrs.tags[2].writedbdisplayname || "";
      tagsModelElementBitNumber2.value = object.value.attrs.tags[2].bit_number || ""


      setMap(object.value, map, tagsModelDataType, object.value.attrs.tags[0].type, tagsModelDataType1, object.value.attrs.tags[1].type, tagsModelDataType2, object.value.attrs.tags[2].type);
      setMap(object.value, map1, tagsModelDataDisplay, object.value.attrs.tags[0].convert, tagsModelDataDisplay1, object.value.attrs.tags[1].convert, tagsModelDataDisplay2, object.value.attrs.tags[2].convert);
    }

    if (object.value.attrs.tags.length == '0') { // eslint-disable-line
      counter.value = 0;
    }

  }

  if (object.value.attrs.type === 'icon') {
    text_edit_visible.value = false;
    isTextDisabled.value = true;
    img_edit_visible.value = true;
    isImageDisabled.value = false;
  }
  changeJSON(editable.value, configuration.structure, xBorder, yBorder);
}
function updateName(e) {
  editable.value.children[1].setAttrs({
    text: e,
  });
  const newRectWidth = editable.value.children[1].getTextWidth() + 20;
  editable.value.children[0].setAttrs({
    width: newRectWidth,
  });
  editable.value.children[1].setAttrs({
    x: 10,
  });
  changeJSON(editable.value, added, xBorder, yBorder);
}
function changeMode() {
  isButtonClicked = modeChanger(
    toolbar,
    fan,
    text,
    button,
    toolbarTitle,
    btnGrid,
    layerGrid,
    layer,
    isActive,
    isButtonClicked,
  );
  selected.value = false;
  if (inters && inters.parent.x() > 220) {
    inters.parent.children[0].setAttrs({
      stroke: 'gray',
      strokeWidth: 0,
    });
  }
  return isButtonClicked;
}
function deleteTag(index) {
  editable.value.attrs.tags.splice(index, 1);
  makeSideMenu(editable);
}
function changeTag(){
  for (let i = 0; i < 3; i++){ // eslint-disable-line
    if (items.value[i]){
      if (editable.value.attrs.tags[i]){
        editable.value.attrs.tags[i].function = items.value[i].function;
        editable.value.attrs.tags[i].name = items.value[i].name || '';
        editable.value.attrs.tags[i].adress = items.value[i].adress;
        editable.value.attrs.tags[i].length = items.value[i].length;
        editable.value.attrs.tags[i].postfix = items.value[i].postfix || '';
        editable.value.attrs.tags[i].timer = items.value[i].timer;
        editable.value.attrs.tags[i].notify = items.value[i].notify;
        editable.value.attrs.tags[i].type = items.value[i].type;
        editable.value.attrs.tags[i].display = items.value[i].display || '';
        editable.value.attrs.tags[i].metadata = items.value[i].metadata || '';
        editable.value.attrs.tags[i].divider = items.value[i].divider || '';
        editable.value.attrs.tags[i].condition = items.value[i].condition || '';
        editable.value.attrs.tags[i].condition_value = items.value[i].conditionValue || '';
        editable.value.attrs.tags[i].writedb = items.value[i].writeDB || false;
        editable.value.attrs.tags[i].writedbname = items.value[i].writeDBName || '';
        editable.value.attrs.tags[i].writedbdisplayname = items.value[i].writeDBDisplayName || '';
        editable.value.attrs.tags[i].bit_number = items.value[i].bitNumber || '';
      }
  }
}
  changeJSON(editable.value, configuration.structure, xBorder, yBorder, '', map, map1)
}

onMounted(() => {

  stage.value = new Konva.Stage({
    container: 'container',
    width,
    height,
    fill: color,
  });

  toolbar.value = new Konva.Rect({
    x: 20,
    y: 20,
    width: toolbarWIdth,
    height: toolbarHeight,
    fill: color,
    stroke: 'grey',
    id: 'konvaStroke',
    visible: false,
  });
  toolbar.value.zIndex(999);

  canva.value = new Konva.Rect({
    x: 230,
    y: 20,
    width: canvasWidth,
    height: canvasHeigth,
    fill: color,
    id: 'mainCanva',
  });
  canva.value.zIndex(999);

  toolbarTitle.value = new Konva.Text({
    x: 32,
    y: 35,
    width: width / 7,
    text: 'Палитра объектов:',
    fontSize: 16,
    align: 'center',
    fill: 'white',
    visible: false,
  });
  toolbarTitle.value.zIndex(0);

  // Создаем линии сетки
  layerGrid = new Konva.Layer({
    visible: false,
  });
  /* eslint-disable */
  // Создаем линии сетки
  for (let x = 0; x <= canva.value.width(); x += layerScale) {
    let line = new Konva.Line({
      points: [x, 0, x, canva.value.height()],
      stroke: 'white',
      strokeWidth: 0.2,
      offsetX: -230,
      offsetY: -20,
    });

    layerGrid.add(line);
  }

  for (let y = 0; y <= canva.value.height(); y += layerScale) {
    let line = new Konva.Line({
      points: [0, y, canva.value.width(), y],
      stroke: 'white',
      strokeWidth: 0.2,
      offsetX: -230,
      offsetY: -20,
    });
    layerGrid.add(line);
  }
  /* eslint-disable */
  // button//
  btnGrid = new Konva.Layer({
    visible: false,
  });
  btn = new Konva.Label({
    x: 1135,
    y: 23,
    opacity: 0.75,
  });
  btnGrid.add(btn);

  btn.add(
    new Konva.Tag({
      fill: 'gray',
      lineJoin: 'round',
      shadowColor: 'black',
      shadowBlur: 5,
      shadowOffset: 10,
      shadowOpacity: 0.5,
    }),
  );

  btn.add(
    new Konva.Text({
      text: 'Сетка',
      fontSize: 16,
      padding: 5,
      fill: 'white',
    }),
  );

  function toggleObjectVisibility() {
    if (isButtonClicked) {
      layerGrid.hide();
    } else {
      layerGrid.show();
    }
    isButtonClicked = !isButtonClicked;
    layer.value.draw();
  }

  btn.on('click', toggleObjectVisibility);

  layer.value = new Konva.Layer();

  layer.value.add(toolbar.value);
  layer.value.add(toolbarTitle.value);
  layer.value.add(canva.value);
  stage.value.add(layer.value);
  stage.value.add(layerGrid);
  stage.value.add(btnGrid);


  let idCounter = 0;

  // let xBorder;
  let xLimit;
 // let yBorder;
  let yLimit;
  let clicked;

  stage.value.on('mousemove', () => {
    const mousePos = stage.value.getPointerPosition();
    const intersectedObjects = stage.value.getIntersection(mousePos);

    inters = stage.value.getIntersection(clicked);
    if (inters && clicked) {
      inters.setAttrs({
        number: clicked.number,
        imgChosen: clicked.image
      })
    }
    if (clicked && intersectedObjects) {
      intersectedObjects.on('click', () => {
        if (inters.parent.x() > 220) {
          inters.parent.children[0].setAttrs({
            stroke: 'gray',
            strokeWidth: 0,
          });
        }
        selected.value = false;
      });
    }

    if (intersectedObjects && intersectedObjects.attrs.type) {
      foundObj.value = intersectedObjects.parent;

      foundObj.value.on('dragend', () => {
        document.getElementById('deleteIcon').style.visibility = 'hidden';
        xBorder = canvasRightX - foundObj.value.width() / 2;
        yBorder = canvasBottomY - foundObj.value.height() / 2;

        if (
          foundObj.value.x() < 230
          || foundObj.value.x() > xBorder
          || foundObj.value.y() < 20
          || foundObj.value.y() > yBorder
        ) {
          if (
            foundObj.value.attrs.type === 'icon'
            || foundObj.value.attrs.type === 'button'
            || foundObj.value.attrs.type === 'input'
          ) {
            idsArr.value = idsArr.value.filter(
              (item) => item !== foundObj.value.attrs.number,
            );
            foundObj.value.remove();
            changeJSON(foundObj.value, configuration.structure, xBorder, yBorder);
          }
        }
        if (foundObj.value.children[0].attrs.strokeWidth === 3) {
          if (inters.parent.x() > 220) {
            inters.parent.children[0].setAttrs({
              stroke: 'gray',
              strokeWidth: 0,
            });
          }
          selected.value = false;
        }
      });

      foundObj.value.on('dragstart', () => {
        isDragEnd.value = false;

        isNew = foundObj.value.x() <= 230 - foundObj.value.attrs.width;
        return isNew;
      });

      foundObj.value.on('dragend', () => {
        correctPosition(
          foundObj.value,
          xBorder,
          isButtonClicked,
          layerScale,
          xLimit,
          yLimit,
          yBorder,
          configuration.structure
        );
        document.getElementById('deleteIcon').style.visibility = 'hidden';
        if (foundObj.value.attrs.type == 'icon' && foundObj.value.attrs.isNew == true){
          chooseImage.value = true;
          foundObj.value.setAttrs({
            isNew : false,
          })
        }

        addToJSON(isDragEnd, isNew, foundObj, configuration.structure);

        isDragEnd.value = true;
      });

      foundObj.value.on('mouseover', () => {
        addShadow(intersectedObjects);
      });

      foundObj.value.on('mouseout', () => {
        deleteShadow(intersectedObjects);
      });

      foundObj.value.on('click', () => {
        createBorder(foundObj.value);
        clicked = createBorder(foundObj.value);
        return clicked;
      });

      foundObj.value.on('dragmove', () => {
        if (foundObj.value.x() > xBorder || foundObj.value.y() < 20 || foundObj.value.y() > 650) {
          document.getElementById('deleteIcon').style.visibility = 'visible';
        } else {
          document.getElementById('deleteIcon').style.visibility = 'hidden';
        }
      });

      foundObj.value.on('click', () => {
        selected.value = true;
        editable.value = foundObj.value;
        makeSideMenu(editable);
        elemID.value = foundObj.value.attrs.number;
      });
    }
  });

  fanIm.value.onload = function () {
    fan = new Fan(
      {
        x: 88,
        y: 70,
        image: customItem.value,
        width: 64,
        height: 64,
        visible: false,
        extraClass: 'original',
        tags: []
      },
      'basicFan',
      false,
      'fan1',
    );
    layer.value.add(fan);

    fan.on('mouseover', () => {
      fan.addNewFan(customItem.value, '', 88, 70, 'image', true);
      layer.value.add(newElemFan.value);
      newElemFan.value.setAttrs({
        isNew : true,
      });

      fan.on('mouseout', () => {
        fan.deleteCreatedFan(toolbarWIdth);
      });
    });

    button = new Button(
      {
        x: 56,
        y: 173,
        visible: false,
        extraClass: 'original',
        tags: []
      },
      'basicBtn',
      false,
      'btn1',
    );
    layer.value.add(button);

    button.on('mouseover', () => {
      button.addNewButton('', 'button', 56, 173, 'Кнопка', 128, 32, []);
      layer.value.add(newElemButton.value);
      newElemButton.value.type = 'button';
    });

    button.on('mouseout', () => {
      button.deleteCreatedButton(toolbarWIdth);
    });

    text = new Text(
      {
        x: 56,
        y: 235,
        text: 'Подпись',
        fontStyle: 'bold italic',
        fontSize: 16,
        fill: 'black',
        opacity: 0.7,
        type: 'input',
        visible: false,
        extraClass: 'original',
        tags: []
      },
      'basicText',
      false,
      'input',
    );

    layer.value.add(text);

    text.on('mouseover', () => {
      text.addNewText('', 'input', 56, 235, 'Подпись', 128, 25, []);
      layer.value.add(newElemText.value);
    });

    text.on('mouseout', () => {
      text.deleteCreatedText(toolbarWIdth);
    });

    const data = localStorage.getItem('storage');
    localStorage.getItem('storage');
    if (data) added.value = JSON.parse(data);

    changeMode();
  };

  airUpBorder.value.src = require('src/components/components/air_up_border.svg');  // eslint-disable-line
  air.value.src = require('src/components/components/air.svg');  // eslint-disable-line
  air90.value.src = require('src/components/components/air90.svg');  // eslint-disable-line
  alarm.value.src = require('src/components/components/alarm.svg');  // eslint-disable-line
  arrow.value.src = require('src/components/components/arrow.svg');  // eslint-disable-line
  bf.value.src = require('src/components/components/bf.svg');  // eslint-disable-line
  calendar.value.src = require('src/components/components/calendar.svg');  // eslint-disable-line
  coolerFreon.value.src = require('src/components/components/cooler_freon.svg');  // eslint-disable-line
  cooler.value.src = require('src/components/components/cooler.svg');  // eslint-disable-line
  fanIm.value.src = require('src/components/components/fan.svg');  // eslint-disable-line
  filter.value.src = require('src/components/components/filter.svg');  // eslint-disable-line
  heaterElectric.value.src = require('src/components/components/heater_electric.svg');  // eslint-disable-line
  heater.value.src = require('src/components/components/heater.svg');  // eslint-disable-line
  humdityMeas.value.src = require('src/components/components/humdity_meas.svg');  // eslint-disable-line
  humdity.value.src = require('src/components/components/humdity.svg');  // eslint-disable-line
  onOff.value.src = require('src/components/components/on-off.svg');  // eslint-disable-line
  pressure.value.src = require('src/components/components/pressure.svg');  // eslint-disable-line
  recup.value.src = require('src/components/components/recup.svg');  // eslint-disable-line
  recupP.value.src = require('src/components/components/recupP.svg');  // eslint-disable-line
  recupR.value.src = require('src/components/components/recupR.svg');  // eslint-disable-line
  recupR1.value.src = require('src/components/components/recupR1.svg');  // eslint-disable-line
  speed.value.src = require('src/components/components/speed.svg');  // eslint-disable-line
  temperature.value.src = require('src/components/components/temperature.svg');  // eslint-disable-line
  valveAnalog.value.src = require('src/components/components/valve_analog.svg');  // eslint-disable-line
  valve.value.src = require('src/components/components/valve.svg');  // eslint-disable-line
  customItem.value.src = require('src/components/components/icon.svg');

  axios.get(`${host}/monitoring/table/SystemConf/18`).then((response) => {
    if (response.data.result === 'ok') {
      configuration = JSON.parse(response.data.data.configuration);
      system.value = response.data.data;

      document.title = response.data.data.name;
      sys_name.value = response.data.data.name;
      ip_addr.value = response.data.data.ip;
      period.value = response.data.data.period;
      port.value = response.data.data.port;
      id_addr.value = response.data.data.id_addr;
      timeout.value = response.data.data.timeout;
      place.value = response.data.data.place;
      placeholder.value = response.data.data.place_holder;
      byteOrder.value = response.data.data.orderBytes;
      connectionType.value = response.data.data.connection;
      periodOfStorage.value = response.data.data.period_of_storage;

      upload(
        configuration,
        newElemFan,
        airUpBorder, air, air90, alarm, arrow, bf, calendar, coolerFreon, cooler, fanIm, filter, heaterElectric, heater, humdityMeas, humdity, onOff, pressure, recupP, recupR, recupR1, speed, temperature, valveAnalog, valve,
        layer,
        fan,
        button,
        newElemButton,
        text,
        newElemText,
      );
      changeMode()
    }

  });

});
</script>

<style>
:root {
  --color: #424242;
  --infocolor: #505050;
}

* {
  font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.mainCont {
  display: grid;
  grid-auto-flow: row;
  grid-template-rows: 1fr 6fr;
  background-color: var(--color);
  height: 95.7vh
}

.canvasCont {
  height: 71vh;
}

#generalInfo {
  background-color: var(--infocolor);
  padding: 10px;
  font-size: larger;
  line-height: 22px;
  color: white;
  font-weight: 300;
}

#deleteIcon {
  position: absolute;
  left: 685px;
  top: 655px;
  visibility: hidden;
}

#textInput {
  width: 100%;
  border: none;
}
</style>

