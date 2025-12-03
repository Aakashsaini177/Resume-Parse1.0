const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api/resume',
  TEMP_URL: import.meta.env.VITE_TEMP_URL || 'http://localhost:5001/temp'
};

export default config;
