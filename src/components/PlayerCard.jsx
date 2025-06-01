import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPlayerCard = styled(Card)(({ theme, isRevealing }) => ({
  position: "relative",
  marginBottom: theme.spacing(1),
  background: isRevealing
    ? "linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(30, 32, 38, 0.95) 50%)"
    : "linear-gradient(135deg, rgba(30, 32, 38, 0.95) 0%, rgba(20, 22, 28, 0.95) 100%)",
  border: isRevealing
    ? "2px solid rgba(255, 107, 53, 0.5)"
    : "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  transition: "all 0.3s ease",
  backdropFilter: "blur(10px)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)",
    borderColor: isRevealing
      ? "rgba(255, 107, 53, 0.7)"
      : "rgba(255, 255, 255, 0.2)",
  },
  ...(isRevealing && {
    "&::before": {
      content: '""',
      position: "absolute",
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      background: "linear-gradient(45deg, #ff6b35, #00bcd4, #ff6b35)",
      borderRadius: 14,
      zIndex: -1,
      animation: "pulse 2s infinite",
    },
  }),
  "@keyframes pulse": {
    "0%, 100%": { opacity: 0.5 },
    "50%": { opacity: 1 },
  },
}));

const PlayerStatusChip = styled(Chip)(({ theme }) => ({
  fontSize: "0.7rem",
  height: 20,
  fontFamily: "monospace",
  fontWeight: 600,
}));

const AttributeChip = styled(Chip)(({ theme, revealed }) => ({
  margin: theme.spacing(0.25),
  fontSize: "0.7rem",
  height: 24,
  fontFamily: "monospace",
  background: revealed
    ? "linear-gradient(45deg, rgba(0, 255, 136, 0.2), rgba(0, 255, 136, 0.1))"
    : "rgba(255, 255, 255, 0.05)",
  border: revealed
    ? "1px solid rgba(0, 255, 136, 0.4)"
    : "1px solid rgba(255, 255, 255, 0.1)",
  color: revealed ? "#00ff88" : theme.palette.text.secondary,
  "&:hover": {
    background: revealed
      ? "linear-gradient(45deg, rgba(0, 255, 136, 0.3), rgba(0, 255, 136, 0.15))"
      : "rgba(255, 255, 255, 0.1)",
  },
}));

export default function PlayerCard({
  player,
  character,
  isRevealing,
  revealedAttributes = [],
}) {
  const attributes = character || {};

  // ✅ Исправляем подсчет revealed атрибутов под новую структуру
  const revealedCount = Object.values(attributes).filter(
    (attr) => attr && attr.revealed === true
  ).length;

  const totalAttributes = Object.keys(attributes).length;

  return (
    <StyledPlayerCard isRevealing={isRevealing}>
      <CardContent sx={{ py: 2 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: isRevealing ? "primary.main" : "secondary.main",
                fontSize: "0.875rem",
                fontWeight: "bold",
                fontFamily: "monospace",
                border: "2px solid",
                borderColor: isRevealing
                  ? "#ff6b35"
                  : "rgba(255, 255, 255, 0.2)",
              }}
            >
              {player.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 600,
                fontFamily: "monospace",
                color: isRevealing ? "#ff6b35" : "#fafafd",
              }}
            >
              {player.name}
            </Typography>
          </Box>
          <Box display="flex" gap={0.5}>
            <PlayerStatusChip
              label={player.online ? "ONLINE" : "OFFLINE"}
              color={player.online ? "success" : "error"}
              size="small"
            />
            {isRevealing && (
              <PlayerStatusChip
                label="REVEALING"
                sx={{
                  background: "linear-gradient(45deg, #ff6b35, #ff8a65)",
                  animation: "pulse 1.5s infinite",
                  color: "#fff",
                }}
                size="small"
              />
            )}
          </Box>
        </Box>

        <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
          {Object.entries(attributes).map(([key, value]) => (
            <AttributeChip
              key={key}
              label={
                value && value.revealed
                  ? `${key}: ${value.name}`
                  : `${key}: [LOCKED]`
              }
              revealed={value && value.revealed}
              size="small"
            />
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            pt: 1,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontFamily: "monospace",
              textTransform: "uppercase",
              fontSize: "0.7rem",
            }}
          >
            DECRYPTED: {revealedCount}/{totalAttributes}
          </Typography>

          <Box
            sx={{
              width: 60,
              height: 4,
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${(revealedCount / totalAttributes) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg, #ff6b35, #00ff88)",
                transition: "width 0.3s ease",
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </StyledPlayerCard>
  );
}
