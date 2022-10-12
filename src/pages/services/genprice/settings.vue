<template>
  <q-page padding>
    <q-card class="bg-white" style="min-height: 800px;">
      <q-card-section class="bg-secondary text-white">
        <div class="text-h6">
          Настройки
        </div>
      </q-card-section>
      <q-card-section class="text-black">
          <q-input v-model="inputCostOneHourWorker" @update:model-value="syncData" class="text-h6" outlined label="Стоимость 1ч" type="number"
              :rules="validationNumberNoZero" suffix="руб." style="width: 160px;" auto-save />
              <q-input v-model="inputPercentOfMaterials" @update:model-value="syncData" class="text-h6" outlined label="Процент от материалов" type="number"
              :rules="validationNumberNoZero" suffix="%" style="width: 160px;" auto-save />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {
  ref, defineComponent, inject, onMounted,
} from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'GenPriceSettings',

  setup() {
    const { host, validationNumberNoZero } = inject('store');
    const inputCostOneHourWorker = ref(0);
    const inputPercentOfMaterials = ref(0);
    function syncData() {
      axios.post(`${host}/services/genprice/settings/costOneHourWorker`, {
        value: inputCostOneHourWorker.value,
      });
      axios.post(`${host}/services/genprice/settings/percentOfMaterials`, {
        value: inputPercentOfMaterials.value,
      });
    }
    onMounted(() => {
      axios
        .get(`${host}/services/genprice/Setting`).then((responseM) => {
          inputCostOneHourWorker.value = responseM.data[0].value;
          inputPercentOfMaterials.value = responseM.data[1].value;
        });
    });
    return {
      syncData,
      inputCostOneHourWorker,
      inputPercentOfMaterials,
      validationNumberNoZero,
    };
  },
});
</script>
