// ✅ Единые константы для Phase 2 согласно документации
export const PHASE2_UI = Object.freeze({
    STATES: {
        PLAYER_ACTION: 'player_action',
        WAITING_FOR_TEAM: 'waiting_for_team',
        PROCESSING_ACTIONS: 'processing_actions',
        CRISIS_RESOLUTION: 'crisis_resolution',
        TURN_COMPLETE: 'turn_complete',
        GAME_FINISHED: 'game_finished'
    },

    TEAMS: {
        BUNKER: 'bunker',
        OUTSIDE: 'outside'
    },

    // ✅ WebSocket события согласно документации + новое событие
    EVENTS: {
        PLAYER_ACTION: 'phase2_player_action',
        PROCESS_ACTION: 'phase2_process_action',
        RESOLVE_CRISIS: 'phase2_resolve_crisis',
        FINISH_TURN: 'phase2_finish_turn',
        GET_ACTION_PREVIEW: 'phase2_get_action_preview' // ✅ НОВОЕ
    }
});

// Остальные константы остаются без изменений...
export const PHASE2_RESOURCES = Object.freeze({
    MAX_BUNKER_HP: 10,
    MAX_MORALE: 10,
    MAX_SUPPLIES: 10,
    MAX_ROUNDS: 10
});

export const RESOURCE_STATUS = Object.freeze({
    CRITICAL: 'critical',
    WARNING: 'warning',
    GOOD: 'good'
});

export const TEAM_COLORS = Object.freeze({
    [PHASE2_UI.TEAMS.BUNKER]: '#1976d2',
    [PHASE2_UI.TEAMS.OUTSIDE]: '#d32f2f'
});

export const TEAM_NAMES = Object.freeze({
    [PHASE2_UI.TEAMS.BUNKER]: 'Команда бункера',
    [PHASE2_UI.TEAMS.OUTSIDE]: 'Команда снаружи'
});

export const TEAM_ICONS = Object.freeze({
    [PHASE2_UI.TEAMS.BUNKER]: '🏠',
    [PHASE2_UI.TEAMS.OUTSIDE]: '⚔️'
});

export const CHARACTER_STATS = Object.freeze({
    HEALTH: 'ЗДР',
    STRENGTH: 'СИЛ',
    INTELLIGENCE: 'ИНТ',
    TECHNICAL: 'ТЕХ',
    EMPATHY: 'ЭМП',
    CHARISMA: 'ХАР'
});

export const STAT_NAMES = Object.freeze({
    [CHARACTER_STATS.HEALTH]: 'Здоровье',
    [CHARACTER_STATS.STRENGTH]: 'Сила',
    [CHARACTER_STATS.INTELLIGENCE]: 'Интеллект',
    [CHARACTER_STATS.TECHNICAL]: 'Техника',
    [CHARACTER_STATS.EMPATHY]: 'Эмпатия',
    [CHARACTER_STATS.CHARISMA]: 'Харизма'
});

export const BUNKER_OBJECT_STATUS = Object.freeze({
    WORKING: 'working',
    DAMAGED: 'damaged',
    DESTROYED: 'destroyed'
});

export const STATUS_SEVERITY = Object.freeze({
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
    POSITIVE: 'positive'
});

export const CRISIS_TYPES = Object.freeze({
    REGULAR: 'regular_crisis',
    ACTION_MINIGAME: 'action_minigame',
});

export const HISTORY_ENTRY_TYPES = Object.freeze({
    ACTION: 'action',
    CRISIS: 'crisis',
    MINIGAME: 'minigame', // ✅ НОВЫЙ ТИП
});

// Добавляем хелпер функцию:
export const isActionMinigameCrisis = (crisis) => {
    return crisis?.id?.startsWith('action_minigame_');
};