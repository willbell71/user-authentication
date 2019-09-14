/**
 * Factory interface.
 */
export interface IFactory<T> {
  /**
   * Register a service with the factory.
   * @param {string} type - type to register service as.
   * @param {{new(): T}} service - service to register for name.
   */
  registerService: (type: string, service: {new(): T}) => void;

  /**
   * Return a service based on type.
   * @param {string} type - type of service to return.
   * @return {T} service.
   */
  createService: (type: string) => T;
}
