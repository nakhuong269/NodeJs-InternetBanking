import { io } from "socket.io-client";

const socket = io(
  "https://internetbanking-production.up.railway.app:4765" ||
    "http://localhost:4765"
);

export default socket;
