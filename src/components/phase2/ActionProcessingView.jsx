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
  Divider,
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
import { getActionById } from "../../constants/phase2";
import { TEAMS } from "../../constants/phase2";

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
  const { actionQueue, canProcessActions, currentTeam, round, myTeam } =
    usePhase2Selectors();

  const { processAction } = usePhase2Actions();
  const game = useGameStore((s) => s.game);
  const role = useGameStore((s) => s.role);

  const [processing, setProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);

  const handleProcessAction = async () => {
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

  const teamColors = {
    [TEAMS.BUNKER]: "#1976d2",
    [TEAMS.OUTSIDE]: "#d32f2f",
  };

  const teamNames = {
    [TEAMS.BUNKER]: "Команда бункера",
    [TEAMS.OUTSIDE]: "Команда снаружи",
  };

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
              label={teamNames[currentTeam]}
              sx={{
                backgroundColor: `${teamColors[currentTeam]}20`,
                color: teamColors[currentTeam],
                border: `1px solid ${teamColors[currentTeam]}`,
              }}
              size="large"
            />
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Action Queue */}
        <Grid item xs={12} lg={8}>
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

              {Object.keys(actionQueue).length === 0 ? (
                <Alert severity="info">
                  Все действия команды обработаны. Ожидание завершения хода.
                </Alert>
              ) : (
                <>
                  {Object.entries(actionQueue).map(
                    ([actionType, group], index) => {
                      const action = getActionById(actionType);

                      return (
                        <Card
                          key={actionType}
                          sx={{ mb: 2, bgcolor: "rgba(0,0,0,0.2)" }}
                        >
                          <CardContent>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mb={2}
                            >
                              <Typography variant="h6" fontWeight="bold">
                                {action?.name || actionType}
                              </Typography>
                              <Chip
                                label={`Сложность: ${
                                  action?.difficulty || "?"
                                }+`}
                                color="warning"
                                icon={<DiceIcon />}
                              />
                            </Box>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mb={2}
                            >
                              {action?.description}
                            </Typography>

                            <Box mb={2}>
                              <Typography variant="subtitle2" gutterBottom>
                                Участники ({group.participants.length}):
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                              >
                                {group.participants.map((playerId) => (
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

                            {index === 0 && (
                              <Box textAlign="center" mt={2}>
                                {processing ? (
                                  <Box>
                                    <DiceAnimation rolling={processing}>
                                      🎲
                                    </DiceAnimation>
                                    <Typography
                                      variant="h6"
                                      color="primary.main"
                                    >
                                      Бросаем кости...
                                    </Typography>
                                    <LinearProgress sx={{ mt: 2 }} />
                                  </Box>
                                ) : (
                                  role === "host" &&
                                  canProcessActions && (
                                    <Button
                                      variant="contained"
                                      size="large"
                                      onClick={handleProcessAction}
                                      startIcon={<DiceIcon />}
                                    >
                                      Обработать действие
                                    </Button>
                                  )
                                )}
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      );
                    }
                  )}
                </>
              )}
            </CardContent>
          </ActionQueueCard>
        </Grid>

        {/* Results Panel */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Последние результаты
              </Typography>

              {/* This would show recent action results */}
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
                            {logEntry.action_name || "Действие"}
                          </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary">
                          Бросок: {logEntry.roll || "?"} + {logEntry.bonus || 0}{" "}
                          = {(logEntry.roll || 0) + (logEntry.bonus || 0)}
                        </Typography>

                        {logEntry.effects && (
                          <Typography variant="body2" fontWeight="bold" mt={1}>
                            Урон: {logEntry.damage || 0}
                          </Typography>
                        )}

                        {logEntry.crisis && (
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

      {/* Instructions */}
      {role !== "host" && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Ожидание обработки действий хостом...
        </Alert>
      )}
    </ProcessingContainer>
  );
}
