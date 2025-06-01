import React from "react";
import { Typography, Box } from "@mui/material";
import Phase2PlayerView from "./phase2/Phase2PlayerView";
import Phase2HostView from "./phase2/Phase2HostView";
import ActionProcessingView from "./phase2/ActionProcessingView";
import CrisisView from "./phase2/CrisisView";
import TurnCompleteView from "./phase2/TurnCompleteView";
import FinishedView from "./FinishedView";
import usePhase2Selectors from "../hooks/usePhase2Selectors";
import useGameStore from "../stores/gameStore";
import { PHASE2_UI } from "../constants/phase2";

/**
 * Main Phase 2 coordinator component
 * Routes between Player and Host views based on role
 */
export default function Phase2View() {
  const { isPhase2, currentState, isGameFinished } = usePhase2Selectors();

  const role = useGameStore((s) => s.role);

  console.log("[PHASE2_VIEW] Routing state:", {
    isPhase2,
    currentState,
    isGameFinished,
    role,
  });

  if (!isPhase2) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Загрузка Phase 2...</Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Ожидание данных с сервера...
        </Typography>
      </Box>
    );
  }

  // Проверяем завершение игры первым приоритетом
  if (isGameFinished) {
    return <FinishedView backToMenu={() => (window.location.href = "/")} />;
  }

  // Специальные состояния, которые показываются одинаково для всех
  switch (currentState) {
    case PHASE2_UI.STATES.GAME_FINISHED:
      return <FinishedView backToMenu={() => (window.location.href = "/")} />;
  }

  // Маршрутизация по ролям
  if (role === "host") {
    // Хост видит полный интерфейс управления
    return <Phase2HostView />;
  } else {
    // Игроки видят упрощенный мобильный интерфейс
    // Некоторые состояния все равно показываются через специальные компоненты
    switch (currentState) {
      case PHASE2_UI.STATES.PROCESSING_ACTIONS:
        return <ActionProcessingView />;
      case PHASE2_UI.STATES.CRISIS_RESOLUTION:
        return <CrisisView />;
      case PHASE2_UI.STATES.TURN_COMPLETE:
        return <TurnCompleteView />;
      default:
        return <Phase2PlayerView />;
    }
  }
}
