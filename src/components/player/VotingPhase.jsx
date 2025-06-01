import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Grid,
  Paper,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { HowToVote, AccessTime, Person, Block } from "@mui/icons-material";

const VotingCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(30, 32, 38, 0.95) 50%)",
  border: "2px solid rgba(244, 67, 54, 0.4)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(244, 67, 54, 0.25)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(244, 67, 54, 0.1), transparent)",
    animation: "votingScan 3s infinite",
  },
  "@keyframes votingScan": {
    "0%": { left: "-100%" },
    "100%": { left: "100%" },
  },
}));

const PlayerVoteButton = styled(Button)(({ theme, voted }) => ({
  background: voted
    ? "linear-gradient(135deg, #666 0%, #888 100%)"
    : "linear-gradient(135deg, #f44336 0%, #ef5350 100%)",
  color: "#fff",
  border: `2px solid ${voted ? "#666" : "#f44336"}`,
  borderRadius: "12px",
  padding: "16px 20px",
  minHeight: "80px",
  width: "100%",
  textTransform: "none",
  fontFamily: "Orbitron",
  fontWeight: 700,
  letterSpacing: "0.5px",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: voted ? "none" : "translateY(-4px) scale(1.02)",
    boxShadow: voted
      ? "none"
      : "0 8px 25px rgba(244, 67, 54, 0.4), 0 0 20px rgba(244, 67, 54, 0.3)",
    background: voted
      ? "linear-gradient(135deg, #666 0%, #888 100%)"
      : "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)",
  },
  "&:disabled": {
    background: "#333",
    color: "#666",
    border: "2px solid #333",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: voted ? "0" : "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
    animation: voted ? "none" : "buttonScan 2s infinite",
  },
  "@keyframes buttonScan": {
    "0%": { left: "-100%" },
    "100%": { left: "100%" },
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontFamily: "Orbitron",
  fontWeight: 700,
  fontSize: "0.8rem",
  animation: "pulse 2s infinite",
  "@keyframes pulse": {
    "0%, 100%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.05)" },
  },
}));

const VotingPhase = ({ game, playerId, onVote }) => {
  const canVote = game.available_actions?.includes("cast_vote");
  const votingStatus = game.voting_status || {};
  const voted = votingStatus.voted_count || 0;
  const total = votingStatus.total_count || game.players?.length || 0;
  const progress = total > 0 ? (voted / total) * 100 : 0;

  // Игроки, за которых можно голосовать
  const votablePlayersIds =
    game.players
      ?.filter((p) => !game.eliminated_ids?.includes(p.id) && p.id !== playerId)
      ?.map((p) => p.id) || [];

  const votablePlayers =
    game.players?.filter((p) => votablePlayersIds.includes(p.id)) || [];

  // Проверяем, проголосовал ли текущий игрок
  const hasVoted = votingStatus.voted_players?.includes(playerId) || false;

  return (
    <VotingCard>
      <CardContent sx={{ position: "relative", zIndex: 1, p: 3 }}>
        {/* Заголовок */}
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Orbitron",
              fontWeight: 700,
              color: "#f44336",
              textShadow: "0 0 15px rgba(244, 67, 54, 0.7)",
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <HowToVote sx={{ fontSize: 40 }} />
            ГОЛОСОВАНИЕ
            <HowToVote sx={{ fontSize: 40 }} />
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontFamily: "monospace" }}
          >
            Кого исключить из бункера?
          </Typography>
        </Box>

        {/* Статус голосования */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            background: "rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(244, 67, 54, 0.3)",
            borderRadius: 2,
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="h6" sx={{ fontFamily: "Orbitron" }}>
              ПРОГРЕСС ГОЛОСОВАНИЯ
            </Typography>
            <StatusChip
              label={hasVoted ? "ВЫ ПРОГОЛОСОВАЛИ" : "ОЖИДАЕТСЯ ВАШ ГОЛОС"}
              color={hasVoted ? "success" : "warning"}
              icon={hasVoted ? <Block /> : <AccessTime />}
            />
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(90deg, #f44336, #ff8a65)",
                borderRadius: 6,
              },
            }}
          />

          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontFamily="monospace"
            >
              Проголосовало: {voted}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontFamily="monospace"
            >
              Всего: {total}
            </Typography>
          </Box>
        </Paper>

        {/* Кнопки голосования */}
        {canVote && !hasVoted ? (
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                textAlign: "center",
                fontFamily: "Orbitron",
                color: "#ff6b35",
              }}
            >
              ВЫБЕРИТЕ КАНДИДАТА НА ИСКЛЮЧЕНИЕ:
            </Typography>

            <Grid container spacing={2}>
              {votablePlayers.map((player) => (
                <Grid item xs={12} sm={6} md={4} key={player.id}>
                  <PlayerVoteButton
                    onClick={() => onVote(player.id)}
                    voted={false}
                  >
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Avatar
                          sx={{
                            bgcolor: "#f44336",
                            width: 32,
                            height: 32,
                            fontWeight: "bold",
                            border: "2px solid #fff",
                          }}
                        >
                          {player.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography
                          variant="h6"
                          sx={{ fontFamily: "Orbitron" }}
                        >
                          {player.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Нажмите для голосования
                      </Typography>
                    </Box>
                  </PlayerVoteButton>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box textAlign="center" py={4}>
            {hasVoted ? (
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#4caf50",
                    fontFamily: "Orbitron",
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  ✓ ВАШ ГОЛОС ПРИНЯТ
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontFamily="monospace"
                >
                  Ожидаем остальных игроков...
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#ff9800",
                    fontFamily: "Orbitron",
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  ОЖИДАНИЕ РЕЗУЛЬТАТОВ
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontFamily="monospace"
                >
                  Голосование завершено, ждем подведения итогов...
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Список выживших */}
        <Paper
          sx={{
            mt: 3,
            p: 2,
            background: "rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontFamily: "Orbitron",
              color: "#00bcd4",
            }}
          >
            ВЫЖИВШИЕ В БУНКЕРЕ:
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={1}>
            {game.players
              ?.filter((p) => !game.eliminated_ids?.includes(p.id))
              ?.map((player) => (
                <Chip
                  key={player.id}
                  label={player.name}
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: player.id === playerId ? "#ff6b35" : "#00bcd4",
                        width: 24,
                        height: 24,
                      }}
                    >
                      <Person sx={{ fontSize: 16 }} />
                    </Avatar>
                  }
                  color={player.id === playerId ? "primary" : "secondary"}
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 600,
                    border: `1px solid ${
                      player.id === playerId ? "#ff6b35" : "#00bcd4"
                    }33`,
                  }}
                />
              ))}
          </Box>
        </Paper>
      </CardContent>
    </VotingCard>
  );
};

export default VotingPhase;
