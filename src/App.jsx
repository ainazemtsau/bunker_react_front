// App.js
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import Lobby from "./pages/Lobby";
import Host from "./pages/Host";
import Player from "./pages/Player";
import useAppInitialization from "./hooks/useAppInitialization";
import useSocketManager from "./hooks/useSocketManager";

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Lobby />} />
      <Route path="/host/:gameId" element={<Host />} />
      <Route path="/play/:gameId/:playerId" element={<Player />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  useSocketManager();
  const { isLoading, isInitialized, error, clearGame } = useAppInitialization();

  if (!isInitialized) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress />
        <Typography>
          {isLoading
            ? "Connecting and restoring session..."
            : "Initializing..."}
        </Typography>

        {error && (
          <Box textAlign="center">
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                clearGame();
                window.location.reload();
              }}
            >
              Restart App
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  return <AppContent />;
}
