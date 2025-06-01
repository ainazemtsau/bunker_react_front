import React from "react";
import MinigameFromActionView from "./MinigameFromActionView";
import RegularCrisisView from "./RegularCrisisView";
import usePhase2Selectors from "../../hooks/usePhase2Selectors";

export default function CrisisView() {
  const { currentCrisis } = usePhase2Selectors();

  if (!currentCrisis) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Нет активного кризиса</Typography>
      </Box>
    );
  }

  // ✅ НОВАЯ ЛОГИКА: Определяем тип кризиса по ID
  if (currentCrisis.id?.startsWith("action_minigame_")) {
    // Это мини-игра от провалившегося действия команды бункера
    return <MinigameFromActionView crisis={currentCrisis} />;
  } else {
    // Это обычный кризис
    return <RegularCrisisView crisis={currentCrisis} />;
  }
}
