<template>
  <q-page class="justify-center" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Материалы</div>
    </q-card-section>
    <q-table class="m-table" dark dense flat :rows="rows" :columns="columns" row-key="name" virtual-scroll
      :filter="filter" :filter-method="find" :hide-selected-banner="true" selection="multiple" v-model:selected="selected"
      binary-state-sort v-model:pagination="pagination" :rows-per-page-options="[1]"
      style="background-color: rgb(60, 60, 60);" :no-results-label="`По запросу '${filter}' ничего не найдено`"
      grid-header @row-click="selectRow">
      <template v-slot:top>
        <q-card-actions class="fit row q-pa-md" style="background-color: rgb(60, 60, 60);">
          <q-btn color='dark-grey' icon="add" @click="createAction" />
          <q-btn color='dark-grey' icon='edit' label='Редактировать' v-show="selected.length === 1"
            @click="changeAction(selected)" />
          <q-btn color='dark-grey' icon="delete" label='Удалить' v-show="selected.length > 0"
            @click="deleteAction(selected)" disable />
          <q-space />
          <q-btn color='dark-grey' label="Помощь" icon="help" @click="() => {
            help = true;
          }" />
          <q-select dark outlined dense v-model="filterOptions" :options="op" class="text-h6 q-pa-sm"
            options-selected-class="text-h6 text-grey" popup-content-class="text-h6" />
          <q-input dark class="text-h6 q-pa-sm" outlined dense debounce="300" color="primary" v-model="filter" clearable
            placeholder="Поиск">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-card-actions>
      </template>
      <template v-slot:pagination>
        <div class="text-h6" style="background-color: rgb(60, 60, 60);">
          {{ getSelectedString() }}
        </div>
      </template>
      <template v-slot:header-cell="props">
        <q-th :props="props" style="background-color: rgb(60, 60, 60);">
          <div class="text-h6">{{ props.col.label }}</div>
        </q-th>
      </template>
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <div class="text-h6">
            {{ props.value }}
          </div>
          <q-tooltip v-if="props.row.descript" :delay="800">
            <template v-slot:default>
              <div v-if="props.row.descript.length > 0">
                <p style="white-space: pre;">
                  {{ props.row.descript }}
                </p>
              </div>
            </template>
          </q-tooltip>
        </q-td>
      </template>
      <template v-slot:body-cell-category="props">
        <q-td :props="props">
          <q-badge color="grey-8">
            <div class="text-h6">{{ props.row.category }}</div>
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="getColor(props.row.status)">
            <div class="text-h6">{{ getStatusData()[props.row.status].label }}</div>
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-measure="props">
        <q-td :props="props">
          <q-badge color="grey-8">
            <div class="text-h6">{{ props.row.measure }}</div>
          </q-badge>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="dialog" persistent>
      <q-card class="text-white q-pt-none" style="width: 1100px; max-width: 95vw; background-color: rgb(60, 60, 60);">
        <q-bar style="background-color: rgb(80, 80, 80);">
          <div class="text-h6">{{ dialogName }}</div>
          <q-space />
          <q-btn color='dark-grey' flat icon="help" @click="() => {
            help = true;
          }" />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-grey text-white">Закрыть</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="text-white" style="background-color: rgb(60, 60, 60);">
          <q-card-section class="row">
            <q-input dark class="fit text-h6" v-model="inputName" clearable outlined label="Наименование" lazy-rules
              :rules="validationName" />
          </q-card-section>
          <q-card-section class="row" style="padding: 0px;">
            <q-card-section class="col-4">
              <q-input dark class="text-h6" v-model.number="inputCost" type="number" label="Цена" suffix="руб." outlined
                lazy-rules :rules="createInputRealValueRules" />
            </q-card-section>
            <q-card-section class="col-2">
              <q-input dark class="text-h6" v-model.number="inputWeight" type="number" label="Вес" suffix="кг." outlined
                lazy-rules :rules="createInputRealValueRules" />
            </q-card-section>
            <q-card-section class="col-2">
              <q-input dark class="text-h6" v-model.number="inputWidth" type="number" label="Ширина" suffix="мм." outlined
                lazy-rules :rules="createInputRealValueRules" />
            </q-card-section>
            <q-card-section class="col-2">
              <q-input dark class="text-h6" v-model.number="inputHeight" type="number" label="Высота" suffix="мм."
                outlined lazy-rules :rules="createInputRealValueRules" />
            </q-card-section>
            <q-card-section class="col-2">
              <q-input dark class="text-h6" v-model.number="inputDepth" type="number" label="Глубина" suffix="мм."
                outlined lazy-rules :rules="createInputRealValueRules" />
            </q-card-section>
          </q-card-section>
          <q-card-section class="row" style="padding: 0px;">
            <q-card-section class="col-3">
              <q-select dark class="text-h6" label="Категория" options-selected-class="text-h6 text-grey"
                popup-content-class="text-h6" outlined v-model="categoryOptions" :options="categoryOp" />
            </q-card-section>
            <q-card-section class="col-3">
              <q-select dark class="text-h6" label="Ед. измерения" options-selected-class="text-h6 text-grey"
                popup-content-class="text-h6" outlined v-model="measureOptions" :options="measureOp" />
            </q-card-section>
            <q-card-section class="col-3">
              <q-input dark class="fit text-h6" v-model="inputArticle" clearable outlined label="Артикул" />
            </q-card-section>
            <q-card-section class="col-3">
              <q-select dark class="text-h6" label="Статус" options-selected-class="text-h6 text-grey"
                popup-content-class="text-h6" outlined v-model="status" :options="statusOp" />
            </q-card-section>
          </q-card-section>
          <div class="row">
            <q-card-section class="col-6">
              <q-input dark class="fit text-h6" v-model="inputUID" clearable outlined label="Код номенклатуры 1C" />
            </q-card-section>
          </div>
          <q-card-section class="row">
            <q-input dark class="text-h8 fit" v-model="inputDescript" outlined label="Описание" type="textarea" />
          </q-card-section>
        </q-card-section>
        <q-card-actions align="center" class="text-black" style="background-color: rgb(60, 60, 60);">
          <q-btn v-show="action === 0" color="dark-grey" class="text-white" label="Создать" @click="createConfirmAction"
            :disabled="isValidationConfirm()" />
          <q-btn v-show="action === 1" color="dark-grey" class="text-white" label="Изменить" @click="changeConfirmAction"
            :disabled="isValidationConfirm()" />
          <q-btn class="text-white" color="dark-grey" label="Отмена" v-close-popup @click="cancelConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="help" persistent>
      <q-card class="text-white q-pt-none"
        style="width: 1200px; max-width: 95vw; height: 700px; background-color: rgb(60, 60, 60);">
        <q-bar>
          <div class="text-h6">Помощь</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-grey text-white">Закрыть</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="row items-justify q-pa-md">
          <ScrollBar styleContent="padding-right: 20px; width: 1200px; height: 600px;">
            <h5 class="full-width" align="center">Инструкция по созданию/редактированию справочника материалов</h5>
            <p class="text-justify">
              Справочник <b>«Материалы»</b> (далее Материалы) является централизованным хранилищем элементов в базе данных
              технического сервера. Материалы используются в качестве элементов формирования спецификаций как для ручных
              расчётов (подсервис
              «Расчёты себестоимости»), так и для автоматизированного подсервиса «Конфигурации систем», где спецификация
              создаётся по определённому алгоритму.
            </p>
            <h6 align="center">Особенности:</h6>
            <ul class="text-justify">
              <li>уникальное наименование материала, преследуются основные цели — это упрощение процесса поиска и выборки,
                повышение эффективности хранения данных;</li>
              <li>заполняемые реквизиты используются в других подсервисах;</li>
              <li>группировка по категориям для более быстрого поиска;</li>
              <li>расширение перечня материалов за счёт пользователей, каждый пользователь может вносить свой вклад и
                обновлять справочник данными, что может улучшить качество, расширить выбор из предоставленного перечня.
                Актуальность материалов — это залог быстрого и эффективного принятия расчёта
                себестоимости продукции.</li>
            </ul>
            <h6 align="center">Для создания материала необходимо:</h6>
            <ol>
              <li>Перейти в справочник материалы нажать на кнопку «+» в верхнем меню таблицы:
                <img class="center q-pa-md" src="./img1.png" style="width: 400px;" />
              </li>
              <li>В появившемся диалоговом окне «Создание нового материала» необходимо заполнить следующие атрибуты:
                <img class="center q-pa-md" src="./img2.png" style="width: 700px;" />
                <ul class="text-justify">
                  <li><b>Наименование</b> — обязательный атрибут, используется как уникальный идентификатор, в базе
                    запрещено
                    создавать два одинаковых по наименованию материала.
                    Откуда брать данный реквизит?
                    В общем случае наименование необходимо брать из атрибута «Рабочее наименование» в реквизитах
                    «Номенклатуры» соответствующего справочника 1С:
                    <img class="center q-pa-md" src="./img3.png" style="width: 700px;" />
                  </li>
                  <li><b>Цена</b>, в рублях — используется при вычислении суммарной стоимости
                    комплектующих. В общем случае значение цены необходимо брать из регистра «Цены номенклатуры»
                    номенклатуры из 1С:
                    <img class="center q-pa-md" src="./img4.png" style="width: 700px;" />
                  </li>
                  <li><b>Вес</b>, кг — качественная характеристика материала, используется
                    при вычислении суммарного веса комплектующих. Необходимо указать фактическую массу материала без
                    упаковки;
                  </li>
                  <li><b>Ширина</b>, мм — качественная характеристика материала, используется
                    при вычислении различных габаритных характеристик. Необходимо указать фактическую ширину материала без
                    упаковки;
                  </li>
                  <li><b>Высота</b>, мм — качественная характеристика материала, используется при
                    вычислении различных габаритных характеристик. Необходимо указать фактическую высоту материала без
                    упаковки;
                  </li>
                  <li><b>Глубина</b>, мм — качественная характеристика материала, используется
                    при вычислении различных габаритных характеристик. Необходимо указать фактическую глубину материала
                    без упаковки;
                  </li>
                  <img class="center q-pa-md" src="./img5.png" style="width: 700px;" />
                  <li><b>Категория</b> — используется для структурированного хранения материалов и
                    быстрого
                    поиска.;
                  </li>
                  <li><b>Единицы измерения</b> — используется для более информативного вида
                    спецификации, в
                    которую будет добавлен материал;
                  </li>
                  <li><b>Статус</b> — используется для отображения актуальности материала, по
                    скольку
                    материалы нельзя удалять из базы;
                  </li>
                  <li><b>Артикул</b> — используется как дополнительный информационный реквизит
                    для более точной идентификации материала:
                    <img class="center q-pa-md" src="./img6.png" style="width: 700px;" />
                    Однако лучше всего уточнять информацию в каталогах производителя.
                  </li>
                  <li><b>Код номенклатуры 1С</b> — используется для синхронизации справочника
                    номенклатуры из 1С:
                    <img class="center q-pa-md" src="./img9.png" style="width: 700px;" />
                  </li>
                </ul>
              </li>
              <li>После заполнения всех атрибутов нажимаем на кнопку «Создать», материал будет добавлен в общую таблицу:
                <img class="center q-pa-md" src="./img7.png" style="width: 700px;" />
              </li>
              <li>При необходимости изменить материал нажимаем на кнопку «РЕДАКТИРОВАТЬ», появится аналогичная по созданию
                материала форма для заполнения атрибутов. При изменении наименования система так-же проверяет уникальность
                имени:
                <img class="center q-pa-md" src="./img8.png" style="width: 700px;" />
              </li>
            </ol>

          </ScrollBar>

        </q-card-section>
      </q-card>
    </q-dialog>
    <DialogError ref="de" />
    <DialogConfirm ref="dc">
      <template v-slot:buttons>
        <q-btn color='dark-grey' label="Да" @click="deleteConfirmAction" />
        <q-btn color='dark-grey' label="Отмена" v-close-popup />
      </template>
    </DialogConfirm>
  </q-page>
</template>

<script>
import {
  onMounted, ref, defineComponent, inject,
} from 'vue';
import ScrollBar from 'src/components/ScrollBar.vue';
import axios from 'axios';
import DialogError from 'src/components/dialogs/error.vue';
import DialogConfirm from 'src/components/dialogs/confirm.vue';

export default defineComponent({
  name: 'GenPricePage',
  components: {
    ScrollBar,
    DialogError,
    DialogConfirm,
  },
  setup() {
    document.title = 'Материалы';
    const {
      host, getProp, getId, validationName, getRubFormat, getStatusData,
    } = inject('store');
    const de = ref(null);
    const dc = ref(null);
    const dialog = ref(false);
    const help = ref(false);
    const dialogName = ref('');
    const nameDefault = 'Новый материал';
    const inputName = ref(nameDefault);
    const inputArticle = ref('');
    const inputUID = ref('');
    const inputDescript = ref('');
    const inputCost = ref(0);
    const inputWeight = ref(0);
    const inputWidth = ref(0);
    const inputHeight = ref(0);
    const inputDepth = ref(0);
    const categories = [];
    const categoryOp = ref([]);
    const measures = [];
    const measureOp = ref([]);

    const statusOp = ref(getStatusData());
    const status = ref(statusOp.value[0]);
    const categoryOptions = ref('');
    const measureOptions = ref('');
    const selected = ref([]);
    const action = ref(0);
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
        name: 'status',
        align: 'left',
        label: 'Статус',
        field: 'status',
        sortable: true,
      },
      {
        name: 'cost',
        align: 'left',
        label: 'Цена, руб',
        field: 'cost',
        sortable: true,
        format: (val) => getRubFormat().format(val),
      },
      {
        name: 'category',
        align: 'left',
        label: 'Категория',
        field: 'category',
        sortable: true,
      },
      {
        name: 'measure',
        align: 'left',
        label: 'Ед. измерения',
        field: 'measure',
        sortable: true,
      },
      {
        name: 'article',
        align: 'left',
        label: 'Артикул',
        field: 'article',
        sortable: true,
      },
      {
        name: 'weight',
        align: 'left',
        label: 'Вес, кг',
        field: 'weight',
        sortable: true,
      },
    ];
    function resetSelect() {
      selected.value.length = 0;
    }
    function getQueryAll() {
      return `${host}/services/genprice/Material`;
    }
    function getQueryDelete() {
      return `${getQueryAll()}/delete`;
    }
    function getQueryCreate() {
      return `${getQueryAll()}/create`;
    }
    function getQueryUpdate() {
      return `${getQueryAll()}/update`;
    }
    function isValidationConfirm() {
      return !inputName.value || inputCost.value < 0 || inputWeight.value < 0 || inputWidth.value < 0
        || inputHeight.value < 0 || inputDepth.value < 0;
    }
    function createAction() {
      dialog.value = true;
      dialogName.value = 'Создание нового материала';
      const n = categoryOp.value[0];
      categoryOptions.value = n;
      const m = measureOp.value[0];
      measureOptions.value = m;
      inputName.value = nameDefault;
      inputDescript.value = '';
      inputCost.value = 0;
      inputWeight.value = 0;
      inputWidth.value = 0;
      inputHeight.value = 0;
      inputDepth.value = 0;
      inputArticle.value = '';
      action.value = 0;
    }
    function deleteAction(select) {
      let objectsNames = select[0].name;
      for (let index = 1; index < select.length; index += 1) {
        const element = select[index];
        objectsNames += `, ${element.name}`;
      }
      if (select.length > 1) {
        dc.value.setName('Удаление материалов');
      } else {
        dc.value.setName('Удаление материала');
      }
      dc.value.setText(`Удалить "${objectsNames}"?`);
      dc.value.show();
    }
    function changeAction(select) {
      dialog.value = true;
      dialogName.value = 'Изменение материала';
      const object = select[0];
      inputName.value = object.name;
      inputDescript.value = object.descript;
      inputCost.value = object.cost;
      inputWeight.value = object.weight;
      inputWidth.value = object.width;
      inputHeight.value = object.height;
      inputDepth.value = object.depth;
      inputArticle.value = object.article;
      inputUID.value = object.uid_1C;
      status.value = getProp(statusOp.value, object.status, 'label');
      categoryOptions.value = getProp(categoryOptions, object.category, 'name');
      measureOptions.value = getProp(measureOptions, object.measure, 'name');
      action.value = 1;
    }
    const rows = ref([]);
    function update() {
      axios
        .get(`${host}/services/genprice/MaterialMeasure`).then((responseMe) => {
          measures.length = 0;
          measureOp.value.length = 0;
          for (let index = 0; index < responseMe.data.length; index += 1) {
            const m = responseMe.data[index];
            measures.push(m);
            measureOp.value.push(m.name);
          }
          axios
            .get(`${host}/services/genprice/MaterialCategory`).then((responseC) => {
              categories.length = 0;
              categoryOp.value.length = 0;
              for (let index = 0; index < responseC.data.length; index += 1) {
                const m = responseC.data[index];
                categories.push(m);
                categoryOp.value.push(m.name);
              }
              rows.value.length = 0;
              axios
                .get(`${host}/services/genprice/Material`).then((responseM) => {
                  for (let index = 0; index < responseM.data.length; index += 1) {
                    const m = responseM.data[index];
                    rows.value.push({
                      id: m.id,
                      name: m.name,
                      status: m.status,
                      category: getProp(categories, m.category, 'name'),
                      categoryId: m.category,
                      cost: m.cost,
                      weight: m.weight,
                      measure: getProp(measures, m.measure, 'name'),
                      measureId: m.measure,
                      width: m.width,
                      height: m.height,
                      depth: m.depth,
                      descript: m.descript,
                      article: m.article,
                      uid_1C: m.uid_1C,
                    });
                  }
                  resetSelect();
                });
            });
        });
    }
    function createConfirmAction() {
      const query = {};
      query.name = inputName.value;
      query.article = inputArticle.value;
      query.cost = inputCost.value;
      query.weight = inputWeight.value;
      query.measure = getId(measures, 'name', measureOptions.value);
      query.status = 0;
      query.width = inputWidth.value;
      query.height = inputHeight.value;
      query.category = getId(categories, 'name', categoryOptions.value);
      query.descript = inputDescript.value;
      query.depth = inputDepth.value;
      query.current_catalog_nom_inductive = 0;
      query.current_catalog_nom_resistive = 0;
      query.current_nom_inductive = 0;
      query.current_nom_resistive = 0;
      query.voltage = 0;
      query.uid_1C = inputUID.value;
      query.time_mount = 0;
      query.time_metalwork = 0;
      query.time_commutation = 0;
      query.time_pack = 0;
      query.time_run_up = 0;
      axios.post(getQueryCreate(), query)
        .then((res) => {
          if (res.data.result === 'ok') {
            update();
            dialog.value = false;
          } else if (res.data.data === 'name must be unique') {
            de.value.setName('Ошибка');
            de.value.setText(`Наименование "${query.name}" уже существует в базе данных`);
            de.value.show();
          }
        });
    }
    function changeConfirmAction() {
      const query = {};
      query.name = inputName.value;
      query.article = inputArticle.value;
      query.cost = inputCost.value;
      query.weight = inputWeight.value;
      query.measure = getId(measures, 'name', measureOptions.value);
      query.width = inputWidth.value;
      query.height = inputHeight.value;
      query.category = getId(categories, 'name', categoryOptions.value);
      query.descript = inputDescript.value;
      query.status = status.value.id;
      query.depth = inputDepth.value;
      query.current_catalog_nom_inductive = 0;
      query.current_catalog_nom_resistive = 0;
      query.current_nom_inductive = 0;
      query.current_nom_resistive = 0;
      query.voltage = 0;
      query.uid_1C = inputUID.value;
      query.time_mount = 0;
      query.time_metalwork = 0;
      query.time_commutation = 0;
      query.time_pack = 0;
      query.time_run_up = 0;
      axios
        .post(`${getQueryUpdate()}/${selected.value[0].id}`, query)
        .then((res) => {
          if (res.data.result === 'ok') {
            update();
            dialog.value = false;
            resetSelect();
          } else if (res.data.data === 'name must be unique') {
            de.value.setName('Ошибка');
            de.value.setText(`Наименование "${query.name}" уже существует в базе данных`);
            de.value.show();
          }
        });
    }
    function deleteConfirmAction() {
      for (let index = 0; index < selected.value.length; index += 1) {
        const element = selected.value[index];
        axios.get(`${getQueryDelete()}/${element.id}`)
          .then((res) => {
            if (res.data.result === 'ok') {
              update();
              dc.value.hide();
            }
          });
      }
    }
    const op = [];
    for (let index = 0; index < columns.length; index += 1) {
      op.push(columns[index].label);
    }
    const filter = ref('');
    const filterOptions = ref(columns[0].label);
    function selectRow(event, row) {
      selected.value.length = 0;
      selected.value.push(row);
    }
    function getIndexColumnOfSelected(value) {
      let index = -1;
      columns.forEach((element) => {
        if (element.label === value) {
          index = columns.indexOf(element);
        }
      });
      return index;
    }
    function find(rows_, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : '';
      return rows_.filter((row) => [cols[getIndexColumnOfSelected(filterOptions.value)]].some(
        (col) => ((`${cellValue(col, row)}`).toLowerCase().indexOf(lowerTerms) !== -1),
      ));
    }
    onMounted(() => {
      update();
    });
    return {
      action,
      isValidationConfirm,
      de,
      dc,
      categoryOp,
      measureOp,
      categoryOptions,
      measureOptions,
      DialogError,
      DialogConfirm,
      dialog,
      dialogName,
      createAction,
      changeAction,
      deleteAction,
      inputName,
      inputArticle,
      inputUID,
      validationName,
      createInputRealValueRules: [
        (val) => (val >= 0) || 'Введите корректное значение',
      ],
      inputDescript,
      inputCost,
      inputWeight,
      inputWidth,
      inputHeight,
      inputDepth,
      createConfirmAction,
      deleteConfirmAction,
      changeConfirmAction,
      getStatusData,
      selectRow,
      op,
      filterOptions,
      find,
      filter,
      rows,
      columns,
      status,
      statusOp,
      pagination: ref({
        rowsPerPage: 0,
      }),
      getColor(params) {
        return (params === 0) ? 'grey-8' : 'red';
      },
      selected,
      help,
      getSelectedString() {
        return selected.value.length === 0 ? `Всего объектов: ${rows.value.length}` : `Объектов выбрано: ${selected.value.length} из ${rows.value.length}`;
      },
    };
  },
});
</script>
<style>
p {
  text-indent: 20px;
  /* Отступ первой строки в пикселах */
}

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
</style>
