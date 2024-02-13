import io from 'socket.io-client';
const gameSocket = io("http://127.0.0.1:3000", { transports: ['websocket'], upgrade: false }, {multiplex: false});

gameSocket.on("connect", () => {
      socket.connect;
      console.log('connected be',);
      });

export const socket = socket;