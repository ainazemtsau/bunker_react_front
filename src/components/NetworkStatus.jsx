import { Chip, Box } from "@mui/material";
import WifiIcon from "@mui/icons-material/WifiRounded";
import useSocket from "../hooks/useSocket";

export default function NetworkStatus() {
  const socket = useSocket();
  return (
    <Box sx={{ mt: 1, display: "flex", gap: 1, justifyContent: "center" }}>
      <Chip
        icon={<WifiIcon />}
        label={socket.connected ? "Connected" : "Disconnected"}
        color={socket.connected ? "success" : "error"}
        variant="outlined"
        size="small"
      />
      <Chip label="LAN ready" color="info" variant="outlined" size="small" />
    </Box>
  );
}