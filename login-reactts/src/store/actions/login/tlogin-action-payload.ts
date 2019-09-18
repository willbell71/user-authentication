/**
 * Login action payload.
 * @property {string} token - auth token.
 * @property {string | null} error - error message.
 */
export type TLoginActionPayload = {
  token: string | null;
  error: string | null;
};
