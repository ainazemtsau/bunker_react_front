import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Drawer,
  IconButton,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";

import usePhase2Selectors from "../hooks/usePhase2Selectors";
import useGameStore from "../stores/gameStore";
import useGameActions from "../hooks/useGameActions";

/** Универсальный экран команды внутри и снаружи во второй фазе. */
export default function Phase2View() {
  const game = useGameStore((s) => s.game);
  const playerId = useGameStore((s) => s.playerId);
  const { sendAction } = useGameActions();

  const { isMyTurn, myTeam, bunkerHp, round, currentTeam, canMakeAction } =
    usePhase2Selectors();

  const p2 = game?.phase2;
  const log = p2?.action_log ?? [];
  const [logOpen, setLogOpen] = useState(false);

  if (!p2) {
    return (
      <Typography align="center" mt={4}>
        Загрузка фазы 2…
      </Typography>
    );
  }

  /* ─── кнопка хода ────────────────────────────── */
  const actionType = myTeam === "outside" ? "attack" : "noop";
  const actionLabel = actionType === "attack" ? "Атаковать" : "Пропустить ход";

  const handleAction = () =>
    sendAction("make_action", {
      player_id: playerId,
      action_type: actionType,
      params: {},
    });

  /* ─── UI ─────────────────────────────────────── */
  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Фаза 2 — Бункер vs Наружа
          </Typography>

          <Stack direction="row" spacing={3} mb={2}>
            <Typography>
              Раунд: <strong>{round}</strong>
            </Typography>
            <Typography>
              HP бункера: <strong>{bunkerHp}</strong>
            </Typography>
            <Chip
              label={`Ходит: ${currentTeam === "bunker" ? "бункер" : "наружа"}`}
              color="primary"
              size="small"
            />
          </Stack>

          <TeamsGrid p2={p2} />

          <Box mt={3}>
            {canMakeAction ? (
              <Button variant="contained" size="large" onClick={handleAction}>
                {actionLabel}
              </Button>
            ) : (
              <Chip label="Ожидаем других игроков…" />
            )}
          </Box>

          <IconButton
            onClick={() => setLogOpen(true)}
            sx={{ position: "absolute", top: 8, right: 8 }}
            size="large"
          >
            <HistoryIcon />
          </IconButton>
        </CardContent>
      </Card>

      <LogDrawer open={logOpen} onClose={() => setLogOpen(false)} log={log} />
    </>
  );
}

/* ─────────────────────────────────────────────── */

function TeamsGrid({ p2 }) {
  const players = useGameStore((s) => s.game.players);
  const game = useGameStore((s) => s.game);

  // массивы команд могут быть в p2 или на корне game
  const teamIn = p2.team_in_bunker ?? game.team_in_bunker ?? [];
  const teamOut = p2.team_outside ?? game.team_outside ?? [];

  const renderList = (ids) =>
    ids.map((pid) => {
      const p = players?.find?.((pl) => pl.id === pid);
      return (
        <Chip
          key={pid}
          label={p?.name || pid}
          size="small"
          variant="outlined"
        />
      );
    });

  return (
    <Stack direction="row" spacing={4} flexWrap="wrap">
      <Box minWidth={140}>
        <Typography variant="subtitle1" gutterBottom>
          В бункере
        </Typography>
        <Stack spacing={0.5}>{renderList(teamIn)}</Stack>
      </Box>

      <Box minWidth={140}>
        <Typography variant="subtitle1" gutterBottom>
          Снаружи
        </Typography>
        <Stack spacing={0.5}>{renderList(teamOut)}</Stack>
      </Box>
    </Stack>
  );
}

/* ─── Drawer с логом ──────────────────────────── */

function LogDrawer({ open, onClose, log }) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 340, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          История раундов
        </Typography>

        {log.length === 0 && (
          <Typography variant="body2">Записей пока нет…</Typography>
        )}

        {log
          .slice()
          .reverse()
          .map((entry, idx) => (
            <Box
              key={idx}
              mb={2}
              p={1}
              border="1px solid #444"
              borderRadius={1}
            >
              <Typography variant="subtitle2" gutterBottom>
                Раунд {entry.round} —{" "}
                {entry.team === "bunker" ? "бункер" : "наружа"}
              </Typography>

              {/* сгруппированные действия */}
              {Object.entries(entry.by_type).map(([type, ids]) => (
                <Typography
                  key={type}
                  variant="caption"
                  display="block"
                  sx={{ ml: 1 }}
                >
                  {type}: {ids.length} чел.
                </Typography>
              ))}

              <Typography variant="body2" mt={0.5}>
                Урон: <strong>{entry.damage}</strong>, HP после:{" "}
                <strong>{entry.bunker_hp_after}</strong>
              </Typography>
            </Box>
          ))}
      </Box>
    </Drawer>
  );
}
