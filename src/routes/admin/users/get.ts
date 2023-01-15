import { Handler } from 'aws-lambda';

import { authenticatedApiRoute } from '@routes/route-handlers';
import { ResponseBuilder, APIHttpStatusCode } from '@utils/ResponseBuilder';

import UserService from '@services/UserService';

import { UserRole } from '@config/types';

export const handler: Handler = authenticatedApiRoute((user, event) => {
  const { userId } = event.pathParameters;

  return new Promise((resolve, reject) => {
    UserService.getById(userId)
      .then((foundUser) => {
        if (foundUser === null) {
          reject(ResponseBuilder.error(APIHttpStatusCode.NOT_FOUND, 'User not found'));
        } else {
          resolve(ResponseBuilder.success(foundUser.getDetails()));
        }
      })
      .catch((error) => {
        reject(ResponseBuilder.error(APIHttpStatusCode.SERVER_ERROR, { error }));
      });
  });
}, UserRole.ADMIN);
