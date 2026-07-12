import api from "./client";

export const authApi = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
};

export const vehicleApi = {
  getAll: () => api.get("/vehicles"),
  getById: (id) => api.get(`/vehicles/${id}`),
  getAvailable: () => api.get("/vehicles/available"),
  create: (data) => api.post("/vehicles", data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
};

export const driverApi = {
  getAll: () => api.get("/drivers"),
  getById: (id) => api.get(`/drivers/${id}`),
  getAvailable: () => api.get("/drivers/available"),
  create: (data) => api.post("/drivers", data),
  update: (id, data) => api.put(`/drivers/${id}`, data),
  delete: (id) => api.delete(`/drivers/${id}`),
};

export const tripApi = {
  getAll: () => api.get("/trips"),
  getById: (id) => api.get(`/trips/${id}`),
  create: (data) => api.post("/trips", data),
  dispatch: (id) => api.post(`/trips/${id}/dispatch`),
  complete: (id, data) => api.post(`/trips/${id}/complete`, data),
  cancel: (id) => api.post(`/trips/${id}/cancel`),
  delete: (id) => api.delete(`/trips/${id}`),
};

export const maintenanceApi = {
  getAll: () => api.get("/maintenance"),
  getByVehicle: (vehicleId) => api.get(`/maintenance/vehicle/${vehicleId}`),
  create: (data) => api.post("/maintenance", data),
  close: (id) => api.post(`/maintenance/${id}/close`),
  delete: (id) => api.delete(`/maintenance/${id}`),
};

export const expenseApi = {
  getAllFuel: () => api.get("/expenses/fuel"),
  createFuel: (data) => api.post("/expenses/fuel", data),
  deleteFuel: (id) => api.delete(`/expenses/fuel/${id}`),
  getAll: () => api.get("/expenses"),
  create: (data) => api.post("/expenses", data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

export const analyticsApi = {
  getDashboard: () => api.get("/analytics/dashboard"),
  getVehicleAnalytics: () => api.get("/analytics/vehicles"),
  exportCsv: () => window.open("http://localhost:8080/api/analytics/export/csv"),
};
