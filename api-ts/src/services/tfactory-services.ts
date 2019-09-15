/**
 * Factory servicees type.
 * @param {T} factory service type.
 */
export type TFactoryServices<T> = {[key: string]: { new(): T}};
