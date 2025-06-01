import { PHASE2_UI, CRISIS_TYPES } from '../constants/phase2.js';

/**
 * Determines current phase 2 state based on game data according to documentation
 */
export const getPhase2State = (game, playerId) => {
    console.log('[PHASE2_UTILS] getPhase2State called with:', {
        phase: game?.phase,
        phase2: game?.phase2,
        playerId
    });

    if (!game?.phase2) {
        console.log('[PHASE2_UTILS] No phase2 data found');
        return null;
    }

    const p2 = game.phase2;

    // 1. Check if game is finished
    if (p2.winner !== null && p2.winner !== undefined) {
        console.log('[PHASE2_UTILS] Game finished, winner:', p2.winner);
        return PHASE2_UI.STATES.GAME_FINISHED;
    }

    // 2. Check if there's an active crisis
    if (p2.current_crisis !== null && p2.current_crisis !== undefined) {
        console.log('[PHASE2_UTILS] Crisis active:', p2.current_crisis);
        return PHASE2_UI.STATES.CRISIS_RESOLUTION;
    }

    // 3. Check if actions can be processed
    if (p2.can_process_actions === true) {
        console.log('[PHASE2_UTILS] Can process actions');
        return PHASE2_UI.STATES.PROCESSING_ACTIONS;
    }

    // 4. Check if team turn is complete
    if (p2.team_turn_complete === true) {
        console.log('[PHASE2_UTILS] Team turn complete');
        return PHASE2_UI.STATES.TURN_COMPLETE;
    }

    // 5. Check if it's player's turn
    if (p2.current_player === playerId) {
        console.log('[PHASE2_UTILS] Player action required for:', playerId);
        return PHASE2_UI.STATES.PLAYER_ACTION;
    }

    // 6. Otherwise waiting for team
    console.log('[PHASE2_UTILS] Waiting for team, current player:', p2.current_player);
    return PHASE2_UI.STATES.WAITING_FOR_TEAM;
};

/**
 * Gets the team of a player according to documentation structure
 */
export const getPlayerTeam = (game, playerId) => {
    if (!game || !playerId) {
        console.log('[PHASE2_UTILS] getPlayerTeam: missing game or playerId');
        return null;
    }

    // According to documentation, teams are stored at game level, not phase2 level
    const bunkerTeam = game.team_in_bunker || [];
    const outsideTeam = game.team_outside || [];

    console.log('[PHASE2_UTILS] getPlayerTeam:', {
        playerId,
        bunkerTeam,
        outsideTeam
    });

    if (bunkerTeam.includes(playerId)) {
        return PHASE2_UI.TEAMS.BUNKER;
    }
    if (outsideTeam.includes(playerId)) {
        return PHASE2_UI.TEAMS.OUTSIDE;
    }

    console.log('[PHASE2_UTILS] Player not found in any team:', playerId);
    return null;
};

/**
 * Gets team members for a specific team according to documentation
 */
export const getTeamMembers = (game, team) => {
    if (!game) return [];

    const bunkerTeam = game.team_in_bunker || [];
    const outsideTeam = game.team_outside || [];

    return team === PHASE2_UI.TEAMS.BUNKER ? bunkerTeam : outsideTeam;
};

/**
 * Checks if player can make an action according to documentation
 */
export const canPlayerMakeAction = (game, playerId) => {
    if (!game?.phase2) return false;

    const state = getPhase2State(game, playerId);
    return state === PHASE2_UI.STATES.PLAYER_ACTION &&
        game.phase2.current_player === playerId;
};

/**
 * Gets team stats from game data according to documentation
 */
export const getTeamStats = (game, team) => {
    if (!game?.phase2?.team_stats) return null;
    return game.phase2.team_stats[team] || null;
};

/**
 * Gets current action queue grouped by action type according to documentation
 */
export const getGroupedActionQueue = (game) => {
    if (!game?.phase2?.action_queue) return {};

    const grouped = {};

    game.phase2.action_queue.forEach(action => {
        if (!grouped[action.action_type]) {
            grouped[action.action_type] = {
                action_type: action.action_type,
                participants: []
            };
        }
        grouped[action.action_type].participants.push(...action.participants);
    });

    return grouped;
};

/**
 * Format stat name for display
 */
export const formatStatName = (stat) => {
    const names = {
        'ТЕХ': 'Техника',
        'СИЛ': 'Сила',
        'ИНТ': 'Интеллект',
        'ЗДР': 'Здоровье',
        'ЭМП': 'Эмпатия',
        'ХАР': 'Харизма'
    };
    return names[stat] || stat;
};

/**
 * Get resource status (critical/warning/good)
 */
export const getResourceStatus = (value, max) => {
    const percent = (value / max) * 100;
    if (percent <= 20) return 'critical';
    if (percent <= 50) return 'warning';
    return 'good';
};

/**
 * Gets display name for character stat
 */
export const getStatDisplayName = (stat) => {
    return formatStatName(stat);
};

/**
 * Gets formatted team stats for display
 */
export const getFormattedTeamStats = (teamStats) => {
    if (!teamStats) return [];

    return Object.entries(teamStats).map(([stat, value]) => ({
        name: stat,
        value: value,
        displayName: getStatDisplayName(stat)
    }));
};

/**
 * Calculate action success chance for a player (UI helper)
 */
export const calculateActionSuccessChance = (action, playerStats) => {
    if (!action || !playerStats) return 0;

    let bonus = 0;

    if (action.stat_weights) {
        Object.entries(action.stat_weights).forEach(([stat, weight]) => {
            const statValue = playerStats[stat] || 0;
            bonus += statValue * weight;
        });
    }

    const targetNumber = action.difficulty || 10;

    // Success if d20 + bonus >= difficulty
    // Probability = (21 - (difficulty - bonus)) / 20
    // But capped between 5% and 95%
    const successChance = Math.max(5, Math.min(95, (21 - (targetNumber - bonus)) * 5));

    return Math.round(successChance);
};

export const getCrisisType = (crisis) => {
    if (!crisis) return null;

    if (crisis.id?.startsWith('action_minigame_')) {
        return CRISIS_TYPES.ACTION_MINIGAME;
    }

    return CRISIS_TYPES.REGULAR;
};
