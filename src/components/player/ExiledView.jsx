import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

const ExiledView = ({ backToMenu }) => (
  <Card>
    <CardContent>
      <Typography variant="h5" color="error">
        You are exiled!
      </Typography>
      <Button onClick={backToMenu} sx={{ mt: 2 }}>
        Back to Menu
      </Button>
    </CardContent>
  </Card>
);

export default ExiledView;
