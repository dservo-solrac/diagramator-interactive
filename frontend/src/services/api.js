const API_URL = '/api'; // Nginx proxy

const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
        throw new Error(error.detail);
    }

    return response.json();
};

export const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
    });

    if (!response.ok) {
        try {
            const error = await response.json();
            throw new Error(error.detail);
        } catch (e) {
            throw new Error('An unexpected error occurred.');
        }
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
};

export const signup = (email, password) => request('/users/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
});

export const getCurrentUser = () => request('/users/me');
export const getDiagrams = () => request('/diagrams/');
export const createDiagram = (data) => request('/diagrams/', { method: 'POST', body: JSON.stringify(data) });
export const updateDiagram = (id, data) => request(`/diagrams/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteDiagram = (id) => request(`/diagrams/${id}`, { method: 'DELETE' });
