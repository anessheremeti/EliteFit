import axiosClient from '../../axiosClient';

const WorkoutApi = {
    /**
     * Merr listën e videove stërvitore nga backend-i.
     */
    getVideos: async (query = {}) => {
        const response = await axiosClient.get('/Workouts/videos', { params: query });
        return response.data;
    },

    /**
     * Merr të gjithë filtrat dinamikë nga databaza (Categories, Difficulties, MuscleGroups, Durations).
     * Endpoint: GET /api/Workouts/filters
     */
    getFilters: async () => {
        const response = await axiosClient.get('/Workouts/filters');
        return response.data;
    },

    /**
     * Merr videot për banerin kryesor (FeaturedBanner).
     * Endpoint: GET /api/Workouts/featured
     */
    getFeaturedVideos: async () => {
        const response = await axiosClient.get('/Workouts/featured'); 
        return response.data;
    },

    /**
     * Merr listën e videove për "Continue Watching".
     * Endpoint: GET /api/Workouts/continue-watching
     */
    getContinueWatching: async () => {
        const response = await axiosClient.get('/Workouts/continue-watching');
        return response.data;
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
        return response.data;
    },

    /**
     * Regjistron përfundimin e stërvitjes.
     */
    completeVideo: async (command) => {
        const response = await axiosClient.post('/Workouts/complete-video', command);
        return response.data;
    }
};

export default WorkoutApi;