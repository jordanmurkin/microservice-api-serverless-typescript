import jwt from 'jsonwebtoken';

import CONFIG from '@config';

export default class AuthenticationUtils {
  /**
   * Extract Bearer token from request
   *
   * @param request - Request object
   * @returns Bearer token
   */
  static extractBearerToken(request): string {
    if (request.headers.Authorization && request.headers.Authorization.split(' ')[0] === 'Bearer') {
      return request.headers.Authorization.split(' ')[1];
    }
    throw new Error('Authentication token missing');
  }

  /**
   * Verify Bearer token and return payload
   *
   * @param token - Bearer token
   * @returns JWT payload
   */
  static verifyBearerToken(token): JwtPayload {
    return jwt.verify(token, CONFIG.jwt_encryption_key);
  }

  /**
   * Verify request and return payload
   *
   * @param token - Bearer token
   * @returns JWT payload
   */
  static verifyRequest(request): JwtPayload {
    const token = this.extractBearerToken(request);
    return this.verifyBearerToken(token);
  }
}
