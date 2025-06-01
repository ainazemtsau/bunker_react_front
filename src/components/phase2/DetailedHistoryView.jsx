import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  Grid,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import {
  ExpandMore as ExpandIcon,
  Search as SearchIcon,
  Casino as DiceIcon,
  CheckCircle as SuccessIcon,
  Cancel as FailIcon,
  Warning as CrisisIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import useGameStore from "../../stores/gameStore";
import { TEAM_COLORS, TEAM_NAMES, TEAM_ICONS } from "../../constants/phase2";

const HistoryContainer = styled(Box)(({ theme }) => ({
  maxHeight: "70vh",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: 8,
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
  },
}));

const ActionCard = styled(Card)(({ success, blocked }) => ({
  background: blocked
    ? "linear-gradient(135deg, rgba(100, 100, 100, 0.2) 0%, rgba(100, 100, 100, 0.1) 100%)"
    : success
    ? "linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)"
    : "linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(244, 67, 54, 0.1) 100%)",
  border: `2px solid ${
    blocked
      ? "rgba(100, 100, 100, 0.4)"
      : success
      ? "rgba(76, 175, 80, 0.4)"
      : "rgba(244, 67, 54, 0.4)"
  }`,
  marginBottom: 16,
}));

const CrisisCard = styled(Card)(({ result }) => ({
  background:
    result === "bunker_win"
      ? "linear-gradient(135deg, rgba(13, 71, 161, 0.2) 0%, rgba(13, 71, 161, 0.1) 100%)"
      : "linear-gradient(135deg, rgba(183, 28, 28, 0.2) 0%, rgba(183, 28, 28, 0.1) 100%)",
  border: `2px solid ${
    result === "bunker_win"
      ? "rgba(13, 71, 161, 0.4)"
      : "rgba(183, 28, 28, 0.4)"
  }`,
  marginBottom: 16,
}));

function ActionHistoryItem({ entry }) {
  const { game } = useGameStore();

  const getPlayerName = (playerId) => {
    const player = game?.players?.find((p) => p.id === playerId);
    return player?.name || playerId;
  };

  const isBlocked = entry.blocked === true;

  return (
    <ActionCard success={entry.success} blocked={isBlocked}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Typography variant="h2" component="span">
            {TEAM_ICONS[entry.team]}
          </Typography>
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold">
              Раунд {entry.round} - {TEAM_NAMES[entry.team]}
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              color={TEAM_COLORS[entry.team]}
            >
              {entry.action_name}
            </Typography>
          </Box>
          <Stack spacing={1} alignItems="flex-end">
            {isBlocked ? (
              <Chip
                icon={<BlockIcon />}
                label="ЗАБЛОКИРОВАНО"
                color="default"
                sx={{ backgroundColor: "rgba(100, 100, 100, 0.3)" }}
              />
            ) : (
              <Chip
                icon={entry.success ? <SuccessIcon /> : <FailIcon />}
                label={entry.success ? "УСПЕХ" : "НЕУДАЧА"}
                color={entry.success ? "success" : "error"}
              />
            )}
            <Typography variant="caption" color="text.secondary">
              {/* ✅ ИСПРАВЛЕНО: используем getPlayerName для каждого участника */}
              {entry.participants?.map(getPlayerName).join(", ") ||
                "Неизвестно"}
            </Typography>
          </Stack>
        </Box>

        {!isBlocked && (
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="caption" color="text.secondary">
                  Сложность
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {entry.difficulty}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="caption" color="text.secondary">
                  Характеристики
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  +{entry.combined_stats}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="caption" color="text.secondary">
                  Нужно было
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {entry.required_roll}+
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="caption" color="text.secondary">
                  Выкинули
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    color:
                      entry.roll >= entry.required_roll ? "#4caf50" : "#f44336",
                  }}
                >
                  🎲 {entry.roll}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="caption" color="text.secondary">
                  Ваш бонус
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  {/* ✅ ИСПРАВЛЕНО: используем combined_stats */}+
                  {entry.combined_stats || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  от характеристик
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}

        {isBlocked && entry.blocking_statuses && (
          <Box mt={2}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Заблокировано статусами:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {entry.blocking_statuses.map((status) => (
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

        {!isBlocked && entry.status_modifiers && (
          <Box mt={2}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Модификаторы:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {entry.status_modifiers.difficulty_modifier !== 0 && (
                <Chip
                  label={`Сложность: ${
                    entry.status_modifiers.difficulty_modifier > 0 ? "+" : ""
                  }${entry.status_modifiers.difficulty_modifier}`}
                  size="small"
                  color={
                    entry.status_modifiers.difficulty_modifier > 0
                      ? "error"
                      : "success"
                  }
                />
              )}
              {entry.status_modifiers.effectiveness !== 1.0 && (
                <Chip
                  label={`Эффективность: ×${entry.status_modifiers.effectiveness}`}
                  size="small"
                  color={
                    entry.status_modifiers.effectiveness < 1.0
                      ? "error"
                      : "success"
                  }
                />
              )}
            </Stack>
          </Box>
        )}

        {entry.effects && Object.keys(entry.effects).length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Эффекты:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {Object.entries(entry.effects).map(([effect, value]) => (
                <Chip
                  key={effect}
                  label={`${effect}: ${value}`}
                  size="small"
                  color="info"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>
        )}

        {entry.crisis_triggered && (
          <Alert severity="warning" sx={{ mt: 2 }} icon={<CrisisIcon />}>
            Вызвал кризис: <strong>{entry.crisis_triggered}</strong>
          </Alert>
        )}
      </CardContent>
    </ActionCard>
  );
}

function CrisisHistoryItem({ entry }) {
  return (
    <CrisisCard result={entry.result}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Typography variant="h2" component="span">
            ⚠️
          </Typography>
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold">
              Раунд {entry.round} - Кризис
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="warning.main">
              {entry.crisis_id}
            </Typography>
          </Box>
          <Chip
            icon={
              entry.result === "bunker_win" ? <SuccessIcon /> : <FailIcon />
            }
            label={entry.result === "bunker_win" ? "РЕШЕН" : "НЕ РЕШЕН"}
            color={entry.result === "bunker_win" ? "primary" : "error"}
          />
        </Box>

        {entry.penalty_applied && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Команда бункера понесла потери из-за неразрешенного кризиса
          </Alert>
        )}
      </CardContent>
    </CrisisCard>
  );
}

export default function DetailedHistoryView({ showTitle = true }) {
  const { game } = useGameStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRound, setExpandedRound] = useState(null);

  const detailedHistory = game?.phase2?.detailed_history || [];

  // Группируем историю по раундам
  const historyByRounds = detailedHistory.reduce((groups, entry) => {
    const round = entry.round;
    if (!groups[round]) groups[round] = [];
    groups[round].push(entry);
    return groups;
  }, {});

  const renderHistoryEntry = (entry, index) => {
    switch (entry.type) {
      case "action":
        return <ActionHistoryItem key={index} entry={entry} />;
      case "crisis":
        return <CrisisHistoryItem key={index} entry={entry} />;
      case "minigame": // ✅ НОВЫЙ ТИП
        return <MinigameHistoryItem key={index} entry={entry} />;
      default:
        return (
          <Alert key={index} severity="warning">
            Неизвестный тип записи: {entry.type}
          </Alert>
        );
    }
  };

  // Фильтруем по поисковому запросу
  const filteredHistory = detailedHistory.filter((entry) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      entry.action_name?.toLowerCase().includes(searchLower) ||
      entry.crisis_id?.toLowerCase().includes(searchLower) ||
      entry.participants?.some((p) =>
        game?.players
          ?.find((player) => player.id === p)
          ?.name?.toLowerCase()
          .includes(searchLower)
      ) ||
      entry.team?.toLowerCase().includes(searchLower)
    );
  });

  if (detailedHistory.length === 0) {
    return showTitle ? (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 История действий
          </Typography>
          <Alert severity="info">
            История действий пуста. Начните игру, чтобы увидеть детальную
            историю.
          </Alert>
        </CardContent>
      </Card>
    ) : null;
  }

  return (
    <Box>
      {showTitle && (
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          📋 История действий ({detailedHistory.length})
        </Typography>
      )}

      {/* Поиск */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Поиск по действиям, игрокам, командам..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <HistoryContainer>
        {searchTerm ? (
          // Показываем отфильтрованные результаты
          filteredHistory.length > 0 ? (
            filteredHistory.map((entry, index) => (
              <Box key={index}>
                {entry.type === "action" ? (
                  <ActionHistoryItem entry={entry} />
                ) : (
                  <CrisisHistoryItem entry={entry} />
                )}
              </Box>
            ))
          ) : (
            <Alert severity="info">
              Ничего не найдено по запросу "{searchTerm}"
            </Alert>
          )
        ) : (
          // Показываем сгруппированную по раундам историю
          Object.entries(historyByRounds)
            .sort(([a], [b]) => parseInt(b) - parseInt(a))
            .map(([round, entries]) => (
              <Accordion
                key={round}
                expanded={expandedRound === round}
                onChange={() =>
                  setExpandedRound(expandedRound === round ? null : round)
                }
                sx={{ mb: 2, bgcolor: "rgba(0,0,0,0.2)" }}
              >
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="h6" fontWeight="bold">
                    🎯 Раунд {round} ({entries.length}{" "}
                    {entries.length === 1
                      ? "событие"
                      : entries.length < 5
                      ? "события"
                      : "событий"}
                    )
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {entries.map((entry, index) => (
                    <Box key={index}>
                      {entry.type === "action" ? (
                        <ActionHistoryItem entry={entry} />
                      ) : (
                        <CrisisHistoryItem entry={entry} />
                      )}
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))
        )}
      </HistoryContainer>
    </Box>
  );
}

function MinigameHistoryItem({ entry }) {
  const actionName =
    entry.crisis_id?.replace("action_minigame_", "").replace(/_/g, " ") ||
    "Неизвестное действие";

  return (
    <Card
      sx={{
        background:
          "linear-gradient(135deg, rgba(156, 39, 176, 0.2) 0%, rgba(156, 39, 176, 0.1) 100%)",
        border: "2px solid rgba(156, 39, 176, 0.4)",
        mb: 2,
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Typography variant="h2" component="span">
            🎯
          </Typography>
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold">
              Раунд {entry.round} - Мини-игра
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="#9c27b0">
              Испытание после провала: {actionName}
            </Typography>
          </Box>
          <Chip
            icon={
              entry.result === "bunker_win" ? <SuccessIcon /> : <FailIcon />
            }
            label={
              entry.result === "bunker_win"
                ? "КОМАНДА СПРАВИЛАСЬ"
                : "КОМАНДА ПРОВАЛИЛА"
            }
            color={entry.result === "bunker_win" ? "success" : "error"}
          />
        </Box>

        {entry.result === "bunker_lose" && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Команда бункера провалила испытание - был применен случайный кризис
          </Alert>
        )}

        {entry.result === "bunker_win" && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Команда бункера справилась с испытанием - негативные последствия
            избежаны!
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
