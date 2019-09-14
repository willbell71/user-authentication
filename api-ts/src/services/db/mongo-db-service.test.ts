import * as mongoose from 'mongoose';

import { ILogger } from '../logger/ilogger';
import { ILogLine } from '../logger/ilog-line';
import { Logger } from '../logger/logger';
import { MongoDBService } from './mongo-db-service';

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
afterEach(() => {
  jest.restoreAllMocks();
  (mongoose.connect as jest.Mock).mockClear();
  (mongoose.model as jest.Mock).mockClear();
  (mongoose.Schema as unknown as jest.Mock).mockClear();
  (mongoose.Model as unknown as jest.Mock).mockClear();
});

describe('MongoDBService', () => {
  describe('connect', () => {
    it('should call mongoose connect', (done: jest.DoneCallback) => {
      mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }])
        .then(() => {
          expect(mongoose.connect).toHaveBeenCalled();
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should log log on successful connect', (done: jest.DoneCallback) => {
      mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }])
        .then(() => {
          expect(logLineSpy).toHaveBeenCalled();
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should log error on failed connect', (done: jest.DoneCallback) => {
      mongoDBService.connect(logger, '', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }])
        .then(() => done('Invoked done block'))
        .catch(() => {
          expect(errorLineSpy).toHaveBeenCalled();
          done();
        });
    });

    it('should call mongoose Schema for each entity', (done: jest.DoneCallback) => {
      mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }])
        .then(() => {
          expect(mongoose.Schema).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should call mongoose Model for each entity', (done: jest.DoneCallback) => {
      mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }])
        .then(() => {
          expect(mongoose.model).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });
  });

  describe('create', () => {
    it('should instance new entity', (done: jest.DoneCallback) => {
      mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }])
        .then(() => {
          mongoDBService.create('test')
            .then((entity: string) => {
              expect(entity).toBeTruthy();
              done();
            })
            .catch(() => done('Invoked catch block'));
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should error if connection hasnt been called', (done: jest.DoneCallback) => {
      mongoDBService.create('test')
        .then(() => done('Invoked then block'))
        .catch((err: Error) => {
          expect(err.message).toEqual('Mappings not set, connection must be called with a schema for this entity');
          done();
        });
    });

    it('should error if entity doesnt exist', (done: jest.DoneCallback) => {
      mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }])
        .then(() => {
          mongoDBService.create('test2')
            .then(() => done('Invoked then block'))
            .catch((err: Error) => {
              expect(err.message).toEqual('Model doesnt exist');
              done();
            });
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should error if entity doesnt exist', (done: jest.DoneCallback) => {
      mongoDBService.connect(logger, 'connect', [{
        name: 's',
        schemaDefinition: {
          test: String
        }
      }])
        .then(() => {
          mongoDBService.create('s')
            .then(() => done('Invoked then block'))
            .catch((err: Error) => {
              expect(err.message).toEqual('Failed to instantiate new entity');
              done();
            });
        })
        .catch(() => done('Invoked catch block'));
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
    it('should call entity save', (done: jest.DoneCallback) => {
      const saveMock: jest.Mock = jest.fn().mockImplementation(() => {
        return new Promise<void>((
          resolve: ((value?: void | PromiseLike<void> | undefined) => void)
        ): void => resolve());
      });
      mongoDBService.save({
        save: saveMock
      })
        .then(() => {
          expect(saveMock).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should throw error if save fails', (done: jest.DoneCallback) => {
      const saveMock: jest.Mock = jest.fn().mockImplementation(() => {
        return new Promise<void>((
          resolve: ((value?: void | PromiseLike<void> | undefined) => void),
          reject: ((reason?: Error) => void)
        ): void => reject());
      });
      mongoDBService.save({
        save: saveMock
      })
        .then(() => done('Invoked then block'))
        .catch(() => done());
    });
  });

  describe('fetch', () => {
    it('should error if connection hasnt been called', (done: jest.DoneCallback) => {
      mongoDBService.fetch('test', 'prop', 'value')
        .then(() => done('Invoked then block'))
        .catch((err: Error) => {
          expect(err.message).toEqual('Mappings not set, connection must be called with a schema for this entity');
          done();
        });
    });
    
    it('should fail if entity doesnt exist', (done: jest.DoneCallback) => {
      mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }])
        .then(() => {
          mongoDBService.fetch('test2', 'prop', 'value')
            .then(() => done('Invoked then block'))
            .catch((err: Error) => {
              expect(err.message).toEqual('Model doesnt exist');
              done();
            });
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should call findById if fetch by id', (done: jest.DoneCallback) => {
      mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }])
        .then(() => {
          mongoDBService.fetch('test', 'id', 'value')
            .then((entity: string) => {
              expect(entity).toEqual('findById');
              done();
            })
            .catch(() => done('Invoked catch block'));
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should call findOne if fetch by other props', (done: jest.DoneCallback) => {
      mongoDBService.connect(logger, 'connect', [{
        name: 'test',
        schemaDefinition: {
          test: String
        }
      }])
        .then(() => {
          mongoDBService.fetch('test', 'prop', 'value')
            .then((entity: string) => {
              expect(entity).toEqual('findOne');
              done();
            })
            .catch(() => done('Invoked catch block'));
        })
        .catch(() => done('Invoked catch block'));
    });
  });
});
