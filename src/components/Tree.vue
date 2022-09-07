<template>
  <div class="q-pa-md q-gutter-sm text-h5 text-primary">
    <q-tree
    :nodes="props"
    default-expand-all
    v-model:selected="selected"
    node-key="label"
    no-connectors
    >
      <template v-slot:header-root="prop">
        <div class="row items-center">
          <div>
            {{ prop.node.label }}
            <q-badge color="orange" class="q-ml-sm">New!</q-badge>
          </div>
        </div>
      </template>
    </q-tree>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const selected = ref(null);

    return {
      selected,

      props: [
        {
          label: 'Навигация',
          selectable: false,
          icon: 'restaurant_menu',
          header: 'root',
          children: [
            { label: 'Главная', icon: 'home' },
            {
              label: 'Производство',
              icon: 'restaurant_menu',
              selectable: false,
              children: [
                { label: 'Quality ingredients' },
                { label: 'Good recipe' },
              ],
            },
            {
              label: 'Вентиляция',
              icon: 'room_service',
              selectable: false,
              children: [
                { label: 'Вент. установка №1' },
                { label: 'Вент. установка №2' },
              ],
            },
            {
              label: 'Лаборатория',
              icon: 'photo',
              selectable: false,
              children: [
                {
                  label: 'Стенд подготовки воздуха',
                },
                {
                  label: 'Стенд А',
                },
                {
                  label: 'Лабораторная установка №1',
                },
              ],
            },
          ],
        },
      ],
    };
  },
};
</script>
