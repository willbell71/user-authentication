import { TDBServiceEntity } from '../../services/db/tdb-service-entity';

/**
 * User service interface.
 */
export interface IUserService {
  /**
   * Register a new user, and log them in.
   * @param {string} firstName - users first name.
   * @param {string} lastName - users last name.
   * @param {string} email - users email address.
   * @param {string} password - users password.
   * @return {Promise<string>} token, if registration is successful.
   */
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<string>;

  /**
   * Log in user.
   * @param {string} email - user's email address.
   * @param {string} password - user's password.
   * @return {Promise<string>} token, if login is successful.
   */
  login: (email: string, password: string) => Promise<string>;

  /**
   * Log out the current user.
   * @param {TDBServiceEntity} user - user from user data service.
   * @return {Promise<void>} nothing.
   */
  logout: (user: TDBServiceEntity) => Promise<void>;
}
