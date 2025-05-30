import React from "react";
import { Typography, Box } from "@mui/material";
import ActionSelectionView from "./phase2/ActionSelectionView";
import ActionProcessingView from "./phase2/ActionProcessingView";
import CrisisView from "./phase2/CrisisView";
import TurnCompleteView from "./phase2/TurnCompleteView";
import FinishedView from "./FinishedView";
import usePhase2Selectors from "../hooks/usePhase2Selectors";
import { PHASE2_STATES } from "../constants/phase2";

/**
 * Main Phase 2 coordinator component
 * Routes to appropriate sub-component based on current state
 */
export default function Phase2View() {
  const { isPhase2, currentState, isGameFinished } = usePhase2Selectors();

  if (!isPhase2) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Загрузка Phase 2...</Typography>
      </Box>
    );
  }

  if (isGameFinished) {
    return <FinishedView backToMenu={() => (window.location.href = "/")} />;
  }

  // Route to appropriate component based on current state
  switch (currentState) {
    case PHASE2_STATES.PLAYER_ACTION:
    case PHASE2_STATES.WAITING_FOR_TEAM:
      return <ActionSelectionView />;

    case PHASE2_STATES.PROCESSING_ACTIONS:
      return <ActionProcessingView />;

    case PHASE2_STATES.CRISIS_RESOLUTION:
      return <CrisisView />;

    case PHASE2_STATES.TURN_COMPLETE:
      return <TurnCompleteView />;

    default:
      return (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">
            Неизвестное состояние: {currentState}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Доступные состояния: {Object.values(PHASE2_STATES).join(", ")}
          </Typography>
        </Box>
      );
  }
}
