import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Tooltip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Casino as DifficultyIcon,
  Block as BlockedIcon,
  TrendingDown as DebuffIcon,
  TrendingUp as BuffIcon,
  Visibility as PreviewIcon,
  SportsEsports as MinigameIcon,
  Warning as CrisisIcon,
  ExpandMore as ExpandIcon,
} from "@mui/icons-material";
import { PHASE2_UI, TEAM_COLORS } from "../../constants/phase2";
import ActionPreviewModal from "./ActionPreviewModal";
import useGameStore from "../../stores/gameStore";

const StyledCard = styled(Card)(({ theme, disabled, myteam }) => {
  const teamColor = TEAM_COLORS[myteam] || "#1976d2";

  return {
    background: disabled
      ? "rgba(100, 100, 100, 0.1)"
      : `linear-gradient(135deg, ${teamColor}20 0%, ${teamColor}10 100%)`,
    border: `2px solid ${
      disabled ? "rgba(100, 100, 100, 0.3)" : `${teamColor}40`
    }`,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    opacity: disabled ? 0.6 : 1,
    "&:hover": disabled
      ? {}
      : {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 25px ${teamColor}30`,
          border: `2px solid ${teamColor}60`,
        },
  };
});

const ActionButton = styled(Button)(({ theme, myteam }) => {
  const teamColor = TEAM_COLORS[myteam] || "#1976d2";

  return {
    background: `linear-gradient(45deg, ${teamColor} 30%, ${teamColor}CC 90%)`,
    color: "white",
    fontWeight: "bold",
    "&:hover": {
      background: `linear-gradient(45deg, ${teamColor}DD 30%, ${teamColor}AA 90%)`,
    },
    "&:disabled": {
      background: "rgba(100, 100, 100, 0.3)",
      color: "rgba(255, 255, 255, 0.3)",
    },
  };
});

const PreviewButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)",
  color: "white",
  "&:hover": {
    background: "linear-gradient(45deg, #7b1fa2 30%, #512da8 90%)",
  },
}));

const DifficultyChip = styled(Chip)(({ difficulty }) => {
  const getDifficultyColor = (diff) => {
    if (diff <= 10) return { bg: "#4caf50", text: "#fff" };
    if (diff <= 15) return { bg: "#ff9800", text: "#fff" };
    return { bg: "#f44336", text: "#fff" };
  };

  const colors = getDifficultyColor(difficulty);

  return {
    backgroundColor: colors.bg,
    color: colors.text,
    fontWeight: "bold",
  };
});

export default function ActionCard({
  action,
  onSelect,
  disabled = false,
  myTeam,
  playerStats = null,
}) {
  const { game } = useGameStore();
  const playerId = useGameStore((s) => s.playerId);

  const [previewOpen, setPreviewOpen] = useState(false);

  if (!action) {
    return (
      <Card sx={{ minHeight: 200 }}>
        <CardContent>
          <Typography color="error">Ошибка: нет данных действия</Typography>
        </CardContent>
      </Card>
    );
  }

  // Проверяем блокировку действия согласно документации
  const isBlocked = action.blocked === true;
  const isActionDisabled = disabled || isBlocked;

  // Получаем модифицированную сложность согласно документации
  const difficulty = action.modified_difficulty || action.difficulty || 10;
  const difficultyModifier = action.difficulty_modifier || 0;

  // Получаем эффективность согласно документации
  const effectivenessModifier = action.effectiveness_modifier || 1.0;

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    setPreviewOpen(true);
  };

  const handleConfirmAction = () => {
    if (onSelect) {
      onSelect(action.id);
    }
  };

  const handleCardClick = () => {
    if (!isActionDisabled) {
      setPreviewOpen(true);
    }
  };

  // Получаем участников (текущий игрок)
  const participants = [playerId];

  return (
    <>
      <StyledCard
        disabled={isActionDisabled}
        myteam={myTeam}
        onClick={handleCardClick}
      >
        <CardContent
          sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          {/* Action Name */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {action.name || action.id}
          </Typography>

          {/* Action Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, flexGrow: 1 }}
          >
            {action.description || "Описание недоступно"}
          </Typography>

          {/* Difficulty and Modifiers */}
          <Box mb={2}>
            <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
              <Tooltip
                title={`Базовая сложность: ${action.difficulty || 10}${
                  difficultyModifier !== 0
                    ? `, модификатор: ${
                        difficultyModifier > 0 ? "+" : ""
                      }${difficultyModifier}`
                    : ""
                }`}
              >
                <DifficultyChip
                  icon={<DifficultyIcon />}
                  label={`Сложность: ${difficulty}+`}
                  size="small"
                  difficulty={difficulty}
                />
              </Tooltip>

              {effectivenessModifier !== 1.0 && (
                <Chip
                  icon={
                    effectivenessModifier > 1.0 ? <BuffIcon /> : <DebuffIcon />
                  }
                  label={`Эффект: ×${effectivenessModifier}`}
                  size="small"
                  color={effectivenessModifier > 1.0 ? "success" : "warning"}
                />
              )}
            </Stack>
          </Box>

          {/* Success Effects */}
          {action.effects?.success && (
            <Box mb={2}>
              <Typography
                variant="caption"
                color="success.main"
                display="block"
                mb={1}
              >
                ✅ При успехе:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {Object.entries(action.effects.success).map(
                  ([effect, value]) => (
                    <Chip
                      key={effect}
                      label={`${effect}: +${value}`}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )
                )}
              </Stack>
            </Box>
          )}

          {/* ✅ НОВАЯ ЛОГИКА: Показываем разные эффекты провала для разных команд */}
          {myTeam === PHASE2_UI.TEAMS.BUNKER ? (
            // Для команды бункера показываем мини-игры и возможные кризисы
            <>
              {action.mini_games && action.mini_games.length > 0 && (
                <Box mb={2}>
                  <Typography
                    variant="caption"
                    color="info.main"
                    display="block"
                    mb={1}
                  >
                    🎯 При провале - мини-игры:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {action.mini_games.map((minigame) => (
                      <Chip
                        key={minigame}
                        icon={<MinigameIcon />}
                        label={minigame}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {action.failure_crises && action.failure_crises.length > 0 && (
                <Box mb={2}>
                  <Typography
                    variant="caption"
                    color="warning.main"
                    display="block"
                    mb={1}
                  >
                    ⚠️ Возможные кризисы:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {action.failure_crises.map((crisis) => (
                      <Chip
                        key={crisis}
                        icon={<CrisisIcon />}
                        label={crisis}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </>
          ) : (
            // Для команды снаружи показываем обычные failure effects
            action.effects?.failure && (
              <Box mb={2}>
                <Typography
                  variant="caption"
                  color="error.main"
                  display="block"
                  mb={1}
                >
                  ❌ При провале:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {Object.entries(action.effects.failure).map(
                    ([effect, value]) => (
                      <Chip
                        key={effect}
                        label={`${effect}: ${value}`}
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    )
                  )}
                </Stack>
              </Box>
            )
          )}

          {/* Required Stats */}
          {action.stat_weights &&
            Object.keys(action.stat_weights).length > 0 && (
              <Box mb={2}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mb={1}
                >
                  Важные характеристики:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {Object.entries(action.stat_weights).map(([stat, weight]) => (
                    <Chip
                      key={stat}
                      label={`${stat}: ×${weight}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.7rem" }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

          {/* Blocking Statuses */}
          {action.blocking_statuses && action.blocking_statuses.length > 0 && (
            <Box mb={2}>
              <Typography
                variant="caption"
                color="warning.main"
                display="block"
                mb={1}
              >
                Блокируется статусами:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {action.blocking_statuses.map((status) => (
                  <Chip
                    key={status}
                    label={status}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Action Buttons */}
          <Box mt="auto">
            {isBlocked ? (
              <Button
                fullWidth
                disabled
                startIcon={<BlockedIcon />}
                sx={{ color: "error.main" }}
              >
                Заблокировано
              </Button>
            ) : (
              <Stack spacing={1}>
                <PreviewButton
                  fullWidth
                  variant="contained"
                  onClick={handlePreviewClick}
                  startIcon={<PreviewIcon />}
                  disabled={isActionDisabled}
                >
                  Анализ шансов
                </PreviewButton>

                <ActionButton
                  fullWidth
                  variant="contained"
                  disabled={isActionDisabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirmAction();
                  }}
                  myteam={myTeam}
                >
                  {disabled ? "Недоступно" : "Выбрать сразу"}
                </ActionButton>
              </Stack>
            )}
          </Box>
        </CardContent>
      </StyledCard>

      {/* Preview Modal */}
      <ActionPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onConfirm={handleConfirmAction}
        action={action}
        participants={participants}
      />
    </>
  );
}
