import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Chip,
} from "@mui/material";

export default function VotingPhase({ game, sendAction }) {
  const voted = game.voting_status?.voted_count || 0;
  const total = game.voting_status?.total_count || 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Voting
        </Typography>
        <Typography>
          All players are voting. <Chip label={`Voted: ${voted}/${total}`} />
        </Typography>
        {/* Голосование у игроков, хост просто ждет */}
        {game.available_actions.includes("reveal_results") && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => sendAction("reveal_results")}
            >
              Reveal Results
            </Button>
          </Box>
        )}
        <List>
          {game.players.map((p) => (
            <ListItem key={p.id}>
              <ListItemText
                primary={p.name}
                secondary={
                  game.eliminated_ids.includes(p.id) ? "KICKED" : "In bunker"
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
