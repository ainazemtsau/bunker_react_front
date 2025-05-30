import { Box, Card, CardContent, Typography, Chip, Stack } from "@mui/material";

/**
 * Горизонтальная лента уже открытых карт бункера.
 * • Нет fixed-позиционирования — компонент просто стоит внизу HostView.
 * • Нет сплошного чёрного фона, поэтому ничего не перекрывает side-panel.
 * • Хидер «Открытые карты бункера» можно убрать/переименовать при желании.
 * • Чтобы скрыть check/tags — удалите соответствующие блоки внутри CardContent.
 */
export default function BunkerCardsBar({ cards = [] }) {
  if (!cards?.length) return null;

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Открытые карты бункера
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": { height: "6px" },
          "&::-webkit-scrollbar-thumb": {
            background:
              "linear-gradient(45deg, rgba(255,107,53,.4), rgba(0,188,212,.4))",
            borderRadius: 3,
          },
        }}
      >
        {cards.map((card, idx) => (
          <Card
            key={`${card.name}-${idx}`}
            sx={{
              flex: "0 0 180px",
              bgcolor: "grey.900",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {card.name}
              </Typography>

              {/* Технический блок check */}
              {card.check && (
                <Typography variant="caption" display="block">
                  {Object.entries(card.check)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")}
                </Typography>
              )}

              {/* Теги */}
              {card.tags?.length > 0 && (
                <Stack direction="row" spacing={0.5} mt={0.5} flexWrap="wrap">
                  {card.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
