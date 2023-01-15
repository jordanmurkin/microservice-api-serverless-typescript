interface APIAuthenticatedHandler {
  (user: User, event, context: Context): Promise<APIResponse>;
}
