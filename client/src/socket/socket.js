import { io } from "socket.io-client";

const socketURL = import.meta.env.PROD
  ? import.meta.env.VITE_PROD_SOCKET_URL
  : import.meta.env.VITE_LOCAL_SOCKET_URL;

const socket = io(socketURL, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;