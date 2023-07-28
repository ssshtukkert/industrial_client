<template>
  <q-page class="full-width text-white" style="background-color: rgb(60, 60, 60);">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="text-h6">Пользователи</div>
    </q-card-section>
    <q-table class="m-table text-white cursor-pointer " dark dense flat :rows="rowsUsers" :columns="[
      {
        name: 'name',
        required: true,
        label: 'Имя',
        align: 'left',
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
        required: true,
        style: 'min-width: 500px',
        edit: false,
      },
      {
        name: 'email',
        align: 'left',
        label: 'Почта',
        field: 'email',
        format: (val) => `${val}`,
        sortable: true,
        defaultValue: 0,
        edit: true,
      },
      {
        name: 'role',
        align: 'left',
        label: 'Роль',
        field: 'role',
        format: (val) => `${val}`,
        sortable: true,
        defaultValue: 0,
        type: 'text',
        edit: true,
      },
    ]" row-key="id" virtual-scroll :hide-selected-banner="true" selection="single" binary-state-sort
      :hide-pagination="true" v-model:pagination="pagination" separator="cell" :rows-per-page-options="[1]" wrap-cells
      style="background-color: rgb(60, 60, 60);" grid-header no-data-label="Нет данных" :filter="filterUsers"
      v-model:selected="selectedUsers" @row-click="selectRow">
      <template v-slot:top>
        <q-card-actions class="fit" style="background-color: rgb(60, 60, 60);">
          <q-btn color='dark-grey' icon="add" @click="() => {
            dialogRegister = true;
            name = '';
            password = '';
            passwordConfirm = '';
            email = '';
            role = roleOptions[0];
          }" />
           <q-btn color='dark-grey' icon="delete" v-show="selectedUsers.length > 0"
           disable />
          <q-space />
          <q-input dark class="text-h6" outlined dense debounce="300" v-model="filterUsers" clearable
            placeholder="Поиск" style="margin: 10px;">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-card-actions>
      </template>
      <template v-slot:pagination>
        <div class="text-h6">
          {{ selected.length === 0 ? `Всего объектов: ${rows.length}` : `Объектов выбрано:
          ${selected.length} из ${rows.length}` }}
        </div>
      </template>
      <template v-slot:header-cell="props">
        <q-th :props="props" style="background-color: rgb(60, 60, 60);">
          <div class="text-h6">{{ props.col.label }}</div>
        </q-th>
      </template>
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <div class="text-h6">
            {{ props.value }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div :class="`text-h6 ${props.value == 'Готово' ? 'text-green' : 'text-red'}`">
            {{ props.value }}
          </div>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="dialogRegister" persistent>
      <q-card class="text-white q-pt-none" style="width: 400px; max-width: 95vw; background-color: rgb(60, 60, 60);">
        <q-bar>
          <div class="text-h6">Регистрация нового пользователя</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-grey text-white">Закрыть</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <form @submit.prevent="register">
            <q-input dark required v-model="email" type="email" placeholder="Логин (адрес почты)" />
            <q-input dark required v-model="name" type="text" placeholder="Имя" />
            <q-select dark borderless class="text-h8" label="Роль:" options-selected-class="text-h8 text-grey"
              label-active-class="text-red" popup-content-class="text-h8" :options="roleOptions" option-value="id"
              v-model="role" popup-content-style="background-color: rgb(60, 60, 60); color:  white;"
              style="padding-right: 5px;">
              <template v-slot:selected>
                <div class="text-white">
                  {{ role.label }}
                </div>
              </template>
            </q-select>
            <q-input dark required v-model="password" type="password" placeholder="Пароль" />
            <q-input dark required v-model="passwordConfirm" type="password" placeholder="Подтверждение пароля" />
            <q-btn class="q-ma-md" type="submit">Зарегистрировать</q-btn>
          </form>
        </q-card-section>
        <q-card-section class="text-h6 text-red">
          {{ message }}
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import {
  onMounted,
  ref,
  inject,
} from 'vue';
import axios from 'axios';
import store from '../store/index';

export default {
  setup() {
    document.title = 'Пользователи';
    const { host } = inject('store');
    const name = ref('Гость');
    const email = ref('guest@mail.ru');
    const password = ref('2');
    const passwordConfirm = ref('2');
    const roleOptions = ref([
      {
        id: 0,
        label: 'Пользователь',
        value: 'user',
      },
      {
        id: 1,
        label: 'Эксперт',
        value: 'expert',
      },
      {
        id: 2,
        label: 'Админ',
        value: 'admin',
      },
    ]);
    const role = ref(roleOptions.value[0]);
    const message = ref('');
    const rowsUsers = ref([]);
    const filterUsers = ref('');
    const selectedUsers = ref([]);
    const dialogRegister = ref(false);
    function update() {
      rowsUsers.value.length = 0;
      axios
        .get(`${host}/services/users`).then((resp) => {
          rowsUsers.value.push(...resp.data);
        }).catch((err) => {
          console.log(err);
        });
    }
    function selectRow(event, row) {
      selectedUsers.value.length = 0;
      selectedUsers.value.push(row);
    }
    function register() {
      if (password.value === passwordConfirm.value) {
        const data = {
          name: name.value,
          email: email.value,
          password: password.value,
          role: role.value.value,
        };
        message.value = '';
        store.storeVue.dispatch('register', data)
          .then(() => {
            dialogRegister.value = false;
            update();
            console.log('Новый пользователь успешно создан');
          })
          .catch((err) => {
            message.value = err.response.data.message;
          });
      } else {
        message.value = 'Пароли не совпадают';
      }
    }

    onMounted(() => {
      update();
    });
    return {
      selectRow,
      roleOptions,
      role,
      name,
      email,
      password,
      passwordConfirm,
      message,
      rowsUsers,
      filterUsers,
      dialogRegister,
      selectedUsers,
      register,
      pagination: ref({
        rowsPerPage: 0,
      }),
    };
  },
};
</script>
