import axios from 'axios';
import config from '../config';

const { API_URL, TEMP_URL } = config;

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const parseUrl = async (url) => {
  const response = await axios.post(`${API_URL}/from-url`, { url });
  return response.data;
};

export const getTempFileUrl = (id) => 
  `${TEMP_URL}/${id}`;
