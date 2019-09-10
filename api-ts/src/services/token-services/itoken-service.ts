/**
 * Token generator service interface.
 */
export interface ITokenService {
  /**
   * Encrypt a given payload as a token.
   * @param {any} payload - payload to encrypt
   * @return {Promise<string>} return encrypted token.
   */
  encrypt: (payload: any) => Promise<string>;

  /**
   * Decrypt a token to it's original payload.
   * @param {string} token - token to decrypt.
   * @return {Promise<any>} return decrypted payload.
   */
  decrypt: (token: string) => Promise<any>;
}
