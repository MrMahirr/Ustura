// TODO: Axios/fetch instance
// TODO: baseURL ayarı
// TODO: JWT token interceptor (request header'a ekle)
// TODO: 401 hatası → refresh token → retry

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export default API_BASE_URL;
