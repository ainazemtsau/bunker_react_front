import { Box, Chip, Alert } from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayArrowRounded";
import GradientButton from "../GradientButton";

export default function HostHeader({ game, aliveCount, onStart }) {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Chip label={`ID ${game.id}`} color="primary" />
      <Chip
        label={game.status.toUpperCase()}
        color={game.status === "waiting" ? "warning" : "success"}
      />

      {game.status === "waiting" && (
        <GradientButton
          startIcon={<PlayIcon />}
          disabled={aliveCount < 2}
          sx={{ ml: "auto" }}
          onClick={onStart}
        >
          Start
        </GradientButton>
      )}

      {game.status === "waiting" && aliveCount < 2 && (
        <Alert severity="warning" sx={{ ml: 3, py: 0.5 }}>
          Need at least two survivors
        </Alert>
      )}
    </Box>
  );
}
