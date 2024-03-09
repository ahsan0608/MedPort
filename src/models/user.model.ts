export interface User {
  name: string;
  email: string;
  password: string;
  mobile: string;
  image: string | null;
  userUniqueId: string;
  // eslint-disable-next-line no-use-before-define
  address: ReadonlyArray<AddressQueryReponse>;
  token: string;
}

export type UserCreatePayload = Pick<User, 'name' | 'mobile' | 'password' | 'email'>;

export type UserUpdatePayload = Pick<User, 'name' | 'email' | 'mobile' | 'password' | 'image' | 'address'>;

export type UserLoginPayload = Pick<User, 'email' | 'password'>;

export type UserQueryResponse = Pick<User, 'name' | 'mobile' | 'email' | 'userUniqueId'>;

export type UserResponse = Pick<User, 'name' | 'mobile' | 'email' | 'token' | 'userUniqueId'>;

export type UserData = Pick<User, 'name' | 'mobile' | 'email' | 'userUniqueId'>;

export type AddressQueryReponse = Pick<User, 'address'>;

export type Profile = Pick<User, 'name' | 'image' | 'mobile' | 'address'>;