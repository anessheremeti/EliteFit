import axiosClient from '../../axiosClient';

// Për herë të parë (INSERT) - Ekzekutohet gjatë onboarding
export const completeOnboarding = async (data) => {
  
  const response = await axiosClient.post('/onboarding/complete', data);
  return response.data;
};

export const updateOnboarding = async (data) => {
  const response = await axiosClient.put('/onboarding/update', data);
  return response.data;
};