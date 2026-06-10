import axiosClient from '../../axiosClient'; // Rregullo rrugën sipas strukturës tënde

export const notificationService = {
  // 1. Merr të gjitha njoftimet e një përdoruesi
  getUserNotifications: async (userId) => {
    return await axiosClient.get(`/Notifications/user/${userId}`);
  },

  // 2. Merr numrin e njoftimeve të palexuara për ikonën 🔔
  getUnreadCount: async (userId) => {
    return await axiosClient.get(`/Notifications/unread-count/${userId}`);
  },

  // 3. Bëj një njoftim si të lexuar
  markAsRead: async (notificationId) => {
    return await axiosClient.put('/Notifications/mark-as-read', { id: notificationId });
  },

  // 4. Bëji të gjitha njoftimet e lexuara
  markAllAsRead: async (userId) => {
    return await axiosClient.put('/Notifications/mark-all-read', { userId: userId });
  }
};