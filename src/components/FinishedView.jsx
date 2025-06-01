import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import useGameStore from "../stores/gameStore";
import {
  PHASE2_UI,
  TEAM_NAMES,
  TEAM_ICONS,
  PHASE2_RESOURCES,
} from "../constants/phase2";

const FinishedContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `
    radial-gradient(circle at 50% 30%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 30% 70%, rgba(255, 165, 0, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)
  `,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(3),
}));

const VictoryCard = styled(Card)(({ winner }) => ({
  background:
    winner === PHASE2_UI.TEAMS.BUNKER
      ? "linear-gradient(135deg, rgba(13, 71, 161, 0.3) 0%, rgba(25, 118, 210, 0.2) 100%)"
      : "linear-gradient(135deg, rgba(183, 28, 28, 0.3) 0%, rgba(229, 57, 53, 0.2) 100%)",
  border: `3px solid ${
    winner === PHASE2_UI.TEAMS.BUNKER
      ? "rgba(13, 71, 161, 0.6)"
      : "rgba(183, 28, 28, 0.6)"
  }`,
  boxShadow: `0 0 30px ${
    winner === PHASE2_UI.TEAMS.BUNKER
      ? "rgba(13, 71, 161, 0.4)"
      : "rgba(183, 28, 28, 0.4)"
  }`,
  maxWidth: 600,
  width: "100%",
}));

export default function FinishedView({ backToMenu }) {
  const { game } = useGameStore();
  const phase2 = game?.phase2;
  const winner = phase2?.winner;

  if (!winner) {
    return (
      <FinishedContainer>
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="warning.main">
              Игра завершается...
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Определение результатов игры
            </Typography>
          </CardContent>
        </Card>
      </FinishedContainer>
    );
  }

  // Определяем тип победы
  const getVictoryType = () => {
    if (winner === PHASE2_UI.TEAMS.BUNKER) {
      if (phase2.round >= PHASE2_RESOURCES.MAX_ROUNDS) {
        return "survival";
      }
      return "defense";
    } else {
      if (phase2.bunker_hp <= 0) {
        return "destruction";
      }
      if (phase2.morale <= 0) {
        return "morale_break";
      }
      if (phase2.supplies <= 0) {
        return "starvation";
      }
      return "conquest";
    }
  };

  const victoryType = getVictoryType();

  const getVictoryMessage = () => {
    switch (victoryType) {
      case "survival":
        return "Команда бункера пережила все 10 раундов!";
      case "defense":
        return "Команда бункера успешно отразила все атаки!";
      case "destruction":
        return "Команда снаружи уничтожила бункер!";
      case "morale_break":
        return "Мораль команды бункера сломлена!";
      case "starvation":
        return "Команда бункера умерла от голода!";
      default:
        return "Команда снаружи одержала победу!";
    }
  };

  const getVictoryDescription = () => {
    switch (victoryType) {
      case "survival":
        return "Проявив невероятную стойкость и мудрость, жители бункера смогли пережить все испытания и дождаться спасения.";
      case "defense":
        return "Благодаря умелой защите и слаженной работе команды, бункер устоял против всех атак.";
      case "destruction":
        return "Неустанные атаки и саботаж привели к разрушению бункера. Выжившие на поверхности взяли реванш.";
      case "morale_break":
        return "Постоянное давление и кризисы сломили дух защитников бункера. Они сдались без боя.";
      case "starvation":
        return "Нехватка припасов и плохое управление ресурсами привели к гибели команды бункера.";
      default:
        return "Команда снаружи смогла преодолеть все препятствия и одержать победу.";
    }
  };

  return (
    <FinishedContainer>
      <VictoryCard winner={winner}>
        <CardContent sx={{ textAlign: "center", py: 6 }}>
          {/* Victory Icon */}
          <Typography
            variant="h1"
            sx={{
              fontSize: "4rem",
              mb: 2,
              filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.7))",
            }}
          >
            {winner === PHASE2_UI.TEAMS.BUNKER ? "🏆" : "💥"}
          </Typography>

          {/* Game Over Title */}
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Orbitron", monospace',
              fontWeight: "bold",
              mb: 2,
              background: "linear-gradient(45deg, #FFD700, #FFA500)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ИГРА ОКОНЧЕНА!
          </Typography>

          {/* Winner Team */}
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            mb={3}
          >
            <Typography variant="h2" component="span">
              {TEAM_ICONS[winner]}
            </Typography>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Победила команда
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  color:
                    winner === PHASE2_UI.TEAMS.BUNKER ? "#1976d2" : "#d32f2f",
                }}
              >
                {TEAM_NAMES[winner].toLowerCase()}
              </Typography>
            </Box>
          </Stack>

          {/* Victory Message */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            {getVictoryMessage()}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            mb={4}
            sx={{ maxWidth: 500, mx: "auto" }}
          >
            {getVictoryDescription()}
          </Typography>

          {/* Game Stats */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            mb={4}
            flexWrap="wrap"
          >
            <Chip
              label={`Раунд: ${phase2.round}/${PHASE2_RESOURCES.MAX_ROUNDS}`}
              color="primary"
              size="medium"
            />
            {phase2.bunker_hp !== undefined && (
              <Chip
                label={`HP бункера: ${phase2.bunker_hp}`}
                color={
                  phase2.bunker_hp <= 0
                    ? "error"
                    : phase2.bunker_hp <= 3
                    ? "warning"
                    : "success"
                }
                size="medium"
              />
            )}
            {phase2.morale !== undefined && (
              <Chip
                label={`Мораль: ${phase2.morale}`}
                color={
                  phase2.morale <= 0
                    ? "error"
                    : phase2.morale <= 3
                    ? "warning"
                    : "success"
                }
                size="medium"
              />
            )}
            {phase2.supplies !== undefined && (
              <Chip
                label={`Припасы: ${phase2.supplies}`}
                color={
                  phase2.supplies <= 0
                    ? "error"
                    : phase2.supplies <= 2
                    ? "warning"
                    : "success"
                }
                size="medium"
              />
            )}
          </Stack>

          {/* Back to Menu Button */}
          <Button
            variant="contained"
            size="large"
            onClick={backToMenu}
            sx={{
              px: 4,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: "bold",
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)",
              },
            }}
          >
            🏠 Вернуться в меню
          </Button>

          {/* Additional Info */}
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={3}
          >
            Спасибо за игру! Увидимся в следующем бункере.
          </Typography>
        </CardContent>
      </VictoryCard>
    </FinishedContainer>
  );
}
