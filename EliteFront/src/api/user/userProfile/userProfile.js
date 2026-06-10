import axiosClient from '../../axiosClient'; // Importo klientin që sapo ndërtove

const UserProfileService = {
  // Merr të dhënat e profilit
  getProfile: () => {
    return axiosClient.get('/user-profile');
  },

  // Përditëso Emrin, Mbiemrin dhe Email
  updateProfile: (data) => {
    // data duhet të jetë: { firstName: '...', lastName: '...', email: '...' }
    return axiosClient.put('/user-profile', data);
  },

  // Ndrysho fjalëkalimin
  changePassword: (data) => {
    // data duhet të jetë: { currentPassword: '...', newPassword: '...' }
    return axiosClient.patch('/user-profile/change-password', data);
  },

  // Fshi llogarinë
  deleteAccount: () => {
    return axiosClient.delete('/user-profile');
  }
};

export default UserProfileService;