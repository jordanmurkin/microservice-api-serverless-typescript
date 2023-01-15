import { Handler } from 'aws-lambda';

import { authenticatedApiRoute } from '@routes/route-handlers';
import { ResponseBuilder, APIHttpStatusCode } from '@utils/ResponseBuilder';

import UserService from '@services/UserService';

import { UserRole } from '@config/types';

export const handler: Handler = authenticatedApiRoute(() => {
  return new Promise((resolve, reject) => {
    UserService.getAll()
      .then((users) => {
        const response = users.map((user) => user.getDetails());

        resolve(ResponseBuilder.success(response));
      })
      .catch((error) => {
        reject(ResponseBuilder.error(APIHttpStatusCode.BAD_REQUEST, { error }));
      });
  });
}, UserRole.ADMIN);
