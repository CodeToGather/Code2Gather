import {
  // GetSelfResponse,
  LoginRequestBody,
  LoginResponse,
} from 'types/api/auth';
import { User } from 'types/crud/user';

import tokenUtils from 'utils/tokenUtils';

import BaseApi, { api } from './baseApi';

class AuthApi extends BaseApi {
  async login(data: {
    token: string;
    githubUsername: string;
    photoUrl: string;
    profileUrl: string;
  }): Promise<void> {
    return this.post(
      'auth/login',
      data as LoginRequestBody,
      (res: LoginResponse) => tokenUtils.storeToken(res.token),
    );
  }

  async getSelf(): Promise<User | null> {
    const token = tokenUtils.getToken();
    if (token == null) {
      return Promise.resolve(null);
    }

    try {
      const response = await api.get('history/user');
      if (response.status === 200) {
        return response.data;
      }
      throw new Error(response.statusText);
    } catch (error) {
      this.logout();
      return Promise.reject(error);
    }
  }

  async logout(): Promise<void> {
    tokenUtils.removeToken();
    // TODO: Clear redux store
    return Promise.resolve();
  }
}

export default new AuthApi();
