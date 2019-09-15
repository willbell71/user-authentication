import { IFactory } from '../ifactory';
import { ILogger } from '../logger/ilogger';
import { IPasswordService } from './ipassword-service';
import { TFactoryServices } from '../tfactory-services';

/**
 * Password service factory.
 */
export class PasswordServiceFactory implements IFactory<IPasswordService> {
  // logger
  private logger: ILogger;
  // registered services
  private services: TFactoryServices<IPasswordService> = {};

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
   * @param {{new(): IPasswordService}} service - service to register for name.
   */
  public registerService(type: string, service: {new(): IPasswordService}): void {
    this.services[type] = service;
  }

  /**
   * Return a service based on type.
   * @param {string} type - type of service to return.
   * @return {IPasswordService} service.
   */
  public createService(type: string): IPasswordService {
    const service: {new(): IPasswordService} = this.services[type];
    if (!service) {
      this.logger.error(`Unhandled password service type - ${type}`);
      throw (new Error(`Unhandled password service type - ${type}`));
    }
    return new service();
  }
}
