import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";

const VotingPhase = ({ game, playerId, onVote }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">Voting!</Typography>
      {game.available_actions.includes("cast_vote") ? (
        <Box>
          {game.players
            .filter(
              (p) => !game.eliminated_ids.includes(p.id) && p.id !== playerId
            )
            .map((p) => (
              <Button key={p.id} sx={{ m: 1 }} onClick={() => onVote(p.id)}>
                {p.name}
              </Button>
            ))}
        </Box>
      ) : (
        <Chip label="Waiting for results…" />
      )}
    </CardContent>
  </Card>
);

export default VotingPhase;
