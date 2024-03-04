import defaultAxios from 'axios';
import { getSession, signOut } from 'next-auth/react';
const axios = defaultAxios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
axios.interceptors.request.use(
  async function (config) {
    const session = await getSession();
    const token = session ? session.user.id : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      console.log('unauthorized, logging out ...');
      signOut();
      alert('다시 로그인 해주세요.');
    }
    return Promise.reject(error);
  }
);
export default axios;
export const { get, post, put, delete: destroy } = axios;
