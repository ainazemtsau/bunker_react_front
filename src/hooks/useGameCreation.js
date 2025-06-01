// hooks/useGameCreation.js
import { useState, useCallback } from "react";
import useSocket from "../hooks/useSocket";
import useGameStore from "../stores/gameStore";

export default function useGameCreation() {
    const { socket, isConnected } = useSocket();
    const { createGame } = useGameStore();
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");

    const createHost = useCallback(() => {
        // Проверяем что socket существует и имеет метод emit
        if (!socket || typeof socket.emit !== 'function') {
            return setError("Socket not available");
        }

        if (!isConnected) {
            return setError("Not connected to server");
        }

        setIsCreating(true);
        setError("");

        const handleGameCreated = ({ game, player_id }) => {
            createGame(game, game.host_id);
            setIsCreating(false);
            cleanup();
            return { success: true, gameId: game.id };
        };

        const handleError = ({ message }) => {
            setError(message);
            setIsCreating(false);
            cleanup();
        };

        const cleanup = () => {
            if (socket && typeof socket.off === 'function') {
                socket.off("game_created", handleGameCreated);
                socket.off("error", handleError);
            }
        };

        try {
            socket.emit("create_game", {});
            socket.once("game_created", handleGameCreated);
            socket.once("error", handleError);

            // Возвращаем функцию очистки
            return cleanup;
        } catch (err) {
            setError("Failed to create game");
            setIsCreating(false);
            console.error("Socket emit error:", err);
        }
    }, [socket, isConnected, createGame]);

    return {
        createHost,
        isCreating,
        error,
        canCreate: isConnected && socket && typeof socket.emit === 'function'
    };
}