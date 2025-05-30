// hooks/useGameActions.js
import { useCallback } from 'react';
import useSocket from './useSocket';
import useGameStore from '../stores/gameStore';

export default function useGameActions() {
    const { socket, isConnected } = useSocket();
    const { game, playerId } = useGameStore();

    const sendAction = useCallback((actionType, payload = {}) => {
        if (!socket || typeof socket.emit !== 'function') {
            console.warn('Socket not available');
            return;
        }

        if (!isConnected) {
            console.warn('Socket not connected');
            return;
        }

        if (!game) {
            console.warn('No active game');
            return;
        }

        console.log(`Sending action: ${actionType}`, payload);

        try {
            socket.emit('game_action', {
                gameId: game.id,
                playerId,
                action: actionType,
                payload
            });
        } catch (error) {
            console.error('Failed to send action:', error);
        }
    }, [socket, isConnected, game, playerId]);

    return {
        sendAction,
        isConnected: isConnected && !!socket
    };
}