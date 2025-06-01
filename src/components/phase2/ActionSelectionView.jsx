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
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ActionCard from "./ActionCard";
import Phase2SidePanel from "./Phase2SidePanel";
import ResourceTracker from "./ResourceTracker";
import usePhase2Selectors from "../../hooks/usePhase2Selectors";
import usePhase2Actions from "../../hooks/usePhase2Actions";
import {
  PHASE2_UI,
  TEAM_COLORS,
  TEAM_NAMES,
  TEAM_ICONS,
} from "../../constants/phase2";
import BunkerObjects from "./BunkerObjects";
import useGameStore from "../../stores/gameStore";

const ActionContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `
    radial-gradient(circle at 30% 20%, rgba(139, 69, 19, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(178, 34, 34, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)
  `,
  padding: theme.spacing(3),
}));

const TeamHeader = styled(Card)(({ theme, team }) => ({
  background:
    team === PHASE2_UI.TEAMS.BUNKER
      ? "linear-gradient(135deg, rgba(13, 71, 161, 0.2) 0%, rgba(25, 118, 210, 0.1) 100%)"
      : "linear-gradient(135deg, rgba(183, 28, 28, 0.2) 0%, rgba(229, 57, 53, 0.1) 100%)",
  border: `2px solid ${
    team === PHASE2_UI.TEAMS.BUNKER
      ? "rgba(13, 71, 161, 0.4)"
      : "rgba(183, 28, 28, 0.4)"
  }`,
  marginBottom: theme.spacing(3),
}));

const ActionsGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StatusChip = styled(Chip)(({ status, theme }) => {
  const colors = {
    selecting: {
      bg: "rgba(255, 193, 7, 0.2)",
      border: "#ffc107",
      text: "#ffc107",
    },
    waiting: {
      bg: "rgba(156, 39, 176, 0.2)",
      border: "#9c27b0",
      text: "#9c27b0",
    },
    ready: {
      bg: "rgba(76, 175, 80, 0.2)",
      border: "#4caf50",
      text: "#4caf50",
    },
    critical: {
      bg: "rgba(244, 67, 54, 0.2)",
      border: "#f44336",
      text: "#f44336",
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

export default function ActionSelectionView() {
  const {
    isPhase2,
    myTeam,
    bunkerObjects,
    availableActions,
    canMakeAction,
    isMyTurn,
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
    actionQueue,
    bunkerMembers,
    outsideMembers,
    isWaitingForTeam,
    currentPlayer,
    isMyTeamTurn,
    isBunkerCritical,
    currentState,
    activeStatuses,
    teamStats,
  } = usePhase2Selectors();

  const { makeAction, isConnected } = usePhase2Actions();
  const { game } = useGameStore();

  const handleActionSelect = (actionId) => {
    if (!canMakeAction) {
      console.warn("[ACTION_SELECTION] Cannot make action:", {
        canMakeAction,
        isMyTurn,
        currentState,
      });
      return;
    }

    console.log("[ACTION_SELECTION] Making action:", actionId);
    makeAction(actionId);
  };

  // Получаем статистики игрока для расчета шансов успеха
  const getPlayerStats = () => {
    const playerId = useGameStore.getState().playerId;
    if (!game?.characters?.[playerId]) return null;

    return teamStats[myTeam] || null;
  };

  const playerStats = getPlayerStats();

  // Получаем имя текущего игрока
  const getCurrentPlayerName = () => {
    if (!currentPlayer || !game?.players) return currentPlayer;
    const player = game.players.find((p) => p.id === currentPlayer);
    return player?.name || currentPlayer;
  };

  if (!isPhase2 || !myTeam) {
    return (
      <ActionContainer>
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6">Загрузка Phase 2...</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Определение команды и загрузка данных...
            </Typography>
          </CardContent>
        </Card>
      </ActionContainer>
    );
  }

  const teamConfig = {
    name: TEAM_NAMES[myTeam],
    color: TEAM_COLORS[myTeam],
    icon: TEAM_ICONS[myTeam],
    description:
      myTeam === PHASE2_UI.TEAMS.BUNKER
        ? "Защищайте бункер и выживите 10 раундов"
        : "Уничтожьте бункер до истечения времени",
  };

  return (
    <ActionContainer>
      {/* Team Header */}
      <TeamHeader team={myTeam}>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h3" component="span">
                {teamConfig.icon}
              </Typography>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: teamConfig.color,
                    fontFamily: '"Orbitron", monospace',
                    fontWeight: "bold",
                  }}
                >
                  {teamConfig.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {teamConfig.description}
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <StatusChip
                label={`Раунд ${round}/10`}
                status="ready"
                size="small"
              />
              <StatusChip
                label={`HP: ${bunkerHp}/${maxHp}`}
                status={isBunkerCritical ? "critical" : "ready"}
                size="small"
              />
              <StatusChip
                label={
                  isMyTurn
                    ? "ВАШ ХОД"
                    : isMyTeamTurn
                    ? "ХОД КОМАНДЫ"
                    : "ОЖИДАНИЕ"
                }
                status={
                  isMyTurn ? "selecting" : isMyTeamTurn ? "ready" : "waiting"
                }
              />
            </Stack>
          </Box>
        </CardContent>
      </TeamHeader>

      {/* Resources Display */}
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

      {/* Bunker Objects Display */}
      <BunkerObjects bunkerObjects={bunkerObjects} />

      <Grid container spacing={3}>
        {/* Actions Selection */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {isMyTurn ? "Выберите действие" : "Ожидание хода"}
              </Typography>

              {!isConnected && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Подключение к серверу потеряно...
                </Alert>
              )}

              {!isMyTeamTurn && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Сейчас ходит {TEAM_NAMES[currentTeam]}. Ожидайте своей
                  очереди.
                </Alert>
              )}

              {isMyTeamTurn && !isMyTurn && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Ожидается ход игрока:{" "}
                  <strong>{getCurrentPlayerName()}</strong>
                </Alert>
              )}

              {isMyTurn && !canMakeAction && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Ожидается подтверждение от сервера...
                </Alert>
              )}

              {isWaitingForTeam && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Ожидаем действий других игроков команды...
                </Alert>
              )}

              <ActionsGrid container spacing={2}>
                {availableActions.map((action) => (
                  <Grid item xs={12} sm={6} md={4} key={action.id}>
                    <ActionCard
                      action={action}
                      disabled={!canMakeAction}
                      onSelect={() => handleActionSelect(action.id)}
                      myTeam={myTeam}
                      playerStats={playerStats}
                    />
                  </Grid>
                ))}
              </ActionsGrid>

              {availableActions.length === 0 && isMyTurn && (
                <Box textAlign="center" py={4}>
                  <Typography variant="h6" color="text.secondary">
                    Нет доступных действий
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Возможно, все действия заблокированы активными статусами.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ✅ Новая боковая панель с вкладками */}
        <Grid item xs={12} lg={4}>
          <Phase2SidePanel
            myTeam={myTeam}
            currentTeam={currentTeam}
            bunkerMembers={bunkerMembers}
            outsideMembers={outsideMembers}
            actionQueue={actionQueue}
          />
        </Grid>
      </Grid>
    </ActionContainer>
  );
}
