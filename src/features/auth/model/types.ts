export interface Authentication {
  login: string;
  password: string;
}

export interface AuthUser extends Authentication {
  token?: string;
}
