import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

export const getArticles = (params) => API.get('/articles', { params });
export const getArticle = (slug) => API.get(`/articles/${slug}`);
export const getServices = () => API.get('/services');
export const getMetrics = () => API.get('/metrics');
export const getLogos = () => API.get('/logos');
export const getTeam = () => API.get('/team');
export const getCaseStudies = () => API.get('/case-studies');
export const getJurisdictions = () => API.get('/jurisdictions');
export const getJurisdiction = (slug) => API.get(`/jurisdictions/${slug}`);
export const getIndustries = () => API.get('/industries');
export const getSettings = () => API.get('/settings');
export const submitContact = (data) => API.post('/contact', data);

export default API;
