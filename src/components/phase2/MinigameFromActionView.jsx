import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  SportsEsports as MinigameIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Cancel as FailIcon,
} from "@mui/icons-material";
import usePhase2Actions from "../../hooks/usePhase2Actions";
import useGameStore from "../../stores/gameStore";

const MinigameContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `
    radial-gradient(circle at 50% 30%, rgba(255, 87, 34, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 30% 70%, rgba(255, 152, 0, 0.15) 0%, transparent 50%),
    linear-gradient(135deg, #1a0e0e 0%, #2d1b1b 100%)
  `,
  padding: theme.spacing(3),
}));

const ActionFailCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(244, 67, 54, 0.1) 100%)",
  border: "3px solid rgba(244, 67, 54, 0.5)",
  marginBottom: theme.spacing(3),
  animation: "failureGlow 2s infinite alternate",
  "@keyframes failureGlow": {
    "0%": { boxShadow: "0 0 20px rgba(244, 67, 54, 0.3)" },
    "100%": { boxShadow: "0 0 40px rgba(244, 67, 54, 0.6)" },
  },
}));

const MinigameCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(156, 39, 176, 0.2) 0%, rgba(156, 39, 176, 0.1) 100%)",
  border: "2px solid rgba(156, 39, 176, 0.4)",
  marginBottom: theme.spacing(3),
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

export default function MinigameFromActionView({ crisis }) {
  const { resolveCrisis } = usePhase2Actions();
  const role = useGameStore((s) => s.role);

  if (!crisis || !crisis.id?.startsWith("action_minigame_")) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Ошибка: неверный тип кризиса</Typography>
      </Box>
    );
  }

  // Извлекаем название действия из ID кризиса
  const actionName = crisis.id
    .replace("action_minigame_", "")
    .replace(/_/g, " ");

  const handleResolution = (result) => {
    resolveCrisis(result);
  };

  return (
    <MinigameContainer>
      {/* Action Failed Header */}
      <ActionFailCard>
        <CardContent sx={{ textAlign: "center", py: 4 }}>
          <Typography
            variant="h2"
            sx={{
              color: "#f44336",
              fontFamily: '"Orbitron", monospace',
              mb: 2,
              textShadow: "0 0 20px rgba(244, 67, 54, 0.7)",
            }}
          >
            ❌ ДЕЙСТВИЕ ПРОВАЛИЛОСЬ!
          </Typography>

          <Typography variant="h4" gutterBottom sx={{ color: "#f44336" }}>
            {crisis.name}
          </Typography>

          <Typography variant="h6" sx={{ maxWidth: 600, mx: "auto" }}>
            {crisis.description}
          </Typography>
        </CardContent>
      </ActionFailCard>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} lg={10}>
          {/* Minigame Rules */}
          {crisis.mini_game && (
            <MinigameCard>
              <CardContent>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    color: "#9c27b0",
                    fontFamily: '"Orbitron", monospace',
                  }}
                >
                  <MinigameIcon sx={{ fontSize: 40 }} />
                  🎯 {crisis.mini_game.name}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Правила мини-игры:
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    padding: 3,
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  {crisis.mini_game.rules}
                </Typography>

                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    📝 Как это работает:
                  </Typography>
                  <Typography variant="body2">
                    • Проведите мини-игру между игроками
                    <br />
                    • Если команда бункера выигрывает - никаких последствий
                    <br />• Если команда бункера проигрывает - произойдет
                    случайный кризис
                  </Typography>
                </Alert>

                {/* Decision Buttons - только для хоста */}
                {role === "host" && (
                  <Box>
                    <Typography variant="h5" textAlign="center" gutterBottom>
                      Результат мини-игры:
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <DecisionButton
                          choice="win"
                          fullWidth
                          size="large"
                          onClick={() => handleResolution("bunker_win")}
                          startIcon={<SuccessIcon />}
                        >
                          ✅ Команда бункера выиграла
                        </DecisionButton>
                        <Typography
                          variant="body2"
                          textAlign="center"
                          mt={1}
                          color="text.secondary"
                        >
                          Команда справилась с испытанием - никаких последствий
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <DecisionButton
                          choice="lose"
                          fullWidth
                          size="large"
                          onClick={() => handleResolution("bunker_lose")}
                          startIcon={<FailIcon />}
                        >
                          ❌ Команда бункера проиграла
                        </DecisionButton>
                        <Typography
                          variant="body2"
                          textAlign="center"
                          mt={1}
                          color="text.secondary"
                        >
                          Команда провалила испытание - будет применен случайный
                          кризис
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </MinigameCard>
          )}

          {/* Warning about consequences */}
          <Alert severity="warning" icon={<WarningIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">
              ⚠️ Внимание!
            </Typography>
            <Typography variant="body2">
              Если команда бункера проиграет в мини-игре, произойдет один из
              возможных кризисов. Это последний шанс избежать негативных
              последствий провала действия!
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      {/* Instructions for non-hosts */}
      {role !== "host" && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Проведите мини-игру и дождитесь решения хоста о результате...
        </Alert>
      )}
    </MinigameContainer>
  );
}
