const chai = require('chai');
const sinon = require('sinon');

const mongoose = require('mongoose');

const MongoDBService = require('../../../../src/services/db/mongo-db-service');

const expect = chai.expect;

describe('MongoDBService class', () => {
  afterEach(() => sinon.restore());

  let infoLogSpy;
  let logger;
  let connection;
  let mappings;
  let connectStub;
  let schemaStub;
  let modelStub;
  let dbService;

  beforeEach(() => {
    sinon.restore();

    infoLogSpy = sinon.spy();
    logger = {
      info: infoLogSpy
    };
    connection = {};
    mappings = [{
      name: 'User',
      schema: {}
    }, {
      name: 'Project',
      schema: {}
    }];

    connectStub = sinon.stub().resolves('');
    schemaStub = sinon.stub();
    modelStub = sinon.stub().returns(function() {});

    sinon.replace(mongoose, 'connect', connectStub);
    sinon.replace(mongoose, 'Schema', schemaStub);
    sinon.replace(mongoose, 'model', modelStub);

    dbService = new MongoDBService(logger, connection, mappings);
  });

  it('should call mongoose connect', () => {
    expect(connectStub.callCount).to.eq(1);
  });

  it('should log on success', done => {
    setTimeout(() => {
      expect(infoLogSpy.callCount).to.eq(1);
      done();
    }, 100);
  });

  it('should create a schema for each mapping passed', () => {
    expect(schemaStub.callCount).to.eq(2);
  });

  it('should create a model for each mapping passed', () => {
    expect(modelStub.callCount).to.eq(2);
  });

  describe('failure', () => {
    let infoLogSpy;
    let errorLogSpy;
    let logger;
    let connection;
    let mappings;
    let connectStub;
    let schemaStub;
    let modelStub;

    beforeEach(() => {
      sinon.restore();

      infoLogSpy = sinon.spy();
      errorLogSpy = sinon.spy();
      logger = {
        info: infoLogSpy,
        error: errorLogSpy
      };
      connection = {};
      mappings = [{
        name: 'User',
        schema: {}
      }, {
        name: 'Project',
        schema: {}
      }];

      connectStub = sinon.stub().rejects('');
      schemaStub = sinon.stub();
      modelStub = sinon.stub().returns(function() {});

      sinon.replace(mongoose, 'connect', connectStub);
      sinon.replace(mongoose, 'Schema', schemaStub);
      sinon.replace(mongoose, 'model', modelStub);

      new MongoDBService(logger, connection, mappings);
    });

    it('should log error on failure', done => {
      setTimeout(() => {
        expect(errorLogSpy.callCount).to.eq(1);
        done();
      }, 100);
    });
  });

  describe('create', () => {
    it('should throw if mapping doesnt exist', done => {
      dbService.create('UserA')
        .then(() => done('Invoked the then block'))
        .catch(() => done());
    });

    it('should instance a new entity', done => {
      dbService.create('User')
        .then(entity => {
          expect(entity).is.not.undefined;
          done();
        })
        .catch(() => done('Invoked the catch block'));
    });

    it('should return new entity on success', done => {
      dbService.create('User')
        .then(entity => {
          expect(entity).to.not.eq(undefined);
          done();
        })
        .catch(() => done('Invoked the catch block'));
    });

    describe('failure', () => {
      let infoLogSpy;
      let logger;
      let connection;
      let mappings;
      let connectStub;
      let schemaStub;
      let modelStub;
      let dbService;

      beforeEach(() => {
        sinon.restore();

        infoLogSpy = sinon.spy();
        logger = {
          info: infoLogSpy
        };
        connection = {};
        mappings = [{
          name: 'User',
          schema: {}
        }, {
          name: 'Project',
          schema: {}
        }];

        connectStub = sinon.stub().resolves('');
        schemaStub = sinon.stub();
        modelStub = sinon.stub();

        sinon.replace(mongoose, 'connect', connectStub);
        sinon.replace(mongoose, 'Schema', schemaStub);
        sinon.replace(mongoose, 'model', modelStub);

        dbService = new MongoDBService(logger, connection, mappings);
      });

      it('should throw error if cant instantiate', done => {
        dbService.create('User')
          .then(entity => done('Invoked then block'))
          .catch(() => done());
      });
    });
  });

  describe('setProp', () => {
    it('should set the value for the property on the entity, if entity exists', () => {
      const entity = {};

      dbService.setProp(entity, 'label', 'title');

      expect(entity.label).to.eq('title');
    });

    it('should do nothing if no entity', () => {
      expect(dbService.setProp(undefined, 'label', 'title')).to.eq(undefined);
    });
  });

  describe('getProp', () => {
    it('should return the value for the property', () => {
      const value = dbService.getProp({label: 'test'}, 'label');

      expect(value).to.eq('test');
    });

    it('should return nothing if no entity', () => {
      const value = dbService.getProp(undefined, 'label');

      expect(value).to.eq(undefined);
    });
  });

  describe('save', () => {
    it('should save the entity if it exists', done => {
      dbService.save({
        save: () => {}
      })
        .then(() => done())
        .catch(() => done('Invoked catch block'));
    });

    it('should throw an exception if saving fails', done => {
      dbService.save()
        .then(() => done('Invoked then block'))
        .catch(() => done());
    });
  });

  describe('fetch', () => {
    it('should call findById if an id is passed, with the id, and return the entity', done => {
      const findByIdStub = sinon.stub().resolves('fetched entity');
      dbService.mongooseMappings['User'] = {
        model: {
          findById: findByIdStub
        }
      };

      dbService.fetch('User', 'id', 'banana')
        .then(entity => {
          expect(findByIdStub.callCount).to.eq(1);
          expect(entity).to.eq('fetched entity');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should call findOne if a property other than id is passed, with the property name and value and return the entity', done => {
      const findOneStub = sinon.stub().resolves('fetched entity');
      dbService.mongooseMappings['User'] = {
        model: {
          findOne: findOneStub
        }
      };

      dbService.fetch('User', 'name', 'banana')
        .then(entity => {
          expect(findOneStub.callCount).to.eq(1);
          expect(entity).to.eq('fetched entity');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should throw if entity doesnt exist', done => {
      dbService.fetch()
        .then(() => done('Invoked then block'))
        .catch(() => done());
    });
  });
});
