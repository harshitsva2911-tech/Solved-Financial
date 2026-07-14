const DEFAULT_API_BASE = 'https://solved-financial-api.applore.in/api';

const rawApiUrl = process.env.REACT_APP_API_URL || DEFAULT_API_BASE;
const API_BASE = /^https?:\/\//i.test(rawApiUrl) ? rawApiUrl : `https://${rawApiUrl}`;

export default API_BASE;
