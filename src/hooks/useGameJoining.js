// hooks/useGameJoining.js
import { useState, useCallback } from "react";
import useSocket from "../hooks/useSocket";
import useGameStore from "../stores/gameStore";

export default function useGameJoining() {
    const { socket, isConnected } = useSocket();
    const { joinGame } = useGameStore();
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState("");

    const join = useCallback((gameId, playerName) => {
        if (!gameId?.trim()) return setError("Enter bunker ID");
        if (!playerName?.trim()) return setError("Enter your name");

        // Проверяем что socket существует и имеет метод emit
        if (!socket || typeof socket.emit !== 'function') {
            return setError("Socket not available");
        }

        if (!isConnected) {
            return setError("Not connected to server");
        }

        setIsJoining(true);
        setError("");

        const handleJoined = ({ game, player_id }) => {
            joinGame(game, player_id);
            setIsJoining(false);
            cleanup();
            return { success: true, gameId: game.id, playerId: player_id };
        };

        const handleError = ({ message }) => {
            setError(message);
            setIsJoining(false);
            cleanup();
        };

        const cleanup = () => {
            if (socket && typeof socket.off === 'function') {
                socket.off("joined", handleJoined);
                socket.off("error", handleError);
            }
        };

        try {
            socket.emit("join_game", {
                id: gameId.trim().toUpperCase(),
                name: playerName.trim(),
            });

            socket.once("joined", handleJoined);
            socket.once("error", handleError);

            return cleanup;
        } catch (err) {
            setError("Failed to join game");
            setIsJoining(false);
            console.error("Socket emit error:", err);
        }
    }, [socket, isConnected, joinGame]);

    return {
        join,
        isJoining,
        error,
        canJoin: isConnected && socket && typeof socket.emit === 'function'
    };
}