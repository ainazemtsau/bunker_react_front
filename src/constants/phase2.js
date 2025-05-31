// ✅ ТОЛЬКО UI константы
export const PHASE2_UI = Object.freeze({
    STATES: {
        PLAYER_ACTION: 'player_action',
        WAITING_FOR_TEAM: 'waiting_for_team',
        PROCESSING_ACTIONS: 'processing_actions',
        CRISIS_RESOLUTION: 'crisis_resolution',
        TURN_COMPLETE: 'turn_complete',
        PHASE2: 'phase2',
        GAME_FINISHED: 'game_finished'
    },

    TEAMS: {
        BUNKER: 'bunker',
        OUTSIDE: 'outside'
    },

    API_ACTIONS: {
        MAKE_ACTION: 'make_action',
        PROCESS_ACTION: 'process_action',
        RESOLVE_CRISIS: 'resolve_crisis',
        FINISH_TEAM_TURN: 'finish_team_turn'
    }
});

// ✅ UI хелперы (НЕ игровая логика)
export const getPhase2State = (phase2) => {
    if (phase2.winner) return PHASE2_UI.STATES.GAME_FINISHED;
    if (phase2.current_crisis) return PHASE2_UI.STATES.CRISIS_RESOLUTION;
    if (phase2.can_process_actions) return PHASE2_UI.STATES.PROCESSING_ACTIONS;
    if (phase2.team_turn_complete) return PHASE2_UI.STATES.TURN_COMPLETE;
    if (phase2.current_player) return PHASE2_UI.STATES.PLAYER_ACTION;
    return PHASE2_UI.STATES.WAITING_FOR_TEAM;
};

// Helper function to calculate player stats from character
export const calculatePlayerStats = (character) => {
    // const stats = {
    //     [CHARACTER_STATS.HEALTH]: 0,
    //     [CHARACTER_STATS.STRENGTH]: 0,
    //     [CHARACTER_STATS.INTELLIGENCE]: 0,
    //     [CHARACTER_STATS.TECHNICAL]: 0,
    //     [CHARACTER_STATS.EMPATHY]: 0,
    //     [CHARACTER_STATS.CHARISMA]: 0
    // };

    // if (!character?.traits) return stats;

    // Object.values(character.traits).forEach(trait => {
    //     if (trait.add) {
    //         Object.entries(trait.add).forEach(([stat, value]) => {
    //             if (stats.hasOwnProperty(stat)) {
    //                 stats[stat] += value;
    //             }
    //         });
    //     }
    // });

    // return stats;
};

export const PHASE2_STATES = Object.freeze({
    PLAYER_ACTION: 'player_action',
    WAITING_FOR_TEAM: 'waiting_for_team',
    PROCESSING_ACTIONS: 'processing_actions',
    CRISIS_RESOLUTION: 'crisis_resolution',
    TURN_COMPLETE: 'turn_complete',
    GAME_FINISHED: 'game_finished'
});

// Helper function to get action bonus for player
export const getActionBonus = (action, playerStats) => {
    let bonus = 0;

    action.requiredStats.forEach(stat => {
        const statValue = playerStats[stat] || 0;
        const weight = action.statWeights[stat] || 1.0;
        bonus += statValue * weight;
    });

    return Math.floor(bonus);
};