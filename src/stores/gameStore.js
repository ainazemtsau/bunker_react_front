import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { getSession, saveSession, clearSession } from '../utils/session';

function logStateChange(actionName, newState) {
    console.log(
        `%c[GAME STORE] action: %c${actionName}`,
        'color: #aaa;',
        'color: #1fa71f; font-weight:bold;',
        '\nnew state:', newState
    );
}
function mergeGame(prev, next) {
    // простое поверхностное объединение, чтобы не терять новые ключи
    return { ...prev, ...next };
}

const useGameStore = create(
    subscribeWithSelector((set, get) => {
        // Сюда положим функции-обертки для логирования
        function setWithLog(stateUpdate, actionName) {
            set((prevState) => {
                const updated = typeof stateUpdate === 'function'
                    ? stateUpdate(prevState)
                    : stateUpdate;
                // Объединяем с предыдущим для полного состояния после update:
                const newState = { ...prevState, ...updated };
                logStateChange(actionName, newState);
                return updated;
            });
        }

        // Основное состояние и экшены:
        return {
            game: null,
            playerId: null,
            role: null,
            isLoading: false,
            error: null,
            isConnected: false,

            setLoading: (loading) => setWithLog({ isLoading: loading }, 'setLoading'),
            setError: (error) => setWithLog({ error }, 'setError'),
            setConnected: (connected) => setWithLog({ isConnected: connected }, 'setConnected'),

            initializeFromSession: async (socket) => {
                const session = getSession();
                if (!session) {
                    logStateChange('initializeFromSession (no session)', get());
                    return { success: false, reason: 'no_session' };
                }
                setWithLog({ isLoading: true, error: null }, 'initializeFromSession (start)');
                try {
                    return new Promise((resolve) => {
                        const timeout = setTimeout(() => {
                            setWithLog({ isLoading: false, error: 'Connection timeout' }, 'initializeFromSession (timeout)');
                            resolve({ success: false, reason: 'timeout' });
                        }, 10000);
                        clearTimeout(timeout);
                        setWithLog({
                            playerId: session.playerId,
                            role: session.role,
                            game: { id: session.gameId },
                            isLoading: false,
                            error: null,
                        }, 'initializeFromSession (success)');
                        resolve({
                            success: true,
                            game: { id: session.gameId },
                            playerId: session.playerId,
                            role: session.role
                        });
                    });
                } catch (error) {
                    setWithLog({ isLoading: false, error: error.message }, 'initializeFromSession (error)');
                    return { success: false, reason: 'error', message: error.message };
                }
            },
            getOnlinePlayers: () => {
                const { game } = get();
                if (!game || !game.players) return [];
                // assuming game.players is an object: { [id]: Player }
                return Object.values(game.players).filter(p => p.online);
            },

            createGame: (gameData, playerId) => {
                setWithLog({
                    game: gameData,
                    playerId,
                    role: 'host',
                    error: null
                }, 'createGame');
                saveSession({
                    role: 'host',
                    gameId: gameData.id,
                    playerId
                });
            },

            joinGame: (gameData, playerId) => {
                setWithLog({
                    game: gameData,
                    playerId,
                    role: 'player',
                    error: null
                }, 'joinGame');
                saveSession({
                    role: 'player',
                    gameId: gameData.id,
                    playerId
                });
            },
            updateGame: (gameData) => {
                if (gameData && gameData.game) {
                    setWithLog(
                        (state) => ({
                            game: mergeGame(state.game || {}, gameData.game),
                        }),
                        "updateGame"
                    );
                } else {
                    console.warn("[GAME STORE] updateGame called with invalid data:", gameData);
                }
            },

            sendAction: (socket, actionType, payload = {}) => {
                const { game, playerId } = get();
                if (!game || !socket.connected) {
                    console.warn(`[GAME STORE] sendAction called with invalid state:`, {
                        game,
                        playerId,
                        actionType,
                        payload,
                        connected: socket.connected
                    });
                    console.warn('Cannot send action: game or socket not ready', { game, connected: socket.connected });
                    return;
                }
                socket.emit('game_action', {
                    gameId: game.id,
                    playerId,
                    action: actionType,
                    ...payload
                });
                logStateChange(`sendAction (${actionType})`, get());
            },

            clearGame: () => {
                setWithLog({
                    game: null,
                    playerId: null,
                    role: null,
                    error: null
                }, 'clearGame');
                clearSession();
            },

            subscribeToSocket: (socket) => {
                socket.on('game_updated', (gameData) => {
                    console.log('[[GAME STORE] Game updated:', gameData);
                    get().updateGame(gameData);
                });
                socket.on('game_error', ({ message }) => {
                    get().setError(message);
                });
                socket.on('connect', () => {
                    get().setConnected(true);
                });
                socket.on('disconnect', () => {
                    get().setConnected(false);
                });
                return () => {
                    socket.off('game_updated');
                    socket.off('game_error');
                    socket.off('connect');
                    socket.off('disconnect');
                };
            }
        };
    })
);

export default useGameStore;
