import { Handler } from 'aws-lambda';

import { authenticatedApiRoute } from '@routes/route-handlers';
import { ResponseBuilder } from '@utils/ResponseBuilder';

export const handler: Handler = authenticatedApiRoute((user) => {
  return Promise.resolve(ResponseBuilder.success(user.getDetails()));
});
