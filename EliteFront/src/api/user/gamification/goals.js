import axiosClient from '../../axiosClient';

// 1. Merr të gjitha qëllimet nga databaza
export const getAllGoals = async () => {
  const response = await axiosClient.get('/Goals');
  return response; // Kthehet direkt pasi interceptor-i e ka bërë punën e vet
};

// 2. Ruaj qëllimet e përzgjedhura për përdoruesin aktual
export const assignUserGoals = async (userId, goalIds) => {
  const response = await axiosClient.post('/Goals/user/assign', {
    userId: userId,
    goalIds: goalIds
  });
  return response;
};

export const getUserGoals = async (userId) => {
  const response = await axiosClient.get(`/Goals/user/${userId}`);
  return response;
};