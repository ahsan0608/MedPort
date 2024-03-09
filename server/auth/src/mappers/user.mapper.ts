import generateToken from '../utils/token.utils';
import { UserQueryResponse, UserResponse } from '../models/user.model';

export const userMapper = (user: UserQueryResponse): UserResponse => (

    {
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        token: generateToken(user),
        userUniqueId: user.userUniqueId
    });

export default userMapper;
