import { Card, CardContent, Typography, Button } from "@mui/material";

export default function DiscussionPhase({ game, sendAction }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Discussion
        </Typography>
        <Typography>
          Discuss the last revealed attribute. When finished, click below to
          continue.
        </Typography>
        <Button
          variant="contained"
          onClick={() => sendAction("end_discussion")}
          disabled={!game.available_actions.includes("end_discussion")}
          sx={{ mt: 2 }}
        >
          Discussion Ended
        </Button>
      </CardContent>
    </Card>
  );
}
