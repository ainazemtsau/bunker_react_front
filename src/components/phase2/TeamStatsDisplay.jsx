import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  LinearProgress,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Engineering as TechIcon,
  FitnessCenter as StrengthIcon,
  Psychology as IntelIcon,
  Favorite as HealthIcon,
  EmojiEmotions as EmpathyIcon,
  RecordVoiceOver as CharismaIcon,
} from "@mui/icons-material";
import {
  PHASE2_UI,
  TEAM_COLORS,
  TEAM_NAMES,
  CHARACTER_STATS,
  STAT_NAMES,
} from "../../constants/phase2";

const TeamCard = styled(Card)(({ team, theme }) => {
  const colors = {
    [PHASE2_UI.TEAMS.BUNKER]: {
      bg: "rgba(13, 71, 161, 0.1)",
      border: "rgba(13, 71, 161, 0.3)",
    },
    [PHASE2_UI.TEAMS.OUTSIDE]: {
      bg: "rgba(183, 28, 28, 0.1)",
      border: "rgba(183, 28, 28, 0.3)",
    },
  };

  const teamColors = colors[team] || colors[PHASE2_UI.TEAMS.BUNKER];

  return {
    background: teamColors.bg,
    border: `2px solid ${teamColors.border}`,
    height: "100%",
  };
});

const StatBar = styled(LinearProgress)(({ team }) => {
  const color = TEAM_COLORS[team];

  return {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    "& .MuiLinearProgress-bar": {
      backgroundColor: color,
      borderRadius: 4,
    },
  };
});

// Иконки для статистик
const StatIcons = {
  [CHARACTER_STATS.TECHNICAL]: TechIcon,
  [CHARACTER_STATS.STRENGTH]: StrengthIcon,
  [CHARACTER_STATS.INTELLIGENCE]: IntelIcon,
  [CHARACTER_STATS.HEALTH]: HealthIcon,
  [CHARACTER_STATS.EMPATHY]: EmpathyIcon,
  [CHARACTER_STATS.CHARISMA]: CharismaIcon,
};

function StatItem({ stat, value, maxValue = 20, team }) {
  const IconComponent = StatIcons[stat] || TechIcon;
  const percentage = (value / maxValue) * 100;

  return (
    <Box mb={2}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <IconComponent sx={{ fontSize: 20, color: TEAM_COLORS[team] }} />
        <Typography variant="body2" fontWeight="bold" flex={1}>
          {STAT_NAMES[stat] || stat}
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          {value}
        </Typography>
      </Box>
      <StatBar variant="determinate" value={percentage} team={team} />
    </Box>
  );
}

function TeamStatsCard({ team, stats, title }) {
  if (!stats) {
    return (
      <TeamCard team={team}>
        <CardContent>
          <Typography variant="h6" color={TEAM_COLORS[team]} gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Статистика недоступна
          </Typography>
        </CardContent>
      </TeamCard>
    );
  }

  // Находим максимальное значение для нормализации
  const maxValue = Math.max(...Object.values(stats), 20);

  // Вычисляем общую силу команды
  const totalPower = Object.values(stats).reduce(
    (sum, value) => sum + value,
    0
  );

  return (
    <TeamCard team={team}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <Typography variant="h6" color={TEAM_COLORS[team]} fontWeight="bold">
            {title}
          </Typography>
          <Chip
            label={`Сила: ${totalPower}`}
            size="small"
            sx={{
              backgroundColor: `${TEAM_COLORS[team]}20`,
              color: TEAM_COLORS[team],
              border: `1px solid ${TEAM_COLORS[team]}`,
            }}
          />
        </Box>

        {Object.entries(stats).map(([stat, value]) => (
          <StatItem
            key={stat}
            stat={stat}
            value={value}
            maxValue={maxValue}
            team={team}
          />
        ))}
      </CardContent>
    </TeamCard>
  );
}

export default function TeamStatsDisplay({ teamStats, showTitle = true }) {
  if (!teamStats || (!teamStats.bunker && !teamStats.outside)) {
    return showTitle ? (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Статистика команд
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Статистика команд недоступна
          </Typography>
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
            mb: 3,
          }}
        >
          📊 Статистика команд
        </Typography>
      )}

      <Grid container spacing={3}>
        {/* Bunker Team */}
        <Grid item xs={12} md={6}>
          <TeamStatsCard
            team={PHASE2_UI.TEAMS.BUNKER}
            stats={teamStats.bunker}
            title={TEAM_NAMES[PHASE2_UI.TEAMS.BUNKER]}
          />
        </Grid>

        {/* Outside Team */}
        <Grid item xs={12} md={6}>
          <TeamStatsCard
            team={PHASE2_UI.TEAMS.OUTSIDE}
            stats={teamStats.outside}
            title={TEAM_NAMES[PHASE2_UI.TEAMS.OUTSIDE]}
          />
        </Grid>
      </Grid>

      {/* Comparison */}
      {teamStats.bunker && teamStats.outside && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ⚖️ Сравнение команд
            </Typography>

            <Grid container spacing={2}>
              {Object.keys({ ...teamStats.bunker, ...teamStats.outside })
                .filter(
                  (stat) =>
                    teamStats.bunker[stat] !== undefined &&
                    teamStats.outside[stat] !== undefined
                )
                .map((stat) => {
                  const bunkerValue = teamStats.bunker[stat] || 0;
                  const outsideValue = teamStats.outside[stat] || 0;
                  const advantage =
                    bunkerValue > outsideValue
                      ? "bunker"
                      : outsideValue > bunkerValue
                      ? "outside"
                      : "equal";

                  return (
                    <Grid item xs={12} sm={6} md={4} key={stat}>
                      <Box>
                        <Typography variant="subtitle2" mb={1}>
                          {STAT_NAMES[stat] || stat}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography
                            variant="body2"
                            color={TEAM_COLORS[PHASE2_UI.TEAMS.BUNKER]}
                            fontWeight="bold"
                          >
                            {bunkerValue}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            VS
                          </Typography>
                          <Typography
                            variant="body2"
                            color={TEAM_COLORS[PHASE2_UI.TEAMS.OUTSIDE]}
                            fontWeight="bold"
                          >
                            {outsideValue}
                          </Typography>
                          {advantage !== "equal" && (
                            <Chip
                              label={TEAM_NAMES[advantage]}
                              size="small"
                              color={
                                advantage === PHASE2_UI.TEAMS.BUNKER
                                  ? "primary"
                                  : "error"
                              }
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      </Box>
                    </Grid>
                  );
                })}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
