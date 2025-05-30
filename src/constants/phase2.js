// Phase 2 Actions for Teams
export const PHASE2_ACTIONS = Object.freeze({
    // Outside team actions
    OUTSIDE: Object.freeze({
        ATTACK_BUNKER: {
            id: 'attack_bunker',
            name: 'Атаковать бункер',
            description: 'Прямая атака на бункер. Высокий урон при успехе.',
            difficulty: 12,
            effects: { bunker_damage: 2 },
            requiredStats: ['СИЛ', 'ТЕХ'],
            statWeights: { СИЛ: 1.0, ТЕХ: 0.5 },
            team: 'outside'
        },
        SABOTAGE: {
            id: 'sabotage',
            name: 'Саботировать системы',
            description: 'Подрыв систем бункера. Меньший урон, но шанс кризиса.',
            difficulty: 15,
            effects: { bunker_damage: 1, crisis_chance: 0.3 },
            requiredStats: ['ТЕХ', 'ИНТ'],
            statWeights: { ТЕХ: 1.0, ИНТ: 0.7 },
            team: 'outside'
        },
        PSYCHOLOGICAL_WARFARE: {
            id: 'psychological_warfare',
            name: 'Психологическая война',
            description: 'Подрыв морали команды бункера.',
            difficulty: 13,
            effects: { morale_damage: 2 },
            requiredStats: ['ХАР', 'ЭМП'],
            statWeights: { ХАР: 1.0, ЭМП: 0.8 },
            team: 'outside'
        }
    }),

    // Bunker team actions
    BUNKER: Object.freeze({
        REPAIR_BUNKER: {
            id: 'repair_bunker',
            name: 'Ремонт бункера',
            description: 'Восстановление HP бункера. Кризис при неудаче.',
            difficulty: 10,
            effects: { bunker_heal: 1 },
            crisisOnFailure: true,
            requiredStats: ['ТЕХ', 'СИЛ'],
            statWeights: { ТЕХ: 1.0, СИЛ: 0.6 },
            team: 'bunker'
        },
        FORTIFY: {
            id: 'fortify',
            name: 'Укрепление',
            description: 'Усиление защиты бункера на следующий раунд.',
            difficulty: 12,
            effects: { defense_bonus: 1 },
            requiredStats: ['СИЛ', 'ТЕХ'],
            statWeights: { СИЛ: 1.0, ТЕХ: 0.8 },
            team: 'bunker'
        },
        MEDICAL_AID: {
            id: 'medical_aid',
            name: 'Медицинская помощь',
            description: 'Восстановление морали команды.',
            difficulty: 11,
            effects: { morale_heal: 1 },
            requiredStats: ['ЭМП', 'ИНТ'],
            statWeights: { ЭМП: 1.0, ИНТ: 0.7 },
            team: 'bunker'
        },
        SEARCH_SUPPLIES: {
            id: 'search_supplies',
            name: 'Поиск припасов',
            description: 'Поиск дополнительных ресурсов.',
            difficulty: 9,
            effects: { supplies_bonus: 1 },
            requiredStats: ['ИНТ', 'ЗДР'],
            statWeights: { ИНТ: 1.0, ЗДР: 0.5 },
            team: 'bunker'
        }
    })
});

// Crisis types
export const CRISIS_TYPES = Object.freeze({
    STRUCTURAL_DAMAGE: {
        id: 'structural_damage',
        name: 'Структурные повреждения',
        description: 'Критические повреждения несущих конструкций бункера',
        importantStats: ['ТЕХ', 'СИЛ'],
        onFailure: { bunker_damage: 2, morale_damage: 1 }
    },
    RESOURCE_SHORTAGE: {
        id: 'resource_shortage',
        name: 'Нехватка ресурсов',
        description: 'Критически низкие запасы жизненно важных ресурсов',
        importantStats: ['ИНТ', 'ЗДР'],
        onFailure: { morale_damage: 2, supplies_damage: 1 }
    },
    MEDICAL_EMERGENCY: {
        id: 'medical_emergency',
        name: 'Медицинская чрезвычайная ситуация',
        description: 'Серьезная травма или болезнь требует немедленного вмешательства',
        importantStats: ['ЭМП', 'ИНТ'],
        onFailure: { morale_damage: 3 }
    },
    CONTAMINATION: {
        id: 'contamination',
        name: 'Заражение',
        description: 'Обнаружено радиоактивное или химическое заражение',
        importantStats: ['ТЕХ', 'ЗДР'],
        onFailure: { bunker_damage: 1, morale_damage: 2 }
    },
    POWER_FAILURE: {
        id: 'power_failure',
        name: 'Отключение электричества',
        description: 'Критический сбой в системе энергоснабжения',
        importantStats: ['ТЕХ', 'ИНТ'],
        onFailure: { bunker_damage: 1, defense_penalty: 1 }
    },
    PSYCHOLOGICAL_BREAKDOWN: {
        id: 'psychological_breakdown',
        name: 'Психологический срыв',
        description: 'Член команды находится на грани нервного срыва',
        importantStats: ['ЭМП', 'ХАР'],
        onFailure: { morale_damage: 4 }
    }
});

// Phase 2 Game States
export const PHASE2_STATES = Object.freeze({
    PLAYER_ACTION: 'player_action',
    WAITING_FOR_TEAM: 'waiting_for_team',
    PROCESSING_ACTIONS: 'processing_actions',
    CRISIS_RESOLUTION: 'crisis_resolution',
    TURN_COMPLETE: 'turn_complete',
    GAME_FINISHED: 'game_finished'
});

// Teams
export const TEAMS = Object.freeze({
    BUNKER: 'bunker',
    OUTSIDE: 'outside'
});

// Victory conditions
export const VICTORY_CONDITIONS = Object.freeze({
    BUNKER_DESTROYED: 'bunker_destroyed', // HP = 0
    BUNKER_SURVIVED: 'bunker_survived', // 10 rounds completed
    MAX_ROUNDS: 10
});

// Game action types for API calls
export const PHASE2_API_ACTIONS = Object.freeze({
    MAKE_ACTION: 'make_action',
    PROCESS_ACTION: 'process_action',
    RESOLVE_CRISIS: 'resolve_crisis',
    FINISH_TEAM_TURN: 'finish_team_turn'
});

// Character stats
export const CHARACTER_STATS = Object.freeze({
    HEALTH: 'ЗДР', // Здоровье
    STRENGTH: 'СИЛ', // Сила
    INTELLIGENCE: 'ИНТ', // Интеллект
    TECHNICAL: 'ТЕХ', // Техника
    EMPATHY: 'ЭМП', // Эмпатия
    CHARISMA: 'ХАР' // Харизма
});

// Helper function to get all actions for a team
export const getActionsForTeam = (team) => {
    return team === TEAMS.BUNKER
        ? Object.values(PHASE2_ACTIONS.BUNKER)
        : Object.values(PHASE2_ACTIONS.OUTSIDE);
};

// Helper function to get action by id
export const getActionById = (actionId) => {
    const allActions = [
        ...Object.values(PHASE2_ACTIONS.BUNKER),
        ...Object.values(PHASE2_ACTIONS.OUTSIDE)
    ];
    return allActions.find(action => action.id === actionId);
};

// Helper function to calculate player stats from character
export const calculatePlayerStats = (character) => {
    const stats = {
        [CHARACTER_STATS.HEALTH]: 0,
        [CHARACTER_STATS.STRENGTH]: 0,
        [CHARACTER_STATS.INTELLIGENCE]: 0,
        [CHARACTER_STATS.TECHNICAL]: 0,
        [CHARACTER_STATS.EMPATHY]: 0,
        [CHARACTER_STATS.CHARISMA]: 0
    };

    if (!character?.traits) return stats;

    Object.values(character.traits).forEach(trait => {
        if (trait.add) {
            Object.entries(trait.add).forEach(([stat, value]) => {
                if (stats.hasOwnProperty(stat)) {
                    stats[stat] += value;
                }
            });
        }
    });

    return stats;
};

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