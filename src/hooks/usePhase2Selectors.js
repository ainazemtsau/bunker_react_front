import { useMemo } from "react";
import useGameStore from "../stores/gameStore";

/**
 * Вычисления для фазы-2.
 */
export default function usePhase2Selectors() {
    const game = useGameStore((s) => s.game);
    const playerId = useGameStore((s) => s.playerId);

    return useMemo(() => {
        if (!game || game.phase !== "phase2" || !game.phase2) {
            return {
                isMyTurn: false,
                myTeam: null,
                bunkerHp: null,
                round: null,
                currentTeam: null,
                canMakeAction: false,
            };
        }

        const p2 = game.phase2;
        const isMyTurn = p2.current_player === playerId;

        /* ----- определяем команду игрока ----- */
        const teamInBunker =
            p2.team_in_bunker ?? game.team_in_bunker ?? [];

        const teamOutside =
            p2.team_outside ?? game.team_outside ?? [];

        const myTeam = teamOutside.includes(playerId)
            ? "outside"
            : teamInBunker.includes(playerId)
                ? "bunker"
                : null;

        const canMakeAction =
            isMyTurn && game.available_actions?.includes("make_action");

        return {
            isMyTurn,
            myTeam,
            bunkerHp: p2.bunker_hp,
            round: p2.round,
            currentTeam: p2.team,
            canMakeAction,
        };
    }, [game, playerId]);
}
