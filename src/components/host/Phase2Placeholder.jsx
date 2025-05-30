import { Card, CardContent, Typography } from "@mui/material";

export default function Phase2Placeholder() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          PHASE 2!
        </Typography>
        <Typography>
          Здесь будет логика второй фазы: кризисы, взаимодействие с бункером и
          т.д.
        </Typography>
      </CardContent>
    </Card>
  );
}
