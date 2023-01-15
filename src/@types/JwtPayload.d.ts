interface JwtPayload {
  userId: string;
  type: JwtPayloadType;
  iat: number;
  exp: number;
}
