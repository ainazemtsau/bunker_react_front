import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import useGameStore from "../stores/gameStore";

export default function FinishedView({ backToMenu }) {
  const phase2 = useGameStore((s) => s.game.phase2);
  const winner = phase2?.winner;

  if (!winner) return null; // защита, если бек ещё не успел проставить

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Игра окончена!
          </Typography>
          <Typography variant="h6" align="center" mb={3}>
            Победила команда&nbsp;
            <strong>{winner === "bunker" ? "бункера" : "снаружи"}</strong>
          </Typography>
          <Box textAlign="center">
            <Button variant="contained" onClick={backToMenu}>
              В меню
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
