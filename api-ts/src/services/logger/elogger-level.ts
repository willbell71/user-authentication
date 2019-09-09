/**
 * Logger level enum.
 * @property {number} NONE - logging is disbled.
 * @property {number} ERROR - only errors are logged.
 * @property {number} ASSERT - asserts and above are logged.
 * @property {number} WARN - warnings and above are logged.
 * @property {number} INFO - info and above is logged.
 * @property {number} VERBOSE - verbose and above is logged.
 * @property {number} DEBUG - debug and above is logged.
 * @property {number} ALL - everything is logged.
 */
export enum ELoggerLevel {
  NONE = 0,

  ERROR,
  ASSERT,
  WARN,
  INFO,
  VERBOSE,
  DEBUG,

  ALL = 100
}
