import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { styled } from "@mui/system";

const backgrounds = {
  profession: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
  hobby: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
  health: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  item: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
  phobia: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
  default: "#ffffff",
};

const StyledCard = styled(Card)(({ attribute }) => ({
  background: backgrounds[attribute] || backgrounds.default,
  borderRadius: "16px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  minWidth: "100%",
  marginBottom: "16px",
}));

const CharacteristicCard = ({
  attribute,
  value,
  revealed,
  onReveal,
  additionalInfo,
}) => (
  <StyledCard attribute={attribute}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
      </Typography>
      {revealed ? (
        <Chip label={`Revealed: ${value}`} color="success" />
      ) : (
        <Button variant="outlined" onClick={() => onReveal(attribute)}>
          Reveal
        </Button>
      )}
      {additionalInfo && (
        <Typography variant="body2" mt={2}>
          {additionalInfo}
        </Typography>
      )}
    </CardContent>
  </StyledCard>
);

export default CharacteristicCard;
