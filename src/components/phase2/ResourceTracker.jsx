import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Grid,
  Alert,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Home as BunkerIcon,
  Favorite as MoraleIcon,
  Restaurant as SuppliesIcon,
  Warning as WarningIcon,
  Schedule as TimerIcon,
} from "@mui/icons-material";
import { PHASE2_RESOURCES, RESOURCE_STATUS } from "../../constants/phase2";
import { getResourceStatus } from "../../utils/phase2Utils";

const ResourceCard = styled(Card)(({ status, theme }) => {
  const statusColors = {
    [RESOURCE_STATUS.CRITICAL]: {
      bg: "rgba(244, 67, 54, 0.2)",
      border: "rgba(244, 67, 54, 0.4)",
      text: "#f44336",
    },
    [RESOURCE_STATUS.WARNING]: {
      bg: "rgba(255, 152, 0, 0.2)",
      border: "rgba(255, 152, 0, 0.4)",
      text: "#ff9800",
    },
    [RESOURCE_STATUS.GOOD]: {
      bg: "rgba(76, 175, 80, 0.2)",
      border: "rgba(76, 175, 80, 0.4)",
      text: "#4caf50",
    },
  };

  const colors = statusColors[status] || statusColors[RESOURCE_STATUS.GOOD];

  return {
    background: colors.bg,
    border: `2px solid ${colors.border}`,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: `0 8px 25px ${colors.border}40`,
    },
  };
});

const ResourceProgress = styled(LinearProgress)(({ status }) => {
  const getColor = () => {
    switch (status) {
      case RESOURCE_STATUS.CRITICAL:
        return "#f44336";
      case RESOURCE_STATUS.WARNING:
        return "#ff9800";
      default:
        return "#4caf50";
    }
  };

  return {
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    "& .MuiLinearProgress-bar": {
      backgroundColor: getColor(),
      borderRadius: 6,
    },
  };
});

const CountdownChip = styled(Chip)(({ theme }) => ({
  background: "rgba(244, 67, 54, 0.3)",
  border: "1px solid rgba(244, 67, 54, 0.6)",
  color: "#f44336",
  animation: "pulse 1.5s infinite",
  "@keyframes pulse": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.7 },
    "100%": { opacity: 1 },
  },
}));

function ResourceBar({
  icon: Icon,
  label,
  value,
  max,
  status,
  countdown = 0,
  description,
}) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <ResourceCard status={status}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Icon sx={{ fontSize: 32, color: "primary.main" }} />
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold">
              {label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight="bold">
            {value}/{max}
          </Typography>
        </Box>

        <Box mb={2}>
          <ResourceProgress
            variant="determinate"
            value={percentage}
            status={status}
          />
        </Box>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="caption" color="text.secondary">
            {Math.round(percentage)}%
          </Typography>

          {countdown > 0 && (
            <CountdownChip
              icon={<TimerIcon />}
              label={`${countdown} раунд${
                countdown > 1 ? (countdown > 4 ? "ов" : "а") : ""
              }`}
              size="small"
            />
          )}

          {status === RESOURCE_STATUS.CRITICAL && (
            <Chip
              icon={<WarningIcon />}
              label="КРИТИЧНО"
              color="error"
              size="small"
            />
          )}
        </Stack>
      </CardContent>
    </ResourceCard>
  );
}

export default function ResourceTracker({
  bunkerHp,
  maxHp = PHASE2_RESOURCES.MAX_BUNKER_HP,
  morale,
  maxMorale = PHASE2_RESOURCES.MAX_MORALE,
  supplies,
  maxSupplies = PHASE2_RESOURCES.MAX_SUPPLIES,
  moraleCountdown = 0,
  suppliesCountdown = 0,
  round,
  showTitle = true,
}) {
  // Определяем статусы ресурсов
  const bunkerStatus = getResourceStatus(bunkerHp, maxHp);
  const moraleStatus =
    morale <= 0 || moraleCountdown > 0
      ? RESOURCE_STATUS.CRITICAL
      : getResourceStatus(morale, maxMorale);
  const suppliesStatus =
    supplies <= 0 || suppliesCountdown > 0
      ? RESOURCE_STATUS.CRITICAL
      : getResourceStatus(supplies, maxSupplies);

  // Проверяем критические условия
  const criticalConditions = [];

  if (bunkerHp <= 2) {
    criticalConditions.push("Бункер на грани разрушения!");
  }

  if (morale <= 0) {
    criticalConditions.push("Мораль команды на нуле!");
  }

  if (supplies <= 0) {
    criticalConditions.push("Припасы закончились!");
  }

  if (moraleCountdown > 0) {
    criticalConditions.push(
      `Мораль будет падать ${moraleCountdown} раунд${
        moraleCountdown > 1 ? (moraleCountdown > 4 ? "ов" : "а") : ""
      }!`
    );
  }

  if (suppliesCountdown > 0) {
    criticalConditions.push(
      `Припасы будут тратиться ${suppliesCountdown} раунд${
        suppliesCountdown > 1 ? (suppliesCountdown > 4 ? "ов" : "а") : ""
      }!`
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      {showTitle && (
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontFamily: '"Orbitron", monospace',
            mb: 3,
          }}
        >
          📊 Состояние бункера
        </Typography>
      )}

      {/* Critical Alerts */}
      {criticalConditions.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            ⚠️ Критическое состояние!
          </Typography>
          <Stack spacing={1}>
            {criticalConditions.map((condition, index) => (
              <Typography key={index} variant="body2">
                • {condition}
              </Typography>
            ))}
          </Stack>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Bunker HP */}
        <Grid item xs={12} md={4}>
          <ResourceBar
            icon={BunkerIcon}
            label="Прочность бункера"
            value={bunkerHp}
            max={maxHp}
            status={bunkerStatus}
            description="Основная защита от атак противника"
          />
        </Grid>

        {/* Morale */}
        <Grid item xs={12} md={4}>
          <ResourceBar
            icon={MoraleIcon}
            label="Мораль команды"
            value={morale}
            max={maxMorale}
            status={moraleStatus}
            countdown={moraleCountdown}
            description="Дух команды и готовность к борьбе"
          />
        </Grid>

        {/* Supplies */}
        <Grid item xs={12} md={4}>
          <ResourceBar
            icon={SuppliesIcon}
            label="Припасы"
            value={supplies}
            max={maxSupplies}
            status={suppliesStatus}
            countdown={suppliesCountdown}
            description="Еда, вода и необходимые ресурсы"
          />
        </Grid>
      </Grid>

      {/* Round Progress */}
      {round && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">📅 Прогресс игры</Typography>
              <Typography variant="h5" fontWeight="bold">
                Раунд {round}/10
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={(round / 10) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#2196f3",
                  borderRadius: 4,
                },
              }}
            />

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mt={1}
            >
              {10 - round} раунд
              {10 - round > 1 ? (10 - round > 4 ? "ов" : "а") : ""} до
              автоматической победы бункера
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
