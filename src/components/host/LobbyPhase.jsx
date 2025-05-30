// components/host/LobbyPhase.js
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";

export default function LobbyPhase({ game, sendAction }) {
  const handleStartGame = () => {
    console.log("Starting game...");
    sendAction("start_game");
  };

  const playersCount = game.players
    ? Array.isArray(game.players)
      ? game.players.length
      : Object.keys(game.players).length
    : 0;

  const canStartGame =
    game.available_actions &&
    Array.isArray(game.available_actions) &&
    game.available_actions.includes("start_game");

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Lobby — waiting for players
        </Typography>
        <Box sx={{ my: 2 }}>
          <Chip label={`ID ${game.id}`} color="primary" />
          <Chip label={`Players: ${playersCount}`} sx={{ ml: 2 }} />
        </Box>
        <Button
          variant="contained"
          size="large"
          disabled={!canStartGame}
          onClick={handleStartGame}
        >
          Start Game
        </Button>

        {/* Отладочная информация */}
        {process.env.NODE_ENV === "development" && (
          <Box sx={{ mt: 2, p: 1, bgcolor: "grey.100", fontSize: "0.8rem" }}>
            <Typography variant="caption">
              Debug: Available actions: {JSON.stringify(game.available_actions)}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
