import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Alert,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  ExpandMore as ExpandIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  Casino as ActionIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import usePhase2Selectors from "../../hooks/usePhase2Selectors";
import usePhase2Actions from "../../hooks/usePhase2Actions";
import useGameStore from "../../stores/gameStore";
import {
  PHASE2_UI,
  TEAM_COLORS,
  TEAM_NAMES,
  TEAM_ICONS,
} from "../../constants/phase2";
import ActionCard from "./ActionCard";
import ActionPreviewModal from "./ActionPreviewModal";

const MobileContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
  padding: theme.spacing(2),
}));

const StatusBar = styled(Card)(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 100,
  marginBottom: theme.spacing(2),
  background: "rgba(0, 0, 0, 0.9)",
  backdropFilter: "blur(10px)",
}));

const ResourceCard = styled(Card)(({ status }) => ({
  background:
    status === "critical"
      ? "linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(244, 67, 54, 0.1) 100%)"
      : status === "warning"
      ? "linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(255, 152, 0, 0.1) 100%)"
      : "linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)",
  border: `1px solid ${
    status === "critical"
      ? "rgba(244, 67, 54, 0.4)"
      : status === "warning"
      ? "rgba(255, 152, 0, 0.4)"
      : "rgba(76, 175, 80, 0.4)"
  }`,
}));

const ActionSection = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

function ResourceMini({ label, value, max, icon, status = "good" }) {
  const percentage = (value / max) * 100;

  return (
    <ResourceCard status={status}>
      <CardContent sx={{ py: 1, px: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">{icon}</Typography>
          <Typography variant="body2" fontWeight="bold" flex={1}>
            {label}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {value}/{max}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 4,
            borderRadius: 2,
            mt: 0.5,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "& .MuiLinearProgress-bar": {
              backgroundColor:
                status === "critical"
                  ? "#f44336"
                  : status === "warning"
                  ? "#ff9800"
                  : "#4caf50",
            },
          }}
        />
      </CardContent>
    </ResourceCard>
  );
}

export default function Phase2PlayerView() {
  const {
    myTeam,
    round,
    currentTeam,
    currentPlayer,
    isMyTurn,
    isMyTeamTurn,
    bunkerHp,
    maxHp,
    morale,
    maxMorale,
    supplies,
    maxSupplies,
    availableActions,
    canMakeAction,
    currentState,
    actionQueue,
    isWaitingForTeam,
    activeStatuses,
  } = usePhase2Selectors();

  const { makeAction, isConnected } = usePhase2Actions();
  const { game } = useGameStore();

  const [showResources, setShowResources] = useState(true);
  const [previewAction, setPreviewAction] = useState(null);

  const playerId = useGameStore((s) => s.playerId);

  const handleActionSelect = (actionId) => {
    if (!canMakeAction) return;
    makeAction(actionId);
  };

  const getCurrentPlayerName = () => {
    if (!currentPlayer || !game?.players) return currentPlayer;
    const player = game.players.find((p) => p.id === currentPlayer);
    return player?.name || currentPlayer;
  };

  const getResourceStatus = (value, max) => {
    const percentage = (value / max) * 100;
    if (percentage <= 20) return "critical";
    if (percentage <= 50) return "warning";
    return "good";
  };

  const getMyStatus = () => {
    if (!isMyTeamTurn) {
      return {
        type: "waiting",
        message: `Ходит ${TEAM_NAMES[currentTeam]}`,
        color: "info",
      };
    }

    if (isMyTurn) {
      return {
        type: "action",
        message: "Ваш ход! Выберите действие",
        color: "warning",
      };
    }

    if (isWaitingForTeam) {
      return {
        type: "waiting_team",
        message: "Ожидание других игроков команды",
        color: "info",
      };
    }

    return {
      type: "waiting_player",
      message: `Ждем игрока: ${getCurrentPlayerName()}`,
      color: "info",
    };
  };

  const myStatus = getMyStatus();

  if (!myTeam) {
    return (
      <MobileContainer>
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6">Загрузка...</Typography>
          </CardContent>
        </Card>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      {/* Status Bar */}
      <StatusBar>
        <CardContent sx={{ py: 2 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h4" component="span">
                {TEAM_ICONS[myTeam]}
              </Typography>
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color={TEAM_COLORS[myTeam]}
                >
                  {TEAM_NAMES[myTeam]}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Раунд {round}/10
                </Typography>
              </Box>
            </Box>

            <Chip
              label={myStatus.message}
              color={myStatus.color}
              variant={isMyTurn ? "filled" : "outlined"}
              icon={isMyTurn ? <ActionIcon /> : undefined}
            />
          </Box>

          {!isConnected && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Нет соединения с сервером
            </Alert>
          )}
        </CardContent>
      </StatusBar>

      {/* Resources */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="subtitle2" fontWeight="bold">
              🏠 Состояние бункера
            </Typography>
            <IconButton
              size="small"
              onClick={() => setShowResources(!showResources)}
            >
              {showResources ? <HideIcon /> : <ViewIcon />}
            </IconButton>
          </Box>

          <Collapse in={showResources}>
            <Stack spacing={1} sx={{ mt: 1 }}>
              <ResourceMini
                label="Прочность"
                value={bunkerHp}
                max={maxHp}
                icon="🛡️"
                status={getResourceStatus(bunkerHp, maxHp)}
              />
              <ResourceMini
                label="Мораль"
                value={morale}
                max={maxMorale}
                icon="❤️"
                status={getResourceStatus(morale, maxMorale)}
              />
              <ResourceMini
                label="Припасы"
                value={supplies}
                max={maxSupplies}
                icon="🍞"
                status={getResourceStatus(supplies, maxSupplies)}
              />
            </Stack>
          </Collapse>
        </CardContent>
      </Card>

      {/* Critical Statuses */}
      {activeStatuses &&
        activeStatuses.filter((s) => s.severity === "critical").length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Критические статусы активны!
            </Typography>
            {activeStatuses
              .filter((s) => s.severity === "critical")
              .map((s) => s.name)
              .join(", ")}
          </Alert>
        )}

      {/* Actions */}
      {isMyTurn && (
        <ActionSection>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              🎯 Выберите действие
            </Typography>

            <Stack spacing={2}>
              {availableActions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  disabled={!canMakeAction}
                  onSelect={() => handleActionSelect(action.id)}
                  myTeam={myTeam}
                  playerStats={null}
                />
              ))}
            </Stack>

            {availableActions.length === 0 && (
              <Alert severity="warning">
                Нет доступных действий. Возможно, все заблокированы статусами.
              </Alert>
            )}
          </CardContent>
        </ActionSection>
      )}

      {/* Current Queue (for team members) */}
      {isMyTeamTurn && !isMyTurn && Object.keys(actionQueue).length > 0 && (
        <ActionSection>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ⏳ Очередь действий команды
            </Typography>

            <Stack spacing={1}>
              {Object.entries(actionQueue).map(([actionType, group]) => (
                <Card key={actionType} sx={{ bgcolor: "rgba(0,0,0,0.2)" }}>
                  <CardContent sx={{ py: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {actionType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Участники:{" "}
                      {group.participants
                        ?.map((p) => {
                          const player = game?.players?.find(
                            (pl) => pl.id === p
                          );
                          return player?.name || p;
                        })
                        .join(", ")}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </CardContent>
        </ActionSection>
      )}

      {/* Team Info (collapsed by default) */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography variant="subtitle1">👥 Информация о командах</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" color={TEAM_COLORS.bunker}>
                🏠 В бункере
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {game?.team_in_bunker
                  ?.map((id) => {
                    const player = game?.players?.find((p) => p.id === id);
                    return player?.name || id;
                  })
                  .join(", ")}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color={TEAM_COLORS.outside}>
                ⚔️ Снаружи
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {game?.team_outside
                  ?.map((id) => {
                    const player = game?.players?.find((p) => p.id === id);
                    return player?.name || id;
                  })
                  .join(", ")}
              </Typography>
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Preview Modal */}
      <ActionPreviewModal
        open={!!previewAction}
        onClose={() => setPreviewAction(null)}
        onConfirm={() => {
          if (previewAction) {
            handleActionSelect(previewAction.id);
            setPreviewAction(null);
          }
        }}
        action={previewAction}
        participants={playerId ? [playerId] : []}
      />
    </MobileContainer>
  );
}
