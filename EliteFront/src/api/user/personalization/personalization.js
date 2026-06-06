import axiosClient from '../../axiosClient'; // Sigurohu që rruga deri te axiosClient është e saktë

// 1. Merr të dhënat e kalorive për dashboard (GetCalorieTracking)
export const getCalorieTracking = async (userId, targetDate = null) => {
  // Pasi kontrolluesi i pranon parametrat si Query, i dërgojmë përmes `params`
  const params = { userId };
  if (targetDate) {
    params.targetDate = targetDate;
  }

  const response = await axiosClient.get('/client/personalization/calorie-tracking', { params });
  return response;
};

// 2. Kontrollo statusin e onboarding (CheckOnboardingStatus)
export const checkOnboardingStatus = async (userId) => {
  const response = await axiosClient.get('/client/personalization/check-onboarding', {
    params: { userId }
  });
  return response;
};