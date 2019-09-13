/**
 * Token generator service interface.
 */
export interface ITokenService {
  /**
   * Encrypt a given payload as a token.
   * @param {string | object | Buffer} payload - payload to encrypt
   * @return {Promise<string>} return encrypted token.
   */
  encrypt: (payload: string | object | Buffer) => Promise<string>;

  /**
   * Decrypt a token to it's original payload.
   * @param {string} token - token to decrypt.
   * @return {Promise<string | object | Buffer>} return decrypted payload.
   */
  decrypt: (token: string) => Promise<string | object | Buffer>;
}
