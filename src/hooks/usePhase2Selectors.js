import useGameStore from "../stores/gameStore";
import { useMemo } from "react";
import { getPhase2State, getPlayerTeam, getTeamMembers, getGroupedActionQueue } from "../utils/phase2Utils";
import { PHASE2_UI, PHASE2_RESOURCES } from "../constants/phase2";

export default function usePhase2Selectors() {
    const game = useGameStore((s) => s.game);
    const playerId = useGameStore((s) => s.playerId);

    return useMemo(() => {
        // Если нет данных phase2, возвращаем базовое состояние
        if (!game?.phase2) {
            console.log("[PHASE2 SELECTORS] No phase2 data available");
            return {
                isPhase2: false,
                currentState: null,
                myTeam: null
            };
        }

        const p2 = game.phase2;
        const currentState = getPhase2State(game, playerId);
        const myTeam = getPlayerTeam(game, playerId);

        console.log("[PHASE2 SELECTORS] Current state:", {
            currentState,
            myTeam,
            playerId,
            currentPlayer: p2.current_player,
            currentTeam: p2.current_team
        });

        // Извлекаем команды согласно документации
        const bunkerMembers = getTeamMembers(game, PHASE2_UI.TEAMS.BUNKER);
        const outsideMembers = getTeamMembers(game, PHASE2_UI.TEAMS.OUTSIDE);

        // Группируем очередь действий
        const actionQueue = getGroupedActionQueue(game);

        return {
            // ✅ Основные флаги
            isPhase2: true,
            currentState,
            myTeam,
            isGameFinished: p2.winner !== null && p2.winner !== undefined,

            // ✅ Текущий ход согласно документации
            round: p2.round || 1,
            currentTeam: p2.current_team || PHASE2_UI.TEAMS.OUTSIDE,
            currentPlayer: p2.current_player || null,

            // ✅ Ресурсы бункера согласно документации
            bunkerHp: p2.bunker_hp ?? PHASE2_RESOURCES.MAX_BUNKER_HP,
            maxHp: PHASE2_RESOURCES.MAX_BUNKER_HP,
            morale: p2.morale ?? PHASE2_RESOURCES.MAX_MORALE,
            maxMorale: PHASE2_RESOURCES.MAX_MORALE,
            supplies: p2.supplies ?? PHASE2_RESOURCES.MAX_SUPPLIES,
            maxSupplies: PHASE2_RESOURCES.MAX_SUPPLIES,
            moraleCountdown: p2.morale_countdown || 0,
            suppliesCountdown: p2.supplies_countdown || 0,

            // ✅ Команды согласно документации
            bunkerMembers,
            outsideMembers,

            // ✅ Действия согласно документации
            availableActions: p2.available_actions || [],
            actionQueue,
            currentAction: p2.current_action || null,

            // ✅ Статистика команд согласно документации
            teamStats: p2.team_stats || {},

            // ✅ Объекты и эффекты согласно документации
            bunkerObjects: p2.bunker_objects || {},
            teamDebuffs: p2.team_debuffs || {},
            activePhobias: p2.active_phobias || {},
            activeStatuses: p2.active_statuses || [],

            // ✅ Кризис согласно документации
            currentCrisis: p2.current_crisis || null,
            isCrisisActive: p2.current_crisis !== null && p2.current_crisis !== undefined,

            // ✅ Победитель согласно документации
            winner: p2.winner || null,

            // ✅ Флаги состояния согласно документации
            canProcessActions: p2.can_process_actions === true,
            isTeamTurnComplete: p2.team_turn_complete === true,

            // ✅ UI флаги для удобства
            canMakeAction: p2.current_player === playerId && currentState === PHASE2_UI.STATES.PLAYER_ACTION,
            isMyTurn: p2.current_player === playerId,
            isMyTeamTurn: p2.current_team === myTeam,
            isWaitingForTeam: currentState === PHASE2_UI.STATES.WAITING_FOR_TEAM,

            // ✅ Критические состояния ресурсов
            isBunkerCritical: (p2.bunker_hp ?? PHASE2_RESOURCES.MAX_BUNKER_HP) <= 2,
            isMoraleCritical: (p2.morale ?? PHASE2_RESOURCES.MAX_MORALE) <= 3 || (p2.morale_countdown || 0) > 0,
            isSuppliesCritical: (p2.supplies ?? PHASE2_RESOURCES.MAX_SUPPLIES) <= 2 || (p2.supplies_countdown || 0) > 0,

            // ✅ Условия победы
            victoryCondition: p2.winner ? {
                winner: p2.winner,
                type: p2.winner === PHASE2_UI.TEAMS.BUNKER ? 'survival' : 'destruction'
            } : null
        };

    }, [game, playerId]);
}