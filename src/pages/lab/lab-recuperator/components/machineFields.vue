<template >
    <div >
    <q-card class="my-card bg-secondary text-white">
      <q-card-section>
        <div class="text-h6">Основные параметры</div>
      </q-card-section>

      <q-separator dark />

      <q-card-section class="my-card bg-white text-black flex justify-between items-baseline">
          <div >
              <q-btn color="amber" label="Пуск / Стоп" />
          </div>
          <div class="flex column items-center" >
              <div>
                <q-icon name="info" color="green" size="100px" />
              </div>
              <div>Работа щита</div>
          </div>
           <div class="flex column items-center">
              <div>
                <q-icon name="info" color="grey" size="100px" />
              </div>
              <div>В работе</div>
          </div>
          <div class="flex column items-center">
              <div>
                <q-icon name="warning" color="red" size="100px" />
              </div>
            <div>Авария</div>
          </div>
          <div >
              <q-btn color="red" label="Сброс аварии" />
          </div>
      </q-card-section>
      <q-separator dark />

      <q-card-actions class="bg-grey-4">
        <!-- <q-btn flat>Action 1</q-btn>
        <q-btn flat>Action 2</q-btn> -->
      </q-card-actions>
    </q-card>
    </div>
</template>
<script>
// import { ref } from 'vue';

export default {
  name: 'machineFields',
  props: [
    'colorField',
    'height',
  ],
  setup() {
    return {

    };
  },
};
</script>
<style scoped>
.main{
    min-width: 400px;
    min-height: 500px;
}
</style>
