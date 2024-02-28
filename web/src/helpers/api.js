import axios from './axiosInstance.js';

export function getData(endpoint) {
  return async () => {
    const response = await axios.get(endpoint);
    return response.data;
  };
}

export function postData(endpoint) {
  return async (data) => {
    try {
      const response = await axios.post(endpoint, data);
      if (`${response?.status}`.slice(0, 1) !== '2') {
        throw new Error('Response not OK');
      }
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
}

export function patchData(endpoint) {
  return async (data) => {
    const response = await axios.patch(endpoint, data);
    return response.data;
  };
}

export function deleteData(endpoint) {
  return async () => {
    const response = await axios.delete(endpoint);
    return response.data;
  };
}
