// Default to local backend for testing
const DEFAULT_API_BASE = 'http://localhost:5000/api';

const rawApiUrl = process.env.REACT_APP_API_URL || DEFAULT_API_BASE;
const API_BASE = /^https?:\/\//i.test(rawApiUrl) ? rawApiUrl : `http://${rawApiUrl}`;

export default API_BASE;
