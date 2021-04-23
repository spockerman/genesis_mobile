import axios from 'axios';
import { create } from 'react-test-renderer';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

export default api;
