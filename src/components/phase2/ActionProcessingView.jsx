import React, { useState } from "react"; // убираем useEffect
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  LinearProgress,
  Alert,
  Grid,
  Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Casino as DiceIcon,
  PlayArrow as ProcessIcon,
  CheckCircle as SuccessIcon,
  Cancel as FailIcon,
  Warning as CrisisIcon,
} from "@mui/icons-material";
import usePhase2Selectors from "../../hooks/usePhase2Selectors";
import usePhase2Actions from "../../hooks/usePhase2Actions";
import useGameStore from "../../stores/gameStore";
import { PHASE2_UI, TEAM_COLORS, TEAM_NAMES } from "../../constants/phase2";

const ProcessingContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `
    radial-gradient(circle at 50% 20%, rgba(255, 193, 7, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)
  `,
  padding: theme.spacing(3),
}));

const ActionQueueCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 193, 7, 0.1) 100%)",
  border: "2px solid rgba(255, 193, 7, 0.4)",
  marginBottom: theme.spacing(3),
}));

const ResultCard = styled(Card)(({ success, theme }) => ({
  background: success
    ? "linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)"
    : "linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(244, 67, 54, 0.1) 100%)",
  border: `2px solid ${
    success ? "rgba(76, 175, 80, 0.4)" : "rgba(244, 67, 54, 0.4)"
  }`,
  marginBottom: theme.spacing(2),
}));

const DiceAnimation = styled(Box)(({ rolling }) => ({
  fontSize: "3rem",
  animation: rolling ? "roll 1s ease-in-out" : "none",
  "@keyframes roll": {
    "0%": { transform: "rotate(0deg)" },
    "25%": { transform: "rotate(90deg)" },
    "50%": { transform: "rotate(180deg)" },
    "75%": { transform: "rotate(270deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
}));

export default function ActionProcessingView() {
  const { actionQueue, canProcessActions, currentTeam, round, currentAction } =
    usePhase2Selectors();

  const { processAction } = usePhase2Actions();
  const { game } = useGameStore();
  const role = useGameStore((s) => s.role);

  const [processing, setProcessing] = useState(false);

  // ❌ УБИРАЕМ автоматическое выполнение useEffect

  const handleProcessAction = async () => {
    if (!canProcessActions || processing) return;

    setProcessing(true);

    // Simulate dice rolling animation
    setTimeout(() => {
      processAction();
      setProcessing(false);
    }, 2000);
  };

  const getPlayerName = (playerId) => {
    const player = game?.players?.find((p) => p.id === playerId);
    return player?.name || playerId;
  };

  const getActionName = (actionType) => {
    const availableActions = game?.phase2?.available_actions || [];
    const action = availableActions.find((a) => a.id === actionType);
    return action?.name || actionType;
  };

  // Группируем действия по типам согласно документации
  const groupedActions = Object.entries(actionQueue);

  return (
    <ProcessingContainer>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h4"
            textAlign="center"
            sx={{
              fontFamily: '"Orbitron", monospace',
              color: "primary.main",
              mb: 2,
            }}
          >
            🎲 ОБРАБОТКА ДЕЙСТВИЙ
          </Typography>

          <Box display="flex" justifyContent="center" gap={2}>
            <Chip label={`Раунд ${round}`} color="primary" size="large" />
            <Chip
              label={TEAM_NAMES[currentTeam]}
              sx={{
                backgroundColor: `${TEAM_COLORS[currentTeam]}20`,
                color: TEAM_COLORS[currentTeam],
                border: `1px solid ${TEAM_COLORS[currentTeam]}`,
              }}
              size="large"
            />
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Action Queue */}
        <Grid item xs={12} lg={8}>
          {groupedActions.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Alert severity="info">
                  Все действия команды обработаны. Переход к следующему этапу...
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <ActionQueueCard>
              <CardContent>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <ProcessIcon />
                  Очередь действий
                </Typography>

                {groupedActions.map(([actionType, group], index) => {
                  const actionName = getActionName(actionType);
                  const isCurrentAction = index === 0;

                  return (
                    <Card
                      key={actionType}
                      sx={{
                        mb: 2,
                        bgcolor: isCurrentAction
                          ? "rgba(255,193,7,0.1)"
                          : "rgba(0,0,0,0.2)",
                        border: isCurrentAction
                          ? "1px solid rgba(255,193,7,0.4)"
                          : "none",
                      }}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={2}
                        >
                          <Typography variant="h6" fontWeight="bold">
                            {actionName}
                          </Typography>
                          {isCurrentAction && (
                            <Chip
                              label="СЛЕДУЮЩЕЕ"
                              color="warning"
                              icon={<ProcessIcon />}
                            />
                          )}
                        </Box>

                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Участники ({group.participants?.length || 0}):
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {(group.participants || []).map((playerId) => (
                              <Chip
                                key={playerId}
                                label={getPlayerName(playerId)}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        </Box>

                        {/* ✅ КНОПКА обработки показывается только для текущего действия и только хосту */}
                        {isCurrentAction && role === "host" && (
                          <Box textAlign="center" mt={2}>
                            {processing ? (
                              <Box>
                                <DiceAnimation rolling={processing}>
                                  🎲
                                </DiceAnimation>
                                <Typography variant="h6" color="primary.main">
                                  Бросаем кости...
                                </Typography>
                                <LinearProgress sx={{ mt: 2 }} />
                              </Box>
                            ) : canProcessActions ? (
                              <Button
                                variant="contained"
                                size="large"
                                onClick={handleProcessAction}
                                startIcon={<DiceIcon />}
                                sx={{
                                  background:
                                    "linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(45deg, #E55A2B 30%, #E8831A 90%)",
                                  },
                                }}
                              >
                                🎲 Обработать действие
                              </Button>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Ожидание готовности к обработке...
                              </Typography>
                            )}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </ActionQueueCard>
          )}
        </Grid>

        {/* Results Panel - остается как есть */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Последние результаты
              </Typography>

              {game?.phase2?.action_log
                ?.slice(-3)
                .reverse()
                .map((logEntry, index) => (
                  <Fade in key={index} timeout={500 + index * 200}>
                    <ResultCard success={logEntry.success}>
                      <CardContent sx={{ py: 2 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          {logEntry.success ? (
                            <SuccessIcon color="success" />
                          ) : (
                            <FailIcon color="error" />
                          )}
                          <Typography variant="subtitle2" fontWeight="bold">
                            {logEntry.action_name ||
                              getActionName(logEntry.action_type)}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                        >
                          Участники:{" "}
                          {logEntry.participants?.join(", ") || "Неизвестно"}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          Бросок: {logEntry.roll || "?"} + {logEntry.bonus || 0}{" "}
                          = {(logEntry.roll || 0) + (logEntry.bonus || 0)}
                        </Typography>

                        {logEntry.effects && (
                          <Stack
                            direction="row"
                            spacing={1}
                            mt={1}
                            flexWrap="wrap"
                          >
                            {logEntry.effects.bunker_damage && (
                              <Chip
                                label={`-${logEntry.effects.bunker_damage} HP`}
                                color="error"
                                size="small"
                              />
                            )}
                            {logEntry.effects.bunker_heal && (
                              <Chip
                                label={`+${logEntry.effects.bunker_heal} HP`}
                                color="success"
                                size="small"
                              />
                            )}
                          </Stack>
                        )}

                        {logEntry.crisis_triggered && (
                          <Chip
                            icon={<CrisisIcon />}
                            label="Кризис!"
                            color="warning"
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </CardContent>
                    </ResultCard>
                  </Fade>
                )) || (
                <Typography variant="body2" color="text.secondary">
                  Результатов пока нет...
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Instructions for non-hosts */}
      {role !== "host" && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Ожидание обработки действий хостом...
        </Alert>
      )}
    </ProcessingContainer>
  );
}
