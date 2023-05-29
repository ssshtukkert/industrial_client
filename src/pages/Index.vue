<template>
  <q-page class="flex flex-center" style="background-color: rgb(60, 60, 60);">
    <q-card class="text-white">
      <q-card-section style="background-color: rgb(80, 80, 80);">
        <div class="text-h6">О сервере</div>
      </q-card-section>
      <q-card-section style="background-color: rgb(60, 60, 60);">
          <div class="q-pa-md">
            <div class="text-h6">Наименование: Технический сервер "Неватом"</div>
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
