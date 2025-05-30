import { useState, useEffect, useCallback } from "react";

export default function useGameState(socket, gameId, initialGame = null) {
    const [game, setGame] = useState(initialGame);

    useEffect(() => {
        if (!socket) return;
        const handler = ({ game }) => setGame(game);

        socket.on("game_updated", handler);
        socket.on("game_created", handler);
        socket.on("joined", handler);
        socket.on("rejoined", handler);

        return () =>
            ["game_updated", "game_created", "joined", "rejoined"].forEach(ev =>
                socket.off(ev, handler)
            );
    }, [socket]);

    const sendAction = useCallback(
        (action, data) => {
            socket.emit("game_action", { game_id: gameId, action, data });
        },
        [socket, gameId]
    );

    return { game, sendAction };
}