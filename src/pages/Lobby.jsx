import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Grid,
  Alert,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import useGameStore from "../stores/gameStore";
import useGameCreation from "../hooks/useGameCreation";
import useGameJoining from "../hooks/useGameJoining";
import GradientButton from "../components/GradientButton";
import NetworkStatus from "../components/NetworkStatus";

export default function Lobby() {
  const navigate = useNavigate();
  const { error: storeError, clearGame } = useGameStore();

  // Отдельные хуки для создания и присоединения к игре
  const {
    createHost,
    isCreating,
    error: createError,
    canCreate,
  } = useGameCreation();

  const { join, isJoining, error: joinError, canJoin } = useGameJoining();

  const [nick, setNick] = useState("");
  const [code, setCode] = useState("");

  // Очищаем предыдущую игру при заходе в лобби
  useEffect(() => {
    clearGame();
  }, [clearGame]);

  const handleCreateHost = async () => {
    const cleanup = createHost();

    // Если создание прошло успешно, перенаправляем
    // Это будет обработано в хуке через createGame
    if (cleanup && typeof cleanup === "function") {
      // Функция очистки будет вызвана автоматически в хуке
      return cleanup;
    }
  };

  const handleJoin = () => {
    const cleanup = join(code, nick);

    // Если присоединение прошло успешно, перенаправляем
    // Это будет обработано в хуке через joinGame
    if (cleanup && typeof cleanup === "function") {
      // Функция очистки будет вызвана автоматически в хуке
      return cleanup;
    }
  };

  // Перенаправление после успешного создания игры
  const { game, role } = useGameStore();
  useEffect(() => {
    if (game && role === "host") {
      navigate(`/host/${game.id}`, { replace: true });
    } else if (game && role === "player") {
      // playerId должен быть в store
      const { playerId } = useGameStore.getState();
      navigate(`/play/${game.id}/${playerId}`, { replace: true });
    }
  }, [game, role, navigate]);

  // Собираем все ошибки
  const displayError = createError || joinError || storeError;

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h1">🏠 BUNKER</Typography>

      {displayError && (
        <Alert severity="error" sx={{ maxWidth: 400, mx: "auto", mb: 2 }}>
          {displayError}
        </Alert>
      )}

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Host bunker
              </Typography>
              <GradientButton
                fullWidth
                startIcon={<HomeIcon />}
                onClick={handleCreateHost}
                disabled={!canCreate || isCreating}
                loading={isCreating}
              >
                {isCreating
                  ? "CREATING..."
                  : !canCreate
                  ? "CONNECTING..."
                  : "CREATE"}
              </GradientButton>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Join survivors
              </Typography>
              <TextField
                label="Your name"
                fullWidth
                sx={{ my: 1 }}
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                disabled={!canJoin || isJoining}
              />
              <TextField
                label="Bunker ID"
                fullWidth
                sx={{ mb: 2 }}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyPress={(e) =>
                  e.key === "Enter" && canJoin && !isJoining && handleJoin()
                }
                disabled={!canJoin || isJoining}
              />
              <GradientButton
                color="secondary"
                fullWidth
                startIcon={<GroupAddIcon />}
                onClick={handleJoin}
                disabled={!canJoin || isJoining || !nick.trim() || !code.trim()}
                loading={isJoining}
              >
                {isJoining ? "JOINING..." : !canJoin ? "CONNECTING..." : "JOIN"}
              </GradientButton>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <NetworkStatus />
    </Box>
  );
}
