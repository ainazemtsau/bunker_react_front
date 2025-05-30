import { Box, Typography } from "@mui/material";
import useGameStore from "../stores/gameStore";
import useGameActions from "../hooks/useGameActions";

import LobbyPhase from "./host/LobbyPhase";
import BunkerPhase from "./host/BunkerPhase";
import RevealPhase from "./host/RevealPhase";
import DiscussionPhase from "./host/DiscussionPhase";
import VotingPhase from "./host/VotingPhase";
import BunkerCardsBar from "./BunkerCardsBar";
import Phase2View from "./Phase2View";
import FinishedView from "./FinishedView";
export default function HostView() {
  const { game } = useGameStore();
  const { sendAction, isConnected } = useGameActions();

  if (!game) return <Typography align="center">Loading…</Typography>;
  if (!isConnected)
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="warning">Connecting to server…</Typography>
      </Box>
    );

  let PhaseUI;
  switch (game.phase) {
    case "lobby":
      PhaseUI = <LobbyPhase game={game} sendAction={sendAction} />;
      break;
    case "bunker":
      PhaseUI = <BunkerPhase game={game} sendAction={sendAction} />;
      break;
    case "reveal":
      PhaseUI = <RevealPhase game={game} sendAction={sendAction} />;
      break;
    case "discussion":
      PhaseUI = <DiscussionPhase game={game} sendAction={sendAction} />;
      break;
    case "voting":
      PhaseUI = <VotingPhase game={game} sendAction={sendAction} />;
      break;
    case "phase2":
      PhaseUI = <Phase2View />;
      break;
    case "finished":
      PhaseUI = (
        <FinishedView backToMenu={() => (window.location.href = "/")} />
      );
      break;
    default:
      PhaseUI = (
        <Typography color="error">Unknown phase: {game.phase}</Typography>
      );
  }

  const isReveal = game.phase === "reveal";

  return (
    <>
      {isReveal ? (
        PhaseUI
      ) : (
        <Box sx={{ px: 2, py: 3 }}>
          <Typography variant="h2" align="center" gutterBottom>
            🏠 BUNKER CONTROL
          </Typography>
          {PhaseUI}
        </Box>
      )}

      <BunkerCardsBar cards={game.revealed_bunker_cards} />
    </>
  );
}
