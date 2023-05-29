<template >
  <q-page class="justify-center full-width" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Калибровка датчиков давления</div>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-3 text-grey">
          ДавлПритокДо (21)
          <div v-if="calibration1 == 0" class="text-h6 text-white">
            {{ pa1 }} Па
          </div>
          <div v-if="calibration1 > 0" class="text-h6 text-white">
            Калибровка: {{ calibration1 }}
          </div>
          <q-btn type="submit" :loading="calibration1 > 0" color="teal" label="Корректировка РА1"
            @click="enterPassword(calibration, 1)" />
        </div>
        <div class="col-3 text-grey">
          ДавлВытяжкаПосле (12)
          <div v-if="calibration2 == 0" class="text-h6 text-white">
            {{ pa2 }} Па
          </div>
          <div v-if="calibration2 > 0" class="text-h6 text-white">
            Калибровка: {{ calibration2 }}
          </div>
          <q-btn type="submit" :loading="calibration2 > 0" color="teal" label="Корректировка РА2"
            @click="enterPassword(calibration, 2)" />
        </div>
        <div class="col-3 text-grey">
          ДавлПритокПосле (22)
          <div v-if="calibration3 == 0" class="text-h6 text-white">
            {{ pa3 }} Па
          </div>
          <div v-if="calibration3 > 0" class="text-h6 text-white">
            Калибровка: {{ calibration3 }}
          </div>
          <q-btn type="submit" :loading="calibration3 > 0" color="teal" label="Корректировка РА3"
            @click="enterPassword(calibration, 3)" />
        </div>
        <div class="col-3 text-grey">
          ДавлВытяжкаДо (11)
          <div v-if="calibration4 == 0" class="text-h6 text-white">
            {{ pa4 }} Па
          </div>
          <div v-if="calibration4 > 0" class="text-h6 text-white">
            Калибровка: {{ calibration4 }}
          </div>
          <q-btn type="submit" :loading="calibration4 > 0" color="teal" label="Корректировка РА4"
            @click="enterPassword(calibration, 4)" />
        </div>
      </div>
    </q-card-section>
    <!-- <q-toggle class="text-white" color="white" v-model="toggleWrite" label="Режим запись"
      @click="send('toggleWrite')" />
    <q-toggle class="text-white" color="white" v-model="toggleAutoWrite" label="Автозапись"
      @click="send('toggleAutoWrite')" />
    <q-btn class="bg-grey text-white" label="Пауза" @click="send('togglePause')" />
    <div class="text-h6 text-white">
      {{ statusWrite }}
    </div> -->

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
    document.title = 'Калибровка';
    const pa1 = ref(0);
    const pa2 = ref(0);
    const pa3 = ref(0);
    const pa4 = ref(0);
    const calibration1 = ref(0);
    const calibration2 = ref(0);
    const calibration3 = ref(0);
    const calibration4 = ref(0);
    const changeDialog = ref(false);
    const errorPasswordDialog = ref(false);
    let password = localStorage.getItem('passwordLab') || '';
    const inputPassword = ref(password);
    const comp_inputPassword = ref(null);
    const confirmPass = ref(null);

    const toggleWrite = ref(false);
    const toggleAutoWrite = ref(false);
    const statusWrite = ref('');
    const {
      WebSocket_Create, WebSocket_Listen, WebSocket_Close, WebSocket_Send, getCurrentTime, TRUE_PASSWORD,
    } = inject('store');
    function calibration(pa) {
      WebSocket_Send('recup', {
        id: 2, type: 'calibration', value: pa, timestamp: getCurrentTime(),
      });
      if (pa === 1) {
        calibration1.value = 15;
      } else if (pa === 2) {
        calibration2.value = 15;
      } else if (pa === 3) {
        calibration3.value = 15;
      } else if (pa === 4) {
        calibration4.value = 15;
      }
    }
    function listen(json) {
      const mes = json.message;
      if (json.id === 2) {
        if (json.type === 'sendDataRecup') {
          pa1.value = mes.Pressure_21.value;
          pa2.value = mes.Pressure_12.value;
          pa3.value = mes.Pressure_22.value;
          pa4.value = mes.Pressure_11.value;
        } else if (json.type === 'sendAirDevices') {
          calibration1.value = mes.calibration1.value;
          calibration2.value = mes.calibration2.value;
          calibration3.value = mes.calibration3.value;
          calibration4.value = mes.calibration4.value;
        } else if (json.type === 'sendManual') {
          console.log(mes);
          toggleWrite.value = mes.write;
          toggleAutoWrite.value = mes.autowrite;
          statusWrite.value = mes.statusWrite;
        }
      }
    }
    let varFunction = null;
    let paD = -1;
    function enterPassword(action, pa) {
      if (password !== TRUE_PASSWORD) {
        changeDialog.value = true;
        inputPassword.value = '';
        varFunction = action;
        paD = pa;
      } else {
        localStorage.setItem('passwordLab', password);
        action(pa);
      }
    }
    function confirmPassword() {
      if (inputPassword.value === TRUE_PASSWORD) {
        password = inputPassword.value;
        console.log(password);
        changeDialog.value = false;
        varFunction(paD);
      } else {
        errorPasswordDialog.value = true;
      }
    }
    function send(toggle) {
      WebSocket_Send('recup', {
        id: 2, type: 'manual', value: toggle, timestamp: getCurrentTime(),
      });
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
      confirmPassword,
      enterPassword,
      pa1,
      pa2,
      pa3,
      pa4,
      calibration,
      calibration1,
      calibration2,
      calibration3,
      calibration4,
      changeDialog,
      errorPasswordDialog,
      inputPassword,
      comp_inputPassword,
      confirmPass,
      toggleWrite,
      toggleAutoWrite,
      statusWrite,
      send,
    };
  },
};
</script>
