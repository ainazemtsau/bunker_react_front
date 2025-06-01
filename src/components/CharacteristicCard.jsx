import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  Lock,
  LockOpen,
  Visibility,
  VisibilityOff,
  Info,
} from "@mui/icons-material";

const StyledCard = styled(Card)(({ theme, revealed }) => ({
  background: revealed
    ? "linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(30, 32, 38, 0.95) 50%)"
    : "linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(20, 22, 28, 0.95) 100%)",
  borderRadius: "16px",
  boxShadow: revealed
    ? "0 8px 32px rgba(255, 107, 53, 0.25), inset 0 1px 0 rgba(255, 107, 53, 0.3)"
    : "0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
  minWidth: "100%",
  marginBottom: "16px",
  border: revealed
    ? "2px solid rgba(255, 107, 53, 0.4)"
    : "2px solid rgba(0, 188, 212, 0.3)",
  color: "#fafafd",
  backdropFilter: "blur(10px)",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: revealed
      ? "0 12px 40px rgba(255, 107, 53, 0.35), inset 0 1px 0 rgba(255, 107, 53, 0.4)"
      : "0 8px 28px rgba(0, 188, 212, 0.3), inset 0 1px 0 rgba(0, 188, 212, 0.2)",
    borderColor: revealed
      ? "rgba(255, 107, 53, 0.6)"
      : "rgba(0, 188, 212, 0.5)",
  },
  // Эффект для revealed карточек
  ...(revealed && {
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(90deg, transparent, rgba(255, 107, 53, 0.1), transparent)",
      animation: "scan 4s infinite",
    },
  }),
  "@keyframes scan": {
    "0%": { left: "-100%" },
    "100%": { left: "100%" },
  },
}));

const HeaderBox = styled(Box)(({ revealed }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
  padding: "12px 16px",
  borderRadius: "8px",
  background: revealed ? "rgba(255, 107, 53, 0.1)" : "rgba(0, 188, 212, 0.1)",
  border: revealed
    ? "1px solid rgba(255, 107, 53, 0.3)"
    : "1px solid rgba(0, 188, 212, 0.3)",
}));

const StatusChip = styled(Chip)(({ revealed }) => ({
  fontFamily: "monospace",
  fontWeight: 700,
  fontSize: "0.7rem",
  background: revealed
    ? "linear-gradient(45deg, #4caf50, #66bb6a)"
    : "linear-gradient(45deg, #ff9800, #ffb74d)",
  color: "#000",
  border: `1px solid ${revealed ? "#4caf50" : "#ff9800"}`,
  boxShadow: `0 0 8px ${revealed ? "#4caf5033" : "#ff980033"}`,
}));

const InfoLine = ({ label, value, accent, icon }) => (
  <Box
    sx={{
      display: "flex",
      gap: 1,
      mb: 1,
      alignItems: "center",
      background: "rgba(0, 0, 0, 0.3)",
      padding: "8px 12px",
      borderRadius: "8px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    }}
  >
    {icon && <Box sx={{ color: accent || "#fafafd", mr: 1 }}>{icon}</Box>}
    <Typography
      variant="body2"
      sx={{
        color: "#a6a7bb",
        minWidth: 80,
        fontFamily: "monospace",
        fontSize: "0.8rem",
        fontWeight: 600,
      }}
    >
      {label}:
    </Typography>
    <Box sx={{ flex: 1 }}>{value}</Box>
  </Box>
);

// Характеристики с улучшенным стилем
function readableAdd(add) {
  if (!add || Object.keys(add).length === 0)
    return (
      <Typography variant="body2" sx={{ color: "#666", fontStyle: "italic" }}>
        Нет бонусов
      </Typography>
    );

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {Object.entries(add).map(([stat, val]) => (
        <Chip
          key={stat}
          label={`${val > 0 ? "+" : ""}${val} ${stat}`}
          size="small"
          sx={{
            background:
              val > 0
                ? "linear-gradient(45deg, #4caf50, #66bb6a)"
                : "linear-gradient(45deg, #f44336, #ef5350)",
            color: "#fff",
            fontWeight: 700,
            fontFamily: "monospace",
            border: `1px solid ${val > 0 ? "#4caf50" : "#f44336"}`,
            boxShadow: `0 0 8px ${val > 0 ? "#4caf5033" : "#f4433633"}`,
          }}
        />
      ))}
    </Box>
  );
}

function readableMult(mult) {
  if (!mult || Object.keys(mult).length === 0)
    return (
      <Typography variant="body2" sx={{ color: "#666", fontStyle: "italic" }}>
        Нет множителей
      </Typography>
    );

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {Object.entries(mult).map(([stat, val]) => (
        <Chip
          key={stat}
          label={`${stat} ×${val}`}
          size="small"
          sx={{
            background: "linear-gradient(45deg, #ff9800, #ffb74d)",
            color: "#000",
            fontWeight: 700,
            fontFamily: "monospace",
            border: "1px solid #ff9800",
            boxShadow: "0 0 8px #ff980033",
          }}
        />
      ))}
    </Box>
  );
}

const chipColors = {
  mentor: "#64b5f6",
  social: "#4ecdc4",
  food: "#ffd54f",
  tech: "#90caf9",
  engineer: "#bdbdbd",
  art: "#ef9a9a",
  mental: "#ba68c8",
  medical: "#66bb6a",
  craft: "#ff8a65",
  relax: "#81c784",
  sport: "#42a5f5",
  outdoor: "#8bc34a",
  media: "#ffb74d",
  combat: "#f44336",
  water: "#26c6da",
  fire: "#ff5722",
  darkness: "#424242",
  strategy: "#9c27b0",
};

const CharacteristicCard = ({ attribute, value, revealed, onReveal }) => {
  return (
    <StyledCard revealed={revealed}>
      <CardContent sx={{ position: "relative", zIndex: 1 }}>
        <HeaderBox revealed={revealed}>
          <Typography
            variant="h6"
            sx={{
              letterSpacing: 1.2,
              fontWeight: 700,
              color: revealed ? "#ff6b35" : "#00bcd4",
              textTransform: "uppercase",
              fontFamily: "Orbitron",
              fontSize: "1rem",
            }}
          >
            {attribute}
          </Typography>

          <StatusChip
            revealed={revealed}
            label={revealed ? "РАСКРЫТО" : "СКРЫТО"}
            icon={revealed ? <Visibility /> : <VisibilityOff />}
            size="small"
          />
        </HeaderBox>

        {/* Всегда показываем информацию пользователю */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: "#e6e0fa",
              fontWeight: 700,
              background: revealed
                ? "linear-gradient(45deg, #ff6b35, #ffab40)"
                : "linear-gradient(45deg, #00bcd4, #4dd0e1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "1.1rem",
            }}
          >
            {value?.name}
          </Typography>

          {!revealed && (
            <Alert
              severity="info"
              sx={{
                mb: 2,
                background: "rgba(0, 188, 212, 0.1)",
                border: "1px solid rgba(0, 188, 212, 0.3)",
                "& .MuiAlert-icon": { color: "#00bcd4" },
                "& .MuiAlert-message": {
                  color: "#fafafd",
                  fontFamily: "monospace",
                },
              }}
              icon={<Info />}
            >
              Другие игроки не видят эту информацию
            </Alert>
          )}

          <InfoLine
            label="ЭФФЕКТЫ"
            value={readableAdd(value?.add)}
            accent="#4caf50"
          />

          {value?.mult && Object.keys(value.mult).length > 0 && (
            <InfoLine
              label="ЛИЧН.MULT"
              value={readableMult(value.mult)}
              accent="#ff9800"
            />
          )}

          {value?.team_mult && Object.keys(value.team_mult).length > 0 && (
            <InfoLine
              label="КОМАНД.MULT"
              value={readableMult(value.team_mult)}
              accent="#00bcd4"
            />
          )}

          {value?.tags && value.tags.length > 0 && (
            <InfoLine
              label="ТЕГИ"
              value={
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {value.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="filled"
                      sx={{
                        background: chipColors[tag] || "#33364b",
                        color: "#000",
                        fontWeight: 600,
                        fontFamily: "monospace",
                        textTransform: "uppercase",
                        fontSize: "0.7rem",
                        border: `1px solid ${chipColors[tag] || "#33364b"}`,
                      }}
                    />
                  ))}
                </Stack>
              }
            />
          )}

          {/* Кнопка раскрытия только для нераскрытых */}
          {!revealed && (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button
                variant="contained"
                onClick={() => onReveal(attribute)}
                startIcon={<LockOpen />}
                sx={{
                  minWidth: 160,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #ff6b35 0%, #ff8a65 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(255, 107, 53, 0.4)",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  fontFamily: "Orbitron",
                  border: "1px solid rgba(255, 107, 53, 0.5)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #ff8a65 0%, #ff6b35 100%)",
                    boxShadow: "0 6px 28px rgba(255, 107, 53, 0.6)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                РАСКРЫТЬ ДРУГИМ
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default CharacteristicCard;
