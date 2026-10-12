import axios from 'axios';

// Base API URL from environment variable, fallback to /api (Vite proxy to localhost:8080)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Response interceptor for beginner-friendly error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let friendlyMessage = 'Backend server is not reachable. Please ensure Spring Boot is running on port 8080.';
    if (error.response) {
      friendlyMessage = error.response.data?.message || `Server responded with status ${error.response.status}`;
    } else if (error.code === 'ECONNABORTED') {
      friendlyMessage = 'Request timed out. Please check backend connection.';
    }
    console.error('[FarmAssist API Error]:', friendlyMessage, error);
    error.friendlyMessage = friendlyMessage;
    return Promise.reject(error);
  }
);

export const api = {
  // Authentication & Users
  auth: {
    login: async (username, password) => {
      try {
        const res = await apiClient.post('/auth/login', { username, password });
        return res.data;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Login failed');
      }
    },
    register: async (userData) => {
      try {
        const res = await apiClient.post('/auth/register', userData);
        return res.data;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Registration failed');
      }
    },
    getFarmers: async () => {
      try {
        const res = await apiClient.get('/farmers');
        return res.data || [];
      } catch (err) {
        console.warn('Could not fetch farmers:', err.friendlyMessage);
        return [];
      }
    }
  },

  // Farmer Profiles & Farmer CRUD
  farmer: {
    getAll: async () => {
      try {
        const res = await apiClient.get('/farmers');
        return res.data || [];
      } catch (err) {
        console.warn('Could not fetch farmers:', err.friendlyMessage);
        return [];
      }
    },
    getById: async (id) => {
      try {
        const res = await apiClient.get(`/farmers/${id}`);
        return res.data;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Farmer not found');
      }
    },
    create: async (data) => {
      try {
        const res = await apiClient.post('/farmers', data);
        return res.data;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to create farmer');
      }
    },
    update: async (id, data) => {
      try {
        const res = await apiClient.put(`/farmers/${id}`, data);
        return res.data;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to update farmer');
      }
    },
    delete: async (id) => {
      try {
        await apiClient.delete(`/farmers/${id}`);
        return true;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to delete farmer');
      }
    },
    getProfile: async (userId) => {
      try {
        const res = await apiClient.get(`/farmers/${userId}/profile`);
        return res.data;
      } catch (err) {
        return { village: 'District Rural', district: 'District', state: 'State', totalExperienceYears: 5, primaryWaterSource: 'Canal & Well' };
      }
    },
    updateProfile: async (userId, data) => {
      try {
        const res = await apiClient.put(`/farmers/${userId}/profile`, data);
        return res.data;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to update profile');
      }
    }
  },

  // Land Parcels CRUD
  land: {
    getAll: async () => {
      try {
        const res = await apiClient.get('/land');
        return res.data || [];
      } catch (err) {
        console.warn('Could not fetch land parcels:', err.friendlyMessage);
        return [];
      }
    },
    getByUser: async (userId) => {
      try {
        const res = await apiClient.get(`/land/user/${userId}`);
        return res.data || [];
      } catch (err) {
        console.warn(`Could not fetch land for user ${userId}:`, err.friendlyMessage);
        return [];
      }
    },
    create: async (data) => {
      try {
        const res = await apiClient.post('/land', data);
        return res.data;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to create land parcel');
      }
    },
    update: async (id, data) => {
      try {
        const res = await apiClient.put(`/land/${id}`, data);
        return res.data;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to update land parcel');
      }
    },
    delete: async (id) => {
      try {
        await apiClient.delete(`/land/${id}`);
        return true;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to delete land parcel');
      }
    }
  },

  // Crop Management CRUD
  crops: {
    getAll: async () => {
      try {
        const res = await apiClient.get('/crops');
        return res.data || [];
      } catch (err) {
        console.warn('Could not fetch crops:', err.friendlyMessage);
        return [];
      }
    },
    getByUser: async (userId) => {
      try {
        const res = await apiClient.get(`/crops/user/${userId}`);
        return res.data || [];
      } catch (err) {
        console.warn(`Could not fetch crops for user ${userId}:`, err.friendlyMessage);
        return [];
      }
    },
    create: async (data) => {
      try {
        const res = await apiClient.post('/crops', data);
        return res.data;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to create crop');
      }
    },
    update: async (id, data) => {
      try {
        const res = await apiClient.put(`/crops/${id}`, data);
        return res.data;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to update crop');
      }
    },
    delete: async (id) => {
      try {
        await apiClient.delete(`/crops/${id}`);
        return true;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to delete crop');
      }
    }
  },

  // Cultivation Records CRUD
  records: {
    getAll: async () => {
      try {
        const res = await apiClient.get('/records');
        return res.data || [];
      } catch (err) {
        console.warn('Could not fetch cultivation records:', err.friendlyMessage);
        return [];
      }
    },
    getByCrop: async (cropId) => {
      try {
        const res = await apiClient.get(`/records/crop/${cropId}`);
        return res.data || [];
      } catch (err) {
        return [];
      }
    },
    create: async (data) => {
      try {
        const res = await apiClient.post('/records', data);
        return res.data;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to save cultivation record');
      }
    },
    update: async (id, data) => {
      try {
        const res = await apiClient.put(`/records/${id}`, data);
        return res.data;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to update cultivation record');
      }
    },
    delete: async (id) => {
      try {
        await apiClient.delete(`/records/${id}`);
        return true;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to delete cultivation record');
      }
    }
  },

  // Farming Resources Catalog CRUD
  resources: {
    getAll: async () => {
      try {
        const res = await apiClient.get('/resources');
        return res.data || [];
      } catch (err) {
        console.warn('Could not fetch resources:', err.friendlyMessage);
        return [];
      }
    },
    getByCategory: async (category) => {
      try {
        const res = await apiClient.get(`/resources/category/${category}`);
        return res.data || [];
      } catch (err) {
        return [];
      }
    },
    create: async (data) => {
      try {
        const res = await apiClient.post('/resources', data);
        return res.data;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to create resource');
      }
    },
    delete: async (id) => {
      try {
        await apiClient.delete(`/resources/${id}`);
        return true;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to delete resource');
      }
    }
  },

  // Announcements CRUD
  announcements: {
    getAll: async () => {
      try {
        const res = await apiClient.get('/announcements');
        return res.data || [];
      } catch (err) {
        console.warn('Could not fetch announcements:', err.friendlyMessage);
        return [];
      }
    },
    create: async (data) => {
      try {
        const res = await apiClient.post('/announcements', data);
        return res.data;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to post announcement');
      }
    },
    delete: async (id) => {
      try {
        await apiClient.delete(`/announcements/${id}`);
        return true;
      } catch (err) {
        throw new Error(err.friendlyMessage || 'Failed to delete announcement');
      }
    }
  },

  // Dashboard Stats
  dashboard: {
    getStats: async () => {
      try {
        const res = await apiClient.get('/dashboard/stats');
        return res.data;
      } catch (err) {
        console.warn('Could not fetch dashboard stats:', err.friendlyMessage);
        return {
          totalFarmers: 0,
          totalLandParcels: 0,
          totalAreaAcres: '0.0',
          activeCropsCount: 0,
          totalCultivationActivities: 0,
          availableResourcesCount: 0,
          activeAnnouncementsCount: 0,
          recentCrops: [],
          recentAnnouncements: [],
          recentActivities: []
        };
      }
    },
    getFarmerStats: async (userId) => {
      try {
        const res = await apiClient.get(`/dashboard/farmer/${userId}`);
        return res.data;
      } catch (err) {
        console.warn('Could not fetch farmer dashboard stats:', err.friendlyMessage);
        return null;
      }
    }
  }
};

export default api;
