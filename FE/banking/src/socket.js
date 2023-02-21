import { io } from "socket.io-client";

const socket = io(
  "https://internetbanking-production.up.railway.app:4675" ||
    "http://localhost:4675"
);

export default socket;
