import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Stack,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  CheckCircle as WorkingIcon,
  Warning as DamagedIcon,
  Cancel as DestroyedIcon,
  Build as RepairIcon,
} from "@mui/icons-material";

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "status",
})(({ status, theme }) => {
  const STATUS = {
    working: {
      bg: "linear-gradient(135deg, rgba(76,175,80,.2) 0%, rgba(76,175,80,.1) 100%)",
      border: "rgba(76,175,80,.4)",
    },
    damaged: {
      bg: "linear-gradient(135deg, rgba(255,152,0,.2) 0%, rgba(255,152,0,.1) 100%)",
      border: "rgba(255,152,0,.4)",
    },
    destroyed: {
      bg: "linear-gradient(135deg, rgba(244,67,54,.2) 0%, rgba(244,67,54,.1) 100%)",
      border: "rgba(244,67,54,.4)",
    },
  };

  const cfg = STATUS[status] || STATUS.working;

  return {
    background: cfg.bg,
    border: `2px solid ${cfg.border}`,
    transition: "all .3s ease",
    animation:
      status === "damaged"
        ? "shake .5s ease-in-out infinite alternate"
        : "none",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: `0 8px 25px ${cfg.border}40`,
    },
    "@keyframes shake": {
      "0%": { transform: "translateX(-1px)" },
      "100%": { transform: "translateX(1px)" },
    },
  };
});

const ObjectsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const objectCard = styled(Card)(({ theme, status }) => {
  const statusConfig = {
    working: {
      bg: "linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)",
      border: "rgba(76, 175, 80, 0.4)",
    },
    damaged: {
      bg: "linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(255, 152, 0, 0.1) 100%)",
      border: "rgba(255, 152, 0, 0.4)",
    },
    destroyed: {
      bg: "linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(244, 67, 54, 0.1) 100%)",
      border: "rgba(244, 67, 54, 0.4)",
    },
  };

  const config = statusConfig[status] || statusConfig.working;

  return {
    background: config.bg,
    border: `2px solid ${config.border}`,
    transition: "all 0.3s ease",
    animation:
      status === "damaged"
        ? "shake 0.5s ease-in-out infinite alternate"
        : "none",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: `0 8px 25px ${config.border}40`,
    },
    "@keyframes shake": {
      "0%": { transform: "translateX(-1px)" },
      "100%": { transform: "translateX(1px)" },
    },
  };
});

const StatusIcon = styled(Box)(({ status }) => {
  const iconConfig = {
    working: { component: WorkingIcon, color: "#4caf50" },
    damaged: { component: DamagedIcon, color: "#ff9800" },
    destroyed: { component: DestroyedIcon, color: "#f44336" },
  };

  const config = iconConfig[status] || iconConfig.working;
  const IconComponent = config.component;

  return {
    color: config.color,
    fontSize: "2rem",
    marginBottom: "8px",
    filter: status === "damaged" ? "drop-shadow(0 0 8px currentColor)" : "none",
  };
});

const EffectChip = styled(Chip)(({ theme }) => ({
  background:
    "linear-gradient(45deg, rgba(33, 150, 243, 0.3), rgba(33, 150, 243, 0.1))",
  border: "1px solid rgba(33, 150, 243, 0.4)",
  color: "#2196f3",
  fontSize: "0.75rem",
  height: "auto",
  "& .MuiChip-label": {
    padding: "4px 8px",
  },
}));

const RepairableChip = styled(Chip)(({ theme }) => ({
  background:
    "linear-gradient(45deg, rgba(255, 152, 0, 0.3), rgba(255, 152, 0, 0.1))",
  border: "1px solid rgba(255, 152, 0, 0.4)",
  color: "#ff9800",
}));

function ObjectCard({ objectId, object }) {
  const statusLabels = {
    working: "Работает",
    damaged: "Поврежден",
    destroyed: "Уничтожен",
  };

  const statusDescriptions = {
    working: "Объект функционирует нормально и дает бонусы команде",
    damaged: "Объект поврежден и не дает бонусов. Можно отремонтировать",
    destroyed: "Объект полностью уничтожен и не подлежит восстановлению",
  };

  return (
    <StyledCard status={object.status}>
      <CardContent sx={{ textAlign: "center", py: 2 }}>
        {/* Статус иконка */}
        <StatusIcon status={object.status}>
          {object.status === "working" && <WorkingIcon fontSize="inherit" />}
          {object.status === "damaged" && <DamagedIcon fontSize="inherit" />}
          {object.status === "destroyed" && (
            <DestroyedIcon fontSize="inherit" />
          )}
        </StatusIcon>

        {/* Название */}
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{
            textDecoration:
              object.status === "destroyed" ? "line-through" : "none",
            opacity: object.status === "destroyed" ? 0.6 : 1,
          }}
        >
          {object.name || objectId}
        </Typography>

        {/* Статус */}
        <Tooltip title={statusDescriptions[object.status]} arrow>
          <Chip
            label={statusLabels[object.status]}
            size="small"
            color={
              object.status === "working"
                ? "success"
                : object.status === "damaged"
                ? "warning"
                : "error"
            }
            sx={{ mb: 2 }}
          />
        </Tooltip>

        {/* Активные эффекты (только для working объектов) */}
        {object.status === "working" &&
          object.active_effects &&
          object.active_effects.length > 0 && (
            <Box mb={2}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={1}
              >
                Активные эффекты:
              </Typography>
              <Stack direction="column" spacing={0.5}>
                {object.active_effects.map((effect, index) => (
                  <EffectChip
                    key={index}
                    label={effect}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}

        {/* Возможность ремонта */}
        {object.status === "damaged" && (
          <RepairableChip
            icon={<RepairIcon />}
            label="Можно отремонтировать"
            size="small"
            variant="outlined"
          />
        )}

        {/* Информация об использовании */}
        {object.status !== "working" && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            {object.status === "damaged"
              ? "Не дает бонусов команде"
              : "Навсегда потерян"}
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  );
}

export default function BunkerObjects({ bunkerObjects, showTitle = true }) {
  // Проверяем есть ли объекты
  if (!bunkerObjects || Object.keys(bunkerObjects).length === 0) {
    return null; // Не показываем компонент если нет объектов
  }

  // Считаем статистику объектов
  const objectStats = Object.values(bunkerObjects).reduce(
    (stats, obj) => {
      stats[obj.status] = (stats[obj.status] || 0) + 1;
      stats.total++;
      return stats;
    },
    { working: 0, damaged: 0, destroyed: 0, total: 0 }
  );

  return (
    <ObjectsContainer>
      {showTitle && (
        <Box mb={3}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontFamily: '"Orbitron", monospace',
            }}
          >
            🏗️ Объекты бункера
          </Typography>

          {/* Краткая статистика */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              label={`Всего: ${objectStats.total}`}
              size="small"
              variant="outlined"
            />
            {objectStats.working > 0 && (
              <Chip
                label={`Работает: ${objectStats.working}`}
                size="small"
                color="success"
                variant="outlined"
              />
            )}
            {objectStats.damaged > 0 && (
              <Chip
                label={`Повреждено: ${objectStats.damaged}`}
                size="small"
                color="warning"
                variant="outlined"
              />
            )}
            {objectStats.destroyed > 0 && (
              <Chip
                label={`Уничтожено: ${objectStats.destroyed}`}
                size="small"
                color="error"
                variant="outlined"
              />
            )}
          </Stack>
        </Box>
      )}

      {/* Сетка объектов */}
      <Grid container spacing={2}>
        {Object.entries(bunkerObjects).map(([objectId, object]) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={objectId}>
            <ObjectCard objectId={objectId} object={object} />
          </Grid>
        ))}
      </Grid>
    </ObjectsContainer>
  );
}
