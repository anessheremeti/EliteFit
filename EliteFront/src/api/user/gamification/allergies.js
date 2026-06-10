import axiosClient from '../../axiosClient'; // Rregullo shtegun (path) nëse është ndryshe

// ==========================================================
// 1. GET ALL ALLERGIES (Për t'i shfaqur në listë/checkboxes)
// ==========================================================
export const getAllergies = async () => {
  try {
    // Thërret: [Route("api/admin/get-allergies")] te GetAdminAllergiesController
    const response = await axiosClient.get('/admin/get-allergies');
    
    // Interceptor-i yt kthen direkt response.data, kështu që këtu vjen array ose objekt
    return response || [];
  } catch (error) {
    console.error("Gabim gjatë marrjes së alergjive:", error);
    return [];
  }
};

// ==========================================================
// 2. UPDATE USER ALLERGIES (Kur klienti zgjedh alergjitë e veta)
// ==========================================================
export const updateUserAllergies = async (userId, allergyIds) => {
  try {
    // Thërret: [Route("api/user/allergies/update")] te UserAllergiesController
    const response = await axiosClient.put('/user/allergies/update', {
      userId: userId,        // ID e përdoruesit (int)
      allergyIds: allergyIds // Lista me ID e përzgjedhur, p.sh. [2, 5]
    });

    return response;
  } catch (error) {
    console.error("Gabim gjatë përditësimit të alergjive të përdoruesit:", error);
    throw error; // E bëjmë throw që komponenti në React/Vue ta kapë error-in nëse duhet
  }
};