// hooks/useSessionRestore.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../stores/gameStore';
import useSocket from './useSocket';
import { getSession } from '../utils/session';

export default function useSessionRestore() {
    const { socket, isConnected } = useSocket();
    const navigate = useNavigate();
    const { initializeFromSession, clearGame } = useGameStore();
    const [isRestoring, setIsRestoring] = useState(false);
    const [restoreComplete, setRestoreComplete] = useState(false);

    useEffect(() => {
        const session = getSession();

        if (!session) {
            setRestoreComplete(true);
            return;
        }

        if (!isConnected) {
            return; // Ждем подключения
        }

        if (isRestoring || restoreComplete) {
            return; // Уже восстанавливаем или завершили
        }

        setIsRestoring(true);
        console.log('Restoring session:', session);

        initializeFromSession(socket)
            .then((result) => {
                if (result.success) {
                    const { game, playerId, role } = result;

                    if (role === 'host') {
                        navigate(`/host/${game.id}`, { replace: true });
                    } else if (role === 'player') {
                        navigate(`/play/${game.id}/${playerId}`, { replace: true });
                    }
                } else {
                    console.log('Session restore failed:', result.reason);
                    clearGame();
                }
            })
            .catch((error) => {
                console.error('Session restore error:', error);
                clearGame();
            })
            .finally(() => {
                setIsRestoring(false);
                setRestoreComplete(true);
            });
    }, [isConnected]);

    return {
        isRestoring,
        restoreComplete,
        socketConnected: isConnected
    };
}