<template>
  <q-page class="flex flex-center text-white" style="background-color: rgb(60, 60, 60);">
    <q-card class="text-white" style="background-color: rgb(60, 60, 60);">
      <q-card-section style="background-color: rgb(80, 80, 80);">
        <div class="text-h6">О сервере</div>
      </q-card-section>
      <q-card-section>
        <div class="q-pa-md">
          <div class="text-h6">Технический сервер "Неватом"</div>
          <div class="text-h6">Контакты: vfynk@nevatom.ru</div>
        </div>
      </q-card-section>
    </q-card>
    <!-- <q-carousel v-model="slide" transition-prev="slide-right" transition-next="slide-left" animated control-color="red"
      class="rounded-borders" style="background-color: rgb(60, 60, 60);">
      <q-carousel-slide name="style" class="column no-wrap flex-center">
        <q-icon name="style" color="primary" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="tv" class="column no-wrap flex-center">
        <q-icon name="live_tv" color="primary" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="layers" class="column no-wrap flex-center">
        <q-icon name="layers" color="primary" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="map" class="column no-wrap flex-center">
        <q-icon name="terrain" color="primary" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
    </q-carousel>
    <div class="row justify-center">
      <q-btn-toggle glossy v-model="slide" :options="[
        { label: 1, value: 'style' },
        { label: 2, value: 'tv' },
        { label: 3, value: 'layers' },
        { label: 4, value: 'map' }
      ]" />
    </div> -->
  </q-page>
</template>

<script>
import { ref, defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    document.title = 'Главная';
    return {
      slide: ref('style'),
      lorem: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo provident incidunt ducimus iusto perferendis porro earum. Totam, numquam?',
    };
  },
});
</script>
