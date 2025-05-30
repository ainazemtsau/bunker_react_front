import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  LinearProgress,
  Tooltip,
  Collapse,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ExpandMore as ExpandMoreIcon,
  Casino as DiceIcon,
  TrendingUp as BonusIcon,
} from "@mui/icons-material";
import useGameStore from "../../stores/gameStore";
import { TEAMS } from "../../constants/phase2";
import {
  calculateActionSuccessChance,
  getStatDisplayName,
} from "../../utils/phase2Utils";

const StyledActionCard = styled(Card)(({ theme, team, disabled }) => {
  const teamColors = {
    [TEAMS.BUNKER]: {
      primary: "rgba(13, 71, 161, 0.3)",
      secondary: "rgba(25, 118, 210, 0.1)",
      border: "rgba(13, 71, 161, 0.5)",
    },
    [TEAMS.OUTSIDE]: {
      primary: "rgba(183, 28, 28, 0.3)",
      secondary: "rgba(229, 57, 53, 0.1)",
      border: "rgba(183, 28, 28, 0.5)",
    },
  };

  const colors = teamColors[team] || teamColors[TEAMS.BUNKER];

  return {
    background: disabled
      ? "rgba(100, 100, 100, 0.1)"
      : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    border: `2px solid ${
      disabled ? "rgba(100, 100, 100, 0.3)" : colors.border
    }`,
    transition: "all 0.3s ease",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    "&:hover": disabled
      ? {}
      : {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 25px ${colors.primary}`,
        },
  };
});

const DifficultyChip = styled(Chip)(({ difficulty }) => {
  const getDifficultyColor = (diff) => {
    if (diff <= 10) return { bg: "rgba(76, 175, 80, 0.2)", color: "#4caf50" };
    if (diff <= 13) return { bg: "rgba(255, 193, 7, 0.2)", color: "#ffc107" };
    return { bg: "rgba(244, 67, 54, 0.2)", color: "#f44336" };
  };

  const colors = getDifficultyColor(difficulty);

  return {
    background: colors.bg,
    color: colors.color,
    border: `1px solid ${colors.color}`,
    fontWeight: "bold",
  };
});

const SuccessBar = styled(LinearProgress)(({ success }) => {
  const getColor = (percent) => {
    if (percent >= 70) return "#4caf50";
    if (percent >= 40) return "#ffc107";
    return "#f44336";
  };

  return {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    "& .MuiLinearProgress-bar": {
      backgroundColor: getColor(success),
    },
  };
});

const ExpandMore = styled(IconButton)(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ActionCard({ action, disabled, onSelect, myTeam }) {
  const [expanded, setExpanded] = useState(false);
  const game = useGameStore((s) => s.game);
  const playerId = useGameStore((s) => s.playerId);

  const successChance = calculateActionSuccessChance(action, game, playerId);

  const handleExpandClick = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleCardClick = () => {
    if (!disabled && onSelect) {
      onSelect();
    }
  };

  // Get action effects text
  const getEffectsText = () => {
    const effects = [];
    if (action.effects.bunker_damage) {
      effects.push(`-${action.effects.bunker_damage} HP бункера`);
    }
    if (action.effects.bunker_heal) {
      effects.push(`+${action.effects.bunker_heal} HP бункера`);
    }
    if (action.effects.morale_damage) {
      effects.push(`-${action.effects.morale_damage} морали`);
    }
    if (action.effects.morale_heal) {
      effects.push(`+${action.effects.morale_heal} морали`);
    }
    if (action.effects.defense_bonus) {
      effects.push(`+${action.effects.defense_bonus} защиты`);
    }
    if (action.effects.supplies_bonus) {
      effects.push(`+${action.effects.supplies_bonus} припасов`);
    }
    return effects.join(", ");
  };

  return (
    <StyledActionCard
      team={myTeam}
      disabled={disabled}
      onClick={handleCardClick}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Typography variant="h6" component="h3" sx={{ fontWeight: "bold" }}>
            {action.name}
          </Typography>
          <DifficultyChip
            difficulty={action.difficulty}
            label={`${action.difficulty}+`}
            size="small"
            icon={<DiceIcon />}
          />
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" mb={2}>
          {action.description}
        </Typography>

        {/* Success chance */}
        <Box mb={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="body2" fontWeight="bold">
              Шанс успеха
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="primary.main">
              {successChance}%
            </Typography>
          </Box>
          <SuccessBar
            variant="determinate"
            value={successChance}
            success={successChance}
          />
        </Box>

        {/* Effects preview */}
        <Box mb={1}>
          <Typography variant="caption" color="text.secondary">
            Эффект при успехе:
          </Typography>
          <Typography variant="body2" fontWeight="bold" color="primary.main">
            {getEffectsText()}
          </Typography>
        </Box>

        {/* Crisis warning */}
        {action.crisisOnFailure && (
          <Chip
            label="⚠️ Кризис при неудаче"
            size="small"
            color="warning"
            variant="outlined"
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>

      {/* Expandable details */}
      <CardActions sx={{ pt: 0 }}>
        <Button
          size="small"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          variant="contained"
          sx={{ mr: "auto" }}
        >
          Выбрать
        </Button>

        <Tooltip title="Подробности">
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="показать детали"
            size="small"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Tooltip>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="subtitle2" gutterBottom>
            <BonusIcon sx={{ fontSize: 16, mr: 0.5 }} />
            Важные характеристики:
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
            {action.requiredStats.map((stat) => {
              const weight = action.statWeights[stat] || 1.0;
              return (
                <Chip
                  key={stat}
                  label={`${getStatDisplayName(stat)} (×${weight})`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              );
            })}
          </Stack>

          <Typography variant="caption" color="text.secondary">
            Бросок d20 + бонусы характеристик против сложности{" "}
            {action.difficulty}
          </Typography>
        </CardContent>
      </Collapse>
    </StyledActionCard>
  );
}
