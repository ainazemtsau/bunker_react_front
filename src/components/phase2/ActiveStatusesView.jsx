import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ExpandMore as ExpandIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon,
  LocalFireDepartment as FireIcon,
  Bolt as ElectricIcon,
  Healing as MedicalIcon,
  Engineering as TechIcon,
} from "@mui/icons-material";
import { STATUS_SEVERITY } from "../../constants/phase2";

const StatusCard = styled(Card)(({ severity, theme }) => {
  const severityColors = {
    [STATUS_SEVERITY.CRITICAL]: {
      bg: "rgba(244, 67, 54, 0.2)",
      border: "rgba(244, 67, 54, 0.4)",
      text: "#f44336",
    },
    [STATUS_SEVERITY.HIGH]: {
      bg: "rgba(255, 152, 0, 0.2)",
      border: "rgba(255, 152, 0, 0.4)",
      text: "#ff9800",
    },
    [STATUS_SEVERITY.MEDIUM]: {
      bg: "rgba(255, 193, 7, 0.2)",
      border: "rgba(255, 193, 7, 0.4)",
      text: "#ffc107",
    },
    [STATUS_SEVERITY.LOW]: {
      bg: "rgba(156, 39, 176, 0.2)",
      border: "rgba(156, 39, 176, 0.4)",
      text: "#9c27b0",
    },
    [STATUS_SEVERITY.POSITIVE]: {
      bg: "rgba(76, 175, 80, 0.2)",
      border: "rgba(76, 175, 80, 0.4)",
      text: "#4caf50",
    },
  };

  const colors =
    severityColors[severity] || severityColors[STATUS_SEVERITY.MEDIUM];

  return {
    background: colors.bg,
    border: `2px solid ${colors.border}`,
    marginBottom: theme.spacing(1),
  };
});

const StatusIcon = ({ iconType, severity }) => {
  const iconMap = {
    fire: FireIcon,
    electric: ElectricIcon,
    medical: MedicalIcon,
    tech: TechIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    success: SuccessIcon,
    info: InfoIcon,
  };

  const IconComponent = iconMap[iconType] || InfoIcon;

  const severityColors = {
    [STATUS_SEVERITY.CRITICAL]: "#f44336",
    [STATUS_SEVERITY.HIGH]: "#ff9800",
    [STATUS_SEVERITY.MEDIUM]: "#ffc107",
    [STATUS_SEVERITY.LOW]: "#9c27b0",
    [STATUS_SEVERITY.POSITIVE]: "#4caf50",
  };

  const color = severityColors[severity] || "#9c27b0";

  return <IconComponent sx={{ color, fontSize: 24 }} />;
};

const SeverityChip = styled(Chip)(({ severity }) => {
  const severityConfig = {
    [STATUS_SEVERITY.CRITICAL]: { color: "error", label: "КРИТИЧНО" },
    [STATUS_SEVERITY.HIGH]: { color: "warning", label: "ВЫСОКИЙ" },
    [STATUS_SEVERITY.MEDIUM]: { color: "warning", label: "СРЕДНИЙ" },
    [STATUS_SEVERITY.LOW]: { color: "info", label: "НИЗКИЙ" },
    [STATUS_SEVERITY.POSITIVE]: { color: "success", label: "ПОЛОЖИТЕЛЬНЫЙ" },
  };

  const config =
    severityConfig[severity] || severityConfig[STATUS_SEVERITY.MEDIUM];

  return {
    fontWeight: "bold",
  };
});

function StatusItem({ status }) {
  const getRemainingText = (remaining) => {
    if (remaining === -1) return "До снятия";
    if (remaining === 1) return "1 раунд";
    if (remaining > 1 && remaining < 5) return `${remaining} раунда`;
    return `${remaining} раундов`;
  };

  return (
    <StatusCard severity={status.severity}>
      <CardContent sx={{ py: 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <StatusIcon iconType={status.ui?.icon} severity={status.severity} />
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold">
              {status.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {status.description}
            </Typography>
          </Box>
          <Stack spacing={1} alignItems="flex-end">
            <SeverityChip
              label={
                status.severity === STATUS_SEVERITY.CRITICAL
                  ? "КРИТИЧНО"
                  : status.severity === STATUS_SEVERITY.HIGH
                  ? "ВЫСОКИЙ"
                  : status.severity === STATUS_SEVERITY.MEDIUM
                  ? "СРЕДНИЙ"
                  : status.severity === STATUS_SEVERITY.LOW
                  ? "НИЗКИЙ"
                  : "ПОЛОЖИТЕЛЬНЫЙ"
              }
              color={
                status.severity === STATUS_SEVERITY.CRITICAL
                  ? "error"
                  : status.severity === STATUS_SEVERITY.HIGH
                  ? "warning"
                  : status.severity === STATUS_SEVERITY.MEDIUM
                  ? "warning"
                  : status.severity === STATUS_SEVERITY.LOW
                  ? "info"
                  : "success"
              }
              size="small"
              severity={status.severity}
            />
            {status.remaining_rounds && (
              <Typography variant="caption" color="text.secondary">
                {getRemainingText(status.remaining_rounds)}
              </Typography>
            )}
          </Stack>
        </Box>

        {/* Effects */}
        {status.effects && status.effects.length > 0 && (
          <Accordion sx={{ backgroundColor: "transparent" }}>
            <AccordionSummary expandIcon={<ExpandIcon />}>
              <Typography variant="subtitle2">
                Эффекты ({status.effects.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {status.effects.map((effect, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <InfoIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={effect} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Removal Conditions */}
        {status.removal_conditions && status.removal_conditions.length > 0 && (
          <Box mt={2}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={1}
            >
              Как снять:
            </Typography>
            <Stack spacing={1}>
              {status.removal_conditions.map((condition, index) => (
                <Typography key={index} variant="body2" color="text.secondary">
                  • {condition.description}
                </Typography>
              ))}
            </Stack>
          </Box>
        )}

        {/* Enhanced By */}
        {status.enhanced_by && status.enhanced_by.length > 0 && (
          <Box mt={2}>
            <Typography
              variant="caption"
              color="warning.main"
              display="block"
              mb={1}
            >
              Усиливается:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {status.enhanced_by.map((enhancer) => (
                <Chip
                  key={enhancer}
                  label={enhancer}
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Source Info */}
        {status.source && (
          <Typography
            variant="caption"
            color="text.secondary"
            mt={2}
            display="block"
          >
            Источник: {status.source}
            {status.applied_at_round && ` (раунд ${status.applied_at_round})`}
          </Typography>
        )}
      </CardContent>
    </StatusCard>
  );
}

export default function ActiveStatusesView({
  activeStatuses = [],
  showTitle = true,
}) {
  if (!activeStatuses || activeStatuses.length === 0) {
    return showTitle ? (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ⚡ Активные статусы
          </Typography>
          <Alert severity="info">Нет активных статусов</Alert>
        </CardContent>
      </Card>
    ) : null;
  }

  // Группируем статусы по серьезности
  const groupedStatuses = activeStatuses.reduce((groups, status) => {
    const severity = status.severity || STATUS_SEVERITY.MEDIUM;
    if (!groups[severity]) groups[severity] = [];
    groups[severity].push(status);
    return groups;
  }, {});

  // Порядок отображения по серьезности
  const severityOrder = [
    STATUS_SEVERITY.CRITICAL,
    STATUS_SEVERITY.HIGH,
    STATUS_SEVERITY.MEDIUM,
    STATUS_SEVERITY.LOW,
    STATUS_SEVERITY.POSITIVE,
  ];

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
          ⚡ Активные статусы ({activeStatuses.length})
        </Typography>
      )}

      {/* Critical statuses alert */}
      {groupedStatuses[STATUS_SEVERITY.CRITICAL] && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            Критические статусы активны!
          </Typography>
          <Typography variant="body2">
            {groupedStatuses[STATUS_SEVERITY.CRITICAL]
              .map((s) => s.name)
              .join(", ")}
          </Typography>
        </Alert>
      )}

      {/* Status list */}
      <Stack spacing={2}>
        {severityOrder.map((severity) => {
          const statuses = groupedStatuses[severity];
          if (!statuses) return null;

          return (
            <Box key={severity}>
              {statuses.map((status) => (
                <StatusItem key={status.id} status={status} />
              ))}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
