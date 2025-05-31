import React from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";

export default function CompactBunkerStatus({ bunkerObjects }) {
  if (!bunkerObjects || Object.keys(bunkerObjects).length === 0) {
    return null;
  }

  const stats = Object.values(bunkerObjects).reduce(
    (acc, obj) => {
      acc[obj.status] = (acc[obj.status] || 0) + 1;
      return acc;
    },
    { working: 0, damaged: 0, destroyed: 0 }
  );

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" gutterBottom>
        Состояние объектов:
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {stats.working > 0 && (
          <Chip
            label={`✅ ${stats.working}`}
            size="small"
            color="success"
            variant="outlined"
          />
        )}
        {stats.damaged > 0 && (
          <Chip
            label={`⚠️ ${stats.damaged}`}
            size="small"
            color="warning"
            variant="outlined"
          />
        )}
        {stats.destroyed > 0 && (
          <Chip
            label={`❌ ${stats.destroyed}`}
            size="small"
            color="error"
            variant="outlined"
          />
        )}
      </Stack>
    </Box>
  );
}
