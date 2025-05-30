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
    ? "linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%)"
    : "linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)",
  border: isRevealing
    ? "2px solid rgba(255, 107, 53, 0.5)"
    : "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)",
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
  fontSize: "0.75rem",
  height: 20,
}));

const AttributeChip = styled(Chip)(({ theme, revealed }) => ({
  margin: theme.spacing(0.25),
  fontSize: "0.75rem",
  background: revealed
    ? "linear-gradient(45deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1))"
    : "rgba(255, 255, 255, 0.05)",
  border: revealed
    ? "1px solid rgba(76, 175, 80, 0.3)"
    : "1px solid rgba(255, 255, 255, 0.1)",
  color: revealed ? "#81c784" : theme.palette.text.secondary,
}));

export default function PlayerCard({
  player,
  character,
  isRevealing,
  revealedAttributes = [],
}) {
  const attributes = character || {};
  const revealedCount = Object.values(attributes).filter(
    (v) => v !== null
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
              }}
            >
              {player.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
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
              label={value !== null ? `${key}: ${value}` : key}
              revealed={value !== null}
              size="small"
            />
          ))}
        </Box>

        <Typography variant="caption" color="text.secondary">
          Revealed: {revealedCount}/{totalAttributes} attributes
        </Typography>
      </CardContent>
    </StyledPlayerCard>
  );
}
