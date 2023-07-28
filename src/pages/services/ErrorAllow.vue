<template>
  <q-page class="flex flex-center text-red text-h6" style="background-color: rgb(60, 60, 60);">
    <div>
      <q-icon class="full-width" name="warning" color="red" size="100px" @click="goAlarm"/>
      <div>
        Недостаточно прав
      </div>
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
