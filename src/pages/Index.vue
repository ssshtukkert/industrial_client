<template>
  <q-page class="flex flex-center">
    <q-card class="my-card bg-secondary text-white">
      <q-card-section>
        <div class="text-h6">О сервере</div>
      </q-card-section>
      <q-separator dark />
      <q-card-section class="my-card bg-white text-black">
          <div class="q-pa-md">
            <div class="text-h6">Наименование: Технический сервер "Цифровое производство 4.0"</div>
            <div class="text-h6">Контакты: vfynk@nevatom.ru</div>
          </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    document.title = 'Главная';
  },
});
</script>
