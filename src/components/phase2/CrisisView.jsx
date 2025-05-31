import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Warning as CrisisIcon,
  Engineering as TechIcon,
  FitnessCenter as StrengthIcon,
  Psychology as IntelIcon,
  Favorite as HealthIcon,
  EmojiEmotions as EmpathyIcon,
  RecordVoiceOver as CharismaIcon,
} from "@mui/icons-material";
import usePhase2Selectors from "../../hooks/usePhase2Selectors";
import usePhase2Actions from "../../hooks/usePhase2Actions";
import useGameStore from "../../stores/gameStore";
import { CHARACTER_STATS } from "../../constants/phase2";

const CrisisContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `
    radial-gradient(circle at 50% 30%, rgba(255, 152, 0, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 30% 70%, rgba(255, 87, 34, 0.15) 0%, transparent 50%),
    linear-gradient(135deg, #1a0e0e 0%, #2d1b1b 100%)
  `,
  padding: theme.spacing(3),
}));

const CrisisCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(255, 87, 34, 0.1) 100%)",
  border: "3px solid rgba(255, 152, 0, 0.5)",
  animation: "crisisGlow 2s infinite alternate",
  "@keyframes crisisGlow": {
    "0%": { boxShadow: "0 0 20px rgba(255, 152, 0, 0.3)" },
    "100%": { boxShadow: "0 0 40px rgba(255, 152, 0, 0.6)" },
  },
}));

const StatCard = styled(Card)(({ advantage, theme }) => ({
  background:
    advantage === "bunker"
      ? "linear-gradient(135deg, rgba(13, 71, 161, 0.2) 0%, rgba(13, 71, 161, 0.1) 100%)"
      : advantage === "outside"
      ? "linear-gradient(135deg, rgba(183, 28, 28, 0.2) 0%, rgba(183, 28, 28, 0.1) 100%)"
      : "linear-gradient(135deg, rgba(100, 100, 100, 0.1) 0%, rgba(100, 100, 100, 0.05) 100%)",
  border: `2px solid ${
    advantage === "bunker"
      ? "rgba(13, 71, 161, 0.4)"
      : advantage === "outside"
      ? "rgba(183, 28, 28, 0.4)"
      : "rgba(100, 100, 100, 0.3)"
  }`,
}));

const DecisionButton = styled(Button)(({ choice, theme }) => ({
  padding: theme.spacing(2, 4),
  fontSize: "1.1rem",
  fontWeight: "bold",
  background:
    choice === "win"
      ? "linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(76, 175, 80, 0.1) 100%)"
      : "linear-gradient(135deg, rgba(244, 67, 54, 0.3) 0%, rgba(244, 67, 54, 0.1) 100%)",
  border: `2px solid ${
    choice === "win" ? "rgba(76, 175, 80, 0.5)" : "rgba(244, 67, 54, 0.5)"
  }`,
  "&:hover": {
    background:
      choice === "win"
        ? "linear-gradient(135deg, rgba(76, 175, 80, 0.4) 0%, rgba(76, 175, 80, 0.2) 100%)"
        : "linear-gradient(135deg, rgba(244, 67, 54, 0.4) 0%, rgba(244, 67, 54, 0.2) 100%)",
  },
}));

export default function CrisisView() {
  const { currentCrisis, teamStats } = usePhase2Selectors();
  const { resolveCrisis } = usePhase2Actions();
  const role = useGameStore((s) => s.role);

  if (!currentCrisis) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Нет активного кризиса</Typography>
      </Box>
    );
  }

  const crisisType = currentCrisis.type;

  const handleResolution = (result) => {
    resolveCrisis(result);
  };

  // Calculate team advantages for important stats
  const getStatAdvantage = (stat) => {
    const bunkerStat = teamStats.bunker?.[stat] || 0;
    const outsideStat = teamStats.outside?.[stat] || 0;

    if (bunkerStat > outsideStat + 2) return "bunker";
    if (outsideStat > bunkerStat + 2) return "outside";
    return "equal";
  };

  const getOverallAdvantage = () => {
    let bunkerAdvantages = 0;
    let outsideAdvantages = 0;

    crisisType.importantStats.forEach((stat) => {
      const advantage = getStatAdvantage(stat);
      if (advantage === "bunker") bunkerAdvantages++;
      if (advantage === "outside") outsideAdvantages++;
    });

    if (bunkerAdvantages > outsideAdvantages) return "bunker";
    if (outsideAdvantages > bunkerAdvantages) return "outside";
    return "equal";
  };

  const overallAdvantage = getOverallAdvantage();

  return (
    <CrisisContainer>
      {/* Crisis Header */}
      <CrisisCard sx={{ mb: 4 }}>
        <CardContent sx={{ textAlign: "center", py: 4 }}>
          <Typography
            variant="h2"
            sx={{
              color: "#ff9800",
              fontFamily: '"Orbitron", monospace',
              mb: 2,
              textShadow: "0 0 20px rgba(255, 152, 0, 0.7)",
            }}
          >
            ⚠️ КРИЗИС! ⚠️
          </Typography>

          <Typography variant="h4" gutterBottom sx={{ color: "#ff9800" }}>
            {crisisType.name}
          </Typography>

          <Typography variant="h6" sx={{ maxWidth: 600, mx: "auto" }}>
            {crisisType.description}
          </Typography>
        </CardContent>
      </CrisisCard>

      <Grid container spacing={3}>
        {/* Stats Comparison */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CrisisIcon />
                Важные характеристики для разрешения
              </Typography>

              <Grid container spacing={2}>
                {crisisType.importantStats.map((stat) => {
                  const advantage = getStatAdvantage(stat);
                  const bunkerValue = teamStats.bunker?.[stat] || 0;
                  const outsideValue = teamStats.outside?.[stat] || 0;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={stat}>
                      <StatCard advantage={advantage}>
                        <CardContent sx={{ textAlign: "center", py: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            stat
                          </Typography>

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box textAlign="center">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Бункер
                              </Typography>
                              <Typography
                                variant="h5"
                                color="#1976d2"
                                fontWeight="bold"
                              >
                                {bunkerValue}
                              </Typography>
                            </Box>

                            <Typography variant="h6" color="text.secondary">
                              VS
                            </Typography>

                            <Box textAlign="center">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Снаружи
                              </Typography>
                              <Typography
                                variant="h5"
                                color="#d32f2f"
                                fontWeight="bold"
                              >
                                {outsideValue}
                              </Typography>
                            </Box>
                          </Stack>

                          {advantage !== "equal" && (
                            <Chip
                              label={`Преимущество: ${
                                advantage === "bunker" ? "Бункер" : "Снаружи"
                              }`}
                              color={
                                advantage === "bunker" ? "primary" : "error"
                              }
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          )}
                        </CardContent>
                      </StatCard>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>

          {/* Decision Buttons */}
          {role === "host" && (
            <Card>
              <CardContent>
                <Typography variant="h5" textAlign="center" gutterBottom>
                  Как разрешается кризис?
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <DecisionButton
                      choice="win"
                      fullWidth
                      size="large"
                      onClick={() => handleResolution("bunker_win")}
                    >
                      🛡️ Бункер справился
                    </DecisionButton>
                    <Typography
                      variant="body2"
                      textAlign="center"
                      mt={1}
                      color="text.secondary"
                    >
                      Команда бункера успешно разрешила кризис
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <DecisionButton
                      choice="lose"
                      fullWidth
                      size="large"
                      onClick={() => handleResolution("bunker_lose")}
                    >
                      💥 Бункер провалился
                    </DecisionButton>
                    <Typography
                      variant="body2"
                      textAlign="center"
                      mt={1}
                      color="text.secondary"
                    >
                      Кризис нанес урон команде бункера
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Side Panel */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Рекомендация
              </Typography>

              {overallAdvantage === "bunker" && (
                <Alert severity="info">
                  <strong>Бункер имеет преимущество</strong> по большинству
                  важных характеристик
                </Alert>
              )}

              {overallAdvantage === "outside" && (
                <Alert severity="warning">
                  <strong>Команда снаружи имеет преимущество</strong> по важным
                  характеристикам
                </Alert>
              )}

              {overallAdvantage === "equal" && (
                <Alert severity="success">
                  <strong>Силы равны</strong> - решение за вами
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Последствия провала
              </Typography>

              <Stack spacing={1}>
                {crisisType.onFailure.bunker_damage && (
                  <Chip
                    label={`-${crisisType.onFailure.bunker_damage} HP бункера`}
                    color="error"
                    variant="outlined"
                  />
                )}
                {crisisType.onFailure.morale_damage && (
                  <Chip
                    label={`-${crisisType.onFailure.morale_damage} морали`}
                    color="warning"
                    variant="outlined"
                  />
                )}
                {crisisType.onFailure.defense_penalty && (
                  <Chip
                    label={`-${crisisType.onFailure.defense_penalty} защиты`}
                    color="error"
                    variant="outlined"
                  />
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Instructions for non-hosts */}
      {role !== "host" && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Ожидание решения хоста по разрешению кризиса...
        </Alert>
      )}
    </CrisisContainer>
  );
}
