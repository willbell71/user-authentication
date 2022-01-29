import mongoose from 'mongoose';

import { ILogger } from '../logger/ilogger';
import { ILogLine } from '../logger/ilog-line';
import { Logger } from '../logger/logger';
import { MongoDBService } from './mongo-db-service';

let connected: boolean = false;
jest.mock('mongoose', () => {
  const connect: jest.Mock = jest.fn().mockImplementation((connection: string) => {
    return new Promise((
      resolve: ((value?: string | PromiseLike<string> | undefined) => void),
      reject: ((reason?: string) => void)
    ): void => {
      if (connection) {
        connected = true;
        resolve('');
      } else {
        connected = false;
        reject('');
      }
    });
  });

  const disconnect: jest.Mock = jest.fn().mockImplementation((): Promise<void> =>
    connected ? Promise.resolve() : Promise.reject({message: ''}));

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function TestModel(): void {}
  TestModel.findById = function(): Promise<string> {
    return new Promise((resolve: (value: string) => void) => {
      resolve('findById');
    });
  };
  TestModel.findOne = function(): Promise<string> {
    return new Promise((resolve: (value: string) => void) => {
      resolve('findOne');
    });
  };
  const model: jest.Mock = jest.fn().mockImplementation((name: string) => name.length > 1 ? TestModel : undefined);
  const Schema: jest.Mock = jest.fn().mockImplementation(() => {});
  const Model: jest.Mock = jest.fn().mockImplementation(() => {});

  return {
    connect,
    disconnect,
    model,
    Schema,
    Model
  };
});

let logLineSpy: jest.Mock;
let warnLineSpy: jest.Mock;
let errorLineSpy: jest.Mock;
let assertLineSpy: jest.Mock;
let log: ILogLine;
let warn: ILogLine;
let error: ILogLine;
let assert: ILogLine;
let logger: ILogger;
let mongoDBService: MongoDBService;
beforeEach(() => {
  logLineSpy = jest.fn().mockImplementation(() => {});
  warnLineSpy = jest.fn().mockImplementation(() => {});
  errorLineSpy = jest.fn().mockImplementation(() => {});
  assertLineSpy = jest.fn().mockImplementation(() => {});

  log = {log: logLineSpy};
  warn = {log: warnLineSpy};
  error = {log: errorLineSpy};
  assert = {log: assertLineSpy};
  logger = new Logger(log, warn, error, assert);

  mongoDBService = new MongoDBService();
});
afterEach(() => jest.clearAllMocks());

describe('MongoDBService', () => {
  describe('connect', () => {
    it('should call mongoose connect', async () => {
      await mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }]);
      expect(mongoose.connect).toHaveBeenCalled();
    });

    it('should log log on successful connect', async () => {
      await mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }]);
      expect(logLineSpy).toHaveBeenCalled();
    });

    // TODO - resolve timeout issue
    // it('should log error on failed connect', async () => {
    //   await mongoDBService.connect(logger, '', [{
    //     name: 'test',
    //     schemaDefinition: {
    //       test: String
    //     }
    //   }]);

    //   expect(errorLineSpy).toHaveBeenCalledTimes(2);
    // });

    it('should call mongoose Schema for each entity', async () => {
      await mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }]);
      expect(mongoose.Schema).toHaveBeenCalledTimes(1);
    });

    it('should call mongoose Model for each entity', async () => {
      await mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }]);
      expect(mongoose.model).toHaveBeenCalledTimes(1);
    });
  });

  describe('disconnect', () => {
    it('should call mongoose disconnect', async () => {
      await mongoDBService.connect(logger, 'connect', []);
      await mongoDBService.disconnect();
      expect(mongoose.disconnect).toHaveBeenCalled();
    });

    it('should call log on successful disconnect', async () => {
      await mongoDBService.connect(logger, 'connect', []);
      await mongoDBService.disconnect();
      expect(logLineSpy).toHaveBeenCalled();
    });

    it('should call error on unsuccessful disconnect', async () => {
      await mongoDBService.connect(logger, 'connect', []);
      connected = false;
      await mongoDBService.disconnect();
      expect(errorLineSpy).toHaveBeenCalled();
    });

    it('should pass successful disconnect with no logger', async () => {
      connected = true;
      await mongoDBService.disconnect();
      expect(true).toBeTruthy();
    });

    it('should pass unsuccessful disconnect with no logger', async () => {
      connected = false;
      await mongoDBService.disconnect();
      expect(true).toBeTruthy();
    });
  });

  describe('create', () => {
    it('should instance new entity', async () => {
      await mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }]);
      const entity: string = await mongoDBService.create('test');
      expect(entity).toBeTruthy();
    });

    it('should error if connection hasnt been called', async () => {
      await expect(mongoDBService.create('test'))
        .rejects.toEqual(new Error('Mappings not set, connection must be called with a schema for this entity'));
    });

    it('should error if entity doesnt exist', async () => {
      await mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }]);
      await expect(mongoDBService.create('test2')).rejects.toEqual(new Error('Model doesnt exist'));
    });

    it('should error if entity doesnt exist', async () => {
      await mongoDBService.connect(logger, 'connect', [{
        name: 's',
        schemaDefinition: {
          test: String
        }
      }]);
      await expect(mongoDBService.create('s')).rejects.toEqual(new Error('Failed to instantiate new entity'));
    });
  });

  describe('setProp', () => {
    it('should set prop value', () => {
      const entity: {prop?: string} = {};
      mongoDBService.setProp(entity, 'prop', 'value');

      expect(entity.prop).toEqual('value');
    });
  });

  describe('getProp', () => {
    it('should get prop value', () => {
      const entity: {prop: string} = {
        prop: 'value'
      };

      const value: string = mongoDBService.getProp(entity, 'prop') as string;

      expect(value).toEqual('value');
    });
  });

  describe('save', () => {
    it('should call entity save', async () => {
      const saveMock: jest.Mock = jest.fn().mockImplementation(() => {
        return new Promise<void>((
          resolve: ((value?: void | PromiseLike<void> | undefined) => void)
        ): void => resolve());
      });
      await mongoDBService.save({
        save: saveMock
      });
      expect(saveMock).toHaveBeenCalledTimes(1);
    });

    it('should throw error if save fails', async () => {
      const saveMock: jest.Mock = jest.fn().mockImplementation(() => {
        return new Promise<void>((
          resolve: ((value?: void | PromiseLike<void> | undefined) => void),
          reject: ((reason?: Error) => void)
        ): void => reject(new Error('error')));
      });

      await expect(mongoDBService.save({
        save: saveMock
      })).rejects.toEqual(new Error('error'));
    });
  });

  describe('fetch', () => {
    it('should error if connection hasnt been called', async () => {
      await expect(mongoDBService.fetch('test', 'prop', 'value'))
        .rejects.toEqual(new Error('Mappings not set, connection must be called with a schema for this entity'));
    });

    it('should fail if entity doesnt exist', async () => {
      await mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }]);
      await expect(mongoDBService.fetch('test2', 'prop', 'value')).rejects.toEqual(new Error('Model doesnt exist'));
    });

    it('should call findById if fetch by id', async () => {
      await mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }]);
      const entity: string = await mongoDBService.fetch('test', 'id', 'value');
      expect(entity).toEqual('findById');
    });

    it('should call findOne if fetch by other props', async () => {
      await mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }]);
      const entity: string = await mongoDBService.fetch('test', 'prop', 'value');
      expect(entity).toEqual('findOne');
    });
  });
});
