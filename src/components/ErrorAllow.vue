<template>
  <q-page class="flex flex-center text-red text-h6" style="background-color: rgb(60, 60, 60);">
    <div>
      <q-icon class="full-width" align="center" name="warning" color="red" size="100px" @click="goAlarm" />
      <div align="center">
        Недостаточно прав
      </div>
      <q-card-section align="center">
        <slot name="actions" />
      </q-card-section>
    </div>
  </q-page>
</template>
<script>
export default {

  setup() {
    document.title = 'Недостаточно прав';
    return {
    };
  },
};
</script>
