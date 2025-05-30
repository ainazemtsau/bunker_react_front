import React from "react";
import { Box, Typography, Card, CardContent, Chip, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Visibility, Person, Emergency, AccessTime } from "@mui/icons-material";

const HeaderCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(0, 188, 212, 0.1) 100%)",
  border: "2px solid rgba(255, 107, 53, 0.3)",
  position: "relative",
  overflow: "visible",
  "&::before": {
    content: '""',
    position: "absolute",
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    background: "linear-gradient(45deg, #ff6b35, #00bcd4, #ff6b35, #00bcd4)",
    borderRadius: 14,
    zIndex: -1,
    animation: "borderGlow 3s linear infinite",
  },
  "@keyframes borderGlow": {
    "0%": { backgroundPosition: "0% 0%" },
    "100%": { backgroundPosition: "200% 200%" },
  },
}));

const PulsingIcon = styled(Emergency)(({ theme }) => ({
  color: theme.palette.primary.main,
  animation: "pulse 1.5s infinite",
  "@keyframes pulse": {
    "0%, 100%": {
      transform: "scale(1)",
      filter: "drop-shadow(0 0 5px rgba(255, 107, 53, 0.5))",
    },
    "50%": {
      transform: "scale(1.1)",
      filter: "drop-shadow(0 0 15px rgba(255, 107, 53, 0.8))",
    },
  },
}));

const StatusCard = styled(Card)(({ theme }) => ({
  background: "rgba(0, 0, 0, 0.4)",
  border: "1px solid rgba(255, 107, 53, 0.2)",
  height: "100%",
}));

const RevealCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 107, 53, 0.05) 100%)",
  border: "2px solid rgba(255, 107, 53, 0.4)",
  height: "100%",
  animation: "glow 2s infinite alternate",
  "@keyframes glow": {
    "0%": { boxShadow: "0 0 5px rgba(255, 107, 53, 0.3)" },
    "100%": { boxShadow: "0 0 20px rgba(255, 107, 53, 0.6)" },
  },
}));

export default function RevealHeader({
  currentPlayer,
  attribute,
  turn,
  phase,
}) {
  return (
    <Box>
      {/* Main Title */}
      <HeaderCard sx={{ mb: 4 }}>
        <CardContent sx={{ py: 4 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={2}
          >
            <PulsingIcon sx={{ fontSize: 50, mr: 2 }} />
            <Typography
              variant="h2"
              component="h1"
              textAlign="center"
              sx={{
                fontFamily: '"Orbitron", monospace',
                textShadow: "0 0 15px rgba(255, 107, 53, 0.7)",
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              BUNKER REVELATION PROTOCOL
            </Typography>
            <PulsingIcon sx={{ fontSize: 50, ml: 2 }} />
          </Box>

          <Box textAlign="center">
            <Chip
              icon={<Visibility />}
              label={`PHASE: ${phase.toUpperCase()}`}
              color="secondary"
              sx={{
                mr: 2,
                fontFamily: '"Orbitron", monospace',
                fontWeight: "bold",
                fontSize: "1rem",
                height: 40,
              }}
            />
            <Chip
              icon={<AccessTime />}
              label={`TURN: ${turn}`}
              color="primary"
              sx={{
                fontFamily: '"Orbitron", monospace',
                fontWeight: "bold",
                fontSize: "1rem",
                height: 40,
              }}
            />
          </Box>
        </CardContent>
      </HeaderCard>

      {/* Status Grid */}
      <Grid container spacing={3}>
        {/* Current Action */}
        <Grid item xs={12} md={8}>
          <RevealCard>
            <CardContent sx={{ py: 4, textAlign: "center" }}>
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  color: "primary.main",
                  fontFamily: '"Orbitron", monospace',
                  mb: 3,
                }}
              >
                🚨 REVELATION IN PROGRESS 🚨
              </Typography>

              <Box
                sx={{
                  background: "rgba(0, 0, 0, 0.6)",
                  borderRadius: 3,
                  p: 4,
                  border: "1px solid rgba(255, 107, 53, 0.3)",
                }}
              >
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <Person sx={{ fontSize: 40 }} />
                  {currentPlayer?.name || "Unknown Player"}
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: "secondary.main",
                    fontWeight: "bold",
                    mt: 2,
                  }}
                >
                  Must reveal:{" "}
                  <span style={{ color: "#ff6b35" }}>
                    {Array.isArray(attribute)
                      ? attribute.join(", ")
                      : attribute}
                  </span>
                </Typography>
              </Box>
            </CardContent>
          </RevealCard>
        </Grid>

        {/* Game Stats */}
        <Grid item xs={12} md={4}>
          <StatusCard>
            <CardContent sx={{ py: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: "secondary.main",
                  fontFamily: '"Orbitron", monospace',
                  textAlign: "center",
                  mb: 3,
                }}
              >
                BUNKER STATUS
              </Typography>

              <Box sx={{ textAlign: "center", space: 2 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h3"
                    sx={{ color: "primary.main", fontWeight: "bold" }}
                  >
                    {turn}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Current Turn
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h3"
                    sx={{ color: "success.main", fontWeight: "bold" }}
                  >
                    8
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Survivors
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="h3"
                    sx={{ color: "warning.main", fontWeight: "bold" }}
                  >
                    0
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Eliminated
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </StatusCard>
        </Grid>
      </Grid>
    </Box>
  );
}
