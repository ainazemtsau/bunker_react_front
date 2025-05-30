import { Card, CardContent, Typography } from "@mui/material";

/** Игроки просто ждут, пока хост откроет карту */
export default function BunkerPhase() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Ожидаем, пока хост откроет карту…</Typography>
      </CardContent>
    </Card>
  );
}
