import React, { useState, useEffect } from "react";
import { Box, Snackbar, Typography } from "@mui/material";
import useGameStore from "../stores/gameStore";
import useGameActions from "../hooks/useGameActions";

import LobbyPhase from "./player/LobbyPhase";
import RevealPhase from "./player/RevealPhase";
import DiscussionPhase from "./player/DiscussionPhase";
import VotingPhase from "./player/VotingPhase";
import Phase2View from "./Phase2View";
import BunkerCardsBar from "../components/BunkerCardsBar";
import LoadingView from "./LoadingView";
import ExiledView from "./player/ExiledView";
import FinishedView from "./FinishedView";

export default function PlayerView({ backToMenu }) {
  const { game } = useGameStore();
  const playerId = useGameStore((s) => s.playerId);
  const { sendAction } = useGameActions();

  const [snack, setSnack] = useState("");

  /* ─── side-effects ───────────────────────────── */
  useEffect(() => {
    if (game && game.eliminated_ids.includes(playerId)) {
      setSnack("You were kicked from the bunker!");
    }
  }, [game, playerId]);

  const handleCloseSnack = () => setSnack("");

  /* ─── helpers for reveal & vote ──────────────── */
  const handleReveal = (attribute) => {
    sendAction("reveal", { player_id: playerId, attribute });
  };

  const handleVote = (targetId) => {
    sendAction("cast_vote", { voter_id: playerId, target_id: targetId });
  };

  const isKickedBeforePhase2 =
    game.phase !== "phase2" && game.eliminated_ids.includes(playerId);

  /* ─── guards ─────────────────────────────────── */
  if (!game) return <LoadingView />;

  if (isKickedBeforePhase2) {
    return (
      <>
        <ExiledView backToMenu={backToMenu} />
        <Snackbar
          open={Boolean(snack)}
          message={snack}
          autoHideDuration={3000}
          onClose={handleCloseSnack}
        />
      </>
    );
  }

  /* ─── phase switch ───────────────────────────── */
  let PhaseComponent;
  let phaseProps = {};

  switch (game.phase) {
    case "lobby":
      PhaseComponent = LobbyPhase;
      break;

    case "reveal":
      PhaseComponent = RevealPhase;
      phaseProps = { game, playerId, onReveal: handleReveal };
      break;

    case "discussion":
      PhaseComponent = DiscussionPhase;
      break;

    case "voting":
      PhaseComponent = VotingPhase;
      phaseProps = { game, playerId, onVote: handleVote };
      break;

    case "phase2":
      PhaseComponent = Phase2View;
      break;
    case "finished":
      return <FinishedView backToMenu={() => (window.location.href = "/")} />;

      break;
    default:
      return <Typography>Unknown phase: {game.phase}</Typography>;
  }

  /* ─── render ─────────────────────────────────── */
  return (
    <>
      <Box sx={{ pb: 12 }}>
        <PhaseComponent {...phaseProps} />
      </Box>

      <BunkerCardsBar cards={game.revealed_bunker_cards} />

      <Snackbar
        open={Boolean(snack)}
        message={snack}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
      />
    </>
  );
}
