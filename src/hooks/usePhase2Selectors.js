import useGameStore from "../stores/gameStore";
import { useMemo } from "react";
import { getPhase2State, getPlayerTeam } from "../utils/phase2Utils";
export default function usePhase2Selectors() {
    const game = useGameStore((s) => s.game);
    const playerId = useGameStore((s) => s.playerId);

    return useMemo(() => {

        if (!game?.phase2) return { isPhase2: false };

        const p2 = game.phase2;
        console.log("[PHASE2 SELECTORS] usePhase2Selectors return state", getPhase2State(game), playerId);
        return {
            // ✅ Простое извлечение данных с бэка
            isPhase2: true,
            currentState: getPhase2State(game),
            myTeam: getPlayerTeam(game, playerId),

            // ✅ Прямые данные с бэкенда
            bunkerHp: p2.bunker_hp,
            morale: p2.morale,
            supplies: p2.supplies,
            moraleCountdown: p2.morale_countdown,
            suppliesCountdown: p2.supplies_countdown,
            round: p2.round,
            currentTeam: p2.current_team,
            currentPlayer: p2.current_player,
            bunkerMembers: game.team_in_bunker || [],
            outsideMembers: game.team_outside || [],
            // ✅ Готовые данные с бэка
            availableActions: p2.available_actions || [],
            actionQueue: p2.action_queue || [],
            teamStats: p2.team_stats || {},
            bunkerObjects: p2.bunker_objects || {},
            teamDebuffs: p2.team_debuffs || {},
            activePhobias: p2.active_phobias || {},
            activeStatuses: p2.active_statuses || [],
            currentCrisis: p2.current_crisis,
            winner: p2.winner,

            // ✅ UI флаги
            canMakeAction: p2.current_player === playerId,
            canProcessActions: p2.can_process_actions,
            isTeamTurnComplete: p2.team_turn_complete,
            isCrisisActive: !!p2.current_crisis,
            isBunkerCritical: (p2.bunker_hp ?? 7) <= 2,
            isMoraleCritical: (p2.morale ?? 10) <= 3 || (p2.morale_countdown ?? 0) > 0,
            isSuppliesCritical: (p2.supplies ?? 8) <= 2 || (p2.supplies_countdown ?? 0) > 0,
        };

    }, [game, playerId]);
}