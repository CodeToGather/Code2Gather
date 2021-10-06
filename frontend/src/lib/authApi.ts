import {
  GetSelfResponse,
  LoginRequestBody,
  LoginResponse,
} from 'types/api/auth';
import { User } from 'types/crud/user';
import tokenUtils from 'utils/tokenUtils';

import BaseApi from './baseApi';

class AuthApi extends BaseApi {
  async login(token: string): Promise<void> {
    return this.post(
      'auth/login',
      { token } as LoginRequestBody,
      (res: LoginResponse) => tokenUtils.storeToken(res.token),
    );
  }

  async getSelf(): Promise<User | null> {
    const token = tokenUtils.getToken();
    if (token == null) {
      return Promise.resolve(null);
    }

    return this.get('history/self', (res: GetSelfResponse) => {
      const { user } = res;
      // TODO: Dispatch user object into redux store
      return user;
    }).catch((error: Error) => {
      this.logout();
      return Promise.reject(error);
    });
  }

  async logout(): Promise<void> {
    tokenUtils.removeToken();
    // TODO: Clear redux store
    return Promise.resolve();
  }
}

export default new AuthApi();
