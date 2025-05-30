import {
    TEAMS,
    PHASE2_STATES,
    VICTORY_CONDITIONS,
    calculatePlayerStats,
    getActionBonus
} from '../constants/phase2.js';

/**
 * Determines current phase 2 state based on game data
 */
export const getPhase2State = (game, playerId) => {
    if (!game?.phase2) return null;

    const p2 = game.phase2;

    // Check if game is finished
    if (p2.winner) {
        return PHASE2_STATES.GAME_FINISHED;
    }

    // Check if there's an active crisis
    if (p2.current_crisis) {
        return PHASE2_STATES.CRISIS_RESOLUTION;
    }

    // Check if all actions can be processed
    if (p2.can_process_actions) {
        return PHASE2_STATES.PROCESSING_ACTIONS;
    }

    // Check if team turn is complete
    if (p2.team_turn_complete) {
        return PHASE2_STATES.TURN_COMPLETE;
    }

    // Check if it's player's turn
    if (p2.current_player === playerId) {
        return PHASE2_STATES.PLAYER_ACTION;
    }

    // Otherwise waiting for team
    return PHASE2_STATES.WAITING_FOR_TEAM;
};

/**
 * Gets the team of a player
 */
export const getPlayerTeam = (game, playerId) => {
    if (!game?.phase2) return null;

    const teamInBunker = game.phase2.team_in_bunker || game.team_in_bunker || [];
    const teamOutside = game.phase2.team_outside || game.team_outside || [];

    if (teamInBunker.includes(playerId)) return TEAMS.BUNKER;
    if (teamOutside.includes(playerId)) return TEAMS.OUTSIDE;

    return null;
};

/**
 * Gets team members for a specific team
 */
export const getTeamMembers = (game, team) => {
    if (!game?.phase2) return [];

    const teamInBunker = game.phase2.team_in_bunker || game.team_in_bunker || [];
    const teamOutside = game.phase2.team_outside || game.team_outside || [];

    return team === TEAMS.BUNKER ? teamInBunker : teamOutside;
};

/**
 * Checks if player can make an action
 */
export const canPlayerMakeAction = (game, playerId) => {
    const state = getPhase2State(game, playerId);
    return state === PHASE2_STATES.PLAYER_ACTION &&
        game.available_actions?.includes('make_action');
};

/**
 * Gets team stats from game data
 */
export const getTeamStats = (game, team) => {
    if (!game?.phase2?.team_stats) return null;
    return game.phase2.team_stats[team];
};

/**
 * Calculate action success chance for a player
 */
export const calculateActionSuccessChance = (action, game, playerId) => {
    if (!game?.characters?.[playerId]) return 0;

    const playerStats = calculatePlayerStats(game.characters[playerId]);
    const bonus = getActionBonus(action, playerStats);
    const targetNumber = action.difficulty;

    // Success if d20 + bonus >= difficulty
    // Probability = (21 - (difficulty - bonus)) / 20
    // But capped between 5% and 95%
    const successChance = Math.max(5, Math.min(95, (21 - (targetNumber - bonus)) * 5));

    return successChance;
};

/**
 * Gets formatted team stats for display
 */
export const getFormattedTeamStats = (teamStats) => {
    if (!teamStats) return {};

    return Object.entries(teamStats).map(([stat, value]) => ({
        name: stat,
        value: value,
        displayName: getStatDisplayName(stat)
    }));
};

/**
 * Gets display name for character stat
 */
export const getStatDisplayName = (stat) => {
    const displayNames = {
        'ЗДР': 'Здоровье',
        'СИЛ': 'Сила',
        'ИНТ': 'Интеллект',
        'ТЕХ': 'Техника',
        'ЭМП': 'Эмпатия',
        'ХАР': 'Харизма'
    };

    return displayNames[stat] || stat;
};

/**
 * Checks victory conditions
 */
export const checkVictoryCondition = (game) => {
    if (!game?.phase2) return null;

    const p2 = game.phase2;

    if (p2.bunker_hp <= 0) {
        return {
            winner: TEAMS.OUTSIDE,
            condition: VICTORY_CONDITIONS.BUNKER_DESTROYED
        };
    }

    if (p2.round >= VICTORY_CONDITIONS.MAX_ROUNDS) {
        return {
            winner: TEAMS.BUNKER,
            condition: VICTORY_CONDITIONS.BUNKER_SURVIVED
        };
    }

    return null;
};

/**
 * Gets current action queue grouped by action type
 */
export const getGroupedActionQueue = (game) => {
    if (!game?.phase2?.action_queue) return {};

    const grouped = {};

    game.phase2.action_queue.forEach(action => {
        if (!grouped[action.action_type]) {
            grouped[action.action_type] = {
                action: action,
                participants: []
            };
        }
        grouped[action.action_type].participants.push(...action.participants);
    });

    return grouped;
};