import { IFactory } from '../ifactory';
import { ILogger } from '../logger/ilogger';
import { ITokenService } from './itoken-service';

type TokenServices = {[key: string]: ITokenService};

/**
 * Token service factory.
 */
export class TokenServiceFactory implements IFactory<ITokenService> {
  // logger
  private logger: ILogger;
  // registered services
  private services: TokenServices = {};

  /**
   * Constructor.
   * @param {ILogger} logger - logger service.
   */
  public constructor(logger: ILogger) {
    this.logger = logger;
  }

  /**
   * Register a service with the factory.
   * @param {string} type - type to register service as.
   * @param {ITokenService} service - service to register for name.
   */
  public registerService(type: string, service: ITokenService): void {
    this.services[type] = service;
  }

  /**
   * Return a service based on type.
   * @param {string} type - type of service to return.
   * @return {ITokenService} service.
   */
  public createService(type: string): ITokenService {
    const service: ITokenService = this.services[type];
    if (!service) {
      this.logger.error(`Unhandled token service type - ${type}`);
      throw (new Error(`Unhandled token service type - ${type}`));
    }
    return service;
  }
}
