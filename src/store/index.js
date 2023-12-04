import { reactive } from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { useRoute } from 'vue-router';
// import ControlVU from '../../../industrial_server/classes/ControlVU.js';

const stt = reactive({
  portDefault: 3080,
  token: '',
  isAuth: false,
  isLoad: false,
  portNR: 1880,
  socket: null,
  sockets: {},
  socketData: {},
});
const ip = '10.8.5.76';
const host = `http://${ip}:3001`;

const version = '0.14.11';

const storeVue = new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    refresh: localStorage.getItem('refresh') || '',
    isAuth: false,
    user: null,
    upd: null,
  },
  mutations: {
    auth_success(state, dataUser) {
      state.token = dataUser.token;
      if (dataUser.refresh) {
        state.refresh = dataUser.refresh;
      }
      state.user = dataUser.user;
      state.isAuth = true;
    },
    logout(state) {
      state.isAuth = false;
      state.token = '';
      state.refresh = '';
      state.user = null;
    },
  },
  actions: {
    register(state, userRegister) {
      const { token } = this.state;
      return new Promise((resolve, reject) => {
        axios.post(`${host}/services/register`, { token, userRegister })
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    login({ commit }, userLogin) {
      return new Promise((resolve, reject) => {
        axios.post(`${host}/services/login`, userLogin)
          .then((resp) => {
            const { token, user, refresh } = resp.data;
            // axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            localStorage.setItem('token', token);
            localStorage.setItem('refresh', refresh);
            commit('auth_success', { user, token, refresh });
            resolve(resp);
          })
          .catch((err) => {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh');
            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        const { refresh } = this.state;
        if (refresh) {
          axios.post(`${host}/services/logout`, { refresh }).then((resp) => {
            commit('logout');
            localStorage.removeItem('token');
            localStorage.removeItem('refresh');
            // delete axios.defaults.headers.common.Authorization;
            console.log(resp.data.message);
            resolve();
          });
        } else {
          resolve();
        }
      });
    },
    isAuth({ commit }) {
      const { token, refresh } = this.state;
      return new Promise((resolve, reject) => {
        if (token) {
          axios.post(`${host}/services/auth`, { token }).then((resp) => {
            // успешная аутентификация
            console.log('Успешная аутентификация');
            commit('auth_success', { user: resp.data.user, refresh, token });
            resolve(resp.data);
          }).catch(() => {
            console.log('Ошибка аутентификации');
            axios.post(`${host}/services/refresh`, { refresh }).then((resp) => {
              console.log('Успешное обновление');
              commit('auth_success', { user: resp.data.user, refresh, token: resp.data.token });
              localStorage.setItem('token', resp.data.token);
              resolve(resp.data);
            }).catch((err) => {
              console.log('Ошибка обновления');
              reject(err.response.data);
            });
          });
        } else {
          reject();
        }
      });
    },
  },
  getters: {
    getAuth: (state) => state.isAuth,
  },
});

function isPermissions(permission) {
  const route = useRoute();
  try {
    const { requiresAuth, permissionsBlock } = route.meta;
    if (requiresAuth && permissionsBlock) {
      return (permissionsBlock[storeVue.state.user.role] || []).includes(permission);
    }
    return false;
  } catch (err) {
    return false;
  }
}

function getUser() {
  return storeVue.state.user;
}

function WebSocket_UpServer(onopenMessage) {
  console.log('Настроена связь с WebSocketServer');
  const ws = new WebSocket(`ws://${ip}:3080/wss`);
  ws.onopen = function () {
    ws.send(JSON.stringify(onopenMessage));
  };
  const serverName = 'wss';
  stt.sockets[serverName] = ws;
  return true;
}
function WebSocket_Create(name, onopenMessage) {
  console.log(`Создан WebSocket: ${name}`);
  const ws = new WebSocket(`ws://${ip}:1880/${name}`);
  ws.onopen = function () {
    ws.send(JSON.stringify(onopenMessage));
  };
  stt.sockets[name] = ws;
  return true;
}
function isOpen(ws) { return ws.readyState === ws.OPEN; }
// function SetSocket() {
//   try {
//     state.socket = new WebSocket(`ws://${window.location.hostname}:${state.port}/wss`);
//     // state.socket = new WebSocket(`ws://${window.location.hostname}:${state.portDefault}/wss`);
//     console.log(state.socket);
//     state.socket.onopen = () => {
//       state.socket.send(JSON.stringify({
//         message: 'Меня зовут Джон',
//       }));
//     };
//     return true;
//   } catch (error) {
//   // $q.notify({   установить в виде плагина
//   //   color: 'red-5',
//   //   textColor: 'white',
//   //   icon: 'warning',
//   //   message: 'Ошибка  данных WS.',
//   // });
//     return false;
//   }
// }
// function WebSocket_Close() {
//   state.socket.close();
//   state.socket = null;
// }
// закрывает вебсокет
function WebSocket_Close(name) {
  stt.sockets[name].close();
  stt.sockets[name] = null;
  console.log(`Удален WebSocket: ${name}`);
  console.log(stt.sockets);
}
// возвращает метаданные аварийных сообщений (зашиты в сервер)
// function getDataAlarms() {
//   return ControlVU.getData();
// }
// function getDataAlarm(id) {
//   const array = getDataAlarms();
//   for (let index = 0; index < array.length; index += 1) {
//     const element = array[index];
//     if (element.id === id) {
//       return element;
//     }
//   }
//   return null;
// }
// отправляет сообщение по вебсокету name
function WebSocket_Send(name, json) {
  stt.sockets[name].send(JSON.stringify(json));
}
// function WebSocket_Send(json) {
//   state.socket.send(JSON.stringify(json));
// }
// function WebSocket_Listen(fun) {
//   try {
//     state.socket.onmessage = async (data) => {
//       const getJson = JSON.parse(data.data);
//       if (fun) {
//         fun(getJson);
//       }
//       state.socketData = getJson;
//     };
//     return true;
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// }
function WebSocket_Listen(name, fun) {
  try {
    stt.sockets[name].onmessage = async (data) => {
      const getJson = JSON.parse(data.data);
      if (fun) {
        fun(getJson);
      }
      stt.socketData = getJson;
    };
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
function getStatusData() {
  return [
    {
      id: 0,
      label: 'Разрешено к применению',
    },
    {
      id: 1,
      label: 'Запрещено к применению',
    },
  ];
}
// на удаление
const newObjectCalculation = {
  cost: 0,
  materials: '[]',
  operations: 7.5,
  descript: '',
};

function getCurrentDate(date) {
  let currentDate;
  if (date) {
    currentDate = date;
  } else {
    currentDate = new Date();
  }
  // .toLocaleFormat('%Y-%m-%d %h:%i:%s');
  // `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`
  let day = currentDate.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  let month = currentDate.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  const year = currentDate.getFullYear();
  let h = currentDate.getHours();
  if (h < 10) {
    h = `0${h}`;
  }
  let m = currentDate.getMinutes();
  if (m < 10) {
    m = `0${m}`;
  }
  let s = currentDate.getSeconds();
  if (s < 10) {
    s = `0${s}`;
  }
  const format = `${year}-${month}-${day} ${h}:${m}:${s}`;
  return format;
}
function getCurrentTime() {
  const currentDate = new Date();
  let h = currentDate.getHours();
  if (h < 10) {
    h = `0${h}`;
  }
  let m = currentDate.getMinutes();
  if (m < 10) {
    m = `0${m}`;
  }
  let s = currentDate.getSeconds();
  if (s < 10) {
    s = `0${s}`;
  }
  const format = `${h}:${m}:${s}`;
  return format;
}
// возвращает элемент из списка по id идентификатору
function getObject(array, prop, value) {
  for (let index = 0; index < array.length; index += 1) {
    const element = array[index];
    if (element[prop] === value) {
      return element;
    }
  }
  return null;
}
// возвращает свойство элемента из списка по id идентификатору
function getProp(array, id, prop) {
  for (let index = 0; index < array.length; index += 1) {
    const element = array[index];
    if (element.id === id) {
      return element[prop];
    }
  }
  return id;
}
// возвращает id элемента из списка по соответствующему свойству
function getId(array, prop, value) {
  for (let index = 0; index < array.length; index += 1) {
    const element = array[index];
    if (element[prop] === value) {
      return element.id;
    }
  }
  return -1;
}

// возвращает формат отображение цены
function getRubFormat() {
  return new Intl.NumberFormat('ru', { style: 'currency', currency: 'RUB' });
}
// удалет элемент из массива с полем field равным value
function removeElementInArray(array, field, value) {
  let ind = -1;
  for (let index = 0; index < array.length; index += 1) {
    if (array[index][field] === value) {
      ind = index;
      break;
    }
  }
  if (ind !== -1) {
    array.splice(ind, 1);
  }
}
// запросы
// запрос категорий материалов
function getMaterialsCategories() {
  const rows = [];
  axios
    .get(`${host}/services/genprice/materials_categories`).then((response) => {
      for (let index = 0; index < response.data.length; index += 1) {
        const m = response.data[index];
        rows.push({
          name: m.name,
        });
      }
      return rows;
    });
}

// валидация
const validationName = [(val) => (val && val.length > 0) || 'Введите наименование'];
const validationNumber = [
  (val) => (val >= 0) || 'Введите корректное значение',
];
const validationNumberNoZero = [
  (val) => (val > 0) || 'Введите корректное значение',
];
function convertToBinary(number) {
  let num = number;
  let binary = (num % 2).toString();
  for (; num > 1;) {
    num = parseInt(num / 2, 10);
    binary = (num % 2) + (binary);
  }
  return binary;
}
export default {
  TRUE_PASSWORD: 'lab123',
  host,
  ip,
  version,
  convertToBinary,
  WebSocket_UpServer,
  WebSocket_Close,
  WebSocket_Send,
  WebSocket_Listen,
  WebSocket_Create,
  isOpen,
  state: stt,
  getCurrentDate,
  getCurrentTime,
  // getDataAlarms,
  // getDataAlarm,
  getProp,
  getObject,
  getId,
  removeElementInArray,
  getMaterialsCategories,
  getRubFormat,
  getStatusData,
  newObjectCalculation,
  validationName,
  validationNumber,
  validationNumberNoZero,
  storeVue,
  isPermissions,
  getUser,
};
