import axiosClient from '../../axiosClient';

const WorkoutApi = {
    /**
     * Merr listën e videove stërvitore nga backend-i.
     */
    getVideos: async (query = {}) => {
        const response = await axiosClient.get('/Workouts/videos', { params: query });
        return response; // RREGULLUAR: Interceptori e ka hequr .data
    },

    /**
     * Merr një video specifike sipas ID-së.
     */
    getVideoById: async (id) => {
        const response = await axiosClient.get(`/Workouts/videos/${id}`);
        return response; // RREGULLUAR: Kthen direkt objektin e stërvitjes
    },

    /**
     * Merr të gjithë filtrat dinamikë nga databaza.
     */
        getFilters: async () => {
            const response = await axiosClient.get('/Workouts/filters');
            return response; // RREGULLUAR
        },
  /**
     * Merr listën e videove stërvitore me filtra të avancuar nga backend-i.
     */
    searchVideos: async (filters = {}) => {
        // filters mund të përmbajë: query, difficulty, muscleGroup, categoryId, sortBy
        const response = await axiosClient.get('/Workouts/search', { params: filters });
        return response;
    },
    /**
     * Merr videot për banerin kryesor (FeaturedBanner).
     */
    getFeaturedVideos: async () => {
        const response = await axiosClient.get('/Workouts/featured'); 
        return response; // RREGULLUAR
    },

    /**
     * Merr listën e videove për "Continue Watching".
     */
    getContinueWatching: async () => {
        const response = await axiosClient.get('/Workouts/continue-watching');
        return response; // RREGULLUAR
    },

    /**
     * Krijon/Ngarkon një video të re stërvitore në sistem.
     */
    createVideo: async (command) => {
        const response = await axiosClient.post('/Workouts/videos', command, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response; // RREGULLUAR
    },

    /**
     * Regjistron përfundimin e stërvitjes.
     */
    completeVideo: async (command) => {
        const response = await axiosClient.post('/Workouts/complete-video', command);
        return response; // RREGULLUAR
    }
};

export default WorkoutApi;