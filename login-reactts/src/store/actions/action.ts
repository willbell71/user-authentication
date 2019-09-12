/**
 * Action type.
 * @property {string} type - action type.
 * @property {T} payload - action payload.
 */
export type Action<T> = {
  type: string;
  payload: T;
}
