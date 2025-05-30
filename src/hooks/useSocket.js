import { socket } from '../services/socket'; // 👈 Импортируем синглтон
import useGameStore from '../stores/gameStore';

export default function useSocket() {
    // Получаем статус подключения из единственного источника правды — нашего стора
    const isConnected = useGameStore((state) => state.isConnected);

    // Возвращаем инстанс сокета и его реактивное состояние
    return { socket, isConnected };
}