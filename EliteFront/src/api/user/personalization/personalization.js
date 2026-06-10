import axiosClient from '../../axiosClient'; // Sigurohu që rruga deri te axiosClient është e saktë

// 1. Merr të dhënat e kalorive për dashboard (GetCalorieTracking)
export const getCalorieTracking = async (targetDate = null) => {
  const params = {};
  if (targetDate) {
    params.targetDate = targetDate;
  }

  // Frontend-i thjesht thërret endpoint-in, 
  // Token-i (JWT) dërgohet automatikisht në Header nga axiosClient
  const response = await axiosClient.get('/client/personalization/calorie-tracking', { params });
  return response;
};

// 2. Kontrollo statusin e onboarding (CheckOnboardingStatus)
export const checkOnboardingStatus = async () => {
  // Nuk ka nevojë për userId në params, sepse Backend-i e merr nga Token-i
  const response = await axiosClient.get('/client/personalization/check-onboarding');
  return response;
};

// 3. Merr recetat inteligjente (GetSmartRecipes)
export const getSmartRecipes = async (userId, gjuha = 'al') => {
  // Nëse GetSmartRecipesQuery pret userId dhe parametra shtesë, i kalojmë këtu
  const response = await axiosClient.get('/client/personalization/smart-recipes', {
    params: { userId, gjuha }
  });
  return response;
};

// 4. Llogarit objektiv i kalorive ditore (CalculateDailyTarget)
export const calculateDailyTarget = async (commandData) => {
  // Meqenëse në backend është [FromBody], të dhënat (si mosha, pesha, gjatësia) 
  // dërgohen direkt si objekt në body të kërkesës POST
  const response = await axiosClient.post('/client/personalization/calculate-daily-target', commandData);
  return response;
};