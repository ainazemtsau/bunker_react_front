import React from "react";
import Slider from "react-slick";
import { Box } from "@mui/material";
import CharacteristicCard from "../CharacteristicCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "20px",
};

const RevealPhase = ({ game, playerId, onReveal }) => {
  console.log(
    "RevealPhase component rendered with game:",
    game,
    game.characters,
    playerId
  );
  if (!game || !game.characters || !game.characters[playerId]) {
    return <Box sx={{ padding: 2 }}>No data available for this player.</Box>;
  }
  const playerCharacteristics = game.characters[playerId];

  return (
    <Box sx={{ padding: 2 }}>
      {/* <Slider {...sliderSettings}> */}
      {Object.entries(playerCharacteristics).map(([attribute, value]) => (
        <CharacteristicCard
          key={attribute}
          attribute={attribute}
          value={value}
          revealed={value !== null}
          onReveal={onReveal}
          additionalInfo={null}
        />
      ))}
      {/* </Slider> */}
    </Box>
  );
};

export default RevealPhase;
