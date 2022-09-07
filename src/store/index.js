import { reactive } from 'vue';

// import { CheckDataJson } from './fun/CheckData/CheckData.js';
// import { NotifyMessage } from './fun/Notify/Notify';

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
function WebSocket_Close(name) {
  state.sockets[name].close();
  state.sockets[name] = null;
  console.log(`Удален WebSocket: ${name}`);
  console.log(state.sockets);
}
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
  return `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
}

export default {
  // SetSocket,
  // WebSocket_Init,
  WebSocket_Close,
  WebSocket_Send, // WebSocket_Send,
  WebSocket_Listen,
  WebSocket_Create,
  isOpen,
  state,
  getCurrentDate,
};
