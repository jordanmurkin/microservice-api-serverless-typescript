export enum JwtPayloadType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}

export enum UserRole {
  ADVISOR = 'ADVISOR_ROLE',
  MANAGER = 'MANAGER_ROLE',
  ADMIN = 'ADMIN_ROLE',
}

export const UserRoleHierarchy = {
  [UserRole.ADMIN]: [UserRole.ADMIN, UserRole.MANAGER, UserRole.ADVISOR],
  [UserRole.MANAGER]: [UserRole.MANAGER, UserRole.ADVISOR],
  [UserRole.ADVISOR]: [UserRole.ADVISOR],
};
