import bcrypt from 'bcryptjs';
import prisma from '../../prisma/prisma-client';
import HttpException from '../models/http-exception.model';
import {
  UserCreatePayload,
  UserLoginPayload,
  UserResponse,
  UserUpdatePayload,
  UserData
} from '../models/user.model';
import userMapper from '../mappers/user.mapper';
import userSelector from '../selectors/user.selector';
import generateUniqueId from '../helpers/uidGenerater';

const checkUserUniqueness = async (email: string): Promise<void> => {
  const existingUserByEmail = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (existingUserByEmail) {
    throw new HttpException(422, {
      errors: {
        ...(existingUserByEmail ? { email: ['has already been taken'] } : {}),
      },
    });
  }
};

export const createUser = async (input: UserCreatePayload): Promise<UserResponse> => {
  const email = input.email.trim();
  const name = input.name.trim();
  const password = input.password.trim();
  const mobile = input.mobile.trim();

  if (!email) {
    throw new HttpException(422, { errors: { email: ["can't be blank"] } });
  }

  if (!name) {
    throw new HttpException(422, { errors: { username: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  await checkUserUniqueness(email);

  const hashedPassword = await bcrypt.hash(password, 10);

  const userUniqueId = generateUniqueId();

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      mobile,
      userUniqueId,
      password: hashedPassword,
    },
    select: userSelector,
  });

  return userMapper(createdUser);
};

export const login = async (userPayload: UserLoginPayload): Promise<UserResponse> => {
  const email = userPayload.email.trim();
  const password = userPayload.password.trim();

  if (!email) {
    throw new HttpException(422, { errors: { email: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      email: true,
      name: true,
      password: true,
      mobile: true,
      userUniqueId: true,
    },
  });

  if (user) {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return userMapper(user);
    }
  }

  throw new HttpException(403, {
    errors: {
      'email or password': ['is invalid'],
    },
  });
};


export const getCurrentUser = async (email: string): Promise<UserData> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: userSelector,
  });

  if (!user) {
    throw new HttpException(404, {});
  }

  //exclude token
  const { token, ...userWithoutToken } = userMapper(user);
  return userWithoutToken;
};

export const updateUser = async (
  userPayload: UserUpdatePayload,
  loggedInUsername: string,
): Promise<UserResponse> => {
  const { email, name, password, image, mobile } = userPayload;
  const user = await prisma.user.update({
    where: {
      email: loggedInUsername,
    },
    data: {
      ...(email ? { email } : {}),
      ...(name ? { name } : {}),
      ...(password ? { password } : {}),
      ...(image ? { image } : {}),
      ...(mobile ? { mobile } : {}),
    },
    select: userSelector,
  });

  return userMapper(user);
};

export const findUserIdByEmail = async (email: string): Promise<number> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new HttpException(404, {});
  }

  return user.id;
};
