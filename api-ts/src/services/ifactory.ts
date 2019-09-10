/**
 * Factory interface.
 */
export interface IFactory<T> {
  /**
   * Register a service with the factory.
   * @param {string} type - type to register service as.
   * @param {T} service - service to register for name.
   */
  registerService: (type: string, service: T) => void;

  /**
   * Return a service based on type.
   * @param {string} type - type of service to return.
   * @return {T} service.
   */
  createService: (type: string) => T;
}
