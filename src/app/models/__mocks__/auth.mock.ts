import { ILoginResponse, IUser } from '../user';

export const ADMIN_USER_MOCK: IUser = {
  id: 'u1',
  name: 'Admin FiloSlot',
  email: 'admin@filoslot.com',
  role: 'admin',
};

export const AUTH_CREDENTIALS_MOCK = {
  email: 'admin@filoslot.com',
  password: '123456',
};

export const AUTH_RESPONSE_MOCK: ILoginResponse = {
  user: ADMIN_USER_MOCK,
  token: 'mock-jwt-token-xyz',
};
