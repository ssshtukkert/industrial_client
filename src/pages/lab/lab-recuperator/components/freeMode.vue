<template >
  <div>
    <q-card class="bg-secondary text-white">
      <q-card-section>
        <div class="text-h6">Свободный режим</div>
      </q-card-section>

      <q-separator dark />

      <q-card-section class="row bg-white text-black">
        <q-card-section class="col-4">
          <q-input v-model="stendPritokTemp" :color=color type="number" outlined label="Стенд Приток температура"
            lazy-rules :rules="[ val => (val && val.length > 0) && (+val < 50) || 'Введите корректные данные']" />
          <q-input v-model="stendPritokHum" :color=color type="number" outlined label="Стенд Приток влажность"
            lazy-rules :rules="[ val => (val && val.length > 0) && (+val < 50) || 'Введите корректные данные']" />
          <q-input v-model="stendVytTemp" :color=color type="number" outlined label="Стенд Вытяжка температура"
            lazy-rules :rules="[ val => (val && val.length > 0) && (+val < 50) || 'Введите корректные данные']" />
          <q-input v-model="stendVytHum" :color=color type="number" outlined label="Стенд Вытяжка влажность"
            lazy-rules :rules="[ val => (val && val.length > 0) && (+val < 50) || 'Введите корректные данные']" />
        </q-card-section>
        <q-card-section class="col-4">
          <q-input v-model="stendPritokTemp" :color=color type="number" outlined label="Уст Смешение Приток 1"
            lazy-rules :rules="[ val => (val && val.length > 0) && (+val < 50) || 'Введите корректные данные']" />
          <q-input v-model="stendPritokTemp" :color=color type="number" outlined label="Уст м3 Приток1" lazy-rules
            :rules="[ val => (val && val.length > 0) && (+val < 50) || 'Введите корректные данные']" />
          <q-input v-model="stendPritokTemp" :color=color type="number" outlined label="Уст Т выход Приток1*"
              lazy-rules :rules="[ val => (val && val.length > 0) && (+val < 50) || 'Введите корректные данные']"
              hint="*При совместной работе Приток1 и Приток2"/>
          <q-input v-model="stendPritokTemp" :color=color type="number" outlined label="Уст смешение Вытяжка" lazy-rules
            :rules="[ val => (val && val.length > 0) && (+val < 50) || 'Введите корректные данные']" />
          <q-input v-model="stendPritokTemp" :color=color type="number" outlined label="Уст м3 Вытяжка" lazy-rules
            :rules="[ val => (val && val.length > 0) && (+val < 50) || 'Введите корректные данные']" />
          <q-input v-model="stendPritokTemp" :color=color type="number" outlined label="Уст смешение Приток 2"
            lazy-rules :rules="[ val => (val && val.length > 0) && (+val < 50) || 'Введите корректные данные']" />
          <q-input v-model="stendPritokTemp" :color=color type="number" outlined label="Уст м3 Приток2" lazy-rules
            :rules="[ val => (val && val.length > 0) && (+val < 50) || 'Введите корректные данные']" />
        </q-card-section>
        <q-card-section class="col-4">
          <q-card-section>
            <q-toggle v-model="autoParameter" class="full-width" label="АвтоПараметр" />
            <q-toggle v-model="onPritok1" class="full-width" label="Система Приток1" />
            <q-toggle v-model="smPritok1" class="full-width" label="Смешение Приток1" />
            <q-toggle v-model="onHumPritok1" class="full-width" label="Увлажнение Приток1" />
            <q-toggle v-model="onVyt" class="full-width" label="Система Вытяжка" />
            <q-toggle v-model="smVyt" class="full-width" label="Смешение Вытяжка" />
            <q-toggle v-model="onHumVyt" class="full-width" label="Увлажнение Вытяжка" />
            <q-toggle v-model="onPritok2" class="full-width" label="Ситема Приток2" />
          </q-card-section>
          <q-card-section>
            <q-input v-model="stendPritokTemp" :color=color type="number" outlined
              label="Сброс ресивера Приток1 (закрытие)" lazy-rules
              :rules="[ val => (val && val.length > 0) && (+val < 50) || 'Введите корректные данные']" />
            <q-input v-model="stendPritokTemp" :color=color type="number" outlined
              label="Сброс ресивера Вытяжка (закрытие)" lazy-rules
              :rules="[ val => (val && val.length > 0) && (+val < 50) || 'Введите корректные данные']" />
          </q-card-section>
        </q-card-section>
      </q-card-section>
      <q-separator dark />

      <q-card-actions class="bg-grey-4">
        <q-btn color="teal">Применить</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
import { ref } from 'vue';

export default {
  name: 'freeForm',
  setup() {
    const autoParameter = ref(false);
    const onPritok1 = ref(false);
    const smPritok1 = ref(false);
    const onHumPritok1 = ref(false);
    const onVyt = ref(false);
    const smVyt = ref(false);
    const onHumVyt = ref(false);
    const onPritok2 = ref(false);
    const stendPritokTemp = ref(33);
    const stendPritokHum = ref(0);
    return {
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
    };
  },
};
</script>
<style scoped>
.widthField {
  min-width: 250px;
}
</style>
