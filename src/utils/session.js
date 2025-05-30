const SESSION_KEY = 'bunker_session';

export const saveSession = (sessionData) => {
    try {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            ...sessionData,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.error('Failed to save session:', error);
    }
};

export const getSession = () => {
    try {
        const data = localStorage.getItem(SESSION_KEY);
        if (!data) return null;

        const session = JSON.parse(data);

        // Проверяем, не устарела ли сессия (например, 24 часа)
        const MAX_AGE = 24 * 60 * 60 * 1000; // 24 часа
        if (Date.now() - session.timestamp > MAX_AGE) {
            clearSession();
            return null;
        }

        return session;
    } catch (error) {
        console.error('Failed to get session:', error);
        clearSession();
        return null;
    }
};

export const clearSession = () => {
    try {
        localStorage.removeItem(SESSION_KEY);
    } catch (error) {
        console.error('Failed to clear session:', error);
    }
};