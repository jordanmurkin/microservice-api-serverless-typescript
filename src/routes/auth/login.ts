import { Handler } from 'aws-lambda';

import { apiRoute } from '@routes/route-handlers';
import { ResponseBuilder, APIHttpStatusCode } from '@utils/ResponseBuilder';

import UserService from '@services/UserService';

export const handler: Handler = apiRoute((event) => {
  const {
    email, password,
  } = JSON.parse(event.body);

  return new Promise((resolve, reject) => {
    UserService.login(email, password)
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
