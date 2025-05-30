import { useState } from "react";
import { Card, CardContent, Box, Typography, TextField } from "@mui/material";
import AnnounceIcon from "@mui/icons-material/AnnouncementRounded";
import GradientButton from "../GradientButton";

export default function AnnouncePanel({ onSend }) {
  const [msg, setMsg] = useState("");

  const send = () => {
    onSend(msg);
    setMsg("");
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <AnnounceIcon sx={{ mr: 1 }} /> Announce
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Message…"
          />
          <GradientButton onClick={send} disabled={!msg.trim()}>
            Send
          </GradientButton>
        </Box>
      </CardContent>
    </Card>
  );
}
