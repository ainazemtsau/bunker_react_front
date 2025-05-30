// pages/Player.js
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useMediaQuery, Typography, Box, Button } from "@mui/material";
import useSocket from "../hooks/useSocket";
import useGameStore from "../stores/gameStore";
import PlayerView from "../components/PlayerView";

export default function PlayerPage() {
  const { gameId, playerId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const isMobile = useMediaQuery("(max-width:600px)");
  const {
    game,
    role,
    playerId: storePlayerId,
    isLoading,
    error,
  } = useGameStore();

  useEffect(() => {
    // Если есть роль но нет игры, пытаемся получить её состояние
    if (role === "player" && storePlayerId && !game && !isLoading) {
      console.log("Player page: requesting game state");
      // socket.emit('get_game_state', { gameId, playerId: storePlayerId });
    }
  }, [role, storePlayerId, game, isLoading, gameId, socket]);

  useEffect(() => {
    // Проверяем права доступа только если загрузка завершена
    if (!isLoading && game) {
      if (
        role !== "player" ||
        game.id !== gameId ||
        storePlayerId !== playerId
      ) {
        console.log("Player page: access denied, redirecting");
        navigate("/", { replace: true });
      }
    }
  }, [game, role, gameId, playerId, storePlayerId, navigate, isLoading]);

  if (isLoading) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>Loading game...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error}
        </Typography>
        <Button onClick={() => navigate("/")}>Back to Lobby</Button>
      </Box>
    );
  }

  // Временно: если нет игры но есть права игрока
  if (!game && role === "player" && storePlayerId === playerId) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography sx={{ mb: 2 }}>Restoring game session...</Typography>
        <Typography variant="body2" color="textSecondary">
          Game ID: {gameId}
          <br />
          Player ID: {playerId}
        </Typography>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Back to Lobby
        </Button>
      </Box>
    );
  }

  if (!game || role !== "player" || storePlayerId !== playerId) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>Game not found or access denied</Typography>
        <Button onClick={() => navigate("/")}>Back to Lobby</Button>
      </Box>
    );
  }

  return (
    <PlayerView
      socket={socket}
      gameId={gameId}
      playerId={playerId}
      backToMenu={() => navigate("/")}
      mobile={isMobile}
    />
  );
}
