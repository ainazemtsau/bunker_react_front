import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  Alert,
  Divider,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  CheckCircle as CompleteIcon,
  NavigateNext as NextIcon,
  Timeline as StatsIcon,
  TrendingDown as DamageIcon,
  TrendingUp as HealIcon,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import usePhase2Selectors from "../../hooks/usePhase2Selectors";
import usePhase2Actions from "../../hooks/usePhase2Actions";
import useGameStore from "../../stores/gameStore";
import {
  PHASE2_UI,
  TEAM_COLORS,
  TEAM_NAMES,
  PHASE2_RESOURCES,
} from "../../constants/phase2";
import ResourceTracker from "./ResourceTracker";

const CompleteContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `
    radial-gradient(circle at 50% 30%, rgba(76, 175, 80, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(33, 150, 243, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)
  `,
  padding: theme.spacing(3),
}));

const SummaryCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)",
  border: "2px solid rgba(76, 175, 80, 0.4)",
  marginBottom: theme.spacing(3),
}));

const ProgressCard = styled(Card)(({ theme, team }) => {
  const colors = {
    [PHASE2_UI.TEAMS.BUNKER]: {
      bg: "rgba(13, 71, 161, 0.2)",
      border: "rgba(13, 71, 161, 0.4)",
    },
    [PHASE2_UI.TEAMS.OUTSIDE]: {
      bg: "rgba(183, 28, 28, 0.2)",
      border: "rgba(183, 28, 28, 0.4)",
    },
  };

  const teamColors = colors[team] || colors[PHASE2_UI.TEAMS.BUNKER];

  return {
    background: `linear-gradient(135deg, ${teamColors.bg} 0%, ${teamColors.bg}80 100%)`,
    border: `2px solid ${teamColors.border}`,
  };
});

const HPBar = styled(LinearProgress)(({ value, max }) => {
  const getColor = (percent) => {
    if (percent >= 70) return "#4caf50";
    if (percent >= 40) return "#ffc107";
    return "#f44336";
  };

  const percent = (value / max) * 100;

  return {
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    "& .MuiLinearProgress-bar": {
      backgroundColor: getColor(percent),
      borderRadius: 10,
    },
  };
});

export default function TurnCompleteView() {
  const {
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
    isTeamTurnComplete,
    bunkerMembers,
    outsideMembers,
    victoryCondition,
  } = usePhase2Selectors();

  const { finishTeamTurn } = usePhase2Actions();
  const role = useGameStore((s) => s.role);
  const { game } = useGameStore();

  const handleNextTurn = () => {
    console.log("[TURN_COMPLETE] Finishing team turn");
    finishTeamTurn();
  };

  const detailedHistory = game?.phase2?.detailed_history || [];
  const currentTurnResults =
    detailedHistory.filter(
      (entry) =>
        entry.type === "action" &&
        entry.round === round &&
        entry.team === currentTeam
    ) || [];

  // Определяем следующую команду и проверяем завершение раунда
  const nextTeam =
    currentTeam === PHASE2_UI.TEAMS.OUTSIDE
      ? PHASE2_UI.TEAMS.BUNKER
      : PHASE2_UI.TEAMS.OUTSIDE;

  const isRoundComplete = currentTeam === PHASE2_UI.TEAMS.BUNKER; // Бункер ходит вторым

  const getPlayerName = (playerId) => {
    const player = game?.players?.find((p) => p.id === playerId);
    return player?.name || playerId;
  };

  const hpPercent = (bunkerHp / maxHp) * 100;

  return (
    <CompleteContainer>
      {/* Header */}
      <SummaryCard>
        <CardContent sx={{ textAlign: "center", py: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: "#4caf50",
              fontFamily: '"Orbitron", monospace',
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <CompleteIcon sx={{ fontSize: 50 }} />
            ХОД ЗАВЕРШЕН
          </Typography>

          <Typography variant="h5" gutterBottom>
            {TEAM_NAMES[currentTeam]} завершили свои действия
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
            <Chip
              label={`Раунд ${round}/${PHASE2_RESOURCES.MAX_ROUNDS}`}
              color="primary"
              size="large"
            />
            <Chip
              label={TEAM_NAMES[currentTeam]}
              sx={{
                backgroundColor: `${TEAM_COLORS[currentTeam]}20`,
                color: TEAM_COLORS[currentTeam],
                border: `1px solid ${TEAM_COLORS[currentTeam]}`,
              }}
              size="large"
            />
          </Stack>
        </CardContent>
      </SummaryCard>

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
        showTitle={false}
      />

      <Grid container spacing={3}>
        {/* Turn Results */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <StatsIcon />
                Результаты хода команды {TEAM_NAMES[currentTeam]}
              </Typography>

              {currentTurnResults.length > 0 ? (
                <Stack spacing={2}>
                  {currentTurnResults.map((result, index) => (
                    <Card
                      key={`${result.round}-${result.team}-${index}`}
                      sx={{ bgcolor: "rgba(0,0,0,0.2)" }}
                    >
                      <CardContent sx={{ py: 2 }}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <Typography variant="h6" fontWeight="bold">
                            {result.action_name || result.action_id}
                          </Typography>
                          <Chip
                            label={result.success ? "УСПЕХ" : "НЕУДАЧА"}
                            color={result.success ? "success" : "error"}
                            icon={result.success ? <CheckCircle /> : <Cancel />}
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                        >
                          Участники:{" "}
                          {result.participants?.map(getPlayerName).join(", ") ||
                            "Неизвестно"}
                        </Typography>

                        <Box
                          display="flex"
                          gap={2}
                          alignItems="center"
                          flexWrap="wrap"
                        >
                          <Typography variant="body2">
                            Бросок: <strong>{result.roll}</strong> +{" "}
                            {result.combined_stats} ={" "}
                            {result.roll + result.combined_stats}
                            (нужно было {result.required_roll}+)
                          </Typography>

                          {result.effects &&
                            Object.keys(result.effects).length > 0 && (
                              <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                              >
                                {result.effects.bunker_damage && (
                                  <Chip
                                    icon={<DamageIcon />}
                                    label={`-${result.effects.bunker_damage} HP`}
                                    color="error"
                                    size="small"
                                  />
                                )}
                                {result.effects.bunker_heal && (
                                  <Chip
                                    icon={<HealIcon />}
                                    label={`+${result.effects.bunker_heal} HP`}
                                    color="success"
                                    size="small"
                                  />
                                )}
                                {result.effects.morale_damage && (
                                  <Chip
                                    icon={<DamageIcon />}
                                    label={`-${result.effects.morale_damage} Мораль`}
                                    color="warning"
                                    size="small"
                                  />
                                )}
                                {result.effects.morale_heal && (
                                  <Chip
                                    icon={<HealIcon />}
                                    label={`+${result.effects.morale_heal} Мораль`}
                                    color="success"
                                    size="small"
                                  />
                                )}
                              </Stack>
                            )}

                          {result.crisis_triggered && (
                            <Chip
                              label="Вызвал кризис"
                              color="warning"
                              size="small"
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">
                  Нет результатов для отображения. Возможно, команда не
                  выполняла действий.
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Next Turn Button */}
          {role === "host" && isTeamTurnComplete && (
            <Card>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {isRoundComplete
                    ? `Раунд ${round} завершен! Переходим к раунду ${round + 1}`
                    : `Переход хода к команде: ${TEAM_NAMES[nextTeam]}`}
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={3}>
                  {isRoundComplete
                    ? "Обе команды завершили свои ходы в этом раунде"
                    : "Команда завершила все свои действия"}
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleNextTurn}
                  startIcon={<NextIcon />}
                  sx={{
                    background:
                      "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)",
                    },
                  }}
                >
                  {isRoundComplete ? "Начать следующий раунд" : "Передать ход"}
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Team Status Panel */}
        <Grid item xs={12} lg={4}>
          {/* Team Composition */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                👥 Состав команд
              </Typography>

              <Box mb={3}>
                <Typography
                  variant="subtitle2"
                  color={TEAM_COLORS.bunker}
                  gutterBottom
                >
                  🏠 В бункере ({bunkerMembers.length})
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                  {bunkerMembers.slice(0, 4).map((playerId) => (
                    <Chip
                      key={playerId}
                      label={getPlayerName(playerId)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                  {bunkerMembers.length > 4 && (
                    <Chip
                      label={`+${bunkerMembers.length - 4}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color={TEAM_COLORS.outside}
                  gutterBottom
                >
                  ⚔️ Снаружи ({outsideMembers.length})
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {outsideMembers.slice(0, 4).map((playerId) => (
                    <Chip
                      key={playerId}
                      label={getPlayerName(playerId)}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  ))}
                  {outsideMembers.length > 4 && (
                    <Chip
                      label={`+${outsideMembers.length - 4}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Box>
            </CardContent>
          </Card>

          {/* Round Progress */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📅 Прогресс раундов
              </Typography>

              <Box mb={2}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body2">Раунды</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {round}/{PHASE2_RESOURCES.MAX_ROUNDS}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(round / PHASE2_RESOURCES.MAX_ROUNDS) * 100}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#2196f3",
                    },
                  }}
                />
              </Box>

              <Typography variant="body2" color="text.secondary">
                {PHASE2_RESOURCES.MAX_ROUNDS - round} раунд
                {PHASE2_RESOURCES.MAX_ROUNDS - round > 1
                  ? PHASE2_RESOURCES.MAX_ROUNDS - round > 4
                    ? "ов"
                    : "а"
                  : ""}{" "}
                до автоматической победы бункера
              </Typography>
            </CardContent>
          </Card>

          {/* Next Phase Info */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ⏭️ Следующий этап
              </Typography>

              {isRoundComplete ? (
                <Alert severity="info">
                  <Typography variant="subtitle2" gutterBottom>
                    Новый раунд {round + 1}
                  </Typography>
                  <Typography variant="body2">
                    Обе команды сделают новые ходы. Начинает команда снаружи.
                  </Typography>
                </Alert>
              ) : (
                <Alert severity="warning">
                  <Typography variant="subtitle2" gutterBottom>
                    Ход команды {TEAM_NAMES[nextTeam]}
                  </Typography>
                  <Typography variant="body2">
                    Игроки {TEAM_NAMES[nextTeam]} будут выбирать свои действия.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Victory Check */}
      {victoryCondition && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            🎉 Игра завершена!
          </Typography>
          <Typography>
            {victoryCondition.winner === PHASE2_UI.TEAMS.BUNKER
              ? "Команда бункера выжила и победила!"
              : "Команда снаружи уничтожила бункер и победила!"}
          </Typography>
        </Alert>
      )}

      {/* Instructions for non-hosts */}
      {role !== "host" && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Ожидание перехода к следующему ходу от хоста...
        </Alert>
      )}
    </CompleteContainer>
  );
}
