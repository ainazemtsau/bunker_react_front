import { io } from 'socket.io-client';

// const URL = "http://192.168.137.1:5000";

const URL = "http://localhost:5000";
// Это настоящий синглтон на уровне модуля.
// Он создается один раз, когда этот файл импортируется впервые.
export const socket = io(URL, {
    transports: ["websocket"],
    autoConnect: true, // Сокет будет пытаться подключиться сразу
});