import React from "react";
import { Box, Typography, Fade, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import PlayerCard from "../PlayerCard";
import RevealHeader from "../RevealHeader";

const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `
    radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0, 188, 212, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)
  `,
  display: "flex",
}));

const SidePanel = styled(Paper)(({ theme }) => ({
  width: "400px",
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, rgba(26, 26, 26, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)",
  backdropFilter: "blur(10px)",
  borderRight: "2px solid rgba(255, 107, 53, 0.3)",
  borderRadius: 0,
  position: "relative",
  overflow: "hidden",
  flexShrink: 0, // Prevent panel from shrinking
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "2px",
    height: "100%",
    background: "linear-gradient(180deg, #ff6b35, #00bcd4, #ff6b35)",
    animation: "panelGlow 3s linear infinite",
  },
  "@keyframes panelGlow": {
    "0%": { backgroundPosition: "0% 0%" },
    "100%": { backgroundPosition: "0% 200%" },
  },
}));

const PlayersContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "calc(100vh - 100px)",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "linear-gradient(45deg, #ff6b35, #00bcd4)",
    borderRadius: "3px",
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  justifyContent: "flex-start",
  gap: theme.spacing(3),
  alignItems: "stretch", // Changed from center to stretch
  minWidth: 0, // Allow shrinking
}));

const PanelHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: "1px solid rgba(255, 107, 53, 0.2)",
  background: "rgba(255, 107, 53, 0.05)",
  position: "sticky",
  top: 0,
  zIndex: 10,
  backdropFilter: "blur(10px)",
}));

export default function RevealPhase({ game, sendAction }) {
  const current = game.current_turn;
  const currentPlayer = game.players.find((p) => p.id === current?.player_id);

  return (
    <MainContainer>
      {/* Left Side Panel */}
      <SidePanel elevation={24}>
        <PanelHeader>
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Orbitron", monospace',
              textAlign: "center",
              color: "primary.main",
              textShadow: "0 0 10px rgba(255, 107, 53, 0.5)",
            }}
          >
            SURVIVORS
          </Typography>
          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            {game.players.length} Active • Turn {game.turn}
          </Typography>
        </PanelHeader>

        <PlayersContainer>
          {game.players.map((player, index) => (
            <Fade
              in
              timeout={800}
              style={{ transitionDelay: `${index * 100}ms` }}
              key={player.id}
            >
              <Box mb={1}>
                <PlayerCard
                  player={player}
                  character={game.characters[player.id]}
                  isRevealing={current?.player_id === player.id}
                />
              </Box>
            </Fade>
          ))}
        </PlayersContainer>
      </SidePanel>

      {/* Main Content Area - Full Width */}
      <MainContent>
        <RevealHeader
          currentPlayer={currentPlayer}
          attribute={current?.attribute}
          turn={game.turn}
          phase={game.phase}
        />
      </MainContent>
    </MainContainer>
  );
}
