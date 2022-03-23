<template >
    <div >
    <q-card class="my-card bg-secondary text-white">
      <q-card-section>
        <div class="text-h6">Основные параметры</div>
      </q-card-section>

      <q-separator dark />

      <q-card-section class="my-card bg-white text-white">
            <q-item class="flex ">
                <div class="q-pa-md widthField" style="max-width: 800px">
                    <q-form
                        class="q-gutter-md"
                    >
                        <q-input
                        v-model="air"
                        :color=color
                        type="number"
                        rounded
                        outlined
                        label="Номинальный объем воздуха"
                        hint="объем воздуха"
                        lazy-rules
                        :rules="[ val => (val && val.length > 0) && (+val < 3001) || 'введите корректные данные']"
                        />
                        <q-select
                        v-model="nomKoef"
                        transition-show="flip-up"
                        transition-hide="flip-down"
                        :color=color
                        rounded
                        outlined
                        :options="optionsNomKoef"
                        label="Коэффициент номинала"
                        class="text-black"
                        hint="Коэффициент номинала"
                        />
                        <q-select
                        v-model="mode"
                        transition-show="flip-up"
                        transition-hide="flip-down"
                        :color=color
                        rounded
                        outlined
                        :options="optionsMode"
                        label="Режим"
                        class="text-black"
                        hint="Режим"
                        />
                        <q-select
                        v-model="season"
                        transition-show="flip-up"
                        transition-hide="flip-down"
                        :color=color
                        rounded
                        outlined
                        :options="optionsSeason"
                        label="Сезон"
                        class="text-black"
                        hint="Сезон"
                        />
                    </q-form>

                </div>
            </q-item>
      </q-card-section>

      <q-separator dark />

      <q-card-actions class="bg-grey-4">
        <q-btn color="teal" >Применить</q-btn>
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
    const optionsMode = ['Вытяжка 25°С/<30%, Приток 5°С/~%', 'Вытяжка 20°С/50%, Приток 20°С/50%', 'Вытяжка 22°С/45%, Приток -5°С/~%',
      'Вытяжка 25°С/50%, Приток 5°С/70%', 'Вытяжка 25°С/60%, Приток -3°С/90%', 'Вытяжка 25°С/50%, Приток 35°С/40%', 'Вытяжка 25°С/50%, Приток 35°С/50%'];
    const air = ref(0);
    const nomKoef = ref(optionsNomKoef[0]);
    const mode = ref(optionsMode[0]);
    const season = ref(optionsSeason[0]);
    return {
      color: props.colorField,
      minHeight: props.height,
      air,
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
