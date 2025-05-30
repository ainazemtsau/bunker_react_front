// hooks/useAppInitialization.js
import useSessionRestore from './useSessionRestore.js';
import useGameStore from '../stores/gameStore';

export default function useAppInitialization() {
    // useSocketSubscription() больше не нужен здесь
    const { isRestoring, restoreComplete, socketConnected } = useSessionRestore();
    const { error, clearGame } = useGameStore();

    // isInitialized теперь зависит от состояния подключения из стора,
    // которое управляется useSocketManager
    const isInitialized = restoreComplete && socketConnected;

    return {
        isLoading: isRestoring || !socketConnected,
        isInitialized,
        error,
        clearGame
    };
}