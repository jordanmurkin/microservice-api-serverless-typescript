import { Handler } from 'aws-lambda';

import { apiRoute } from '@routes/route-handlers';

import { ResponseBuilder, APIHttpStatusCode } from '@utils/ResponseBuilder';
import AuthenticationUtils from '@utils/AuthenticationUtils';

import UserService from '@services/UserService';

import { JwtPayloadType } from '@config/types';

export const handler: Handler = apiRoute((event) => {
  const {
    refreshToken,
  } = JSON.parse(event.body);

  const jwtPayload = AuthenticationUtils.verifyBearerToken(refreshToken);
  if (jwtPayload.type !== JwtPayloadType.REFRESH_TOKEN) {
    return Promise.reject(ResponseBuilder.error(APIHttpStatusCode.UNAUTHORIZED, 'Refresh token is malformed'));
  }

  return new Promise((resolve, reject) => {
    UserService.getById(jwtPayload.userId)
      .then((user) => {
        const response = {
          accessToken: user.getAccessToken(),
          refreshToken: user.getRefreshToken(),
          user: user.getDetails(),
        };

        resolve(ResponseBuilder.success(response));
      })
      .catch((error) => {
        reject(ResponseBuilder.error(APIHttpStatusCode.UNAUTHORIZED, error.message));
      });
  });
});
