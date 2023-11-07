<template>
  <div class="full-width q-pa-lg" align="center">
    <q-card-section>
      <q-date v-model="model" flat  minimal range :locale="locale" color="grey-6" text-color="white" style="background-color: rgb(60, 60, 60);" />
    </q-card-section>
    <q-card-actions align="center">
      <q-btn :disabled="!isSelected()" color='dark-grey' label="Скачать" @click="action(model)" />
    </q-card-actions>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DatePicker',
  props: {
    date: {
      type: String,
      default: '',
    },
    nameDef: {
      type: String,
      default: '',
    },
    action: {
      type: Function,
      default() {
      },
    },
  },
  methods: {
    setName(newName) {
      this.name = newName;
    },
    setText(newText) {
      this.text = newText;
    },

  },
  setup(props) {
    const finishDate = new Date(props.date);
    const startDate = new Date(props.date);
    startDate.setDate(finishDate.getDate() - 1);
    const sd = `${startDate.getFullYear()}/${(startDate.getMonth() + 1 > 9) ? startDate.getMonth() + 1 : `0${startDate.getMonth() + 1}`}/${(startDate.getDate() > 9) ? startDate.getDate() : `0${startDate.getDate()}`}`;
    const fd = `${finishDate.getFullYear()}/${(finishDate.getMonth() + 1 > 9) ? finishDate.getMonth() + 1 : `0${finishDate.getMonth() + 1}`}/${(finishDate.getDate() > 9) ? finishDate.getDate() : `0${finishDate.getDate()}`}`;
    const model = ref({ from: sd, to: fd });
    function isSelected() {
      if (model.value) {
        return model.value.to && model.value.from;
      }
      return false;
    }
    return {
      isSelected,
      name: props.nameDef,
      model,
      locale: {
        days: 'Воскресенье_Понедельник_Вторник_Среда_Четверг_Пятница_Суббота'.split('_'),
        daysShort: 'Вс_Пн_Вт_Ср_Чт_Пт_Сб'.split('_'),
        months: 'Январь_Февраль_Март_Апрель_Май_Июнь_Июль_Август_Сентябрь_Октябрь_Ноябрь_Декабрь'.split('_'),
        monthsShort: 'Янв_Фев_Мар_Апр_Май_Июн_Июл_Авг_Сен_Окт_Ноя_Дек'.split('_'),
        firstDayOfWeek: 1,
        format24h: true,
        pluralDay: 'дня/дней',
      },
    };
  },

});
</script>
