import { useEffect } from 'react';
import useSocket from './useSocket';
import useGameStore from '../stores/gameStore';

export default function useSocketSubscription() {
    const { socket } = useSocket();
    const { updateGame, setError, setConnected } = useGameStore();

    useEffect(() => {
        if (!socket) return;

        const handlers = {
            'game_updated': (gameData) => updateGame(gameData),
            'game_error': ({ message }) => setError(message),
            'connect': () => setConnected(true),
            'disconnect': () => setConnected(false)
        };

        // Подписываемся на события
        Object.entries(handlers).forEach(([event, handler]) => {
            socket.on(event, handler);
        });

        // Отписываемся при размонтировании
        return () => {
            Object.keys(handlers).forEach(event => {
                socket.off(event);
            });
        };
    }, [socket, updateGame, setError, setConnected]);
}