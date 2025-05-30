import { useCallback } from 'react';
import useSocket from './useSocket';
import useGameStore from '../stores/gameStore';
import { PHASE2_API_ACTIONS } from '../constants/phase2';

/**
 * Phase 2 specific actions hook
 */
export default function usePhase2Actions() {
    const { socket, isConnected } = useSocket();
    const { game, playerId } = useGameStore();

    const sendPhase2Action = useCallback((action, payload = {}) => {
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

        console.log(`Sending Phase 2 action: ${action}`, payload);

        try {
            socket.emit('game_action', {
                gameId: game.id,
                action,
                payload: {
                    ...payload,
                    player_id: playerId // Always include current player ID
                }
            });
        } catch (error) {
            console.error('Failed to send Phase 2 action:', error);
        }
    }, [socket, isConnected, game, playerId]);

    // Specific action methods
    const makeAction = useCallback((actionId, params = {}) => {
        sendPhase2Action(PHASE2_API_ACTIONS.MAKE_ACTION, {
            action_id: actionId,
            params
        });
    }, [sendPhase2Action]);

    const processAction = useCallback(() => {
        sendPhase2Action(PHASE2_API_ACTIONS.PROCESS_ACTION);
    }, [sendPhase2Action]);

    const resolveCrisis = useCallback((result) => {
        sendPhase2Action(PHASE2_API_ACTIONS.RESOLVE_CRISIS, {
            result // 'bunker_win' or 'bunker_lose'
        });
    }, [sendPhase2Action]);

    const finishTeamTurn = useCallback(() => {
        sendPhase2Action(PHASE2_API_ACTIONS.FINISH_TEAM_TURN);
    }, [sendPhase2Action]);

    return {
        makeAction,
        processAction,
        resolveCrisis,
        finishTeamTurn,
        isConnected: isConnected && !!socket
    };
}