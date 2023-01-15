import { Handler } from 'aws-lambda';

import { authenticatedApiRoute } from '@routes/route-handlers';
import { ResponseBuilder, APIHttpStatusCode } from '@utils/ResponseBuilder';

import { validateUser } from '@config/types/guards';
import UserService from '@services/UserService';

import { UserRole } from '@config/types';

export const handler: Handler = authenticatedApiRoute((user, event) => {
  const userAttributes: UserAttributes = JSON.parse(event.body);

  try {
    validateUser(userAttributes);
  } catch (error) {
    return Promise.reject(ResponseBuilder.error(APIHttpStatusCode.BAD_REQUEST, error));
  }

  userAttributes.role = UserRole[userAttributes.role];

  return new Promise((resolve, reject) => {
    UserService.create(userAttributes)
      .then((newUser) => {
        resolve(ResponseBuilder.success(newUser.getDetails()));
      })
      .catch((error) => {
        reject(ResponseBuilder.error(APIHttpStatusCode.BAD_REQUEST, { error }));
      });
  });
}, UserRole.ADMIN);
