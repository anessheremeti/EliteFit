import axiosClient from '../../axiosClient';

// Merr historikun e stërvitjeve (për t'i shfaqur në tabela/grafikë)
export const getWorkoutHistory = async (params) => {
  return axiosClient.get('/Reports/workout-history', { params });
};

// Eksporto historikun në Excel (Kthehet si Blob binar)
export const exportWorkoutHistoryExcel = async (params) => {
  return axiosClient.get('/Reports/workout-history/export/excel', {
    params,
    responseType: 'blob' // E domosdoshme për shkarkim skedarësh
  });
};

// Eksporto historikun në PDF (Kthehet si Blob binar)
export const exportWorkoutHistoryPdf = async (params) => {
  return axiosClient.get('/Reports/workout-history/export/pdf', {
    params,
    responseType: 'blob' // E domosdoshme për shkarkim skedarësh
  });
};