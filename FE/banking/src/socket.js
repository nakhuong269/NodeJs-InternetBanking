import { io } from "socket.io-client";

const socket = io(
  "https://internetbanking-production.up.railway.app" || "http://localhost:4000"
);

export default socket;
