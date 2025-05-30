import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/PersonRounded";

/**
 * Универсальный список игроков
 */
export default function PlayerTable({ title, players, professionOf, muted }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">
          {title} ({players.length})
        </Typography>
        <List dense>
          {players.map((p) => (
            <ListItem key={p.id}>
              <ListItemAvatar>
                <Avatar sx={muted && { bgcolor: "grey.700" }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={p.name}
                secondary={professionOf && professionOf(p.id)}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
