export type UserRole = 'admin' | 'staff';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: IUser;
  token: string;
}
