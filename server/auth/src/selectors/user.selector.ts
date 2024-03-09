import { Prisma } from '@prisma/client';

export const userSelector = Prisma.validator<Prisma.UserSelect>()({
    email: true,
    name: true,
    mobile: true,
    userUniqueId: true
});

export default userSelector;
