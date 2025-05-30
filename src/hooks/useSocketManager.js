import { useEffect } from 'react';
import { socket } from '../services/socket'; // 👈 Импортируем наш синглтон
import useGameStore from '../stores/gameStore';

// Флаг, чтобы убедиться, что слушатели устанавливаются только один раз
let listenersAttached = false;

export default function useSocketManager() {
    const { subscribeToSocket, setConnected } = useGameStore();

    useEffect(() => {
        // Эта логика должна выполниться только один раз за все время жизни приложения
        if (!listenersAttached && socket) {
            console.log("Attaching global socket listeners...");

            // Устанавливаем начальное состояние подключения
            setConnected(socket.connected);

            // Слушатели, которые обновляют стор
            socket.on('connect', () => {
                console.log('Socket connected!');
                setConnected(true);
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected!');
                setConnected(false);
            });

            // Вызываем экшен из стора для подписки на игровые события
            subscribeToSocket(socket);

            listenersAttached = true;
        }

        // Мы не возвращаем функцию очистки, так как эти слушатели должны жить вечно
    }, [subscribeToSocket, setConnected]); // Зависимости стабильны, эффект выполнится один раз
}