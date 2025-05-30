import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";

export default function BunkerPhase({ game, sendAction }) {
  const opened = game.bunker_reveal_idx ?? 0;
  const total = 5;
  const canOpen = game.available_actions?.includes("open_bunker");

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Бункер — открыта карта {opened}/{total}
        </Typography>

        <Typography mb={2}>
          Нажмите кнопку, чтобы открыть следующую карту бункера.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => sendAction("open_bunker")}
          disabled={!canOpen}
        >
          Открыть карту
        </Button>

        <Box mt={2}>
          <Chip label={`Открыто: ${opened}/${total}`} color="success" />
        </Box>
      </CardContent>
    </Card>
  );
}
