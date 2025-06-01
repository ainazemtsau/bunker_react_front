import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Divider,
} from "@mui/material";
import {
  ExpandMore as ExpandIcon,
  Casino as DiceIcon,
  TrendingUp as BonusIcon,
  TrendingDown as PenaltyIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import useSocket from "../../hooks/useSocket";
import useGameStore from "../../stores/gameStore";
import { STAT_NAMES } from "../../constants/phase2";

export default function ActionPreviewModal({
  open,
  onClose,
  onConfirm,
  action,
  participants = [],
}) {
  const { socket } = useSocket();
  const { game } = useGameStore();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Запрашиваем предварительный расчет при открытии модала
  useEffect(() => {
    if (open && action && participants.length > 0) {
      setLoading(true);
      setPreview(null);

      console.log("[ACTION_PREVIEW] Requesting preview for:", {
        action: action.id,
        participants,
      });

      socket.emit("phase2_get_action_preview", {
        gameId: game?.id,
        participants,
        actionId: action.id,
      });
    }
  }, [open, action, participants, socket, game?.id]);

  // Слушаем ответ от сервера
  useEffect(() => {
    const handleActionPreview = (data) => {
      console.log("[ACTION_PREVIEW] Received preview:", data);
      setPreview(data.preview);
      setLoading(false);
    };

    const handleError = (error) => {
      console.error("[ACTION_PREVIEW] Error:", error);
      setLoading(false);
    };

    if (socket) {
      socket.on("action_preview", handleActionPreview);
      socket.on("error", handleError);

      return () => {
        socket.off("action_preview", handleActionPreview);
        socket.off("error", handleError);
      };
    }
  }, [socket]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getSuccessColor = (chance) => {
    if (chance >= 70) return "#4caf50";
    if (chance >= 40) return "#ff9800";
    return "#f44336";
  };

  if (!action) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          🎲 Предварительный расчет: {action.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Анализ шансов успеха перед выполнением действия
        </Typography>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box textAlign="center" py={4}>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography>Рассчитываем шансы успеха...</Typography>
          </Box>
        ) : preview ? (
          <Grid container spacing={3}>
            {/* Общая информация */}
            <Grid item xs={12}>
              <Card sx={{ bgcolor: "rgba(0,0,0,0.3)" }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                      <Box textAlign="center">
                        <Typography variant="caption" color="text.secondary">
                          Шанс успеха
                        </Typography>
                        <Typography
                          variant="h4"
                          fontWeight="bold"
                          sx={{
                            color: getSuccessColor(preview.success_chance),
                          }}
                        >
                          {preview.success_chance}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={preview.success_chance}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: getSuccessColor(
                                preview.success_chance
                              ),
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box textAlign="center">
                        <Typography variant="caption" color="text.secondary">
                          Нужно выкинуть
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {preview.required_roll}+
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          на d20
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box textAlign="center">
                        <Typography variant="caption" color="text.secondary">
                          Ваш бонус
                        </Typography>
                        <Typography
                          variant="h4"
                          fontWeight="bold"
                          color="primary.main"
                        >
                          +{preview.total_stats}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          от характеристик
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box textAlign="center">
                        <Typography variant="caption" color="text.secondary">
                          Сложность
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {preview.modified_difficulty}
                        </Typography>
                        {preview.status_modifiers.difficulty_modifier !== 0 && (
                          <Typography
                            variant="body2"
                            color={
                              preview.status_modifiers.difficulty_modifier > 0
                                ? "error"
                                : "success"
                            }
                          >
                            {preview.base_difficulty}{" "}
                            {preview.status_modifiers.difficulty_modifier > 0
                              ? "+"
                              : ""}
                            {preview.status_modifiers.difficulty_modifier}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Блокировки */}
            {preview.blocked && (
              <Grid item xs={12}>
                <Alert severity="error" icon={<BlockIcon />}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Действие заблокировано!
                  </Typography>
                  <Typography variant="body2">
                    Статусы: {preview.blocking_statuses.join(", ")}
                  </Typography>
                </Alert>
              </Grid>
            )}

            {/* Модификаторы статусов */}
            {(preview.status_modifiers.difficulty_modifier !== 0 ||
              preview.status_modifiers.effectiveness !== 1.0) && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    bgcolor: "rgba(255, 152, 0, 0.1)",
                    border: "1px solid rgba(255, 152, 0, 0.3)",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      ⚡ Влияние активных статусов
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      {preview.status_modifiers.difficulty_modifier !== 0 && (
                        <Chip
                          icon={
                            preview.status_modifiers.difficulty_modifier > 0 ? (
                              <PenaltyIcon />
                            ) : (
                              <BonusIcon />
                            )
                          }
                          label={`Сложность: ${
                            preview.status_modifiers.difficulty_modifier > 0
                              ? "+"
                              : ""
                          }${preview.status_modifiers.difficulty_modifier}`}
                          color={
                            preview.status_modifiers.difficulty_modifier > 0
                              ? "error"
                              : "success"
                          }
                        />
                      )}
                      {preview.status_modifiers.effectiveness !== 1.0 && (
                        <Chip
                          icon={
                            preview.status_modifiers.effectiveness < 1.0 ? (
                              <PenaltyIcon />
                            ) : (
                              <BonusIcon />
                            )
                          }
                          label={`Эффективность: ×${preview.status_modifiers.effectiveness}`}
                          color={
                            preview.status_modifiers.effectiveness < 1.0
                              ? "error"
                              : "success"
                          }
                        />
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Участники */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                👥 Участники и их вклад
              </Typography>
              {preview.participants.map((participant, index) => (
                <Accordion
                  key={participant.player_id}
                  sx={{ mb: 1, bgcolor: "rgba(0,0,0,0.2)" }}
                >
                  <AccordionSummary expandIcon={<ExpandIcon />}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      width="100%"
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {participant.player_name}
                      </Typography>
                      <Chip
                        label={`Вклад: +${participant.total_contribution}`}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {Object.entries(participant.stat_contributions).map(
                        ([stat, contrib]) => (
                          <Grid item xs={12} sm={6} md={4} key={stat}>
                            <Card sx={{ bgcolor: "rgba(0,0,0,0.3)", p: 2 }}>
                              <Typography
                                variant="subtitle2"
                                fontWeight="bold"
                                mb={1}
                              >
                                {STAT_NAMES[stat] || stat}
                              </Typography>

                              <Stack spacing={1}>
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography variant="body2">
                                    Базовая:
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {contrib.base}
                                  </Typography>
                                </Box>

                                {contrib.trait_bonus !== 0 && (
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                  >
                                    <Typography
                                      variant="body2"
                                      color="success.main"
                                    >
                                      Бонусы черт:
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="success.main"
                                    >
                                      +{contrib.trait_bonus}
                                    </Typography>
                                  </Box>
                                )}

                                {contrib.phobia_penalty !== 0 && (
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                  >
                                    <Typography
                                      variant="body2"
                                      color="error.main"
                                    >
                                      Штрафы фобий:
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="error.main"
                                    >
                                      {contrib.phobia_penalty}
                                    </Typography>
                                  </Box>
                                )}

                                <Divider />

                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography variant="body2" fontWeight="bold">
                                    Итого:
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {contrib.final}
                                  </Typography>
                                </Box>

                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography variant="body2">
                                    ×{contrib.weight} =
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    color="primary.main"
                                  >
                                    +{contrib.contribution}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Card>
                          </Grid>
                        )
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>
        ) : (
          <Alert severity="error">
            Не удалось получить предварительный расчет
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Отмена
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading || (preview && preview.blocked)}
          startIcon={<DiceIcon />}
        >
          {preview && preview.blocked ? "Заблокировано" : "Выполнить действие"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
