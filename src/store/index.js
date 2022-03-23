import { reactive } from 'vue';
// import { CheckDataJson } from './fun/CheckData/CheckData.js';
// import { NotifyMessage } from './fun/Notify/Notify';

const state = reactive({
  portDefault: 3080,
  portNR: 1880,
  socket: null,
  socketData: {},
});

function WebSocket_Init(nameNR, onopenMessage) {
  if (nameNR) {
    state.socket = new WebSocket(`ws://${window.location.hostname}:${state.portNR}/${nameNR}`);
  } else {
    state.socket = new WebSocket(`ws://${window.location.hostname}:${state.portDefault}/${nameNR}`);
  }

  if (onopenMessage) {
    state.socket.onopen = function () {
      state.socket.send(JSON.stringify(onopenMessage));
    };
  }
  return true;
}

function WebSocket_Close() {
  state.socket.close();
  state.socket = null;
}

function WebSocket_Send(Message) {
  state.socket.send(JSON.stringify(Message));
}
function WebSocket_Listen(q, fun) {
  try {
    state.socket.onmessage = async (data) => {
      const getJson = JSON.parse(data.data);
      //   NotifyMessage(getJson, q);
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
export default {
  WebSocket_Init,
  WebSocket_Close,
  WebSocket_Send,
  WebSocket_Listen,
  state,
};
