<template lang="ru">
    <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card">
      <q-card-section class="bg-teal text-white">
        <div class="text-h6">Стэнд подготовки воздуха</div>
      </q-card-section>

      <q-card-actions vertical align="right">
        <q-btn to="/lab/recup-par" flat>Параметры</q-btn>
        <q-btn to="/lab/recup-online" flat>Онлайн график</q-btn>
        <q-btn to="/lab/recup-history" flat>Архивный график</q-btn>
      </q-card-actions>
    </q-card>
    </div>
</template>
<script>
export default {
  name: 'MainRecup',
  setup() {
    return {
    };
  },
};
</script>
<style scoped>

</style>
