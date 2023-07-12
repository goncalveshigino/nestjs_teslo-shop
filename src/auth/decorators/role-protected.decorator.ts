import { SetMetadata } from '@nestjs/common';
import { validRoles } from 'src/auth/interfaces/interfaces';


export const META_ROLES = 'roles'

export const RoleProtected = (...args: validRoles[] ) => {


    return SetMetadata( META_ROLES , args)
};
