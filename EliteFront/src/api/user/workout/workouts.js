import axiosClient from '../axiosClient'; // Sigurohu që path-i është i saktë

export const workoutApi = {

  getVideos: (params) => {
    return axiosClient.get('/workouts/videos', { params });
  },

  /**
   * Përfundon një video stërvitore dhe regjistron progresin
   * @param {Object} command - Objekti që përmban workoutId dhe kohëzgjatjen
   */
  completeVideo: (command) => {
    return axiosClient.post('/workouts/complete-video', command);
  },

  
  createVideo: (formData) => {
    return axiosClient.post('/workouts/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};