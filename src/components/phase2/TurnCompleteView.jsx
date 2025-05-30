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
} from "@mui/icons-material";
import usePhase2Selectors from "../../hooks/usePhase2Selectors";
import usePhase2Actions from "../../hooks/usePhase2Actions";
import useGameStore from "../../stores/gameStore";
import { TEAMS, VICTORY_CONDITIONS } from "../../constants/phase2";

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
    [TEAMS.BUNKER]: {
      bg: "rgba(13, 71, 161, 0.2)",
      border: "rgba(13, 71, 161, 0.4)",
    },
    [TEAMS.OUTSIDE]: {
      bg: "rgba(183, 28, 28, 0.2)",
      border: "rgba(183, 28, 28, 0.4)",
    },
  };

  const teamColors = colors[team] || colors[TEAMS.BUNKER];

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
    isTeamTurnComplete,
    bunkerMembers,
    outsideMembers,
    victoryCondition,
  } = usePhase2Selectors();

  const { finishTeamTurn } = usePhase2Actions();
  const role = useGameStore((s) => s.role);
  const game = useGameStore((s) => s.game);

  const handleNextTurn = () => {
    finishTeamTurn();
  };

  // Get recent action results for this turn
  const recentResults =
    game?.phase2?.action_log?.filter(
      (entry) => entry.round === round && entry.team === currentTeam
    ) || [];

  const teamNames = {
    [TEAMS.BUNKER]: "Команда бункера",
    [TEAMS.OUTSIDE]: "Команда снаружи",
  };

  const teamColors = {
    [TEAMS.BUNKER]: "#1976d2",
    [TEAMS.OUTSIDE]: "#d32f2f",
  };

  const nextTeam = currentTeam === TEAMS.BUNKER ? TEAMS.OUTSIDE : TEAMS.BUNKER;
  const isRoundComplete = currentTeam === TEAMS.BUNKER; // Bunker goes second

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
            {teamNames[currentTeam]} завершили свои действия
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
            <Chip label={`Раунд ${round}/10`} color="primary" size="large" />
            <Chip
              label={teamNames[currentTeam]}
              sx={{
                backgroundColor: `${teamColors[currentTeam]}20`,
                color: teamColors[currentTeam],
                border: `1px solid ${teamColors[currentTeam]}`,
              }}
              size="large"
            />
          </Stack>
        </CardContent>
      </SummaryCard>

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
                Результаты хода
              </Typography>

              {recentResults.length > 0 ? (
                <Stack spacing={2}>
                  {recentResults.map((result, index) => (
                    <Card key={index} sx={{ bgcolor: "rgba(0,0,0,0.2)" }}>
                      <CardContent sx={{ py: 2 }}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <Typography variant="h6" fontWeight="bold">
                            {result.action_name || "Действие"}
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
                          {result.participants?.join(", ") || "Неизвестно"}
                        </Typography>

                        <Box display="flex" gap={2} alignItems="center">
                          <Typography variant="body2">
                            Бросок: <strong>{result.roll || "?"}</strong> +{" "}
                            {result.bonus || 0} ={" "}
                            {(result.roll || 0) + (result.bonus || 0)}
                          </Typography>

                          {result.damage > 0 && (
                            <Chip
                              icon={<DamageIcon />}
                              label={`-${result.damage} HP`}
                              color="error"
                              size="small"
                            />
                          )}

                          {result.heal > 0 && (
                            <Chip
                              icon={<HealIcon />}
                              label={`+${result.heal} HP`}
                              color="success"
                              size="small"
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">Нет результатов для отображения</Alert>
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
                    : `Переход хода к команде: ${teamNames[nextTeam]}`}
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleNextTurn}
                  startIcon={<NextIcon />}
                  sx={{ mt: 2 }}
                >
                  {isRoundComplete ? "Следующий раунд" : "Следующая команда"}
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Progress Panel */}
        <Grid item xs={12} lg={4}>
          {/* Bunker HP */}
          <ProgressCard team={TEAMS.BUNKER} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#1976d2" }}>
                🏠 Состояние бункера
              </Typography>

              <Box mb={2}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body2">Прочность</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {bunkerHp}/{maxHp}
                  </Typography>
                </Box>
                <HPBar variant="determinate" value={hpPercent} max={100} />
              </Box>

              <Typography variant="body2" color="text.secondary">
                {bunkerHp <= 3
                  ? "⚠️ Критическое состояние!"
                  : bunkerHp <= 6
                  ? "⚡ Требует ремонта"
                  : "✅ Хорошее состояние"}
              </Typography>
            </CardContent>
          </ProgressCard>

          {/* Round Progress */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📅 Прогресс игры
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
                    {round}/10
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(round / 10) * 100}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>

              <Typography variant="body2" color="text.secondary">
                {10 - round} раундов до победы бункера
              </Typography>
            </CardContent>
          </Card>

          {/* Team Status */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                👥 Команды
              </Typography>

              <Box mb={2}>
                <Typography variant="subtitle2" color="#1976d2" gutterBottom>
                  🏠 В бункере ({bunkerMembers.length})
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                  {bunkerMembers.slice(0, 4).map((playerId) => {
                    const player = game?.players?.find(
                      (p) => p.id === playerId
                    );
                    return (
                      <Chip
                        key={playerId}
                        label={player?.name || playerId}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    );
                  })}
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
                <Typography variant="subtitle2" color="#d32f2f" gutterBottom>
                  ⚔️ Снаружи ({outsideMembers.length})
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {outsideMembers.slice(0, 4).map((playerId) => {
                    const player = game?.players?.find(
                      (p) => p.id === playerId
                    );
                    return (
                      <Chip
                        key={playerId}
                        label={player?.name || playerId}
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    );
                  })}
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
        </Grid>
      </Grid>

      {/* Victory Check */}
      {victoryCondition && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            🎉 Игра завершена!
          </Typography>
          <Typography>
            {victoryCondition.winner === TEAMS.BUNKER
              ? "Команда бункера выжила и победила!"
              : "Команда снаружи уничтожила бункер и победила!"}
          </Typography>
        </Alert>
      )}

      {/* Instructions for non-hosts */}
      {role !== "host" && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Ожидание перехода к следующему ходу...
        </Alert>
      )}
    </CompleteContainer>
  );
}
