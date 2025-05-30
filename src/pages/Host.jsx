// pages/Host.js
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useSocket from "../hooks/useSocket";
import useGameStore from "../stores/gameStore";
import HostView from "../components/HostView";
import { Typography, Box, Button } from "@mui/material";

export default function HostPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const { game, role, isLoading, error, playerId } = useGameStore();

  useEffect(() => {
    // Если есть роль но нет игры, пытаемся получить её состояние
    if (
      role === "host" &&
      playerId &&
      !game &&
      !isLoading &&
      socket &&
      isConnected
    ) {
      console.log("Host page: requesting game state");
      // Здесь можно запросить состояние игры у сервера
      try {
        socket.emit("get_game_state", { gameId, playerId });
      } catch (err) {
        console.error("Failed to request game state:", err);
      }
    }
  }, [role, playerId, game, isLoading, gameId, socket, isConnected]);

  useEffect(() => {
    if (!isLoading && game) {
      if (role !== "host" || game.id !== gameId) {
        console.log("Host page: access denied, redirecting");
        navigate("/", { replace: true });
      }
    }
  }, [game, role, gameId, navigate, isLoading]);

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

  // Если нет игры но есть права хоста - показываем загрузку
  if (!game && role === "host") {
    return (
      <Box textAlign="center" mt={4}>
        <Typography sx={{ mb: 2 }}>Restoring game session...</Typography>
        <Typography variant="body2" color="textSecondary">
          Game ID: {gameId}
        </Typography>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Back to Lobby
        </Button>
      </Box>
    );
  }

  if (!game || role !== "host") {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>Game not found or access denied</Typography>
        <Button onClick={() => navigate("/")}>Back to Lobby</Button>
      </Box>
    );
  }

  return <HostView gameId={gameId} backToMenu={() => navigate("/")} />;
}
