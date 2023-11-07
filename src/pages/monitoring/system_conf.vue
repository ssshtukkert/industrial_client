<template>
  <Page v-show="allowPermission()" ref="page">
    <template v-slot:subname>
      <div>
        <div class="text-h6"><a :href="placeholder" style="color: rgb(175, 182, 245); font-size: large;">{{ name
        }}</a> </div>
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
    </template>
    <template v-slot:actions>
      <q-btn color='dark-grey' icon="arrow_back" label='' @click="exit" />
      <q-btn :disable="time == '' || getTagsWriteDB().length === 0" color='dark-grey' icon="download" label="Графики"
        @click="() => {
          openChartDownload();
          dialogDownload.show();
        }" />
      <!-- <q-btn disable color='dark-grey' icon="summarize" label="Журнал аварий" @click="() => {
        dialogJournal.show();
      }" /> -->
      <q-btn v-if="!isPermissions('viewLogs')" color='dark-grey' icon="summarize" label="Логи" @click="() => {
        openLogs();
        dialogLog.show();
      }" />
      <q-btn color='dark-grey' icon="summarize" label="Расписание" @click="() => {
        dialogTimeDaily.show();
        synchTimers();
      }" />
      <q-space />
      <q-btn v-if="!isPermissions('editConfiguration')" color='dark-grey' icon="restart_alt" label="Перезагрузить"
        @click="reload()" />
      <q-btn v-if="!isPermissions('editConfiguration')" color='dark-grey' icon="settings" label="Настройки" @click="() => {
        readDatabase();
        dialogSettingManual.show();
      }" />
    </template>
    <template v-slot:content>
      <div class="full-width full-height">
        <q-toggle v-if="!isPermissions('editConfiguration')" class="q-ma-sm" dark v-model="edit"
          label="Режим редактирования" color="green" @update:model-value="hideGrid" />
        <q-btn v-if="edit" color='dark-grey' icon="settings" label="" @click="() => {
          readDatabase(() => {
            synchSettings();
            dialogSettings.show();
          });
        }" />
        <q-space />
        <q-card-section class="text-h6" v-if="structure.length == 0">
          <div align="center">
            Добавьте элементы структуры в настройках
          </div>
        </q-card-section>
        <ScrollBar styleContent="height: 56vh">
          <GridCanvas class="full-width" ref="grid" :width="960" :height="480" :clickSelect="pressedElem"
            :sendValue="sendValue" />
        </ScrollBar>
        <q-inner-loading :showing="connect != 'Подключен' && structure.length > 0" color="green"
          label-class="fit text-white" style="height: 100%;" label-style="font-size: 1.1em" />
      </div>
      <Dialog name-def="Просмотр графиков" ref="dialogDownload" width="80%">
        <template v-slot:content>
          <div class="row">
            <q-input dark class="col text-h6 q-pa-sm" outlined v-model="startDate"
              @update:model-value="changeTagIsChart(tagIsChart)" label-color="grey" color="white" label="Время начала:">
              <template v-slot:append>
                <q-icon dark name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date color="grey-6" dark v-model="startDate" @update:model-value="changeTagIsChart(tagIsChart)"
                      mask="DD-MM-YYYY HH:mm:ss">
                      <div class="row items-center justify-center">
                        <q-btn v-close-popup label="Закрыть" color="dark-grey" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time color="grey-6" dark v-model="startDate" @update:model-value="changeTagIsChart(tagIsChart)"
                      with-seconds format24h mask="DD-MM-YYYY HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Закрыть" color='dark-grey' flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input dark class="col text-h6 q-pa-sm" outlined v-model="finishDate"
              @update:model-value="changeTagIsChart(tagIsChart)" label-color="grey" color="white"
              label="Время завершения:">
              <template v-slot:append>
                <q-icon dark name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date color="grey-6" dark v-model="finishDate" @update:model-value="changeTagIsChart(tagIsChart)"
                      mask="DD-MM-YYYY HH:mm:ss">
                      <div class="row items-center justify-center">
                        <q-btn v-close-popup label="Закрыть" color="dark-grey" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time color="grey-6" dark v-model="finishDate" @update:model-value="changeTagIsChart(tagIsChart)"
                      with-seconds format24h mask="DD-MM-YYYY HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Закрыть" color='dark-grey' flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-btn color='dark-grey' label="Обновить" @click="openChartDownload()" />
          </div>
          <div class="row">
            <Chart class="col" ref="chart" :legend="false" style="min-height: 480px" />
            <div class="q-m-md col-2" align="center">
              <q-select dark class="text-h6" label="Тег:" option-value="id" options-selected-class="text-h8 text-grey"
                label-active-class="text-red" popup-content-class="text-h6" :options="tagIsChartOp" v-model="tagIsChart"
                popup-content-style="background-color: rgb(60, 60, 60); color:  white;" style="padding: 10px;"
                @update:model-value="changeTagIsChart">
                <template v-slot:selected-item="scope">
                  {{ scope.opt.tag.writedbdisplayname }}
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.tag.writedbdisplayname }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-card-actions>
                <q-btn color='dark-grey' label="Скачать" @click="downloadPDF(tagIsChart)" />
              </q-card-actions>
            </div>
          </div>
        </template>
      </Dialog>
      <Dialog name-def="Просмотр журнала аварий" ref="dialogJournal">
        <template v-slot:content>
          <Table keyFilter="Авария" :columns="[
            {
              name: 'time',
              label: 'Время',
              align: 'left',
              field: (row) => row.name,
              format: (val) => `${val}`,
              sortable: true,
            },
            {
              name: 'text',
              align: 'left',
              label: 'Авария',
              field: 'text',
              format: (val) => `${val}`,
              sortable: true,
              style: 'min-width: 500px',
            },
          ]" :rows="[
  { id: 0, name: '21.08.2023 15:34', text: 'Пожарная сигнализация' }
]">
            <template v-slot:actions>
              <q-btn color='dark-grey' label="Очистить" @click="actionClearAlarmJournal" />
            </template>
          </Table>
        </template>
      </Dialog>
      <Dialog width="95vw" name-def="Просмотр логов" ref="dialogLog">
        <template v-slot:content>
          {{ name }}
          <Table keyFilter="Событие" :columns="[
            {
              name: 'time',
              label: 'Время',
              align: 'left',
              field: 'time',
              format: (val) => `${val}`,
              sortable: true,
            },
            {
              name: 'user',
              label: 'Пользователь',
              align: 'left',
              field: 'user',
              format: (val) => `${val}`,
              sortable: true,
            },
            {
              name: 'event',
              align: 'left',
              label: 'Событие',
              field: 'event',
              format: (val) => `${val}`,
              sortable: true,
              style: 'min-width: 500px',
            },
          ]" :rows="logs">
          </Table>
        </template>
      </Dialog>
      <Dialog width="95vw" name-def="Настройки расписания" ref="dialogTimeDaily">
        <template v-slot:content>
          <q-card-section>
            <q-btn v-if="!isPermissions('addedTimer')" :disable="timers.length >= 10 && allTags.length == 0"
              color="dark-grey" icon="add" label="Добавить новый таймер" @click="addTimer" />
            <q-btn v-if="!isPermissions('addedTimer') && timers.length > 0" color="dark-grey" icon="delete"
              label="Удалить все таймеры" @click="clearAllTimers" />
          </q-card-section>
          <ScrollBar styleContent="height: 50vh">
            <div v-for="element in timers" :key="element" class="row fit justify-between items-start content-center">
              <!-- Включение/Отключение таймера -->
              <div class="col-2" style="padding-left: 30px; padding-top: 15px;">
                <q-toggle size="48px" :label="element.name" left-label v-model="timersModelEnable[element.id]" dark
                  color="green" />
              </div>
              <!-- Кнопка выбора тега -->
              <div class="col-2">
                <q-select dark :disable="!timersModelEnable[element.id] || isPermissions('changeTag')" class="text-h6"
                  label="Тег:" option-value="id" options-selected-class="text-h8 text-grey" label-active-class="text-red"
                  popup-content-class="text-h6" :options="allTags" v-model="timersModelTag[element.id]"
                  popup-content-style="background-color: rgb(60, 60, 60); color:  white;" style="padding: 10px;"
                  @update:model-value="changeTimerTag">
                  <template v-slot:selected-item="scope">
                    {{ scope.opt.element.name }}:{{ scope.opt.tag.name }}
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.element.name }}:{{ scope.opt.tag.name }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <!-- Поле для ввода чисел -->
              <div v-if="element.tag.element.type == 'input'" class="col-2">
                <q-input type="number" :disable="!timersModelEnable[element.id]" v-model="timerModelInput[element.id]"
                  dark color="white" input-class="text-h6 text-white" label-color="grey" stack-label label="Значение:"
                  style="padding: 10px;" />
              </div>
              <div v-else class="col-2">
                <q-select dark :disable="!timersModelEnable[element.id]" class="text-h6" label="Значение:"
                  options-selected-class="text-h8 text-grey" label-active-class="text-red" popup-content-class="text-h6"
                  :options="timerModelSelectInputOp[element.id]" v-model="timerModelSelectInput[element.id]"
                  popup-content-style="background-color: rgb(60, 60, 60); color:  white;">
                  <template v-slot:selected-item="scope">
                    {{ scope.opt.value }}
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.value }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>

                </q-select>
              </div>
              <!-- Блок выбора времени -->
              <div class="col-2">
                <q-input class="text-h6" dark :disable="!timersModelEnable[element.id]" flat
                  v-model="timersModelTime[element.id]" mask="fulltime" :rules="['fulltime']" style="padding: 10px;">
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time color="grey-6" dark v-model="timersModelTime[element.id]" with-seconds format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Закрыть" color='dark-grey' flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <!-- Блок выбора дней недели -->
              <div class="col-3">
                <q-option-group :disable="!timersModelEnable[element.id]" v-model="timersModelDays[element.id]" inline
                  keep-color :options="[
                    {
                      label: 'Пн',
                      value: 'op1'
                    },
                    {
                      label: 'Вт',
                      value: 'op2'
                    },
                    {
                      label: 'Ср',
                      value: 'op3'
                    },
                    {
                      label: 'Чт',
                      value: 'op4'
                    },
                    {
                      label: 'Пт',
                      value: 'op5'
                    },
                    {
                      label: 'Сб',
                      value: 'op6'
                    },
                    {
                      label: 'Вс',
                      value: 'op7'
                    }
                  ]" color="grey" type="checkbox" />
              </div>
              <!-- Кнопка удаления -->
              <div v-if="!isPermissions('addedTimer')" class="col">
                <q-btn color="dark-grey" label="" icon="delete" @click="deleteTimer(element.id)"
                  style="width: 32px; height: 32px;" />
              </div>
            </div>
          </ScrollBar>
          <q-card-actions align="center">
            <q-btn color="dark-grey" label="Готово" @click="() => {
              rebuildTimers();
              writeDatabase(() => {
                dialogTimeDaily.hide();
              });
            }" />
          </q-card-actions>
        </template>
      </Dialog>
      <Confirm name-def="Подтверждение действия" text-def="Отправить данные?" ref="dialogConfirm">
        <template v-slot:buttons>
          <q-btn color="red" label="Да" @click="submit" />
          <q-btn color="dark-grey" label="Отмена" v-close-popup />
        </template>
      </Confirm>
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
              <q-select dark class="text-h6" label="Тип подключения:" options-selected-class="text-h6 text-grey"
                label-active-class="text-red" popup-content-class="text-h6" :options="['DEFAULT', 'TELNET']"
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
              <q-select dark class="text-h6" label="Порядок битов:" options-selected-class="text-h6 text-grey"
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
      <Dialog width="95%" name-def="Редактор структуры" ref="dialogSettings">
        <template v-slot:content>
          <q-card-section>
            <q-btn color="dark-grey" icon="add" label="Добавить новый элемент" @click="addElement" />
            <q-btn color="dark-grey" icon="delete" label="Удалить все элементы" @click="removeAllElements" />
          </q-card-section>
          <ScrollBar styleContent="height: 50vh">
            <q-item v-for="element in structure" :key="element" class="row items-center">
              <q-item-section>
                <q-select dark class="text-h10" label="Тип:" options-selected-class="text-h10 text-grey"
                  label-active-class="text-red" popup-content-class="text-h10" :options="['icon', 'button', 'input']"
                  v-model="structureModeltypeElement[element.id]"
                  popup-content-style="background-color: rgb(60, 60, 60); color:  white;">
                </q-select>
              </q-item-section>
              <q-item-section>
                <q-input type="text" v-model="structureModelNameElement[element.id]" dark color="white"
                  input-class="text-h10 text-white" label-color="grey" stack-label label="Наименование элемента" />
              </q-item-section>
              <q-item-section>
                <q-input type="number" v-model="structureModelCoordXElement[element.id]" dark color="white"
                  input-class="text-h10 text-white" label-color="grey" stack-label label="Х:" />
              </q-item-section>
              <q-item-section>
                <q-input type="number" v-model="structureModelCoordYElement[element.id]" dark color="white"
                  input-class="text-h10 text-white" label-color="grey" stack-label label="Y:" />
              </q-item-section>
              <q-item-section>
                <q-input type="number" v-model="structureModelWidthElement[element.id]" dark color="white"
                  input-class="text-h10 text-white" label-color="grey" stack-label label="Width:" />
              </q-item-section>
              <q-item-section>
                <q-input type="number" v-model="structureModelHeightElement[element.id]" dark color="white"
                  input-class="text-h10 text-white" label-color="grey" stack-label label="Height:" />
              </q-item-section>
              <q-item-section v-if="structureModeltypeElement[element.id] != 'input'">
                <q-select dark class="text-h10" label="Иконка (Слой 1):" options-selected-class="text-h10 text-grey"
                  popup-content-class="text-h10" :options="structureIconsOptions"
                  v-model="structureModelImageTopElement[element.id]"
                  popup-content-style="background-color: rgb(60, 60, 60); color: white;">
                  <template v-slot:selected>
                    <img v-if="structureModelImageTopElement[element.id] != 'нет'"
                      :src="require(`src/components/components/${structureModelImageTopElement[element.id]}`)"
                      style="margin: 0px; width: 30px; height:30px; filter: brightness(0) invert(1);">
                    <div v-else>
                      нет
                    </div>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <img v-if="scope.opt != 'нет'" :src="require(`src/components/components/${scope.opt}`)"
                          style="margin: 0px; width: 30px; height:30px; filter: brightness(0) invert(1);">
                      </q-item-section>
                      <q-item-section>
                        {{ scope.opt }}
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-item-section>
              <q-item-section v-if="structureModeltypeElement[element.id] == 'icon'">
                <q-select dark class="text-h10" label="Иконка (Слой 2):" options-selected-class="text-h10 text-grey"
                  label-active-class="text-red" popup-content-class="text-h10" :options="structureIconsOptions"
                  v-model="structureModelImageBottomElement[element.id]"
                  popup-content-style="background-color: rgb(60, 60, 60); color:  white;">
                  <template v-slot:selected>
                    <img v-if="structureModelImageBottomElement[element.id] != 'нет'"
                      :src="require(`src/components/components/${structureModelImageBottomElement[element.id]}`)"
                      style="margin: 0px; width: 30px; height:30px; filter: brightness(0) invert(1);">
                    <div v-else>
                      нет
                    </div>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <img v-if="scope.opt != 'нет'" :src="require(`src/components/components/${scope.opt}`)"
                          style="margin: 0px; width: 30px; height:30px; filter: brightness(0) invert(1);">
                      </q-item-section>
                      <q-item-section>
                        {{ scope.opt }}
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-item-section>
              <q-item-section v-if="structureModeltypeElement[element.id] != 'input'">
                <q-select dark class="text-h10" label="Цвет:" options-selected-class="text-h10 text-grey"
                  label-active-class="text-red" popup-content-class="text-h10" :options="structureColorOptions"
                  v-model="structureModelColorElement[element.id]"
                  popup-content-style="background-color: rgb(60, 60, 60); color:  white;">
                  <template v-slot:selected>
                    <div
                      :style="`width: 32px; height: 32px; background-color: ${structureModelColorElement[element.id]};`">
                    </div>
                    <span style="margin-left: 10px;">
                      {{ structureModelColorElement[element.id] }}
                    </span>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <div :style="`width: 32px; height: 32px; background-color: ${scope.opt};`">
                        </div>
                      </q-item-section>
                      <q-item-section>
                        {{ scope.opt }}
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-item-section>
              <q-btn color="dark-grey" label="" icon="delete" @click="() => {
                deleteElement(element.id);
              }" style="width: 32px; height: 32px;" />
            </q-item>
          </ScrollBar>
          <q-card-actions align="center">
            <q-btn color="dark-grey" label="Готово" @click="() => {
              rebuild();
              writeDatabase(() => {
                dialogSettings.hide();
              });
            }" />
          </q-card-actions>
        </template>
      </Dialog>
      <Dialog width="70%" ref="dialogElement">
        <template v-slot:content>
          <q-card-section>
            <q-btn :disable="getObjectSelect().tags.length >= 2" color="dark-grey" label="Добавить новый тег"
              @click="addTagElement(select)" />
          </q-card-section>
          <ScrollBar styleContent="height: 30vh">
            <q-item v-for="element in getObjectSelect().tags" :key="element" class="row items-center">
              <q-item-section class="text-h10">
                <q-input type="text" v-model="tagsModelElementName[element.id]" dark color="white"
                  input-class="text-h10 text-white" label-color="grey" stack-label label="Наименование:" />
              </q-item-section>
              <q-item-section class="text-h6">
                <q-input type="number" v-model="tagsModelElementAdress[element.id]" dark color="white"
                  input-class="text-h6 text-white" label-color="grey" stack-label label="Адрес:" />
              </q-item-section>
              <q-item-section class="text-h6">
                <q-select dark class="text-h6" label="Функция:" options-selected-class="text-h6 text-grey"
                  label-active-class="text-red" popup-content-class="text-h6" :options="functionsOptions"
                  option-value="label" v-model="tagsModelElementFunction[element.id]"
                  popup-content-style="background-color: rgb(60, 60, 60); color:  white;" style="padding-right: 5px;" />
              </q-item-section>
              <q-item-section
                v-if="(tagsModelElementFunction[element.id] === 'FC5' || tagsModelElementFunction[element.id] === 'FC6') && getObjectSelect().type !== 'input'"
                class="text-h6">
                <q-input type="number" v-model="tagsModelElementFlagValue[element.id]" dark color="white"
                  input-class="text-h6 text-white" label-color="grey" stack-label label="Значение:" />
              </q-item-section>
              <q-item-section class="text-h6">
                <q-input type="number" v-model="tagsModelElementTimer[element.id]" dark color="white"
                  input-class="text-h6 text-white" label-color="grey" stack-label label="Задержка, мс:" />
              </q-item-section>
              <q-item-section
                v-if="tagsModelElementFunction[element.id] !== 'FC5' && tagsModelElementFunction[element.id] !== 'FC6' && tagsModelElementFunction[element.id] !== 'FC16'"
                class="text-h6">
                <q-input type="number" v-model="tagsModelElementLength[element.id]" dark color="white"
                  input-class="text-h6 text-white" label-color="grey" stack-label label="Количество байтов:" />
              </q-item-section>
              <q-item-section v-if="tagsModelElementFunction[element.id] !== 'FC5' && tagsModelElementFunction[element.id] !== 'FC6' && tagsModelElementFunction[element.id] !== 'FC16'
                && getObjectSelect().type !== 'input'" class="text-h6">
                <q-select dark class="text-h6" label="Расположение:" options-selected-class="text-h6 text-grey"
                  label-active-class="text-red" popup-content-class="text-h6" :options="['top', 'bottom']"
                  option-value="label" v-model="tagsModelElementPosition[element.id]"
                  popup-content-style="background-color: rgb(60, 60, 60); color:  white;" style="padding-right: 5px;" />
              </q-item-section>
              <q-item-section
                v-if="tagsModelElementFunction[element.id] !== 'FC5' && tagsModelElementFunction[element.id] !== 'FC6' && tagsModelElementFunction[element.id] !== 'FC16'"
                class="text-h10">
                <q-input type="text" v-model="tagsModelElementPostfix[element.id]" dark color="white"
                  input-class="text-h10 text-white" label-color="grey" stack-label label="Постфикс:" />
              </q-item-section>
              <q-btn v-if="tarWrite(element.id)" color="dark-grey" label="" icon="settings" @click="() => {
                selectTag = element.id;
                dialogSettingTag.show();
                dialogSettingTag.setName(`Настройка чтения тега: ${getTagSelect().name}`);
                openInterpretatorTag(element.id);
              }" style="width: 32px; height: 32px;" />
              <q-btn v-else color="dark-grey" label="" icon="settings" @click="() => {
                selectTag = element.id;
                tagType = 'integer';
                dialogSettingTag.show();
                dialogSettingTag.setName(`Настройка метаданных тега: ${getTagSelect().name}`);
                openInterpretatorTag(element.id);
                tagConvert = 'reference';
              }" style="width: 32px; height: 32px;" />
              <q-btn color="dark-grey" label="" icon="delete" @click="() => {
                deleteTagElement(select, element.id);
              }" style="width: 32px; height: 32px;" />
            </q-item>
          </ScrollBar>
          <q-card-actions align="center">
            <q-btn color="dark-grey" label="Готово" @click="() => {
              rebuildTags(select);
              writeDatabase();
              dialogElement.hide();
            }" />
          </q-card-actions>
          <Dialog width="70%" ref="dialogSettingTag">
            <template v-slot:content>
              <ScrollBar styleContent="height: 78vh">
                <div class="row">
                  <div class="col">
                    <div class="text-white text-h6">Тип данных:</div>
                    <q-item>
                      <q-radio :disable="!tarWrite(selectTag)" size="32px" dark v-model="tagType" val="none"
                        label="Сырые данные" color="white" />
                    </q-item>
                    <q-item>
                      <q-radio :disable="!tarWrite(selectTag)" size="32px" dark v-model="tagType" val="byte" label="Байт"
                        color="white" />
                    </q-item>
                    <q-item>
                      <q-radio :disable="!tarWrite(selectTag)" size="32px" dark v-model="tagType" val="integer"
                        label="Целое число" color="white" />
                    </q-item>
                    <q-item>
                      <q-radio :disable="!tarWrite(selectTag)" size="32px" dark v-model="tagType" val="long"
                        label="Большое число" color="white" />
                    </q-item>
                    <q-item>
                      <q-radio :disable="!tarWrite(selectTag)" size="32px" dark v-model="tagType" val="float"
                        label="Дробное число" color="white" />
                    </q-item>
                    <q-item v-if="tagType == 'float'">
                      <q-input type="number" v-model="tagLengthNumbers" dark color="white"
                        input-class="text-h6 text-white" label-color="grey" stack-label
                        label="Количество знаков после запятой:" />
                    </q-item>
                    <q-item
                      v-if="tarWrite(selectTag) && (tagType == 'float' || tagType == 'integer' || tagType == 'long')">
                      <q-input type="number" v-model="tagDivider" dark color="white" input-class="text-h6 text-white"
                        label-color="grey" stack-label label="Делитель:" />
                    </q-item>
                    <q-item
                      v-if="tagType == 'float' || tagType == 'integer' || tagType == 'long'">
                      <q-input type="number" v-model="tagMultiplier" dark color="white" input-class="text-h6 text-white"
                        label-color="grey" stack-label label="Множитель:" />
                    </q-item>
                  </div>
                  <div class="col">
                    <div class="text-white text-h6">Отображение:</div>
                    <q-item>
                      <q-radio :disable="!tarWrite(selectTag)" size="32px" dark v-model="tagConvert" val="none"
                        label="Без преобразований" color="white" />
                    </q-item>
                    <q-item>
                      <q-radio :disable="!tarWrite(selectTag)" size="32px" dark v-model="tagConvert" val="reference"
                        label="Соответствие значению из справочника" color="white" />
                    </q-item>
                    <q-item>
                      <q-radio :disable="!tarWrite(selectTag)" size="32px" dark v-model="tagConvert"
                        val="reference_single_bit" label="Поиск бита из справочника" color="white" />
                    </q-item>
                    <q-item>
                      <q-radio :disable="!tarWrite(selectTag)" size="32px" dark v-model="tagConvert" val="reference_bit"
                        label="Соответствие бита значению из справочника" color="white" />
                    </q-item>
                    <q-item v-if="tagConvert == 'reference_bit'">
                      <q-input :disable="!tarWrite(selectTag)" type="number" v-model="tagBitNumber" dark color="white"
                        input-class="text-h6 text-white" label-color="grey" stack-label label="Номер бита:" />
                    </q-item>
                  </div>
                  <div v-if="tarWrite(selectTag)" class="col">
                    <div class="text-white text-h6">Оповещение:</div>
                    <q-checkbox dark v-model="tagNotify" label="Активно" />
                    <q-item v-if="tagNotify" class="text-h6">
                      <q-select dark class="text-h6 fit" label="Условие:" options-selected-class="text-h6 text-grey"
                        label-active-class="text-red" popup-content-class="text-h6"
                        :options="['==', '>=', '<=', '>', '<', '!=']" option-value="label" v-model="tagCondition"
                        popup-content-style="background-color: rgb(60, 60, 60); color:  white;"
                        style="padding-right: 5px;" />
                    </q-item>
                    <q-item v-if="tagNotify">
                      <q-input dark type="text" v-model="tagConditionValue" color="white" input-class="text-h6 text-white"
                        label-color="grey" stack-label label="Значение:" />
                    </q-item>
                    <div class="text-white text-h6">Запись в базу данных:</div>
                    <q-checkbox dark v-model="tagWriteDB" label="Активно" />
                    <q-item v-if="tagWriteDB">
                      <q-input dark type="text" v-model="tagWriteDBName" color="white" input-class="text-h6 text-white"
                        label-color="grey" stack-label label="Имя переменной:" />
                    </q-item>
                    <q-item v-if="tagWriteDB">
                      <q-input dark type="text" v-model="tagWriteDBDisplayName" color="white"
                        input-class="text-h6 text-white" label-color="grey" stack-label label="Имя для отображения:" />
                    </q-item>
                  </div>
                </div>
                <StringTable
                  v-if="tagConvert == 'reference' || tagConvert == 'reference_bit' || tagConvert == 'reference_single_bit'"
                  ref="tableSettingsTagReference" name="Справочник:" :save="readSettingsTagReference" :columnsDef="[
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
                  ]" :rows-def="rowsSettingsTag">

                </StringTable>
              </ScrollBar>
              <q-card-actions align="center">
                <q-btn color="dark-grey" label="Готово" @click="() => {
                  rebuildSettingsTags(selectTag);
                  writeDatabase();
                  dialogSettingTag.hide();
                }" />
              </q-card-actions>
            </template>
          </Dialog>
        </template>
      </Dialog>
      <Dialog width="60vw" name-def="Добавить пользователя" ref="dialogAddUsers">
        <template v-slot:content>
          <StringTable ref="tableAllUsers" name="Справочник:" :add="false" :remove="false" :columnsDef="[
            {
              name: 'name',
              align: 'left',
              label: 'Имя',
              field: 'name',
              format: (val) => val,
              type: 'text',
              edit: false,
              sortable: false,
            },
            {
              name: 'email',
              align: 'left',
              label: 'Логин',
              field: 'email',
              format: (val) => val,
              type: 'text',
              edit: false,
              sortable: false,
            },
          ]" :rows-def="allUsers">
          </StringTable>
          <q-card-actions align="center">
            <q-btn color="dark-grey" label="Готово" @click="() => {
              dialogAddUsers.hide();
              readAllowUsers();
            }" />
          </q-card-actions>
        </template>
      </Dialog>
      <Dialog width="30vw" name-def="Инфо" ref="dialogNoTags">
        <template v-slot:content>
          Нет активных тегов для отправки данных
        </template>
      </Dialog>
    </template>
  </Page>
  <ErrorAllow v-show="!allowPermission()">
    <template v-slot:actions>
      <q-btn color="dark-grey" label="К списку объектов" @click="exit" />
    </template>
  </ErrorAllow>
</template>
<script>
import {
  ref, onMounted, onBeforeUnmount, inject,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import moment from 'moment';
import Page from 'src/components/Page.vue';
import GridCanvas from 'src/components/GridCanvas.vue';
// import Section from 'src/components/Section.vue';
import Dialog from 'src/components/dialogs/standart.vue';
import Confirm from 'src/components/dialogs/confirm.vue';
// import DatePicker from 'src/components/DatePicker.vue';
import Table from 'src/components/Table.vue';
import ScrollBar from 'src/components/ScrollBar.vue';
import StringTable from 'src/components/StringTable.vue';
import ErrorAllow from 'src/components/ErrorAllow.vue';
import Chart from 'src/components/charts/chart_v5.vue';

export default {
  name: 'SystemConfiguration',
  components: {
    Page,
    GridCanvas,
    // Section,
    Dialog,
    // DatePicker,
    Table,
    Confirm,
    ScrollBar,
    StringTable,
    ErrorAllow,
    Chart,
  },
  setup() {
    const name = ref('');
    const router = useRouter();
    const route = useRoute();
    const {
      host, getObject, ip, isPermissions, getUser,
    } = inject('store');
    const { id } = route.params;
    const structure = ref([]);
    const allTags = ref([]);
    const timers = ref([]);
    const logs = ref([]);
    const select = ref('');
    const selectTag = ref('');
    const grid = ref(null);

    const time = ref('');
    const startDate = ref('');
    const finishDate = ref('');
    const chart = ref(null);
    const tagIsChart = ref({});
    const tagIsChartOp = ref([]);
    const button = ref(false);
    const setpoint = ref(24);
    const mode = ref('heat');
    const manual = ref('manual');
    const ip_addr = ref('');
    const port = ref(502);
    const timeout = ref(1000);
    const id_addr = ref(1);
    const connectionType = ref('TCP');
    const period = ref(5);
    const byteOrder = ref('1234');
    const place = ref('');
    const placeholder = ref('');
    const allUsers = ref([]);
    const allowUsers = ref([]);
    const periodOfStorage = ref(1);
    const messenger = ref([]);
    const tableAllUsers = ref(null);

    // настройки
    const structureIconsOptions = ref(['нет', 'on-off.svg', 'alarm.svg', 'calendar.svg', 'air.svg', 'valve.svg', 'filter.svg',
      'fan.svg', 'recup.svg', 'heater.svg', 'heater_electric.svg', 'cooler.svg', 'temperature.svg', 'humdity_meas.svg', 'valve_analog.svg', 'bf.svg',
      'air90.svg', 'humdity.svg', 'speed.svg', 'pressure.svg', 'air_up_border.svg', 'recupP.svg', 'recupR.svg',
    ]);
    const structureColorOptions = ref(['white', 'red', 'blue', 'green',
      'black', 'sky', 'yellow', 'grey', 'silver', 'brown',
    ]);

    const functionsOptions = ref(['FC1', 'FC2', 'FC3', 'FC4', 'FC5', 'FC6', 'FC16']);

    const structureModeltypeElement = ref({});
    const structureIcons = ref(structureIconsOptions.value[0]);
    const structureModelNameElement = ref({});
    const structureModelCoordXElement = ref({});
    const structureModelCoordYElement = ref({});
    const structureModelWidthElement = ref({});
    const structureModelHeightElement = ref({});
    const structureModelImageTopElement = ref({});
    const structureModelImageBottomElement = ref({});
    const structureModelColorElement = ref({});
    const tagsModelElementName = ref({});
    const tagsModelElementAdress = ref({});
    const tagsModelElementLength = ref({});
    const tagsModelElementFunction = ref({});
    const tagsModelElementPostfix = ref({});
    const tagsModelElementPosition = ref({});
    const tagsModelElementFlagValue = ref({});
    const tagsModelElementTimer = ref({});

    const tagType = ref('byte');
    const tagConvert = ref('none');
    const tagLengthNumbers = ref(1);
    const tagDivider = ref(1);
    const tagMultiplier = ref(1);
    const tagBitNumber = ref(0);
    const tagNotify = ref(false);
    const tagCondition = ref('>');
    const tagConditionValue = ref(0);
    const rowsSettingsTag = ref([]);
    const tagWriteDB = ref(false);
    const tagWriteDBName = ref('');
    const tagWriteDBDisplayName = ref('');

    const timersModelEnable = ref({});
    const timersModelTime = ref({});
    const timersModelTag = ref({});
    const timersModelTagName = ref({});
    const timersModelDays = ref({});
    const timerModelInput = ref({});
    const timerModelSelectInput = ref({});
    const timerModelSelectInputOp = ref({});

    const edit = ref(false);
    const dialogElement = ref(null);
    const dialogNoTags = ref(null);
    const dialogConfirm = ref(null);
    let ws;

    const connect = ref('');
    const connect_color = ref('white');
    // заполняет все теги элементов фиксированными лейблами
    function drawLabelAll(text, color) {
      try {
        structure.value.forEach((el) => {
          el.tags.forEach((tag) => {
            if (!(tag.function === 'FC5' || tag.function === 'FC6' || tag.function === 'FC16')) {
              grid.value.updateText(el.id, text, tag.position, color);
            }
          });
        });
      } catch (err) {
        if (edit.value) {
          console.log('Ошибка обновления');
        }
      }
    }
    // удаление вебсокета
    function deleteWS() {
      if (ws) {
        ws.close();
        ws = null;
      }
    }
    // создание вебсокета
    function createWS() {
      deleteWS();
      setInterval(() => {
        connect.value = 'Подключение...';
        connect_color.value = 'yellow';
        if (ws) {
          if (ws.readyState === WebSocket.OPEN) {
            connect.value = 'Подключен';
            connect_color.value = 'green';
          } else if (ws.readyState === WebSocket.CLOSED) {
            connect.value = 'Ошибка подключения';
            connect_color.value = 'red';
            drawLabelAll('Ошибка', 'red');
          }
        }
      }, 500);
      const connectWs = setInterval(() => {
        if (ip_addr.value !== '') {
          ws = new WebSocket(`ws://${ip}:3001/monitoring`);
          ws.onopen = () => {
            drawLabelAll('Опрос...', 'yellow');
            console.log('Веб сокет подключен');
          };
          ws.onclose = () => {
            console.log('Веб сокет отключён');
            drawLabelAll('Ожидание...', 'yellow');
          };
          ws.onmessage = (data) => {
            function updateTagsElements(el, tg, val, color, postfix) {
              const element = getObject(structure.value, 'id', el);
              element.tags.forEach((tag) => {
                if (tag.id === tg) {
                  if (element.type === 'input') {
                    grid.value.updateDescription(el, '', 'bottom');
                    grid.value.updateDescription(el, '', 'top');
                    grid.value.updateSuffix(el, tag.postfix);
                    grid.value.clearText(el);
                    grid.value.updateText(el, element.name, 'top', 'grey');
                    if (!grid.value.isFocus(el) && !dialogConfirm.value.visible) {
                      grid.value.updateText(el, `${val}`, 'include', color);
                    }
                  } else if (element.type === 'button') {
                    grid.value.updateText(el, `${val} ${postfix ? tag.postfix : ''}`, tag.position, color);
                    grid.value.updateDescription(el, '', 'bottom');
                    grid.value.updateDescription(el, '', 'top');
                  } else {
                    grid.value.updateText(el, `${val} ${postfix ? tag.postfix : ''}`, tag.position, color);
                    grid.value.updateDescription(el, `${tag.name} ${val} ${postfix ? tag.postfix : ''}`, tag.position);
                  }
                }
              });
            }
            try {
              const v = JSON.parse(data.data);
              if (v.sender === ip_addr.value) {
                if (v.status) {
                  if (v.status === 'ok') {
                    if (edit.value) {
                      console.log(v);
                    }
                    if (grid.value) {
                      if (v.element) {
                        updateTagsElements(v.element, v.tag, `${v.value}`, 'green', true);
                      }
                    }
                  } else if (v.status === 'error') {
                    if (edit.value) {
                      console.error(v);
                    }
                    if (v.element) {
                      updateTagsElements(v.element, v.tag, 'Ошибка', 'red');
                    }
                  }
                }
                structure.value.forEach((element) => {
                  if (element.type === 'button') {
                    if (element.imageTop !== '') {
                      if (grid.value) {
                        grid.value.updateDescription(element.id, '', 'bottom');
                        grid.value.updateDescription(element.id, '', 'top');
                        grid.value.updateText(element.id, element.name, 'top', 'grey');
                      }
                    }
                  }
                });
              } else if (v.sender === 'server') {
                time.value = v.value;
              }
            } catch (err) {
              console.log('Ошибка обновления', err);
              clearInterval(connectWs);
            }
          };
          ws.onerror = () => {
            console.log(`Ошибка вебсокета ${ip_addr.value}`);
            clearInterval(connectWs);
          };
          if (ws.readyState === 0) {
            clearInterval(connectWs);
          }
        }
      }, 3000);
    }
    function rebuild() {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const key in structureModelColorElement.value) {
        const element = getObject(structure.value, 'id', key);
        element.type = structureModeltypeElement.value[key];
        element.color = structureModelColorElement.value[key];
        element.name = structureModelNameElement.value[key];
        element.x = structureModelCoordXElement.value[key];
        element.y = structureModelCoordYElement.value[key];
        element.w = structureModelWidthElement.value[key];
        element.h = structureModelHeightElement.value[key];
        element.imageTop = structureModelImageTopElement.value[key] === 'нет' ? '' : structureModelImageTopElement.value[key];
        element.imageBottom = structureModelImageBottomElement.value[key] === 'нет' ? '' : structureModelImageBottomElement.value[key];
        element.descriptionBottom = '';
        element.descriptionTop = '';
      }
      createWS();
    }
    // чтение данных из БД
    function readDatabase(callback) {
      axios.get(`${host}/services/users`).then((usrs) => {
        allUsers.value = usrs.data;
        axios.get(`${host}/monitoring/table/SystemConf/${id}`)
          .then((res) => {
            if (res.data.result === 'ok') {
              document.title = res.data.data.name;
              name.value = res.data.data.name;
              ip_addr.value = res.data.data.ip;
              period.value = res.data.data.period;
              port.value = res.data.data.port;
              id_addr.value = res.data.data.id_addr;
              timeout.value = res.data.data.timeout;
              place.value = res.data.data.place;
              placeholder.value = res.data.data.place_holder;
              byteOrder.value = res.data.data.orderBytes;
              connectionType.value = res.data.data.connection;
              periodOfStorage.value = res.data.data.period_of_storage;
              try {
                const conf = JSON.parse(res.data.data.configuration);
                timers.value = conf.timers || [];
                structure.value = conf.structure || [];
                allowUsers.value = conf.allowUsers || [];
                messenger.value = conf.messenger || [];
              } catch (err) {
                structure.value = [];
              }
              grid.value.init(structure.value);
              if (callback) {
                callback();
              }
            }
          });
      });
    }
    // возвращает массив тегов, со включенной опцией записи в БД
    function getTagsWriteDB() {
      const tags = [];
      structure.value.forEach((element) => {
        element.tags.forEach((tag) => {
          if (tag.writedb) {
            if (tag.writedb !== false) {
              tags.push({
                id: `${element.id}:${tag.id}`,
                tag,
              });
            }
          }
        });
      });
      return tags;
    }
    onMounted(() => {
      readDatabase(() => {
        axios.post(`${host}/monitoring/table/SystemLog/create`, {
          id_system: id,
          event: 'Выполнен вход',
          user: getUser().name,
        });
        createWS();
        tagIsChartOp.value = getTagsWriteDB();
        [tagIsChart.value] = tagIsChartOp.value;
      });
    });
    onBeforeUnmount(() => {
      deleteWS();
    });
    function synchTimers() {
      allTags.value.length = 0;
      structure.value.forEach((element) => {
        if (element.tags) {
          element.tags.forEach((tag) => {
            if (tag.function === 'FC5' || tag.function === 'FC6' || tag.function === 'FC16') {
              let add = true;
              if (element.type !== 'input') {
                if (tag.metadata.length === 0) {
                  add = false;
                }
              }
              if (add) {
                allTags.value.push({
                  id: `${element.id}:${tag.id}`,
                  element,
                  tag,
                });
              }
            }
          });
        }
      });
      timers.value.forEach((element) => {
        timersModelEnable.value[element.id] = element.enable;
        timersModelTime.value[element.id] = element.time;
        timersModelTag.value[element.id] = element.tag || null;
        timersModelDays.value[element.id] = element.days;
        if (element.tag) {
          timersModelTagName.value[element.id] = `${element.tag.element.name}:${element.tag.tag.name}`;
          // если ввод числа
          if (element.tag.element.type === 'input') {
            timerModelInput.value[element.id] = Number(element.value);
            timerModelSelectInput.value[element.id] = {};
            timerModelSelectInputOp.value[element.id] = [];
          } else { // если кнопка/иконка
            timerModelInput.value[element.id] = 0;
            if (element.tag.tag.metadata.length > 0) {
              // eslint-disable-next-line prefer-destructuring
              timerModelSelectInput.value[element.id] = getObject(element.tag.tag.metadata, 'num', Number(element.value));
              timerModelSelectInputOp.value[element.id] = element.tag.tag.metadata;
            }
          }
        }
      });
    }
    // непосредственная запись данных в БД
    function writeDatabase(callback) {
      axios.post(`${host}/monitoring/table/SystemConf/update/${id}`, {
        name: name.value,
        id_addr: Number(id_addr.value),
        ip: ip_addr.value,
        period: Number(period.value),
        port: Number(port.value),
        timeout: Number(timeout.value),
        period_of_storage: Number(periodOfStorage.value),
        orderBytes: byteOrder.value,
        configuration: JSON.stringify({
          timers: timers.value,
          structure: structure.value,
          messenger: messenger.value,
          allowUsers: allowUsers.value,
        }),
        place: place.value,
        place_holder: placeholder.value,
      }).then((res) => {
        if (res.data.result === 'ok') {
          grid.value.init(structure.value);
          console.log('Обновлено');
          if (callback) {
            callback();
          }
          axios.post(`${host}/monitoring/table/SystemLog/create`, {
            id_system: id,
            event: 'Изменена конфигурация',
            user: getUser().name,
          });
        } else {
          console.log('Ошибка записи');
        }
      });
    }
    // синхронизирует текущую структуру с окном настройки структуры
    function synchSettings() {
      structure.value.forEach((element) => {
        structureModeltypeElement.value[element.id] = element.type || 'icon';
        structureModelNameElement.value[element.id] = element.name;
        structureModelCoordXElement.value[element.id] = element.x;
        structureModelCoordYElement.value[element.id] = element.y;
        structureModelWidthElement.value[element.id] = element.w || 1;
        structureModelHeightElement.value[element.id] = element.h || 1;
        structureModelImageTopElement.value[element.id] = element.imageTop || 'нет';
        structureModelImageBottomElement.value[element.id] = element.imageBottom || 'нет';
        structureModelColorElement.value[element.id] = element.color || 'white';
      });
    }
    function rebuildTags(elementId) {
      getObject(structure.value, 'id', elementId).tags.forEach((tag) => {
        tag.name = tagsModelElementName.value[tag.id];
        tag.quantity = tagsModelElementLength.value[tag.id];
        tag.function = tagsModelElementFunction.value[tag.id];
        tag.adress = tagsModelElementAdress.value[tag.id];
        tag.position = tagsModelElementPosition.value[tag.id];
        tag.postfix = tagsModelElementPostfix.value[tag.id] || '';
        tag.sendValue = Number(tagsModelElementFlagValue.value[tag.id]) || 0;
        tag.timer = tagsModelElementTimer.value[tag.id] || 0;
      });
      createWS();
    }
    function rebuildTimers() {
      timers.value.forEach((timer) => {
        timer.enable = timersModelEnable.value[timer.id];
        timer.time = timersModelTime.value[timer.id];
        timer.tag = timersModelTag.value[timer.id];
        timer.days = timersModelDays.value[timer.id];
        if (timer.tag.element.type === 'input') {
          timer.value = timerModelInput.value[timer.id];
        } else if (timerModelSelectInput.value[timer.id].num) {
          timer.value = timerModelSelectInput.value[timer.id].num;
        } else {
          timer.value = 0;
        }
      });
      createWS();
    }
    function synchSettingsTags(elementId) {
      getObject(structure.value, 'id', elementId).tags.forEach((element) => {
        tagsModelElementName.value[element.id] = element.name;
        tagsModelElementAdress.value[element.id] = element.adress;
        tagsModelElementLength.value[element.id] = element.quantity;
        tagsModelElementPostfix.value[element.id] = element.postfix;
        tagsModelElementPosition.value[element.id] = element.position;
        tagsModelElementFunction.value[element.id] = element.function;
        tagsModelElementFlagValue.value[element.id] = element.sendValue || 0; // по умолчанию
        tagsModelElementTimer.value[element.id] = element.timer || 0; // по умолчанию
      });
    }
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
    function addElement() {
      writeDatabase(() => {
        rebuild();
        structure.value.push({
          x: 15,
          y: 2,
          type: 'icon',
          name: 'Новый элемент',
          id: `el${getUniquieCNT(structure.value, 'el', 'id')}`,
          imageTop: 'valve.svg',
          imageBottom: '',
          color: 'white',
          tags: [],
        });
        synchSettings();
      });
    }
    function deleteElement(elementId) {
      structure.value.splice(structure.value.indexOf(getObject(structure.value, 'id', elementId)), 1);
      delete structureModelColorElement.value[elementId];
      delete structureModelNameElement.value[elementId];
      delete structureModelCoordXElement.value[elementId];
      delete structureModelCoordYElement.value[elementId];
      delete structureModelWidthElement.value[elementId];
      delete structureModelHeightElement.value[elementId];
      delete structureModelImageTopElement.value[elementId];
      delete structureModelImageBottomElement.value[elementId];
      grid.value.init(structure.value);
    }
    function deleteTimer(elementId) {
      writeDatabase(() => {
        rebuildTimers();
        timers.value.splice(timers.value.indexOf(getObject(timers.value, 'id', elementId)), 1);
        delete timersModelEnable.value[elementId];
        delete timersModelTime.value[elementId];
        delete timersModelTag.value[elementId];
        delete timersModelDays.value[elementId];
        delete timerModelInput.value[elementId];
        delete timersModelTagName.value[elementId];
        delete timerModelSelectInput.value[elementId];
        synchTimers();
      });
    }
    function removeAllElements() {
      structure.value.forEach((element) => {
        delete structureModelColorElement.value[element.id];
        delete structureModelNameElement.value[element.id];
        delete structureModelCoordXElement.value[element.id];
        delete structureModelCoordYElement.value[element.id];
        delete structureModelWidthElement.value[element.id];
        delete structureModelHeightElement.value[element.id];
        delete structureModelImageTopElement.value[element.id];
        delete structureModelImageBottomElement.value[element.id];
      });
      structure.value.length = 0;
      grid.value.init(structure.value);
    }
    function addTagElement(elementId) {
      const { tags } = getObject(structure.value, 'id', elementId);
      tags.push({
        id: `tag${getUniquieCNT(tags, 'tag', 'id')}`,
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
      synchSettingsTags(elementId);
    }
    function addTimer() {
      if (allTags.value.length > 0) {
        writeDatabase(() => {
          rebuildTimers();
          const newId = getUniquieCNT(timers.value, 'timer', 'id');
          timers.value.push({
            id: `timer${newId}`,
            name: `Таймер ${newId + 1}`,
            time: '10:00:00',
            enable: false,
            tag: allTags.value[0],
            days: ['op1', 'op2', 'op3', 'op4', 'op5', 'op6', 'op7'],
            value: 0,
          });
          synchTimers();
        });
      } else {
        dialogNoTags.value.show();
        console.log('Нет тегов для привязки');
      }
    }
    function clearAllTimers() {
      timers.value.forEach((element) => {
        const elementId = element.id;
        delete timersModelEnable.value[elementId];
        delete timersModelTime.value[elementId];
        delete timersModelTag.value[elementId];
        delete timersModelDays.value[elementId];
        delete timerModelInput.value[elementId];
        delete timersModelTagName.value[elementId];
        delete timerModelSelectInput.value[elementId];
      });
      timers.value.length = 0;
      writeDatabase();
    }
    function getObjectSelect() {
      return getObject(structure.value, 'id', select.value);
    }
    function getTagSelect() {
      return getObject(getObject(structure.value, 'id', select.value).tags, 'id', selectTag.value);
    }
    function deleteTagElement(elementId, tagId) {
      const { tags } = getObject(structure.value, 'id', elementId);
      tags.splice(tags.indexOf(getObject(tags, 'id', tagId)), 1);
      delete tagsModelElementName.value[tagId];
      synchSettingsTags(elementId);
    }
    function openInterpretatorTag(elementId) {
      const tag = getObject(getObjectSelect().tags, 'id', elementId);
      tagType.value = tag.type;
      tagConvert.value = tag.convert || 'none';
      tagLengthNumbers.value = tag.number_length || 1;
      tagDivider.value = tag.divider || 1;
      tagMultiplier.value = tag.multiplier || 1;
      tagBitNumber.value = tag.bit_number || 0;
      tagNotify.value = tag.notify || false;
      tagWriteDB.value = tag.writedb || false;
      tagWriteDBName.value = tag.writedbname || '';
      tagWriteDBDisplayName.value = tag.writedbdisplayname || '';
      tagCondition.value = tag.condition || '>';
      tagConditionValue.value = tag.condition_value || '';
      rowsSettingsTag.value = tag.metadata;
    }
    function rebuildSettingsTags(tagId) {
      const tag = getObject(getObjectSelect().tags, 'id', tagId);
      tag.type = tagType.value || 'byte';
      tag.convert = tagConvert.value || 'none';
      tag.number_length = Number(tagLengthNumbers.value) || 1;
      tag.divider = Number(tagDivider.value) || 1;
      tag.multiplier = Number(tagMultiplier.value) || 1;
      tag.metadata = rowsSettingsTag.value;
      tag.bit_number = tagBitNumber.value || 0;
      tag.notify = tagNotify.value || false;
      tag.writedb = tagWriteDB.value || false;
      tag.writedbname = tagWriteDBName.value || '';
      tag.writedbdisplayname = tagWriteDBDisplayName.value || '';
      tag.condition = tagCondition.value || '>';
      tag.condition_value = tagConditionValue.value || '';
    }
    function readSettingsTagReference(_rows) {
      console.log(_rows);
    }
    function actionClearAlarmJournal() {
      console.log('Журнал очищен');
    }
    function exit() {
      router.push('/monitoring/configurations');
    }
    function hideGrid(val) {
      grid.value.visibleGrid = val;
    }

    const submit = ref(() => { });

    function confirmSendValue(s) {
      if (!edit.value) {
        const sendObj = getObject(structure.value, 'id', s);
        if (sendObj.type === 'input') {
          sendObj.sender = ip_addr.value;
          sendObj.tags.forEach((tag) => {
            if (tag.function === 'FC5' || tag.function === 'FC6' || tag.function === 'FC16') {
              tag.sendValue = grid.value.getValue(select.value);
              ws.send(JSON.stringify(sendObj));
              axios.post(`${host}/monitoring/table/SystemLog/create`, {
                id_system: id,
                event: `${sendObj.name}${tag.name !== '' ? `/${tag.name}` : ''}, значение: ${tag.sendValue}`,
                user: getUser().name,
              });
            }
          });
        }
      }
    }
    function confirmPressButton(sendObj) {
      sendObj.sender = ip_addr.value;
      ws.send(JSON.stringify(sendObj));
      sendObj.tags.forEach((tag) => {
        axios.post(`${host}/monitoring/table/SystemLog/create`, {
          id_system: id,
          event: `${sendObj.name}${tag.name !== '' ? `/${tag.name}` : ''}, значение: ${tag.sendValue}`,
          user: getUser().name,
        });
      });
    }
    function sendValue(s) {
      dialogConfirm.value.show();
      submit.value = () => {
        confirmSendValue(s);
        dialogConfirm.value.hide();
      };
    }
    function pressedElem(s) {
      select.value = s;
      if (edit.value) {
        dialogElement.value.setName('Настройка элемента');
        dialogElement.value.show();
        synchSettingsTags(select.value);
      } else {
        const sendObj = getObject(structure.value, 'id', select.value);
        if (sendObj.type === 'button') {
          dialogConfirm.value.show();
          submit.value = () => {
            confirmPressButton(sendObj);
            dialogConfirm.value.hide();
          };
        }
      }
    }
    function reload() {
      axios.get(`${host}/monitoring/reload/`)
        .then((res) => {
          console.log(res);
        });
    }
    function removeUser(usr) {
      const deleteIndex = allowUsers.value.findIndex((u) => u.id === usr.id);
      allowUsers.value.splice(deleteIndex, 1);
    }
    function readAllowUsers() {
      tableAllUsers.value.selection.forEach((user) => {
        if (allowUsers.value.findIndex((u) => u.id === user.id) === -1) {
          allowUsers.value.push(user);
        }
      });
    }
    function changeTimerTag() {
      rebuildTimers();
      synchTimers();
    }
    // реализация скачивания графика (проходит в 2 этапа)
    function downloadPDF(value) {
      const downloadFile = async (url, filename) => {
        const response = await axios({
          url,
          method: 'GET',
          responseType: 'blob',
        });
        const blob = new Blob([response.data]);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      };
      const img = chart.value.getDataURL().replace(/^data:image\/(png|jpg);base64,/, '');
      axios.post(`${host}/monitoring/save_chart`, {
        data: img,
        time: time.value,
        name: name.value,
        parameter: value.tag.writedbdisplayname,
      }).then((response) => {
        downloadFile(`${host}/monitoring/get_chart/${response.data.filename}`, response.data.filename);
      });
    }
    // обновляет время и перестраивает график в соответствии с выбранным параметром
    function changeTagIsChart(value) {
      if (chart.value) {
        chart.value.setLoad(true);
      }
      axios.post(`${host}/monitoring/get_chart_data/${id}`, {
        startDate: startDate.value,
        finishDate: finishDate.value,
      }).then((res) => {
        // Обновление графиков
        const points = [];
        res.data.forEach((pt) => {
          const addedPoint = JSON.parse(pt.data);
          if (addedPoint[value.tag.writedbname]) {
            points.push({
              valueX: pt.createdAt,
              valueY: addedPoint[value.tag.writedbname],
            });
          }
        });
        chart.value.pushValuesArray(points);
        chart.value.setLoad(false);
      });
    }
    // обновляет время и ищет теги для записи
    function openChartDownload() {
      const t1 = moment();
      const t2 = moment();
      t1.set('day', t2.day() - 5);
      startDate.value = t1.format('DD-MM-YYYY HH:mm:ss');
      finishDate.value = t2.format('DD-MM-YYYY HH:mm:ss');
      changeTagIsChart(tagIsChart.value);
    }
    function openLogs() {
      logs.value.length = 0;
      axios.get(`${host}/monitoring/logs/${id}`).then((logData) => {
        logData.data.forEach((log) => {
          logs.value.push({
            id: log.id,
            time: log.createdAt,
            user: log.user,
            event: log.event,
          });
        });
      });
    }
    return {
      removeUser,
      allUsers,
      readAllowUsers,
      isPermissions,
      allowPermission: () => getUser().role === 'admin' || allowUsers.value.find((u) => u.email === getUser().email),
      getUser,
      structure,
      tagsModelElementName,
      tagsModelElementAdress,
      tagsModelElementLength,
      tagsModelElementFunction,
      tagsModelElementPostfix,
      tagsModelElementPosition,
      tagsModelElementFlagValue,
      tagsModelElementTimer,
      tagType,
      tagConvert,
      tagLengthNumbers,
      tagDivider,
      tagMultiplier,
      tagBitNumber,
      tagNotify,
      tagWriteDB,
      tagWriteDBName,
      tagWriteDBDisplayName,
      tagCondition,
      tagConditionValue,
      tarWrite: (elementId) => tagsModelElementFunction.value[elementId] !== 'FC5'
        && tagsModelElementFunction.value[elementId] !== 'FC6'
        && tagsModelElementFunction.value[elementId] !== 'FC16',
      rowsSettingsTag,
      timers,
      structureIcons,
      structureIconsOptions,
      structureColorOptions,
      functionsOptions,
      structureModelNameElement,
      structureModelCoordXElement,
      structureModelCoordYElement,
      structureModelWidthElement,
      structureModelHeightElement,
      structureModelImageTopElement,
      structureModelImageBottomElement,
      structureModelColorElement,
      structureModeltypeElement,
      timersModelEnable,
      timersModelTime,
      timersModelTag,
      timersModelTagName,
      timersModelDays,
      timerModelInput,
      timerModelSelectInput,
      timerModelSelectInputOp,
      changeTimerTag,
      tableAllUsers,
      allowUsers,
      select,
      selectTag,
      grid,
      button,
      setpoint,
      mode,
      ip_addr,
      periodOfStorage,
      port,
      connect,
      connect_color,
      id_addr,
      connectionType,
      name,
      id,
      period,
      byteOrder,
      timeout,
      place,
      placeholder,
      manual,
      messenger,
      dialogDownload: ref(null),
      dialogLog: ref(null),
      dialogJournal: ref(null),
      dialogTimeDaily: ref(null),
      dialogSettings: ref(null),
      dialogConfirm,
      dialogNoTags,
      dialogElement,
      dialogSettingManual: ref(null),
      dialogSettingTag: ref(null),
      dialogAddUsers: ref(null),
      edit,
      pressedElem,
      sendValue,
      confirmSendValue,
      confirmPressButton,
      submit,
      hideGrid,
      readSettingsTagReference,
      actionClearAlarmJournal,
      synchSettings,
      deleteElement,
      removeAllElements,
      addElement,
      addTagElement,
      addTimer,
      clearAllTimers,
      deleteTagElement,
      deleteTimer,
      openInterpretatorTag,
      synchTimers,
      writeDatabase,
      rebuild,
      reload,
      createWS,
      exit,
      getObject,
      synchSettingsTags,
      rebuildTags,
      rebuildSettingsTags,
      rebuildTimers,
      readDatabase,
      getObjectSelect,
      getTagSelect,
      allTags,
      time,
      chart,
      startDate,
      finishDate,
      openChartDownload,
      changeTagIsChart,
      tagIsChart,
      tagIsChartOp,
      downloadPDF,
      getTagsWriteDB,
      logs,
      openLogs,
    };
  },
};
</script>
