<template >
  <q-page class="justify-center full-width" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Журнал аварий</div>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-4 text-white" style="padding: 10px;">
          <table style="width: 100%;">
            <div class="text-h6"></div>
            <q-tr>
              <q-th>Перечень аварий 1</q-th>
              <q-th>Авария</q-th>
            </q-tr>
            <q-tr>
              <q-td>Термостат ЕК1</q-td>
              <q-td :class="getcolor(AlarmStatus1[0])">{{ parsebool(AlarmStatus1[0]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Термостат ЕК2</q-td>
              <q-td :class="getcolor(AlarmStatus1[1])">{{ parsebool(AlarmStatus1[1]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Термостат ЕК3</q-td>
              <q-td :class="getcolor(AlarmStatus1[2])">{{ parsebool(AlarmStatus1[2]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Термостат ЕК4</q-td>
              <q-td :class="getcolor(AlarmStatus1[3])">{{ parsebool(AlarmStatus1[3]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Термостат ЕК5</q-td>
              <q-td :class="getcolor(AlarmStatus1[4])">{{ parsebool(AlarmStatus1[4]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Термостат ЕК6</q-td>
              <q-td :class="getcolor(AlarmStatus1[5])">{{ parsebool(AlarmStatus1[5]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>ВоКал термостат Приток 1</q-td>
              <q-td :class="getcolor(AlarmStatus1[6])">{{ parsebool(AlarmStatus1[6]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>ВоКал термостат Вытяжка</q-td>
              <q-td :class="getcolor(AlarmStatus1[7])">{{ parsebool(AlarmStatus1[7]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Авария ЦН Приток 1</q-td>
              <q-td :class="getcolor(AlarmStatus1[8])">{{ parsebool(AlarmStatus1[8]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Авария ЦНВытяжка</q-td>
              <q-td :class="getcolor(AlarmStatus1[9])">{{ parsebool(AlarmStatus1[9]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Резерв</q-td>
              <q-td :class="getcolor(AlarmStatus1[10])">{{ parsebool(AlarmStatus1[10]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Обрыв датчика на Матрикс А4</q-td>
              <q-td :class="getcolor(AlarmStatus1[11])">{{ parsebool(AlarmStatus1[11]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Обрыв связи вент Вытяжка</q-td>
              <q-td :class="getcolor(AlarmStatus1[12])">{{ parsebool(AlarmStatus1[12]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Обрыв связи вент Приток</q-td>
              <q-td :class="getcolor(AlarmStatus1[13])">{{ parsebool(AlarmStatus1[13]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Обрыв связи удал вент Приток</q-td>
              <q-td :class="getcolor(AlarmStatus1[14])">{{ parsebool(AlarmStatus1[14]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Обрыв связи удал вент Вытяжка</q-td>
              <q-td :class="getcolor(AlarmStatus1[15])">{{ parsebool(AlarmStatus1[15]) }}</q-td>
            </q-tr>
          </table>
        </div>
        <div class="col-4 text-white" style="padding: 10px;">
          <table style="width: 100%;">
            <div class="text-h6"></div>
            <q-tr>
              <q-th>Перечень аварий 2</q-th>
              <q-th>Авария</q-th>
            </q-tr>
            <q-tr>
              <q-td>Перегрев М5</q-td>
              <q-td :class="getcolor(AlarmStatus2[0])">{{ parsebool(AlarmStatus2[0]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Перегрев М9</q-td>
              <q-td :class="getcolor(AlarmStatus2[1])">{{ parsebool(AlarmStatus2[1]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Перегрев М20</q-td>
              <q-td :class="getcolor(AlarmStatus2[2])">{{ parsebool(AlarmStatus2[2]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Перегрев М13</q-td>
              <q-td :class="getcolor(AlarmStatus2[3])">{{ parsebool(AlarmStatus2[3]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Перегрев М25</q-td>
              <q-td :class="getcolor(AlarmStatus2[4])">{{ parsebool(AlarmStatus2[4]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Потеря фазы М20</q-td>
              <q-td :class="getcolor(AlarmStatus2[5])">{{ parsebool(AlarmStatus2[5]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Потеря фазы М9</q-td>
              <q-td :class="getcolor(AlarmStatus2[6])">{{ parsebool(AlarmStatus2[6]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Потеря фазы М13</q-td>
              <q-td :class="getcolor(AlarmStatus2[7])">{{ parsebool(AlarmStatus2[7]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Потеря фазы М25</q-td>
              <q-td :class="getcolor(AlarmStatus2[8])">{{ parsebool(AlarmStatus2[8]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Ошибка вентилятора М20</q-td>
              <q-td :class="getcolor(AlarmStatus2[9])">{{ parsebool(AlarmStatus2[9]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Ошибка вентилятора М9</q-td>
              <q-td :class="getcolor(AlarmStatus2[10])">{{ parsebool(AlarmStatus2[10]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Ошибка вентилятора М13</q-td>
              <q-td :class="getcolor(AlarmStatus2[11])">{{ parsebool(AlarmStatus2[11]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Ошибка вентилятора М25</q-td>
              <q-td :class="getcolor(AlarmStatus2[12])">{{ parsebool(AlarmStatus2[12]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Занос фильтра Приток 1</q-td>
              <q-td :class="getcolor(AlarmStatus2[13])">{{ parsebool(AlarmStatus2[13]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Занос фильтра Вытяжка</q-td>
              <q-td :class="getcolor(AlarmStatus2[14])">{{ parsebool(AlarmStatus2[14]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Занос фильтра Приток 2</q-td>
              <q-td :class="getcolor(AlarmStatus2[15])">{{ parsebool(AlarmStatus2[15]) }}</q-td>
            </q-tr>
          </table>
        </div>
        <div class="col-4 text-white" style="padding: 10px;">
          <table style="width: 100%;">
            <div class="text-h6"></div>
            <q-tr>
              <q-th>Перечень аварий 3</q-th>
              <q-th>Авария</q-th>
            </q-tr>
            <q-tr>
              <q-td>FMR A2(управление)</q-td>
              <q-td :class="getcolor(AlarmStatus3[0])">{{ parsebool(AlarmStatus3[0]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>FMR A3(управление)</q-td>
              <q-td :class="getcolor(AlarmStatus3[1])">{{ parsebool(AlarmStatus3[1]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>FMR A1(силовой)</q-td>
              <q-td :class="getcolor(AlarmStatus3[2])">{{ parsebool(AlarmStatus3[2]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>MRL A2(силовой)</q-td>
              <q-td :class="getcolor(AlarmStatus3[3])">{{ parsebool(AlarmStatus3[3]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>MRL A3(силовой)</q-td>
              <q-td :class="getcolor(AlarmStatus3[4])">{{ parsebool(AlarmStatus3[4]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>MRL A4(силовой)</q-td>
              <q-td :class="getcolor(AlarmStatus3[5])">{{ parsebool(AlarmStatus3[5]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>MRL A5(силовой)</q-td>
              <q-td :class="getcolor(AlarmStatus3[6])">{{ parsebool(AlarmStatus3[6]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Matrix A4(управление)</q-td>
              <q-td :class="getcolor(AlarmStatus3[7])">{{ parsebool(AlarmStatus3[7]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Пожар</q-td>
              <q-td :class="getcolor(AlarmStatus3[8])">{{ parsebool(AlarmStatus3[8]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>СТОП ав.увл.Вытяжка</q-td>
              <q-td :class="getcolor(AlarmStatus3[9])">{{ parsebool(AlarmStatus3[9]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>СТОП ав.увл.Приток1</q-td>
              <q-td :class="getcolor(AlarmStatus3[10])">{{ parsebool(AlarmStatus3[10]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Авария ККБ Приток</q-td>
              <q-td :class="getcolor(AlarmStatus3[11])">{{ parsebool(AlarmStatus3[11]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Авария ККБ Вытяжка</q-td>
              <q-td :class="getcolor(AlarmStatus3[12])">{{ parsebool(AlarmStatus3[12]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Заморозка входов Матрикс_А1</q-td>
              <q-td :class="getcolor(AlarmStatus3[13])">{{ parsebool(AlarmStatus3[13]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Заморозка входов Матрикс_А4</q-td>
              <q-td :class="getcolor(AlarmStatus3[14])">{{ parsebool(AlarmStatus3[14]) }}</q-td>
            </q-tr>
            <q-tr>
              <q-td>Резерв</q-td>
              <q-td :class="getcolor(AlarmStatus3[15])">{{ parsebool(AlarmStatus3[15]) }}</q-td>
            </q-tr>
          </table>
        </div>
      </div>
      <div class="row">
        <q-btn color="teal" label="Сброс" v-show="!load" @click="enterPassword(reset)" />
      </div>
      <q-inner-loading :showing="load" color="white" label-class="text-white" style="height: 60vh;"
        label-style="font-size: 1.1em" />
    </q-card-section>
    <q-dialog v-model="changeDialog" ref="comp_inputPassword" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section style="background-color: rgb(80, 80, 80);">
          <div class="text-h6 text-white">Авторизованный доступ</div>
        </q-card-section>
        <q-card-section class="row text-white" style="background-color: rgb(60, 60, 60);">
          <q-card-section class="col-6">
            Для внесения изменений в работу установки введите сервисный пароль:
          </q-card-section>
          <q-card-section class="col-6 q-pt-none">
            <q-input ref="comp_inputPassword" v-model="inputPassword" clearable dark type="password" label="Пароль"
              @clear="inputPassword = ''" color="white" input-class="text-h6 text-white" outlined label-color="grey" />
          </q-card-section>
        </q-card-section>
        <q-card-actions align="right" style="background-color: rgb(80, 80, 80);">
          <q-btn class="bg-teal text-white" label="Принять" @click="confirmPassword"
            :disable="inputPassword.length == 0" />
          <q-btn ref="confirmPass" class="bg-teal text-white" label="Отмена" v-close-popup @click="cancelConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="errorPasswordDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Ошибка</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Неверный пароль
        </q-card-section>
        <q-card-actions align="right" class="bg-red text-white">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  inject, ref, onMounted, onBeforeUnmount,
} from 'vue';

export default {
  name: 'Calibration',
  setup() {
    document.title = 'Журнал аварий';
    const changeDialog = ref(false);
    const errorPasswordDialog = ref(false);
    let password = '';
    const inputPassword = ref(password);
    const comp_inputPassword = ref(null);
    const confirmPass = ref(null);
    const AlarmStatus1 = ref([]);
    const AlarmStatus2 = ref([]);
    const AlarmStatus3 = ref([]);
    const load = ref(true);
    const {
      WebSocket_Create, WebSocket_Listen, WebSocket_Close, WebSocket_Send, getCurrentTime, TRUE_PASSWORD,
    } = inject('store');

    function parsebool(value) {
      if (Number(value) === 1) return 'ДА';
      return 'НЕТ';
    }
    function getcolor(value) {
      if (Number(value) === 0) return 'text-green';
      return 'text-red';
    }
    function convertToBinary(number) {
      let num = number;
      let binary = (num % 2).toString();
      for (; num > 1;) {
        num = parseInt(num / 2, 10);
        binary = (num % 2) + (binary);
      }
      return binary;
    }
    function listen(json) {
      const mes = json.message;
      if (json.id === 2) {
        if (json.type === 'sendAirDevices') {
          AlarmStatus1.value = convertToBinary(mes.IntCodeAlarms1.value).split('');
          while (AlarmStatus1.value.length < 16) {
            AlarmStatus1.value.unshift(Number(0));
          }
          AlarmStatus1.value.reverse();
          AlarmStatus2.value = convertToBinary(mes.IntCodeAlarms2.value).split('');
          while (AlarmStatus2.value.length < 16) {
            AlarmStatus2.value.unshift(Number(0));
          }
          AlarmStatus2.value.reverse();
          AlarmStatus3.value = convertToBinary(mes.IntCodeAlarms3.value).split('');
          while (AlarmStatus3.value.length < 16) {
            AlarmStatus3.value.unshift(Number(0));
          }
          AlarmStatus3.value.reverse();
          load.value = false;
        }
      }
    }
    function reset() {
      WebSocket_Send('recup', {
        id: 2, type: 'alarmsReset', value: true, timestamp: getCurrentTime(),
      });
    }
    let varFunction = null;
    function enterPassword(action) {
      if (password !== TRUE_PASSWORD) {
        changeDialog.value = true;
        inputPassword.value = '';
        console.log('введите пароль');
        varFunction = action;
      } else {
        console.log('пароль введён');
        action();
      }
    }
    function confirmPassword() {
      if (inputPassword.value === TRUE_PASSWORD) {
        password = inputPassword.value;
        console.log(password);
        changeDialog.value = false;
        varFunction();
      } else {
        errorPasswordDialog.value = true;
      }
    }
    onMounted(() => {
      // написать удаление элементов при размонтировании образа
      WebSocket_Create('recup', { getMain: 1 });
      WebSocket_Listen('recup', listen);
    });
    onBeforeUnmount(() => {
      WebSocket_Close('recup');
    });
    return {
      reset,
      AlarmStatus1,
      AlarmStatus2,
      AlarmStatus3,
      parsebool,
      getcolor,
      load,
      changeDialog,
      errorPasswordDialog,
      inputPassword,
      comp_inputPassword,
      confirmPass,
      enterPassword,
      confirmPassword,
      ds: ref(() => {
        console.log(1);
      }),
    };
  },
};
</script>
<style>
table,
th,
td {
  border: 1px solid rgb(100, 100, 100);
}
</style>
