import httpService from './HttpService';

class AuthService {
  async login(username, password) {
    try {
      const response = await httpService.post('/user/login', {
        username,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('role', response.data.user.role);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async register(userData, role) {
    try {
      let endpoint = '';
      switch(role) {
        case 'PATIENT':
          endpoint = '/patient/register';
          break;
        case 'DOCTOR':
          endpoint = '/doctor/register';
          break;
        case 'RECEPTIONIST':
          endpoint = '/receptionist/register';
          break;
        default:
          throw new Error('Invalid role');
      }

      const response = await httpService.post(endpoint, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getCurrentRole() {
    return localStorage.getItem('role');
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export default new AuthService();