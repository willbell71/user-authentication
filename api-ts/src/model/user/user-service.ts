import { ILogger } from '../../services/logger/ilogger';
import { ITokenService } from '../../services/token-services/itoken-service';
import { IDBService } from '../../services/db/idb-service';
import { IPasswordService } from '../../services/password-service/ipassword-service';
import { TDBServiceEntity } from '../../services/db/tdb-service-entity';
import { IUserService } from './iuser-service';

/**
 * User service.
 */
export class UserService implements IUserService {
  private loggerService: ILogger;
  private tokenService: ITokenService;
  private dbService: IDBService;
  private passwordService: IPasswordService;

  /**
   * Constructor.
   * @param {ILogger} loggerService - logger service.
   * @param {ITokenService} tokenService - token service.
   * @param {IDBService} dbService - db service.
   * @param {IPasswordService} passwordService - password service.
   */
  public constructor(loggerService: ILogger, tokenService: ITokenService, dbService: IDBService, passwordService: IPasswordService) {
    // store services
    this.loggerService = loggerService;
    this.tokenService = tokenService;
    this.dbService = dbService;
    this.passwordService = passwordService;
  }

  /**
   * Register a new user, and log them in.
   * @param {string} firstName - users first name.
   * @param {string} lastName - users last name.
   * @param {string} email - users email address.
   * @param {string} password - users password.
   * @return {Promise<string>} token, if registration is successful.
   */
  public async register(firstName: string, lastName: string, email: string, password: string): Promise<string> {
    // create a new user
    const user: TDBServiceEntity = await this.dbService.create('User');
    this.dbService.setProp(user, 'firstName', firstName);
    this.dbService.setProp(user, 'lastName', lastName);
    this.dbService.setProp(user, 'email', email);
    this.dbService.setProp(user, 'password', await this.passwordService.encrypt(password));
    // generate token
    const token: string = await this.tokenService.encrypt({
      id: this.dbService.getProp(user, 'id')
    });
    // set token on user and last log in date, write user to db
    this.dbService.setProp(user, 'token', token);
    this.dbService.setProp(user, 'lastLogin', new Date());
    await this.dbService.save(user);

    // if everything passed, return auth token
    return token;
  }

  /**
   * Log in user.
   * @param {string} email - user's email address.
   * @param {string} password - user's password.
   * @return {Promise<string>} token, if login is successful.
   */
  public async login(email: string, password: string): Promise<string> {
    // get user for email
    const user: TDBServiceEntity = await this.dbService.fetch('User', 'email', email);
    if (user) {
      // ensure their password match
      const match: boolean = await this.passwordService.compare(password, this.dbService.getProp(user, 'password') as string);
      if (match) {
        // generate an auth token
        const token: string = await this.tokenService.encrypt({
          id: this.dbService.getProp(user, 'id')
        });
        // login in the user
        this.dbService.setProp(user, 'token', token);
        this.dbService.setProp(user, 'lastLogin', new Date());
        await this.dbService.save(user);

        // if everything passed, return the auth token
        return token;
      } else {
        throw (new Error('Passwords dont match'));
      }
    } else {
      throw (new Error('Failed to retrieve a user for email'));
    }
  }

  /**
   * Log out the current user.
   * @param {TDBServiceEntity} user - user from user data service.
   * @return {Promise<void>} nothing.
   */
  public async logout(user: TDBServiceEntity): Promise<void> {
    // clear user token
    this.dbService.setProp(user, 'token');
    // write user to db
    await this.dbService.save(user);
  }
}
