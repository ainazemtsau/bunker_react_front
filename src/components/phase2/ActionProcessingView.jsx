// src/components/phase2/ActionProcessingView.jsx
import React, { useState } from "react";
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
  Snackbar,
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

const LatestResultCard = styled(Card)(({ success, theme }) => ({
  background: success
    ? "linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(76, 175, 80, 0.2) 100%)"
    : "linear-gradient(135deg, rgba(244, 67, 54, 0.3) 0%, rgba(244, 67, 54, 0.2) 100%)",
  border: `3px solid ${
    success ? "rgba(76, 175, 80, 0.6)" : "rgba(244, 67, 54, 0.6)"
  }`,
  marginBottom: theme.spacing(3),
  animation: "highlight 2s ease-in-out",
  "@keyframes highlight": {
    "0%": { transform: "scale(1)", boxShadow: "none" },
    "50%": {
      transform: "scale(1.02)",
      boxShadow: `0 0 30px ${
        success ? "rgba(76, 175, 80, 0.4)" : "rgba(244, 67, 54, 0.4)"
      }`,
    },
    "100%": { transform: "scale(1)", boxShadow: "none" },
  },
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
  const { actionQueue, canProcessActions, currentTeam, round } =
    usePhase2Selectors();

  const { processAction } = usePhase2Actions();
  const { game } = useGameStore();
  const role = useGameStore((s) => s.role);

  const [processing, setProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleProcessAction = async () => {
    if (!canProcessActions || processing) return;

    setProcessing(true);

    // Simulate dice rolling animation
    setTimeout(() => {
      processAction();
      setProcessing(false);

      // Показываем уведомление
      setSnackbar({
        open: true,
        message: "🎲 Действие обработано! Проверьте результаты.",
        severity: "success",
      });
    }, 2000);
  };

  // ✅ ИСПРАВЛЕННАЯ функция поиска игрока
  const getPlayerName = (playerId) => {
    if (!game?.players || !Array.isArray(game.players)) {
      console.warn("Players data not available or not array:", game?.players);
      return playerId;
    }
    const player = game.players.find((p) => p.id === playerId);
    return player?.name || playerId;
  };

  const getActionName = (actionType) => {
    const availableActions = game?.phase2?.available_actions || [];
    const action = availableActions.find((a) => a.id === actionType);
    return action?.name || actionType;
  };

  // Группируем действия по типам согласно документации
  const groupedActions = Object.entries(actionQueue);

  // ✅ ИСПРАВЛЕНО: Получаем последний результат из detailed_history
  const detailedHistory = game?.phase2?.detailed_history || [];
  const lastResult =
    detailedHistory.length > 0
      ? detailedHistory[detailedHistory.length - 1]
      : null;

  console.log("[ACTION_PROCESSING] Last result:", lastResult);
  console.log("[ACTION_PROCESSING] Players:", game?.players);

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

                        {/* Кнопка обработки */}
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

        {/* Results Panel */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Результаты действий
              </Typography>

              {/* ✅ ИСПРАВЛЕНО: Показываем последний результат из detailed_history */}
              {lastResult && lastResult.type === "action" && (
                <LatestResultCard success={lastResult.success} sx={{ mb: 2 }}>
                  <CardContent sx={{ py: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      {lastResult.success ? (
                        <SuccessIcon color="success" />
                      ) : (
                        <FailIcon color="error" />
                      )}
                      <Typography variant="subtitle1" fontWeight="bold">
                        ПОСЛЕДНИЙ РЕЗУЛЬТАТ
                      </Typography>
                    </Box>

                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      {lastResult.action_name || lastResult.action_id}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Участники:{" "}
                      {lastResult.participants?.map(getPlayerName).join(", ") ||
                        "Неизвестно"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Команда: {TEAM_NAMES[lastResult.team] || lastResult.team}{" "}
                      (Раунд {lastResult.round})
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Бросок: {lastResult.roll} + {lastResult.combined_stats} ={" "}
                      {lastResult.roll + lastResult.combined_stats}
                      (нужно было {lastResult.required_roll}+)
                    </Typography>

                    {lastResult.effects &&
                      Object.keys(lastResult.effects).length > 0 && (
                        <Stack
                          direction="row"
                          spacing={1}
                          mt={1}
                          flexWrap="wrap"
                        >
                          {lastResult.effects.bunker_damage && (
                            <Chip
                              label={`-${lastResult.effects.bunker_damage} HP`}
                              color="error"
                              size="small"
                            />
                          )}
                          {lastResult.effects.bunker_heal && (
                            <Chip
                              label={`+${lastResult.effects.bunker_heal} HP`}
                              color="success"
                              size="small"
                            />
                          )}
                          {lastResult.effects.morale_damage && (
                            <Chip
                              label={`-${lastResult.effects.morale_damage} Мораль`}
                              color="warning"
                              size="small"
                            />
                          )}
                          {lastResult.effects.morale_heal && (
                            <Chip
                              label={`+${lastResult.effects.morale_heal} Мораль`}
                              color="success"
                              size="small"
                            />
                          )}
                        </Stack>
                      )}

                    {lastResult.crisis_triggered && (
                      <Chip
                        icon={<CrisisIcon />}
                        label="Вызвал кризис!"
                        color="warning"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </CardContent>
                </LatestResultCard>
              )}

              {/* Остальные результаты */}
              {detailedHistory
                .filter((entry) => entry.type === "action")
                .slice(-4, -1) // Берем предыдущие 3 результата (исключая последний)
                .reverse()
                .map((logEntry, index) => (
                  <Fade
                    in
                    key={`${logEntry.round}-${logEntry.team}-${index}`}
                    timeout={500 + index * 200}
                  >
                    <ResultCard success={logEntry.success}>
                      <CardContent sx={{ py: 2 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          {logEntry.success ? (
                            <SuccessIcon color="success" />
                          ) : (
                            <FailIcon color="error" />
                          )}
                          <Typography variant="subtitle2" fontWeight="bold">
                            {logEntry.action_name || logEntry.action_id}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                        >
                          Участники:{" "}
                          {logEntry.participants
                            ?.map(getPlayerName)
                            .join(", ") || "Неизвестно"}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          Бросок: {logEntry.roll} + {logEntry.combined_stats} ={" "}
                          {logEntry.roll + logEntry.combined_stats}
                        </Typography>

                        {logEntry.effects &&
                          Object.keys(logEntry.effects).length > 0 && (
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
                ))}

              {detailedHistory.filter((entry) => entry.type === "action")
                .length === 0 && (
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

      {/* Snackbar для уведомлений */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </ProcessingContainer>
  );
}
