interface UserAttributes {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface UserAttributesUpdates {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}
