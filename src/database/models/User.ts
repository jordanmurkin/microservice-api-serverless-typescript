import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import sequelize from '@database';
import CONFIG from '@config';
import { JwtPayloadType, UserRole, UserRoleHierarchy } from '@config/types';

// eslint-disable-next-line max-len
export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> implements UserAttributes {
  declare id: CreationOptional<string>;

  declare email: string;

  declare password: string;

  declare firstName: string;

  declare lastName: string;

  declare role: UserRole;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;

  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;

  // updatedAt can be undefined during creation
  declare deletedAt: CreationOptional<Date>;

  getDetails(): UserAttributes {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
    };
  }

  comparePassword(plainText: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainText, this.password)
        .then((isMatch) => {
          resolve(isMatch);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getAccessToken(): string {
    const expirationTime = parseInt(CONFIG.jwt_access_expiry_time, 10);

    const payload = {
      userId: this.id,
      type: JwtPayloadType.ACCESS_TOKEN,
    };

    return jwt.sign(payload, CONFIG.jwt_encryption_key, { expiresIn: expirationTime });
  }

  getRefreshToken(): string {
    const expirationTime = parseInt(CONFIG.jwt_refresh_expiry_time, 10);

    const payload = {
      userId: this.id,
      type: JwtPayloadType.REFRESH_TOKEN,
    };

    return jwt.sign(payload, CONFIG.jwt_encryption_key, { expiresIn: expirationTime });
  }

  hasRole(role: UserRole): boolean {
    if (UserRoleHierarchy[this.role].indexOf(role) !== -1) {
      return true;
    }

    return false;
  }
}

User.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    role: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: 'users',
    sequelize, // passing the `sequelize` instance is required
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

User.beforeSave(async (user) => {
  if (user.changed('password')) {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
  }
});
