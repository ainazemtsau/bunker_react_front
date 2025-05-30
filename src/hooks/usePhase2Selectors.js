import { useMemo } from "react";
import useGameStore from "../stores/gameStore";
import {
    getPhase2State,
    getPlayerTeam,
    canPlayerMakeAction,
    getTeamStats,
    getGroupedActionQueue,
    checkVictoryCondition
} from "../utils/phase2Utils";
import { TEAMS, getActionsForTeam } from "../constants/phase2";

/**
 * Enhanced Phase 2 selectors with full game state management
 */
export default function usePhase2Selectors() {
    const game = useGameStore((s) => s.game);
    const playerId = useGameStore((s) => s.playerId);

    return useMemo(() => {
        if (!game || game.phase !== "phase2" || !game.phase2) {
            return {
                // Basic state
                isPhase2: false,
                currentState: null,
                isMyTurn: false,
                myTeam: null,
                canMakeAction: false,

                // Game info
                bunkerHp: 0,
                maxHp: 10,
                round: 0,
                maxRounds: 10,
                currentTeam: null,

                // Teams and actions
                availableActions: [],
                actionQueue: {},
                teamStats: { bunker: null, outside: null },

                // Crisis and victory
                currentCrisis: null,
                victoryCondition: null,

                // Team members
                bunkerMembers: [],
                outsideMembers: [],

                // Processed selectors
                isWaitingForTeam: false,
                canProcessActions: false,
                isTeamTurnComplete: false,
                isCrisisActive: false,
                isGameFinished: false
            };
        }

        const p2 = game.phase2;
        const currentState = getPhase2State(game, playerId);
        const myTeam = getPlayerTeam(game, playerId);
        const canMakeAction = canPlayerMakeAction(game, playerId);

        // Team members
        const bunkerMembers = p2.team_in_bunker || game.team_in_bunker || [];
        const outsideMembers = p2.team_outside || game.team_outside || [];

        // Available actions for player's team
        const availableActions = myTeam ? getActionsForTeam(myTeam) : [];

        // Action queue grouped by type
        const actionQueue = getGroupedActionQueue(game);

        // Team stats
        const teamStats = {
            bunker: getTeamStats(game, TEAMS.BUNKER),
            outside: getTeamStats(game, TEAMS.OUTSIDE)
        };

        // Victory condition check
        const victoryCondition = checkVictoryCondition(game);

        return {
            // Basic state
            isPhase2: true,
            currentState,
            isMyTurn: p2.current_player === playerId,
            myTeam,
            canMakeAction,

            // Game info
            bunkerHp: p2.bunker_hp || 0,
            maxHp: 10, // Could be configurable later
            round: p2.round || 1,
            maxRounds: 10,
            currentTeam: p2.current_team || p2.team,

            // Teams and actions
            availableActions,
            actionQueue,
            teamStats,

            // Crisis and victory
            currentCrisis: p2.current_crisis,
            victoryCondition,

            // Team members
            bunkerMembers,
            outsideMembers,

            // Processed selectors for UI logic
            isWaitingForTeam: currentState === 'waiting_for_team',
            canProcessActions: p2.can_process_actions || false,
            isTeamTurnComplete: p2.team_turn_complete || false,
            isCrisisActive: !!p2.current_crisis,
            isGameFinished: !!p2.winner || !!victoryCondition
        };
    }, [game, playerId]);
}