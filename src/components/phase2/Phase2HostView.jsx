import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import usePhase2Selectors from "../../hooks/usePhase2Selectors";
import {
  PHASE2_UI,
  TEAM_COLORS,
  TEAM_NAMES,
  TEAM_ICONS,
} from "../../constants/phase2";
import ResourceTracker from "./ResourceTracker";
import BunkerObjects from "./BunkerObjects";
import Phase2SidePanel from "./Phase2SidePanel";
import ActionProcessingView from "./ActionProcessingView";
import CrisisView from "./CrisisView";
import TurnCompleteView from "./TurnCompleteView";
import FinishedView from "../FinishedView";

const HostContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `
    radial-gradient(circle at 30% 20%, rgba(139, 69, 19, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(178, 34, 34, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)
  `,
  padding: theme.spacing(3),
}));

const GameHeader = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(0, 188, 212, 0.2) 0%, rgba(0, 188, 212, 0.1) 100%)",
  border: "2px solid rgba(0, 188, 212, 0.4)",
  marginBottom: theme.spacing(3),
}));

const StatusChip = styled(Chip)(({ status, theme }) => {
  const colors = {
    processing: {
      bg: "rgba(255, 193, 7, 0.2)",
      border: "#ffc107",
      text: "#ffc107",
    },
    crisis: {
      bg: "rgba(255, 87, 34, 0.2)",
      border: "#ff5722",
      text: "#ff5722",
    },
    complete: {
      bg: "rgba(76, 175, 80, 0.2)",
      border: "#4caf50",
      text: "#4caf50",
    },
    waiting: {
      bg: "rgba(156, 39, 176, 0.2)",
      border: "#9c27b0",
      text: "#9c27b0",
    },
  };

  const color = colors[status] || colors.waiting;

  return {
    background: color.bg,
    border: `1px solid ${color.border}`,
    color: color.text,
    fontWeight: "bold",
  };
});

export default function Phase2HostView() {
  const {
    currentState,
    currentTeam,
    round,
    bunkerHp,
    maxHp,
    morale,
    maxMorale,
    supplies,
    maxSupplies,
    moraleCountdown,
    suppliesCountdown,
    bunkerObjects,
    bunkerMembers,
    outsideMembers,
    actionQueue,
    currentPlayer,
    isGameFinished,
    winner,
  } = usePhase2Selectors();

  const getStateDisplay = () => {
    switch (currentState) {
      case PHASE2_UI.STATES.PLAYER_ACTION:
      case PHASE2_UI.STATES.WAITING_FOR_TEAM:
        return { status: "waiting", label: "Выбор действий" };
      case PHASE2_UI.STATES.PROCESSING_ACTIONS:
        return { status: "processing", label: "Обработка действий" };
      case PHASE2_UI.STATES.CRISIS_RESOLUTION:
        return { status: "crisis", label: "Кризис!" };
      case PHASE2_UI.STATES.TURN_COMPLETE:
        return { status: "complete", label: "Ход завершен" };
      case PHASE2_UI.STATES.GAME_FINISHED:
        return { status: "complete", label: "Игра окончена" };
      default:
        return { status: "waiting", label: "Ожидание" };
    }
  };

  const stateDisplay = getStateDisplay();

  // Показываем специальные экраны для определенных состояний
  switch (currentState) {
    case PHASE2_UI.STATES.PROCESSING_ACTIONS:
      return <ActionProcessingView />;
    case PHASE2_UI.STATES.CRISIS_RESOLUTION:
      return <CrisisView />;
    case PHASE2_UI.STATES.TURN_COMPLETE:
      return <TurnCompleteView />;
    case PHASE2_UI.STATES.GAME_FINISHED:
      return <FinishedView backToMenu={() => (window.location.href = "/")} />;
  }

  return (
    <HostContainer>
      {/* Game Header */}
      <GameHeader>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h3" component="span">
                🏠
              </Typography>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Orbitron", monospace',
                    fontWeight: "bold",
                    background: "linear-gradient(45deg, #00bcd4, #0097a7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  BUNKER CONTROL CENTER
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Полное управление игрой Phase 2
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <StatusChip
                label={`Раунд ${round}/10`}
                status="waiting"
                size="small"
              />
              <StatusChip
                label={stateDisplay.label}
                status={stateDisplay.status}
              />
              <Stack direction="row" spacing={1}>
                <Typography variant="h4" component="span">
                  {TEAM_ICONS[currentTeam]}
                </Typography>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color={TEAM_COLORS[currentTeam]}
                  >
                    {TEAM_NAMES[currentTeam]}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Активная команда
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </GameHeader>

      {/* Resources and Status */}
      <ResourceTracker
        bunkerHp={bunkerHp}
        maxHp={maxHp}
        morale={morale}
        maxMorale={maxMorale}
        supplies={supplies}
        maxSupplies={maxSupplies}
        moraleCountdown={moraleCountdown}
        suppliesCountdown={suppliesCountdown}
        round={round}
      />

      {/* Bunker Objects */}
      <BunkerObjects bunkerObjects={bunkerObjects} />

      <Grid container spacing={3}>
        {/* Current Action Status */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                🎯 Текущее состояние игры
              </Typography>

              {currentState === PHASE2_UI.STATES.PLAYER_ACTION && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Ожидание выбора действия
                  </Typography>
                  <Typography variant="body2">
                    Игрок {currentPlayer} выбирает действие для команды{" "}
                    {TEAM_NAMES[currentTeam]}
                  </Typography>
                </Alert>
              )}

              {currentState === PHASE2_UI.STATES.WAITING_FOR_TEAM && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Ожидание команды
                  </Typography>
                  <Typography variant="body2">
                    Игроки команды {TEAM_NAMES[currentTeam]} выбирают свои
                    действия
                  </Typography>
                </Alert>
              )}

              {/* Action Queue */}
              {Object.keys(actionQueue).length > 0 && (
                <Box mt={2}>
                  <Typography variant="h6" gutterBottom>
                    📋 Очередь действий команды {TEAM_NAMES[currentTeam]}
                  </Typography>
                  <Stack spacing={1}>
                    {Object.entries(actionQueue).map(([actionType, group]) => (
                      <Card
                        key={actionType}
                        sx={{ bgcolor: "rgba(0,0,0,0.2)" }}
                      >
                        <CardContent sx={{ py: 2 }}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              {actionType}
                            </Typography>
                            <Chip
                              label={`${
                                group.participants?.length || 0
                              } участник${
                                (group.participants?.length || 0) === 1
                                  ? ""
                                  : (group.participants?.length || 0) < 5
                                  ? "а"
                                  : "ов"
                              }`}
                              size="small"
                              color="primary"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Участники:{" "}
                            {group.participants?.join(", ") || "Неизвестно"}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}

              {Object.keys(actionQueue).length === 0 &&
                currentState === PHASE2_UI.STATES.WAITING_FOR_TEAM && (
                  <Alert severity="info">
                    Команда {TEAM_NAMES[currentTeam]} еще не выбрала действия
                  </Alert>
                )}
            </CardContent>
          </Card>
        </Grid>

        {/* Side Panel with all tabs */}
        <Grid item xs={12} lg={4}>
          <Phase2SidePanel
            myTeam={null} // Host sees all teams
            currentTeam={currentTeam}
            bunkerMembers={bunkerMembers}
            outsideMembers={outsideMembers}
            actionQueue={actionQueue}
          />
        </Grid>
      </Grid>
    </HostContainer>
  );
}
