<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-page class="full-width" style="margin: 0px; background-color: rgb(60, 60, 60);">
      <div class="row" v-show="load">
        <div class="col-6">
          <q-card class="text-white" style="margin: 10px;">
            <q-card-section style="background-color: rgb(80, 80, 80);">
              <div class="text-h6">Щит управление</div>
            </q-card-section>
            <q-card-section class="row text-white" style="background-color: rgb(60, 60, 60);">
              <div class="col-4">
                <div class="flex column items-center" v-if="on == false">
                  <q-icon name="info" color="white" size="100px" />
                  <div>Дежурный</div>
                </div>
                <div class="flex column items-center" v-if="on">
                  <q-icon name="emoji_objects" color="green" size="100px" />
                  <div>В работе</div>
                </div>
              </div>
              <div class="col-4" v-if="alarm">
                <div class="flex column items-center">
                  <div>
                    <q-icon name="warning" color="red" size="100px" />
                  </div>
                  <div>Авария</div>
                </div>
              </div>
              <div class="col-4" v-if="filter">
                <div class="flex column items-center">
                  <div>
                    <q-icon name="warning" color="yellow" size="100px" />
                  </div>
                  <div>Фильтр</div>
                </div>
              </div>
            </q-card-section>
            <q-card-actions class="row" style="background-color: rgb(80, 80, 80);">
              <q-space />
              <q-btn color="green" label="Пуск / Стоп" @click="onof" :disable="onofLock" />
            </q-card-actions>
          </q-card>
        </div>
        <div class="col-6">
          <q-card class="text-white" style="margin: 10px;">
            <q-card-section style="background-color: rgb(80, 80, 80);">
              <div class="text-h6">Силовой щит</div>
            </q-card-section>
            <q-card-section class="row text-white" style="background-color: rgb(60, 60, 60);">
              <div class="col-4">
                <div class="flex column items-center" v-if="onforce == false">
                  <q-icon name="info" color="white" size="100px" />
                  <div>Дежурный</div>
                </div>
                <div class="flex column items-center" v-if="onforce">
                  <q-icon name="emoji_objects" color="green" size="100px" />
                  <div>В работе</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div v-show="load">
        <q-card class="text-white" style="margin: 10px;">
          <q-card-section style="background-color: rgb(80, 80, 80);">
            <div class="text-h6">Настройка режима</div>
          </q-card-section>
          <q-card-section style="background-color: rgb(60, 60, 60);">
            <div class="row fit">
              <q-card-section class="col-6">
                <q-form class="q-gutter-sm">
                  <q-select v-model="mode" transition-show="flip-up" transition-hide="flip-down" color="grey"
                    label-color="grey" popup-content-style="background-color: rgb(60, 60, 60); color:  white;" outlined
                    :options="optionsMode" label="Режим" @update:model-value="acceptParameters">
                    <template v-slot:selected>
                      <div class="text-white">
                        {{ mode }}
                      </div>
                    </template>
                  </q-select>
                  <q-input ref="compWidth" v-model="width" type="number" label="Ширина воздуховода, мм" lazy-rules
                    :rules="[val => (val && val > 0) && (+val < 1000) || 'Введите корректные данные']" color="white"
                    @focus="focus_width = true" @blur="acceptParameters" input-class="text-h6 text-white" outlined
                    label-color="grey" @keydown.enter.prevent="acceptParameters" />
                  <q-input ref="compHeight" v-model="height" type="number" label="Высота воздуховода, мм" lazy-rules
                    :rules="[val => (val && val > 0) && (+val < 1000) || 'Введите корректные данные']" color="white"
                    @focus="focus_height = true" @blur="acceptParameters" @keydown.enter.prevent="acceptParameters"
                    input-class="text-h6 text-white" outlined label-color="grey" />
                  <q-input ref="compAirV" v-model="airV" type="number"
                    label="Уставка номинала расхода водуха (вытяжка), м3/ч" lazy-rules
                    :rules="[val => (val && val > 0) && (+val < 10000) || 'Введите корректные данные']"
                    @focus="focus_airV = true" @blur="acceptParameters" @keydown.enter.prevent="acceptParameters"
                    color="white" input-class="text-h6 text-white" outlined label-color="grey" />
                  <q-input v-model="airP" type="number" label="Уставка номинала расхода водуха (приток)" readonly
                    color="white" input-class="text-h6 text-white" outlined label-color="grey" />
                </q-form>
              </q-card-section>
              <q-card-section class="col-6">
                <div class="text-h8 text-grey">
                  Текущее сечение:
                </div>
                <div class="text-h6 text-white">
                  {{ currentS }}
                </div>
                <div class="text-h8 text-grey">
                  Уставка массового расхода:
                </div>
                <div class="text-h6 text-white">
                  {{ setMass }}
                </div>
                <div class="text-h8 text-grey">
                  Уставка влагосодержания:
                </div>
                <div class="text-h6 text-white">
                  {{ Hc_21_Pr }}
                </div>
                <div class="text-h8 text-grey">
                  УстВлТерм Приток, °С:
                </div>
                <div class="text-h6 text-white">
                  {{ TwT_21 }}
                </div>
                <div class="text-h8 text-grey">
                  Уставка влагосодержания Вытяжка, г/кг:
                </div>
                <div class="text-h6 text-white">
                  {{ Hc_11_Vyt }}
                </div>
                <div class="text-h8 text-grey">
                  УстВлТерм Вытяжка, °С:
                </div>
                <div class="text-h6 text-white">
                  {{ TwT_11 }}
                </div>
              </q-card-section>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div v-show="load">
        <q-card class="bg-secondary text-white" style="margin: 10px;">
          <q-card-section style="background-color: rgb(80, 80, 80);">
            <div class="text-h6">Параметры выбранного режима</div>
          </q-card-section>

          <q-card-section class="row text-white" style="background-color: rgb(60, 60, 60);">
            <q-card-section class="col-4" style="background-color: rgb(60, 60, 60);">
              <q-input ref="comp_stendPritokTemp" v-model="stendPritokTemp" type="number"
                label="Стенд Приток температура" color="white" input-class="text-h6 text-white" outlined
                label-color="grey" :rules="[val => (val >= -50) && (+val <= 100) || 'Введите корректные данные']" @focus="focus_stendPritokTemp = true" @blur="accept"
                @keydown.enter.prevent="accept" />
              <q-input ref="comp_stendPritokHum" v-model="stendPritokHum" type="number" label="Стенд Приток влажность"
                color="white" input-class="text-h6 text-white" outlined label-color="grey"
                :rules="[val => (val >= 0) && (+val <= 100) || 'Введите корректные данные']"
                @focus="focus_stendPritokHum = true" @blur="accept" @keydown.enter.prevent="accept" />
              <q-input ref="comp_stendVytTemp" v-model="stendVytTemp" type="number" label="Стенд Вытяжка температура"
                color="white" input-class="text-h6 text-white" outlined label-color="grey"
                :rules="[val => (val >= -50) && (+val <= 100) || 'Введите корректные данные']"
                @focus="focus_stendVytTemp = true" @blur="accept" @keydown.enter.prevent="accept" />
              <q-input ref="comp_stendVytHum" v-model="stendVytHum" type="number" label="Стенд Вытяжка влажность"
                color="white" input-class="text-h6 text-white" outlined label-color="grey"
                :rules="[val => (val >= 0) && (+val <= 100) || 'Введите корректные данные']"
                @focus="focus_stendVytHum = true" @blur="accept" @keydown.enter.prevent="accept" />
            </q-card-section>
            <q-card-section class="col-4" style="background-color: rgb(60, 60, 60);">
              <q-input ref="comp_setSmeshPritok1" v-model="setSmeshPritok1" type="number" label="Уст Смешение Приток 1"
                color="white" input-class="text-h6 text-white" outlined label-color="grey"
                :rules="[val => (val >= -50) && (+val <= 100) || 'Введите корректные данные']"
                @focus="focus_setSmeshPritok1 = true" @blur="accept" @keydown.enter.prevent="accept" />
              <q-input ref="comp_setM3Pritok1" v-model="setM3Pritok1" type="number" label="Уст м3 Приток1"
                color="white" input-class="text-h6 text-white" outlined label-color="grey"
                :rules="[val => (val >= 0) && (+val <= 10000) || 'Введите корректные данные']"
                @focus="focus_setM3Pritok1 = true" @blur="accept" @keydown.enter.prevent="accept" />
              <q-input ref="comp_setTOutPritok1" v-model="setTOutPritok1" type="number" label="Уст Т выход Приток1*"
                color="white" input-class="text-h6 text-white" outlined label-color="grey"
                :rules="[val => (val >= -50) && (+val <= 100) || 'Введите корректные данные']"
                @focus="focus_setTOutPritok1 = true" @blur="accept" @keydown.enter.prevent="accept">
                <template v-slot:hint>
                  <div class="text-grey">
                    *При совместной работе Приток1 и Приток2
                  </div>
                </template>
              </q-input>
              <q-input ref="comp_setSmeshVyt" v-model="setSmeshVyt" type="number" label="Уст смешение Вытяжка"
                color="white" input-class="text-h6 text-white" outlined label-color="grey"
                :rules="[val => (val >= -50) && (+val <= 100) || 'Введите корректные данные']"
                @focus="focus_setSmeshVyt = true" @blur="accept" @keydown.enter.prevent="accept" />
              <q-input ref="comp_setM3Vyt" v-model="setM3Vyt" type="number" label="Уст м3 Вытяжка"
                color="white" input-class="text-h6 text-white" outlined label-color="grey"
                :rules="[val => (val >= 0) && (+val <= 10000) || 'Введите корректные данные']"
                @focus="focus_setM3Vyt = true" @blur="accept" @keydown.enter.prevent="accept" />
              <q-input ref="comp_setSmeshPritok2" v-model="setSmeshPritok2" type="number" label="Уст смешение Приток 2"
                color="white" input-class="text-h6 text-white" outlined label-color="grey"
                :rules="[val => (val >= -50) && (+val <= 100) || 'Введите корректные данные']"
                @focus="focus_setSmeshPritok2 = true" @blur="accept" @keydown.enter.prevent="accept" />
              <q-input ref="comp_setM3Pritok2" v-model="setM3Pritok2" type="number" label="Уст м3 Приток2"
                color="white" input-class="text-h6 text-white" outlined label-color="grey"
                :rules="[val => (val >= 0) && (+val <= 10000) || 'Введите корректные данные']"
                @focus="focus_setM3Pritok2 = true" @blur="accept" @keydown.enter.prevent="accept" />
            </q-card-section>
            <q-card-section class="col-4" style="background-color: rgb(60, 60, 60);">
              <q-card-section>
                <q-toggle v-model="autoParameter" class="full-width" label="АвтоПараметр"
                  @update:model-value="accept_autoParameter" />
                <q-toggle v-model="onPritok1" class="full-width" label="Система Приток1"
                  @update:model-value="accept_onPritok1" />
                <q-toggle v-model="smPritok1" class="full-width" label="Смешение Приток1"
                  @update:model-value="accept_smPritok1" />
                <q-toggle v-model="onHumPritok1" class="full-width" label="Увлажнение Приток1"
                  @update:model-value="accept_onHumPritok1" />
                <q-toggle v-model="onVyt" class="full-width" label="Система Вытяжка"
                  @update:model-value="accept_onVyt" />
                <q-toggle v-model="smVyt" class="full-width" label="Смешение Вытяжка"
                  @update:model-value="accept_smVyt" />
                <q-toggle v-model="onHumVyt" class="full-width" label="Увлажнение Вытяжка"
                  @update:model-value="accept_onHumVyt" />
                <q-toggle v-model="onPritok2" class="full-width" label="Ситема Приток2"
                  @update:model-value="accept_onPritok2" />
              </q-card-section>
              <q-card-section>
                <q-input ref="comp_resetRecieverPritok1" v-model="resetRecieverPritok1" type="number" color="white"
                  input-class="text-h6 text-white" outlined label-color="grey" label="Сброс ресивера Приток (закрытие)"
                   :rules="[val => (val >= 0) && (+val <= 10000) || 'Введите корректные данные']"
                  @focus="focus_resetRecieverPritok1 = true" @blur="accept" @keydown.enter.prevent="accept" />
                <q-input ref="comp_resetRecieverPritokVyt" v-model="resetRecieverPritokVyt" type="number" color="white"
                  input-class="text-h6 text-white" outlined label-color="grey" label="Сброс ресивера Вытяжка (закрытие)"
                  :rules="[val => (val >= 0) && (+val <= 10000) || 'Введите корректные данные']"
                  @focus="focus_resetRecieverPritokVyt = true" @blur="accept" @keydown.enter.prevent="accept" />
              </q-card-section>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <!-- <ThingForm :colorField=colorField :radioCheck=radioCheck style="margin: 10px;" /> -->
      <q-inner-loading :showing="load === false" color="white" label-class="text-white"
        label="Получение данных с щита управления" label-style="font-size: 1.1em" />
    </q-page>

  </div>

</template>

<script>
import {
  ref, inject, onMounted, onBeforeUnmount,
} from 'vue';

export default {
  name: 'MainRecup',
  setup() {
    document.title = 'Установки';
    const load = ref(false);
    // управление
    const on = ref(false);
    // блокировка кнопки пуск (блокировка включается ровно до следующего пакета данных)
    const onofLock = ref(false);
    const onforce = ref(false);
    const alarm = ref(false);
    const filter = ref(false);
    // свободный режим
    const autoParameter = ref(false);
    const onPritok1 = ref(false);
    const smPritok1 = ref(false);
    const onHumPritok1 = ref(false);
    const onVyt = ref(false);
    const smVyt = ref(false);
    const onHumVyt = ref(false);
    const onPritok2 = ref(false);

    const stendPritokTemp = ref(0);
    const focus_stendPritokTemp = ref(false);
    const comp_stendPritokTemp = ref(null);

    const stendPritokHum = ref(0);
    const focus_stendPritokHum = ref(false);
    const comp_stendPritokHum = ref(null);

    const stendVytTemp = ref(0);
    const focus_stendVytTemp = ref(false);
    const comp_stendVytTemp = ref(null);

    const stendVytHum = ref(0);
    const focus_stendVytHum = ref(false);
    const comp_stendVytHum = ref(null);

    const setSmeshPritok1 = ref(0);
    const focus_setSmeshPritok1 = ref(false);
    const comp_setSmeshPritok1 = ref(null);

    const setM3Pritok1 = ref(0);
    const focus_setM3Pritok1 = ref(false);
    const comp_setM3Pritok1 = ref(null);

    const setTOutPritok1 = ref(0);
    const focus_setTOutPritok1 = ref(false);
    const comp_setTOutPritok1 = ref(null);

    const setSmeshVyt = ref(0);
    const focus_setSmeshVyt = ref(false);
    const comp_setSmeshVyt = ref(null);

    const setM3Vyt = ref(0);
    const focus_setM3Vyt = ref(false);
    const comp_setM3Vyt = ref(null);

    const setSmeshPritok2 = ref(0);
    const focus_setSmeshPritok2 = ref(false);
    const comp_setSmeshPritok2 = ref(null);

    const setM3Pritok2 = ref(0);
    const focus_setM3Pritok2 = ref(false);
    const comp_setM3Pritok2 = ref(null);

    const resetRecieverPritok1 = ref(0);
    const focus_resetRecieverPritok1 = ref(false);
    const comp_resetRecieverPritok1 = ref(null);

    const resetRecieverPritokVyt = ref(0);
    const focus_resetRecieverPritokVyt = ref(false);
    const comp_resetRecieverPritokVyt = ref(null);

    // const optionsSeason = ['Лето', 'Зима'];
    const optionsMode = ['Вытяжка 25°С/<30%, Приток 5°С/~%', 'Вытяжка 20°С/50%, Приток 20°С/50%', 'Вытяжка 22°С/45%, Приток -5°С/~%',
      'Вытяжка 25°С/50%, Приток 5°С/70%', 'Вытяжка 25°С/60%, Приток -3°С/90%', 'Вытяжка 25°С/50%, Приток 35°С/40%', 'Вытяжка 25°С/50%, Приток 35°С/50%', 'Свободный'];
    const airP = ref(0);
    const airV = ref(3000);
    const focus_airV = ref(false);
    const compAirV = ref(null);
    const width = ref(700);
    const focus_width = ref(false);
    const compWidth = ref(null);
    const height = ref(400);
    const focus_height = ref(false);
    const compHeight = ref(null);
    const mode = ref(optionsMode[0]);

    // данные в разделе Параметры
    const currentS = ref(0);
    const setMassAir = ref(0);
    const setHum = ref(0);
    const setHumTermometerPritok = ref(0);

    const setMass = ref(0);
    const Hc_21_Pr = ref(0);
    const TwT_21 = ref(0);
    const Hc_11_Vyt = ref(0);
    const TwT_11 = ref(0);

    let a1 = [];
    let a2 = [];
    let a3 = [];
    const {
      WebSocket_Create, WebSocket_Listen, WebSocket_Close, WebSocket_Send, getCurrentTime, validationNumber, convertToBinary,
    } = inject('store');
    function listen(json) {
      const mes = json.message;
      if (json.id === 2) {
        if (json.type === 'sendDataRecup') {
          console.log(mes);
        } else if (json.type === 'sendAirDevices') {
          console.log(mes);
          if (mes.rabota.value === 'СТОП') {
            on.value = false;
          } else if (mes.rabota.value === 'Работа') {
            on.value = true;
          }
          if (mes.workbox.value === 'СТОП') {
            onforce.value = false;
          } else if (mes.workbox.value === 'Работа') {
            onforce.value = true;
          }
          a1 = convertToBinary(mes.IntCodeAlarms1.value).split('');
          while (a1.length < 16) {
            a1.unshift(Number(0));
          }
          a1.reverse();
          a2 = convertToBinary(mes.IntCodeAlarms2.value).split('');
          while (a2.length < 16) {
            a2.unshift(Number(0));
          }
          a2.reverse();
          a3 = convertToBinary(mes.IntCodeAlarms3.value).split('');
          while (a3.length < 16) {
            a3.unshift(Number(0));
          }
          a3.reverse();
          // отображение аварий IntCodeAlarms1:
          // 0 "Термостат ЕК1",
          // 1 "Термостат ЕК2",
          // 2 "Термостат ЕК3",
          // 3 "Термостат ЕК4",
          // 4 "Термостат ЕК5",
          // 5 "Термостат ЕК6",
          // 6 "ВоКал термостат Приток 1",
          // 7 "ВоКал термостат Вытяжка",
          // 8 "Авария ЦН Приток 1",
          // 9 "Авария ЦНВытяжка",
          //  10 "Резерв",
          // 11 "Обрыв датчика на Матрикс А4",
          // 12 "Обрыв связи вент Вытяжка",
          // 13 "Обрыв связи вент Приток",
          // 14 "Обрыв связи удал вент Приток",
          // 15 "Обрыв связи удал вент Вытяжка"
          // отображение аварий IntCodeAlarms2:
          // 0 "Перегрев М5",
          // 1 "Перегрев М9",
          // 2 "Перегрев М20",
          // 3 "Перегрев М13",
          // 4 "Перегрев М25",
          // 5 "Потеря фазы М20",
          // 6 "Потеря фазы М9",
          // 7 "Потеря фазы М13",
          // 8 "Потеря фазы М25",
          // 9 "Ошибка вентилятора М20",
          // 10 "Ошибка вентилятора М9",
          // 11 "Ошибка вентилятора М13",
          // 12 "Ошибка вентилятора М25",
          // 13 "Занос фильтра Приток 1",
          // 14 "Занос фильтра Вытяжка",
          // 15 "Занос фильтра Приток 2"
          //  отображение аварий IntCodeAlarms3:
          // 0 "FMR A2(управление)",
          // 1 "FMR A3(управление)",
          // 2 "FMR A1(силовой)",
          // 3 "MRL A2(силовой)",
          // 4 "MRL A3(силовой)",
          // 5 "MRL A4(силовой)",
          // 6 "MRL A5(силовой)",
          // 7 "Matrix A4(управление)",
          // 8 "Пожар",
          // 9 "СТОП ав.увл.Вытяжка",
          // 10 "СТОП ав.увл.Приток1",
          // 11 "Авария ККБ Приток",
          // 12 "Авария ККБ Вытяжка",
          // 13 "Заморозка входов Матрикс_А1",
          // 14 "Заморозка входов Матрикс_А4",
          // 15 "Резерв"
          if (Number(a1[0]) === 1 || Number(a1[1]) === 1
            || Number(a1[2]) === 1 || Number(a1[3]) === 1
            || Number(a1[4]) === 1 || Number(a1[5]) === 1
            || Number(a1[6]) === 1 || Number(a1[7]) === 1
            || Number(a1[8]) === 1 || Number(a1[9]) === 1
            || Number(a1[11]) === 1 || Number(a1[12]) === 1
            || Number(a1[13]) === 1 || Number(a1[14]) === 1
            || Number(a1[15]) === 1 || Number(a2[0]) === 1
            || Number(a2[1]) === 1 || Number(a2[2]) === 1
            || Number(a2[3]) === 1 || Number(a2[4]) === 1
            || Number(a2[5]) === 1 || Number(a2[6]) === 1
            || Number(a2[7]) === 1 || Number(a2[8]) === 1
            || Number(a2[9]) === 1 || Number(a2[10]) === 1
            || Number(a2[11]) === 1 || Number(a2[12]) === 1
            || Number(a2[14]) === 1 || Number(a2[15]) === 1
            || Number(a3[0]) === 1 || Number(a3[1]) === 1
            || Number(a3[2]) === 1 || Number(a3[3]) === 1
            || Number(a3[4]) === 1 || Number(a3[5]) === 1
            || Number(a3[6]) === 1 || Number(a3[7]) === 1
            || Number(a3[8]) === 1 || Number(a3[9]) === 1
            || Number(a3[10]) === 1 || Number(a3[11]) === 1
            || Number(a3[12]) === 1 || Number(a3[13]) === 1
            || Number(a3[14]) === 1
          ) {
            alarm.value = true;
          }
          if (Number(a2[13]) === 1 || Number(a2[14]) === 1 || Number(a2[15]) === 1) {
            filter.value = true;
          }
          const mesMode = optionsMode[mes.mode.value];
          mode.value = mesMode;
          airP.value = mes.m3h_21_UdalPr.setpoint;

          if (!focus_airV.value) {
            airV.value = mes.m3h_11_UdalVyt.setpoint;
          }
          if (!focus_width.value) {
            width.value = mes.W.value;
          }
          if (!focus_height.value) {
            height.value = mes.L.value;
          }

          if (!focus_resetRecieverPritokVyt.value) {
            resetRecieverPritokVyt.value = mes.exRecieverVyt.setpoint;
          }
          if (!focus_resetRecieverPritok1.value) {
            resetRecieverPritok1.value = mes.exRecieverPr.setpoint;
          }
          if (!focus_setM3Pritok2.value) {
            setM3Pritok2.value = mes.SCo_m3h_pr2.setpoint;
          }
          if (!focus_setSmeshPritok2.value) {
            setSmeshPritok2.value = mes.SCo_t_smesh_pr2.setpoint;
          }
          if (!focus_setM3Vyt.value) {
            setM3Vyt.value = mes.SCo_m3h_vyt.setpoint;
          }
          if (!focus_setSmeshVyt.value) {
            setSmeshVyt.value = mes.SCo_t_smesh_vyt.setpoint;
          }
          if (!focus_setTOutPritok1.value) {
            setTOutPritok1.value = mes.setToutPr1.setpoint;
          }
          if (!focus_setM3Pritok1.value) {
            setM3Pritok1.value = Number(mes.SCo_m3h_pr1.setpoint);
          }
          if (!focus_setSmeshPritok1.value) {
            setSmeshPritok1.value = mes.SCo_t_smesh_pr1.setpoint;
          }
          if (!focus_stendVytHum.value) {
            stendVytHum.value = mes.Rh_11_Vyt.setpoint;
          }
          if (!focus_stendVytTemp.value) {
            stendVytTemp.value = mes.T_11_Vyt.setpoint;
          }
          if (!focus_stendPritokHum.value) {
            stendPritokHum.value = mes.Rh_21_Pr.setpoint;
          }
          if (!focus_stendPritokTemp.value) {
            stendPritokTemp.value = mes.T_21_Pr.setpoint;
          }

          onPritok1.value = mes.CodeSets.value[0] === 1;
          smPritok1.value = mes.CodeSets.value[1] === 1;
          onHumPritok1.value = mes.CodeSets.value[2] === 1;
          onVyt.value = mes.CodeSets.value[3] === 1;
          smVyt.value = mes.CodeSets.value[4] === 1;
          onHumVyt.value = mes.CodeSets.value[5] === 1;
          onPritok2.value = mes.CodeSets.value[6] === 1;
          autoParameter.value = mes.CodeSets.value[13] === 1;
          setMass.value = mes.setMass.setpoint;
          Hc_21_Pr.value = mes.Hc_21_Pr.setpoint;
          TwT_21.value = mes.TwT_21.setpoint;
          Hc_11_Vyt.value = mes.Hc_11_Vyt.setpoint;
          TwT_11.value = mes.TwT_11.setpoint;

          currentS.value = mes.currentS.value;

          // разблокировка органов управления
          load.value = true;
          onofLock.value = false;
        }
      }
    }
    function acceptParameters() {
      const value = {
        airV: Number(airV.value),
        mode: optionsMode.indexOf(mode.value),
        width: Number(width.value),
        height: Number(height.value),
      };
      WebSocket_Send('recup', {
        id: 2, type: 'acceptParameters', value, timestamp: getCurrentTime(),
      });
      focus_airV.value = false;
      focus_width.value = false;
      focus_height.value = false;
      compWidth.value.blur();
      compHeight.value.blur();
      compAirV.value.blur();
    }
    function onof() {
      WebSocket_Send('recup', {
        id: 2, type: 'onof', value: true, timestamp: getCurrentTime(),
      });
    }

    function accept_autoParameter() {
      WebSocket_Send('recup', {
        id: 2, type: 'autoParameter', value: autoParameter.value, timestamp: getCurrentTime(),
      });
    }
    function accept_onPritok1() {
      WebSocket_Send('recup', {
        id: 2, type: 'onPritok1', value: onPritok1.value, timestamp: getCurrentTime(),
      });
    }
    function accept_smPritok1() {
      WebSocket_Send('recup', {
        id: 2, type: 'smPritok1', value: smPritok1.value, timestamp: getCurrentTime(),
      });
    }
    function accept_onHumPritok1() {
      WebSocket_Send('recup', {
        id: 2, type: 'onHumPritok1', value: onHumPritok1.value, timestamp: getCurrentTime(),
      });
    }
    function accept_onVyt() {
      WebSocket_Send('recup', {
        id: 2, type: 'onVyt', value: onVyt.value, timestamp: getCurrentTime(),
      });
    }
    function accept_smVyt() {
      WebSocket_Send('recup', {
        id: 2, type: 'smVyt', value: smVyt.value, timestamp: getCurrentTime(),
      });
    }
    function accept_onHumVyt() {
      WebSocket_Send('recup', {
        id: 2, type: 'onHumVyt', value: onHumVyt.value, timestamp: getCurrentTime(),
      });
    }
    function accept_onPritok2() {
      WebSocket_Send('recup', {
        id: 2, type: 'onPritok2', value: onPritok2.value, timestamp: getCurrentTime(),
      });
    }
    function accept() {
      if (comp_stendPritokTemp.value.validate()
        && comp_stendPritokHum.value.validate()
        && comp_stendVytTemp.value.validate()
        && comp_stendVytHum.value.validate()
        && comp_setSmeshPritok1.value.validate()
        && comp_stendPritokTemp.value.validate()
        && comp_setM3Pritok1.value.validate()
        && comp_setSmeshVyt.value.validate()
        && comp_setM3Vyt.value.validate()
        && comp_setSmeshPritok2.value.validate()
        && comp_setM3Pritok2.value.validate()
        && comp_resetRecieverPritok1.value.validate()
        && comp_resetRecieverPritokVyt.value.validate()
      ) {
        const value = {
          stendPritokTemp: Number(stendPritokTemp.value),
          stendPritokHum: Number(stendPritokHum.value),
          stendVytTemp: Number(stendVytTemp.value),
          stendVytHum: Number(stendVytHum.value),
          setSmeshPritok1: Number(setSmeshPritok1.value),
          setM3Pritok1: Number(setM3Pritok1.value),
          setTOutPritok1: Number(setTOutPritok1.value),
          setSmeshVyt: Number(setSmeshVyt.value),
          setM3Vyt: Number(setM3Vyt.value),
          setSmeshPritok2: Number(setSmeshPritok2.value),
          setM3Pritok2: Number(setM3Pritok2.value),
          resetRecieverPritok1: Number(resetRecieverPritok1.value),
          resetRecieverPritokVyt: Number(resetRecieverPritokVyt.value),
        };
        WebSocket_Send('recup', {
          id: 2, type: 'acceptFreeMode', value, timestamp: getCurrentTime(),
        });
      }

      focus_stendPritokTemp.value = false;
      focus_stendPritokHum.value = false;
      focus_stendVytTemp.value = false;
      focus_stendVytHum.value = false;
      focus_setSmeshPritok1.value = false;
      focus_setM3Pritok1.value = false;
      focus_setTOutPritok1.value = false;
      focus_setSmeshVyt.value = false;
      focus_setM3Vyt.value = false;
      focus_setSmeshPritok2.value = false;
      focus_setM3Pritok2.value = false;
      focus_resetRecieverPritok1.value = false;
      focus_resetRecieverPritokVyt.value = false;

      comp_stendPritokTemp.value.blur();
      comp_stendPritokHum.value.blur();
      comp_stendVytTemp.value.blur();
      comp_stendVytHum.value.blur();
      comp_setSmeshPritok1.value.blur();
      comp_setM3Pritok1.value.blur();
      comp_setTOutPritok1.value.blur();
      comp_setSmeshVyt.value.blur();
      comp_setM3Vyt.value.blur();
      comp_setSmeshPritok2.value.blur();
      comp_setM3Pritok2.value.blur();
      comp_resetRecieverPritok1.value.blur();
      comp_resetRecieverPritokVyt.value.blur();
    }
    onMounted(() => {
      WebSocket_Create('recup', { getMain: 1 });
      WebSocket_Listen('recup', listen);
    });
    onBeforeUnmount(() => {
      WebSocket_Close('recup');
    });
    return {
      on,
      acceptParameters,
      stendPritokTemp,
      stendPritokHum,
      autoParameter,
      onPritok1,
      smPritok1,
      onHumPritok1,
      onVyt,
      smVyt,
      onHumVyt,
      onPritok2,
      accept,
      accept_onHumPritok1,
      accept_autoParameter,
      accept_onPritok1,
      accept_onPritok2,
      accept_onHumVyt,
      accept_smPritok1,
      accept_smVyt,
      accept_onVyt,
      stendVytTemp,
      stendVytHum,
      setSmeshPritok1,
      setM3Pritok1,
      setTOutPritok1,
      setSmeshVyt,
      setM3Vyt,
      setSmeshPritok2,
      setM3Pritok2,
      resetRecieverPritok1,
      resetRecieverPritokVyt,
      validationNumber,
      alarm,
      filter,
      onof,
      airP,
      airV,
      mode,
      optionsMode,
      // optionsSeason,
      currentS,
      setMassAir,
      setHum,
      setHumTermometerPritok,
      width,
      focus_width,
      compWidth,
      height,
      focus_height,
      compHeight,
      onforce,
      setMass,
      Hc_21_Pr,
      TwT_21,
      Hc_11_Vyt,
      TwT_11,
      onofLock,
      load,
      focus_airV,
      compAirV,

      focus_stendPritokTemp,
      comp_stendPritokTemp,

      focus_stendPritokHum,
      comp_stendPritokHum,

      focus_stendVytTemp,
      comp_stendVytTemp,

      focus_stendVytHum,
      comp_stendVytHum,

      focus_setSmeshPritok1,
      comp_setSmeshPritok1,

      focus_setM3Pritok1,
      comp_setM3Pritok1,

      focus_setTOutPritok1,
      comp_setTOutPritok1,

      focus_setSmeshVyt,
      comp_setSmeshVyt,

      focus_setM3Vyt,
      comp_setM3Vyt,

      focus_setSmeshPritok2,
      comp_setSmeshPritok2,

      focus_setM3Pritok2,
      comp_setM3Pritok2,

      focus_resetRecieverPritok1,
      comp_resetRecieverPritok1,

      focus_resetRecieverPritokVyt,
      comp_resetRecieverPritokVyt,
    };
  },
};
</script>
<style>

</style>
