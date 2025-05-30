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
import TeamStatusPanel from "./TeamStatusPanel";
import usePhase2Selectors from "../../hooks/usePhase2Selectors";
import usePhase2Actions from "../../hooks/usePhase2Actions";
import { TEAMS } from "../../constants/phase2";

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
    team === TEAMS.BUNKER
      ? "linear-gradient(135deg, rgba(13, 71, 161, 0.2) 0%, rgba(25, 118, 210, 0.1) 100%)"
      : "linear-gradient(135deg, rgba(183, 28, 28, 0.2) 0%, rgba(229, 57, 53, 0.1) 100%)",
  border: `2px solid ${
    team === TEAMS.BUNKER ? "rgba(13, 71, 161, 0.4)" : "rgba(183, 28, 28, 0.4)"
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
    ready: { bg: "rgba(76, 175, 80, 0.2)", border: "#4caf50", text: "#4caf50" },
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
    availableActions,
    canMakeAction,
    isMyTurn,
    currentTeam,
    round,
    bunkerHp,
    maxHp,
    actionQueue,
    bunkerMembers,
    outsideMembers,
    isWaitingForTeam,
  } = usePhase2Selectors();

  const { makeAction, isConnected } = usePhase2Actions();

  const handleActionSelect = (actionId) => {
    if (!canMakeAction) return;
    makeAction(actionId);
  };

  // Team colors and names
  const teamConfig = {
    [TEAMS.BUNKER]: {
      name: "КОМАНДА БУНКЕРА",
      color: "#1976d2",
      icon: "🏠",
      description: "Защищайте бункер и выживите 10 раундов",
    },
    [TEAMS.OUTSIDE]: {
      name: "КОМАНДА СНАРУЖИ",
      color: "#d32f2f",
      icon: "⚔️",
      description: "Уничтожьте бункер до истечения времени",
    },
  };

  const currentTeamConfig = teamConfig[myTeam];

  if (!isPhase2 || !myTeam) {
    return (
      <ActionContainer>
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6">Загрузка Phase 2...</Typography>
          </CardContent>
        </Card>
      </ActionContainer>
    );
  }

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
                {currentTeamConfig.icon}
              </Typography>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: currentTeamConfig.color,
                    fontFamily: '"Orbitron", monospace',
                    fontWeight: "bold",
                  }}
                >
                  {currentTeamConfig.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {currentTeamConfig.description}
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
                status={bunkerHp <= 3 ? "warning" : "ready"}
                size="small"
              />
              <StatusChip
                label={isMyTurn ? "ВАШ ХОД" : "ОЖИДАНИЕ"}
                status={isMyTurn ? "selecting" : "waiting"}
              />
            </Stack>
          </Box>
        </CardContent>
      </TeamHeader>

      <Grid container spacing={3}>
        {/* Actions Selection */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Выберите действие
              </Typography>

              {!isConnected && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Подключение к серверу потеряно...
                </Alert>
              )}

              {!canMakeAction && isMyTurn && (
                <Alert severity="info" sx={{ mb: 2 }}>
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
                    />
                  </Grid>
                ))}
              </ActionsGrid>

              {availableActions.length === 0 && (
                <Box textAlign="center" py={4}>
                  <Typography variant="h6" color="text.secondary">
                    Нет доступных действий
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Team Status Panel */}
        <Grid item xs={12} lg={4}>
          <TeamStatusPanel
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
