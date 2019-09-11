/**
 * Password encryption service interface.
 */
export interface IPasswordService {
  /**
   * Encrypt a given password.
   * @param {string} password - password to encrypt
   * @return {Promise<string>} return encrypted password.
   */
  encrypt: (password: string) => Promise<string>;

  /**
   * Compare a raw password against an encrypted password for a match.
   * @param {string} password - raw password to compare.
   * @param {string} encrypted - encrypted password to compare against.
   * @return {Promise<boolean>} return if passwords match.
   */
  compare: (password: string, encrypted: string) => Promise<boolean>;
}
