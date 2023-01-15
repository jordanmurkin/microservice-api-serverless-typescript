interface APIHandler {
  (event, context: Context): Promise<APIResponse>;
}
