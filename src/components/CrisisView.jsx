// ✅ Показываем готовые правила с бэка
function CrisisView({ crisis, onResolve, isHost }) {
  const { mini_game } = crisis;

  return (
    <Box>
      <Typography variant="h3">🚨 {crisis.name}</Typography>

      <Typography variant="h6">{crisis.description}</Typography>

      {mini_game && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h5">🎮 {mini_game.name}</Typography>

            {/* ✅ Готовые правила с бэка */}
            <Typography variant="body1">{mini_game.rules}</Typography>

            {isHost && (
              <Box mt={3}>
                <Button onClick={() => onResolve("bunker_win")}>
                  🏠 Бункер победил
                </Button>
                <Button onClick={() => onResolve("bunker_lose")}>
                  🌪️ Снаружи победили
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
