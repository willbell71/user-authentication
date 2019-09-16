import { IAuthService } from './iauth-service';
import { ITokenService } from '../../services/token-services/itoken-service';
import { IDBService } from '../../services/db/idb-service';
import { ILogger } from '../../services/logger/ilogger';
import { TDBServiceEntity } from '../../services/db/tdb-service-entity';

/**
 * Auth service.
 */
export class AuthService implements IAuthService {
  private logger: ILogger;
  private tokenService: ITokenService;
  private dbService: IDBService;

  /**
   * Constructor.
   * @param {Logger} loggerService - logger service.
   * @param {TokenService} tokenService - token service.
   * @param {DBService} dbService - db service.
   */
  public constructor(logger: ILogger, tokenService: ITokenService, dbService: IDBService) {
    // store services
    this.logger = logger;
    this.tokenService = tokenService;
    this.dbService = dbService;
  }

  /**
   * Get an authentication user, if token is valid.
   * @param {string} token - authentication token.
   * @return {Promise<TDBServiceEntity>} user, if authentication passes.
   */
  public async getAuthenticatedUserForToken(token: string): Promise<TDBServiceEntity> {
    // get user id from auth token
    const {id}: {id: string} = await this.tokenService.decrypt(token) as {id: string};
    // get user for id
    const user: TDBServiceEntity = await this.dbService.fetch('User', 'id', id);
    // ensure this token is valid/active for this user
    const storedToken: string = this.dbService.getProp(user, 'token') as string;
    if (storedToken && storedToken === token) {
      // check token hasn't expired
      const now: Date = new Date();
      const maxSessionDuration: number = 1000 * 60 * 60;
      const lastLogin: Date = this.dbService.getProp(user, 'lastLogin') as Date;
      if (now.getTime() > lastLogin.getTime() + maxSessionDuration) {
        // log user out
        this.dbService.setProp(user, 'token');
        await this.dbService.save(user);
        // reject
        throw (new Error('Login expired'));
      }

      // if everything passed, return user
      return user;
    } else {
      throw new Error('Tokens dont match');
    }
  }
}
