import { reactive } from 'vue';
import axios from 'axios';
import ControlVU from '../../../industrial_server/classes/ControlVU.js';

const state = reactive({
  portDefault: 3080,
  token: '',
  isAuth: false,
  isLoad: false,
  portNR: 1880,
  socket: null,
  sockets: {},
  socketData: {},
});

// function WebSocket_Init(nameNR, onopenMessage) {
//   state.socket = new WebSocket('ws://10.154.152.88:1880/vu1');

//   // if (nameNR) {
//   //   state.socket = new WebSocket(`ws://${window.location.hostname}:${state.portNR}/${nameNR}`);
//   // } else {
//   //   state.socket = new WebSocket(`wss://${window.location.hostname}:${state.portDefault}/${nameNR}`);
//   // }
//   // if (onopenMessage) {
//   state.socket.onopen = function () {
//     state.socket.send(JSON.stringify(onopenMessage));
//   };
//   // }
//   return true;
// }
const host = 'http://10.154.152.88:3001';

function WebSocket_UpServer(onopenMessage) {
  console.log('Настроена связь с WebSocketServer');
  const ws = new WebSocket('ws://10.154.152.88:3080/wss');
  ws.onopen = function () {
    ws.send(JSON.stringify(onopenMessage));
  };
  const serverName = 'wss';
  state.sockets[serverName] = ws;
  return true;
}
function WebSocket_Create(name, onopenMessage) {
  console.log(`Создан WebSocket: ${name}`);
  const ws = new WebSocket(`ws://10.154.152.88:1880/${name}`);
  ws.onopen = function () {
    ws.send(JSON.stringify(onopenMessage));
  };
  state.sockets[name] = ws;
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
  state.sockets[name].close();
  state.sockets[name] = null;
  console.log(`Удален WebSocket: ${name}`);
  console.log(state.sockets);
}
// возвращает метаданные аварийных сообщений (зашиты в сервер)
function getDataAlarms() {
  return ControlVU.getData();
}
function getDataAlarm(id) {
  const array = getDataAlarms();
  for (let index = 0; index < array.length; index += 1) {
    const element = array[index];
    if (element.id === id) {
      return element;
    }
  }
  return null;
}
// отправляет сообщение по вебсокету name
function WebSocket_Send(name, json) {
  state.sockets[name].send(JSON.stringify(json));
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
    state.sockets[name].onmessage = async (data) => {
      const getJson = JSON.parse(data.data);
      if (fun) {
        fun(getJson);
      }
      state.socketData = getJson;
    };
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function getCurrentDate() {
  const currentDate = new Date();
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
  host,
  convertToBinary,
  WebSocket_UpServer,
  WebSocket_Close,
  WebSocket_Send,
  WebSocket_Listen,
  WebSocket_Create,
  isOpen,
  state,
  getCurrentDate,
  getCurrentTime,
  getDataAlarms,
  getDataAlarm,
  getProp,
  getId,
  getMaterialsCategories,
  validationName,
  validationNumber,
  validationNumberNoZero,
};
