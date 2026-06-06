import axiosClient from '../../axiosClient';

/**
 * Merr listën e recetave nga backend-i duke aplikuar filtrat e duhur.
 * @param {Object} filters - Objekt që përmban filtrat (category, dietType, search, page, etj.)
 */
export const getRecipes = async (filters = {}) => {
  try {
    // Pasi axiosClient.js bën automatikisht `return response.data`,
    // kjo kërkesë do të kthejë direkt masivin e recetave ose objektin e paginuar.
    const response = await axiosClient.get('client/get-recipes', {
      params: filters
    });
    return response;
  } catch (error) {
    console.error("Gabim gjatë marrjes së recetave:", error);
    throw error;
  }
};

/**
 * Merr detajet e plota të një recete specifike bazuar në ID-në e saj.
 * @param {number|string} id - ID-ja e recetës
 */
export const getRecipeDetails = async (id) => {
  try {
    const response = await axiosClient.get(`client/get-recipes/${id}`);
    return response;
  } catch (error) {
    console.error(`Gabim gjatë marrjes së detajeve për recetën me ID ${id}:`, error);
    throw error;
  }
};