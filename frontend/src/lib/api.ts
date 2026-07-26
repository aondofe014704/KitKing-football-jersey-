import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage on each request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 → refresh token flow
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// ----- API methods -----

// Auth
export const authApi = {
  register: (data: object) => api.post('/auth/register', data),
  login: (data: object) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  changePassword: (data: object) => api.post('/auth/change-password', data),
};

// Products
export const productsApi = {
  getAll: (params?: object) => api.get('/products', { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  getFeatured: () => api.get('/products', { params: { featured: true, limit: 8 } }),
  getNewArrivals: () => api.get('/products', { params: { newArrival: true, limit: 8 } }),
  getBestSellers: () => api.get('/products', { params: { bestSeller: true, limit: 8 } }),
  getRelated: (id: string) => api.get(`/products/${id}/related`),
};

// Categories
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug: string) => api.get(`/categories/${slug}`),
};

// Cart
export const cartApi = {
  get: () => api.get('/cart'),
  add: (data: object) => api.post('/cart', data),
  update: (id: number, quantity: number) => api.put(`/cart/${id}`, { quantity }),
  remove: (id: number) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart'),
};

// Wishlist
export const wishlistApi = {
  get: () => api.get('/wishlist'),
  add: (productId: string) => api.post('/wishlist', { productId }),
  remove: (productId: string) => api.delete(`/wishlist/${productId}`),
};

// Orders
export const ordersApi = {
  create: (data: object) => api.post('/orders', data),
  getMyOrders: (params?: object) => api.get('/orders/my', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  trackByNumber: (orderNumber: string) => api.get(`/orders/track/${orderNumber}`),
};

// Reviews
export const reviewsApi = {
  getByProduct: (productId: string) => api.get(`/reviews/product/${productId}`),
  create: (data: object) => api.post('/reviews', data),
};

// Coupons
export const couponsApi = {
  validate: (code: string) => api.post('/coupons/validate', { code }),
};

// Gallery
export const galleryApi = {
  getAll: () => api.get('/gallery'),
};

// Blog
export const blogApi = {
  getAll: (params?: object) => api.get('/blog', { params }),
  getBySlug: (slug: string) => api.get(`/blog/${slug}`),
};

// Delivery
export const deliveryApi = {
  getZones: () => api.get('/delivery/zones'),
};

// Users
export const usersApi = {
  updateProfile: (data: object) => api.put('/users/profile', data),
  addAddress: (data: object) => api.post('/users/addresses', data),
  updateAddress: (id: string, data: object) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/users/addresses/${id}`),
};

// Payments
export const paymentsApi = {
  initializePaystack: (data: object) => api.post('/payments/paystack/initialize', data),
  verifyPaystack: (reference: string) => api.get(`/payments/paystack/verify/${reference}`),
  initializeFlutterwave: (data: object) => api.post('/payments/flutterwave/initialize', data),
};

// Admin
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getOrders: (params?: object) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id: string, status: string) => api.put(`/admin/orders/${id}/status`, { status }),
  getProducts: (params?: object) => api.get('/products', { params }),
  createProduct: (data: object) => api.post('/products', data),
  updateProduct: (id: string, data: object) => api.put(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
  getCustomers: (params?: object) => api.get('/admin/customers', { params }),
  getAnalytics: (params?: object) => api.get('/admin/analytics', { params }),
  getCoupons: () => api.get('/coupons'),
  createCoupon: (data: object) => api.post('/coupons', data),
  updateCoupon: (id: string, data: object) => api.put(`/coupons/${id}`, data),
  deleteCoupon: (id: string) => api.delete(`/coupons/${id}`),
  getGallery: () => api.get('/gallery'),
  addGalleryImage: (data: object) => api.post('/gallery', data),
  deleteGalleryImage: (id: string) => api.delete(`/gallery/${id}`),
  getBlogPosts: (params?: object) => api.get('/blog', { params }),
  createBlogPost: (data: object) => api.post('/blog', data),
  updateBlogPost: (id: string, data: object) => api.put(`/blog/${id}`, data),
  deleteBlogPost: (id: string) => api.delete(`/blog/${id}`),
  getReviews: (params?: object) => api.get('/admin/reviews', { params }),
  updateReview: (id: string, data: object) => api.put(`/reviews/${id}`, data),
  getDeliveryZones: () => api.get('/delivery/zones'),
  createDeliveryZone: (data: object) => api.post('/delivery/zones', data),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: object) => api.put('/admin/settings', data),
  uploadImage: (data: FormData) => api.post('/gallery/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
