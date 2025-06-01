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

            // stores/gameStore.js
            // stores/gameStore.js
            initializeFromSession: async (socket) => {
                const session = getSession();
                if (!session) return { success: false, reason: "no_session" };

                return new Promise((resolve) => {
                    let finished = false;
                    function finish(result) {
                        if (!finished) {
                            finished = true;
                            cleanup();
                            resolve(result);
                        }
                    }
                    function cleanup() {
                        socket.off('rejoined', onRejoined);
                        socket.off('error', onError);
                    }
                    const onRejoined = (data) => {
                        console.log('Rejoined game:', data);
                        setWithLog({
                            playerId: data.player_id,
                            role: session.role,
                            game: data.game,
                            isLoading: false,
                            error: null,
                        }, 'initializeFromSession (rejoined)');
                        finish({
                            success: true,
                            game: data.game,
                            playerId: data.player_id,
                            role: session.role
                        });
                    };
                    const onError = (err) => {
                        setWithLog({ isLoading: false, error: err.message }, 'initializeFromSession (error)');
                        finish({ success: false, reason: "error", message: err.message });
                    };
                    socket.on('rejoined', onRejoined);
                    socket.on('error', onError);

                    console.log('Rejoining game with session:', session);
                    socket.emit('rejoin_game', {
                        id: session.gameId,
                        player_id: session.playerId
                    });

                    // Timeout after 10 seconds
                    // setTimeout(() => {
                    //     setWithLog({ isLoading: false, error: 'Connection timeout' }, 'initializeFromSession (timeout)');
                    //     finish({ success: false, reason: "timeout" });
                    // }, 10000);
                });
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
