import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname.startsWith('/admin')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (data) => api.post('/login', data),
    register: (data) => api.post('/register', data),
    logout: () => api.post('/logout'),
    getUser: () => api.get('/user'),
};

export const homeService = {
    getData: () => api.get('/home'),
};

export const postService = {
    getAll: (params) => api.get('/posts', { params }),
    getBySlug: (slug) => api.get(`/posts/${slug}`),
    create: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) formData.append(key, data[key]);
        });
        return api.post('/admin/posts', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    update: (id, data) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) formData.append(key, data[key]);
        });
        return api.post(`/admin/posts/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    delete: (id) => api.delete(`/admin/posts/${id}`),
    toggleStatus: (id) => api.post(`/admin/posts/${id}/toggle-status`),
    submit: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) formData.append(key, data[key]);
        });
        return api.post('/submit-post', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

export const categoryService = {
    getAll: () => api.get('/categories'),
    create: (data) => api.post('/admin/categories', data),
    update: (id, data) => api.put(`/admin/categories/${id}`, data),
    delete: (id) => api.delete(`/admin/categories/${id}`),
};

export const galleryService = {
    getAll: (params) => api.get('/galleries', { params }),
    create: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) formData.append(key, data[key]);
        });
        return api.post('/admin/galleries', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    update: (id, data) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) formData.append(key, data[key]);
        });
        return api.post(`/admin/galleries/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    delete: (id) => api.delete(`/admin/galleries/${id}`),
    toggleStatus: (id) => api.post(`/admin/galleries/${id}/toggle-status`),
};

export const sliderService = {
    getAll: () => api.get('/sliders'),
    create: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) formData.append(key, data[key]);
        });
        return api.post('/admin/sliders', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    update: (id, data) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) formData.append(key, data[key]);
        });
        return api.post(`/admin/sliders/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    delete: (id) => api.delete(`/admin/sliders/${id}`),
    toggleStatus: (id) => api.post(`/admin/sliders/${id}/toggle-status`),
};

export const subscriberService = {
    subscribe: (data) => api.post('/subscribe', data),
    getAll: (params) => api.get('/admin/subscribers', { params }),
    export: () => api.get('/admin/subscribers/export', { responseType: 'blob' }),
    delete: (id) => api.delete(`/admin/subscribers/${id}`),
    sendNewsletter: (data) => api.post('/admin/newsletter/send', data),
};

export const dashboardService = {
    getStats: () => api.get('/admin/dashboard'),
};

export const commentService = {
    getApproved: (postId) => api.get('/comments', { params: { post_id: postId } }),
    create: (data) => api.post('/comments', data),
    getAll: (params) => api.get('/admin/comments', { params }),
    approve: (id) => api.post(`/admin/comments/${id}/approve`),
    delete: (id) => api.delete(`/admin/comments/${id}`),
};

export default api;
