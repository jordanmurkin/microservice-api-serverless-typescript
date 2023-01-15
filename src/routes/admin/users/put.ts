import has from 'has';
import { Handler } from 'aws-lambda';

import { authenticatedApiRoute } from '@routes/route-handlers';
import { ResponseBuilder, APIHttpStatusCode } from '@utils/ResponseBuilder';

import UserService from '@services/UserService';

import { UserRole } from '@config/types';

export const handler: Handler = authenticatedApiRoute((user, event) => {
  const { userId } = event.pathParameters;

  const eventBody = JSON.parse(event.body);
  if (eventBody === null) {
    return Promise.reject(ResponseBuilder.error(APIHttpStatusCode.BAD_REQUEST, 'No body provided'));
  }

  const userUpdates: UserAttributesUpdates = {};

  if (has(eventBody, 'firstName')) {
    userUpdates.firstName = eventBody.firstName;
  }

  if (has(eventBody, 'lastName')) {
    userUpdates.lastName = eventBody.lastName;
  }

  if (Object.keys(userUpdates).length === 0) {
    return Promise.reject(ResponseBuilder.error(APIHttpStatusCode.BAD_REQUEST, 'No updates provided'));
  }

  return new Promise((resolve, reject) => {
    UserService.getById(userId)
      .then((foundUser) => {
        if (foundUser === null) {
          reject(ResponseBuilder.error(APIHttpStatusCode.NOT_FOUND, 'User not found'));
        }

        return UserService.update(foundUser, userUpdates);
      })
      .then((customer) => {
        resolve(ResponseBuilder.success(customer.getDetails()));
      })
      .catch((error) => {
        reject(ResponseBuilder.error(APIHttpStatusCode.SERVER_ERROR, { error }));
      });
  });
}, UserRole.ADMIN);
