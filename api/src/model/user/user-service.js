// @ts-check
'use strict';

/**
 * User service.
 */
class UserService {
  /**
   * Constructor.
   * @param {Logger} loggerService - logger service.
   * @param {TokenService} tokenService - token service.
   * @param {DBService} dbService - db service.
   * @param {PasswordService} passwordService - password service.
   */
  constructor(loggerService, tokenService, dbService, passwordService) {
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
  async register(firstName, lastName, email, password) {
    // create a new user
    const user = await this.dbService.create('User');
    this.dbService.setProp(user, 'firstName', firstName);
    this.dbService.setProp(user, 'lastName', lastName);
    this.dbService.setProp(user, 'email', email);
    this.dbService.setProp(user, 'password', await this.passwordService.encrypt(password));
    // generate token
    const token = await this.tokenService.encrypt({
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
   * @param {*} password - user's password.
   * @return {Promise<string>} token, if login is successful.
   */
  async login(email, password) {
    // get user for email
    const user = await this.dbService.fetch('User', 'email', email);
    if (user) {
      // ensure their password match
      const match = await this.passwordService.compare(password, this.dbService.getProp(user, 'password'));
      if (match) {
        // generate an auth token
        const token = await this.tokenService.encrypt({
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
   * @param {any} user - user from user data service.
   * @return {Promise<void>} nothing.
   */
  async logout(user) {
    // clear user token
    this.dbService.setProp(user, 'token');
    // write user to db
    await this.dbService.save(user);
  }
}

module.exports = UserService;
