import { Handler, Context } from 'aws-lambda';

import sequelize from '@database';
import '@database/associations';

import { ResponseBuilder, APIHttpStatusCode } from '@utils/ResponseBuilder';
import AuthenticationUtils from '@utils/AuthenticationUtils';

import UserService from '@services/UserService';

import { JwtPayloadType, UserRole } from '@config/types';

export const apiRoute = (handler: APIHandler): Handler => async (event, context: Context) => {
  try {
    await sequelize.authenticate();

    // await sequelize.sync({ force: true });
  } catch (error) {
    return ResponseBuilder.error(APIHttpStatusCode.SERVER_ERROR, 'Database connection error');
  }

  let response;
  try {
    response = await handler(event, context);
  } catch (error) {
    response = error; // keep handler response
  }

  return response;
};

// eslint-disable-next-line max-len
export const authenticatedApiRoute = (handler: APIAuthenticatedHandler, requiredRole: UserRole = UserRole.ADVISOR): Handler => async (event, context: Context) => {
  let user;
  try {
    const jwtPayload = AuthenticationUtils.verifyRequest(event);
    if (jwtPayload.type !== JwtPayloadType.ACCESS_TOKEN) {
      return ResponseBuilder.error(APIHttpStatusCode.UNAUTHORIZED, 'Access token is malformed');
    }
    user = await UserService.getById(jwtPayload.userId);
    if (user === null) {
      return ResponseBuilder.error(APIHttpStatusCode.UNAUTHORIZED, 'Access token not valid');
    }
    if (!user.hasRole(requiredRole)) {
      return ResponseBuilder.error(APIHttpStatusCode.FORBIDDEN, 'User does not have permission to access this resource');
    }
  } catch (error) {
    return ResponseBuilder.error(APIHttpStatusCode.UNAUTHORIZED, error.message);
  }

  try {
    await sequelize.authenticate();
  } catch (error) {
    return ResponseBuilder.error(APIHttpStatusCode.SERVER_ERROR, 'Database connection error');
  }

  let response;
  try {
    response = await handler(user, event, context);
  } catch (error) {
    response = error; // keep handler response
  }

  return response;
};
