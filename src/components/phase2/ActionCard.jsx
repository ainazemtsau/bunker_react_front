import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Alert,
  Stack,
  Divider,
} from "@mui/material";

export default function ActionCard({ action, onSelect }) {
  return (
    <Card onClick={() => onSelect(action.id)}>
      <CardContent>
        <Typography variant="h6">
          {action.name} {/* ← с бэка */}
        </Typography>

        <Typography variant="body2">
          {action.description} {/* ← с бэка */}
        </Typography>

        {action.difficulty && (
          <Chip label={`Сложность: ${action.difficulty}`} color="warning" />
        )}

        {/* ✅ Показываем готовые веса характеристик */}
        {action.stat_weights && (
          <Box mt={1}>
            {Object.entries(action.stat_weights).map(([stat, weight]) => (
              <Chip
                key={stat}
                label={`${stat}: ×${weight}`}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
