<template >
  <div>
    <q-card class="bg-secondary text-white">
      <q-card-section>
        <div class="text-h6">Параметры</div>
      </q-card-section>

      <q-separator dark />

      <q-card-section class="bg-white text-black">
        <div class="row fit">
          <q-card-section class="col-6">
            <q-form class="q-gutter-sm">
              <q-select v-model="mode" transition-show="flip-up" transition-hide="flip-down" :color=color outlined
                :options="optionsMode" label="Режим" />
              <q-input v-model="airP" :color=color type="number" outlined label="Номинальный объем воздуха (приток)"
                lazy-rules :rules="[val => (val && val.length > 0) && (+val < 3001) || 'Введите корректные данные']" />
              <q-input v-model="airV" :color=color type="number" outlined label="Номинальный объем воздуха (вытяжка)"
                lazy-rules :rules="[val => (val && val.length > 0) && (+val < 3001) || 'Введите корректные данные']" />
              <q-select v-model="nomKoef" transition-show="flip-up" transition-hide="flip-down" :color=color outlined
                :options="optionsNomKoef" label="Коэффициент номинала" />
              <q-select v-model="season" transition-show="flip-up" transition-hide="flip-down" :color=color outlined
                :options="optionsSeason" label="Сезон" />
            </q-form>
          </q-card-section>
          <q-card-section class="col-6 text-h6 text-black">
            <div>
              Текущее сечение:
            </div>
            <div>
              0
            </div>
            <div>
              Уставка массового расхода:
            </div>
            <div>
              0
            </div>
            <div>
              Уставка влагосодержания:
            </div>
            <div>
              0
            </div>
            <div>
              УстВлТерм Приток, °С:
            </div>
            <div>
              0
            </div>
            <div>
              Уставка влагосодержания Вытяжка, г/кг:
            </div>
            <div>
              0
            </div>
            <div>
              УстВлТерм Вытяжка, °С:
            </div>
            <div>
              0
            </div>
          </q-card-section>
        </div>
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
  name: 'mainForm',
  props: [
    'colorField',
    'height',
  ],
  setup(props) {
    const optionsNomKoef = ['0,67', '1', '1,5'];
    const optionsSeason = ['Лето', 'Зима'];
    const optionsMode = ['Свободный', 'Вытяжка 25°С/<30%, Приток 5°С/~%', 'Вытяжка 20°С/50%, Приток 20°С/50%', 'Вытяжка 22°С/45%, Приток -5°С/~%',
      'Вытяжка 25°С/50%, Приток 5°С/70%', 'Вытяжка 25°С/60%, Приток -3°С/90%', 'Вытяжка 25°С/50%, Приток 35°С/40%', 'Вытяжка 25°С/50%, Приток 35°С/50%'];
    const airP = ref(0);
    const airV = ref(0);
    const nomKoef = ref(optionsNomKoef[0]);
    const mode = ref(optionsMode[0]);
    const season = ref(optionsSeason[0]);
    return {
      color: props.colorField,
      minHeight: props.height,
      airP,
      airV,
      nomKoef,
      mode,
      season,
      optionsNomKoef,
      optionsMode,
      optionsSeason,

    };
  },
};
</script>
<style scoped>

</style>
