import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Stack,
  Badge,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Groups as TeamIcon,
  Person as PlayerIcon,
  PlayArrow as ActionIcon,
  Schedule as WaitingIcon,
} from "@mui/icons-material";
import useGameStore from "../../stores/gameStore";
import { TEAMS } from "../../constants/phase2";
import { getActionById } from "../../constants/phase2";

const TeamCard = styled(Card)(({ theme, team }) => {
  const colors = {
    [TEAMS.BUNKER]: {
      bg: "rgba(13, 71, 161, 0.1)",
      border: "rgba(13, 71, 161, 0.3)",
    },
    [TEAMS.OUTSIDE]: {
      bg: "rgba(183, 28, 28, 0.1)",
      border: "rgba(183, 28, 28, 0.3)",
    },
  };

  const teamColors = colors[team] || colors[TEAMS.BUNKER];

  return {
    background: teamColors.bg,
    border: `1px solid ${teamColors.border}`,
    marginBottom: theme.spacing(2),
  };
});

const ActionQueueCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 193, 7, 0.1)",
  border: "1px solid rgba(255, 193, 7, 0.3)",
}));

const PlayerAvatar = styled(Avatar)(({ online, team }) => {
  const colors = {
    [TEAMS.BUNKER]: "#1976d2",
    [TEAMS.OUTSIDE]: "#d32f2f",
  };

  return {
    backgroundColor: online ? colors[team] : "#666",
    opacity: online ? 1 : 0.6,
  };
});

export default function TeamStatusPanel({
  myTeam,
  currentTeam,
  bunkerMembers,
  outsideMembers,
  actionQueue,
}) {
  const game = useGameStore((s) => s.game);
  const players = game?.players || [];

  // Get player data by ID
  const getPlayerData = (playerId) => {
    return (
      players.find((p) => p.id === playerId) || {
        id: playerId,
        name: "Unknown",
        online: false,
      }
    );
  };

  // Team configurations
  const teams = [
    {
      type: TEAMS.BUNKER,
      name: "В бункере",
      icon: "🏠",
      members: bunkerMembers,
      color: "#1976d2",
    },
    {
      type: TEAMS.OUTSIDE,
      name: "Снаружи",
      icon: "⚔️",
      members: outsideMembers,
      color: "#d32f2f",
    },
  ];

  const renderTeam = (team) => {
    const isCurrentTeam = currentTeam === team.type;
    const isMyTeamType = myTeam === team.type;

    return (
      <TeamCard key={team.type} team={team.type}>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h4" component="span">
                {team.icon}
              </Typography>
              <Typography variant="h6" fontWeight="bold" color={team.color}>
                {team.name}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              {isCurrentTeam && (
                <Chip
                  label="АКТИВНЫ"
                  size="small"
                  color="warning"
                  icon={<ActionIcon />}
                />
              )}
              {isMyTeamType && (
                <Chip
                  label="МОЯ КОМАНДА"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>

          <List dense>
            {team.members.map((playerId) => {
              const player = getPlayerData(playerId);
              const hasAction = Object.values(actionQueue).some((group) =>
                group.participants.includes(playerId)
              );

              return (
                <ListItem key={playerId} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      badgeContent={
                        hasAction ? (
                          <ActionIcon
                            sx={{
                              color: "#4caf50",
                              fontSize: 16,
                              backgroundColor: "rgba(0,0,0,0.8)",
                              borderRadius: "50%",
                              p: 0.2,
                            }}
                          />
                        ) : null
                      }
                    >
                      <PlayerAvatar online={player.online} team={team.type}>
                        <PlayerIcon />
                      </PlayerAvatar>
                    </Badge>
                  </ListItemAvatar>

                  <ListItemText
                    primary={player.name}
                    secondary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          label={player.online ? "онлайн" : "офлайн"}
                          size="small"
                          color={player.online ? "success" : "default"}
                          variant="outlined"
                        />
                        {hasAction && (
                          <Chip
                            label="действие выбрано"
                            size="small"
                            color="success"
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>

          {team.members.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Нет игроков в команде
            </Typography>
          )}
        </CardContent>
      </TeamCard>
    );
  };

  return (
    <Box>
      {/* Team Status */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <TeamIcon />
        Состав команд
      </Typography>

      {teams.map(renderTeam)}

      {/* Action Queue */}
      {Object.keys(actionQueue).length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />

          <ActionQueueCard>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <WaitingIcon />
                Очередь действий
              </Typography>

              {Object.entries(actionQueue).map(([actionType, group]) => {
                const action = getActionById(actionType);
                const actionName = action?.name || actionType;

                return (
                  <Box key={actionType} mb={2}>
                    <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                      {actionName}
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {group.participants.map((playerId) => {
                        const player = getPlayerData(playerId);
                        return (
                          <Chip
                            key={playerId}
                            label={player.name}
                            size="small"
                            avatar={
                              <Avatar sx={{ width: 20, height: 20 }}>
                                <PlayerIcon />
                              </Avatar>
                            }
                            color="warning"
                          />
                        );
                      })}
                    </Stack>
                  </Box>
                );
              })}
            </CardContent>
          </ActionQueueCard>
        </>
      )}
    </Box>
  );
}
