    import axiosClient from '../../axiosClient';

    // Merr medaljet e përdoruesit (Badges)
    export const getUserBadges = async (userId) => {
    return axiosClient.get(`/Gamification/badges/${userId}`);
    };

    // Merr serinë e ditëve aktive (Streak)
    export const getUserStreak = async (userId) => {
    return axiosClient.get(`/Gamification/streak/${userId}`);
    };

    // Përditëso streak-un pas një aktiviteti
    export const updateStreakActivity = async (commandData) => {
    return axiosClient.post('/Gamification/streak/activity', commandData);
    };

    // Merr këshillat e shpejta për përdoruesin (QuickFix Tips)
    export const getQuickFixTips = async () => {
    return axiosClient.get('/Gamification/quickfix-tips');
    };