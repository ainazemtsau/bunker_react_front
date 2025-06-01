import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledCard = styled(Card)(({ theme }) => ({
  background: "rgba(30, 32, 38, 0.93)", // глухой графит с прозрачностью
  borderRadius: "18px",
  boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
  minWidth: "100%",
  marginBottom: "22px",
  border: "1px solid #393955",
  color: "#fafafd", // светлый текст
  backdropFilter: "blur(3px)", // небольшой блюр
  transition: "box-shadow 0.2s",
  "&:hover": {
    boxShadow: "0 10px 32px 4px #4a4266cc",
    borderColor: "#655ba8",
  },
}));

const InfoLine = ({ label, value, accent }) => (
  <Box sx={{ display: "flex", gap: 1, mb: 0.7, alignItems: "center" }}>
    <Typography variant="body2" sx={{ color: "#a6a7bb", minWidth: 95 }}>
      {label}:
    </Typography>
    <Typography
      variant="body2"
      sx={{ color: accent || "#fafafd", fontWeight: 500 }}
    >
      {value}
    </Typography>
  </Box>
);

// Характеристики красиво, с плюсом/минусом и цветами акцентов
function readableAdd(add) {
  if (!add || Object.keys(add).length === 0) return null;
  return Object.entries(add).map(([stat, val]) => (
    <span
      key={stat}
      style={{
        color: val > 0 ? "#74ffb8" : "#ff8d7b",
        fontWeight: 600,
        marginRight: 7,
      }}
    >
      {val > 0 ? "+" : ""}
      {val} {stat}
    </span>
  ));
}

function readableMult(mult) {
  if (!mult || Object.keys(mult).length === 0) return null;
  return Object.entries(mult).map(([stat, val]) => (
    <span
      key={stat}
      style={{
        color: "#f4de80",
        fontWeight: 500,
        marginRight: 7,
      }}
    >
      {stat} ×{val}
    </span>
  ));
}

const chipColors = {
  mentor: "#64b5f6",
  social: "#aee571",
  food: "#ffd54f",
  tech: "#90caf9",
  engineer: "#bdbdbd",
  art: "#ef9a9a",
  mental: "#ba68c8",
};

const CharacteristicCard = ({ attribute, value, revealed, onReveal }) => (
  <StyledCard>
    <CardContent>
      <Box sx={{ mb: 1 }}>
        <Typography
          variant="h6"
          sx={{
            letterSpacing: 1,
            fontWeight: 700,
            color: "#bcbaff",
            mb: 0.5,
            textTransform: "capitalize",
          }}
        >
          {attribute}
        </Typography>
      </Box>

      {revealed ? (
        <>
          <Typography
            variant="subtitle1"
            sx={{ mb: 1, color: "#e6e0fa", fontWeight: 600 }}
          >
            {value?.name}
          </Typography>

          {value?.add && Object.keys(value.add).length > 0 && (
            <InfoLine label="Сила" value={readableAdd(value.add)} />
          )}

          {value?.mult && Object.keys(value.mult).length > 0 && (
            <InfoLine label="Множители" value={readableMult(value.mult)} />
          )}

          {value?.team_mult && Object.keys(value.team_mult).length > 0 && (
            <InfoLine
              label="Командные множители"
              value={readableMult(value.team_mult)}
              accent="#88ffe7"
            />
          )}

          {value?.tags && value.tags.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              {value.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="filled"
                  sx={{
                    background: chipColors[tag] || "#33364b",
                    color: "#222",
                    fontWeight: 500,
                  }}
                />
              ))}
            </Stack>
          )}
        </>
      ) : (
        <Button
          variant="contained"
          onClick={() => onReveal(attribute)}
          sx={{
            mt: 2,
            minWidth: 120,
            fontWeight: 700,
            fontSize: "1rem",
            borderRadius: "12px",
            background: "linear-gradient(90deg, #6d44ef 0%, #9f74ff 100%)",
            color: "#fff",
            boxShadow: "0 2px 16px #6d44ef55",
            letterSpacing: 1,
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(90deg, #9f74ff 0%, #6d44ef 100%)",
              boxShadow: "0 4px 24px #9f74ff99",
              color: "#fff",
            },
          }}
        >
          Показать
        </Button>
      )}
    </CardContent>
  </StyledCard>
);

export default CharacteristicCard;
