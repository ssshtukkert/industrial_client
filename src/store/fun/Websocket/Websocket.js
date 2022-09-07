// const Websocket = (socket, fun) => {
//   try {
//     socket.onmessage = (data) => {
//       if (data) {
//         const getJson = JSON.parse(data.data);
//         // console.log(getJson);
//         fun(getJson);
//       }
//     };
//     return true;
//   } catch (error) {
//     // console.log(error);

//     return false;
//   }
// };
// export {
//   Websocket,
// };
