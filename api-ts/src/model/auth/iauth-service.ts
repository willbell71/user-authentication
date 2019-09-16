import { TDBServiceEntity } from '../../services/db/tdb-service-entity';

export interface IAuthService {
  /**
   * Get an authentication user, if token is valid.
   * @param {string} token - authentication token.
   * @return {Promise<TDBServiceEntity>} user, if authentication passes.
   */
  getAuthenticatedUserForToken: (token: string) => Promise<TDBServiceEntity>;
}
