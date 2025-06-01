import { useCallback } from 'react';
import useSocket from './useSocket';
import useGameStore from '../stores/gameStore';
import { PHASE2_UI } from '../constants/phase2';

/**
 * Phase 2 specific actions hook according to documentation
 */
export default function usePhase2Actions() {
    const { socket, isConnected } = useSocket();
    const { game, playerId } = useGameStore();

    const sendPhase2Event = useCallback((eventName, payload = {}) => {
        if (!socket || typeof socket.emit !== 'function') {
            console.warn('[PHASE2_ACTIONS] Socket not available');
            return false;
        }

        if (!isConnected) {
            console.warn('[PHASE2_ACTIONS] Socket not connected');
            return false;
        }

        if (!game) {
            console.warn('[PHASE2_ACTIONS] No active game');
            return false;
        }

        console.log(`[PHASE2_ACTIONS] Sending ${eventName}:`, payload);

        try {
            socket.emit(eventName, {
                gameId: game.id,
                playerId,
                ...payload
            });
            return true;
        } catch (error) {
            console.error(`[PHASE2_ACTIONS] Failed to send ${eventName}:`, error);
            return false;
        }
    }, [socket, isConnected, game, playerId]);

    // ✅ Действие игрока согласно документации
    const makeAction = useCallback((actionId, params = {}) => {
        return sendPhase2Event(PHASE2_UI.EVENTS.PLAYER_ACTION, {
            actionId,
            params
        });
    }, [sendPhase2Event]);

    // ✅ Обработка действий согласно документации
    const processAction = useCallback(() => {
        return sendPhase2Event(PHASE2_UI.EVENTS.PROCESS_ACTION);
    }, [sendPhase2Event]);

    // ✅ Разрешение кризиса согласно документации
    const resolveCrisis = useCallback((result) => {
        if (!['bunker_win', 'bunker_lose'].includes(result)) {
            console.error('[PHASE2_ACTIONS] Invalid crisis result:', result);
            return false;
        }

        return sendPhase2Event(PHASE2_UI.EVENTS.RESOLVE_CRISIS, {
            result
        });
    }, [sendPhase2Event]);

    // ✅ Завершение хода команды согласно документации
    const finishTeamTurn = useCallback(() => {
        return sendPhase2Event(PHASE2_UI.EVENTS.FINISH_TURN);
    }, [sendPhase2Event]);

    // ✅ НОВОЕ: Получение предварительного расчета действия
    const getActionPreview = useCallback((participants, actionId) => {
        if (!socket || typeof socket.emit !== 'function') {
            console.warn('[PHASE2_ACTIONS] Socket not available for preview');
            return false;
        }

        if (!isConnected || !game) {
            console.warn('[PHASE2_ACTIONS] Not connected or no game for preview');
            return false;
        }

        console.log('[PHASE2_ACTIONS] Requesting action preview:', { participants, actionId });

        try {
            socket.emit('phase2_get_action_preview', {
                gameId: game.id,
                participants,
                actionId
            });
            return true;
        } catch (error) {
            console.error('[PHASE2_ACTIONS] Failed to request action preview:', error);
            return false;
        }
    }, [socket, isConnected, game]);

    return {
        makeAction,
        processAction,
        resolveCrisis,
        finishTeamTurn,
        getActionPreview, // ✅ Новый метод
        isConnected: isConnected && !!socket
    };
}