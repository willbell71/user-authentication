const chai = require('chai');
const sinon = require('sinon');

const mongoose = require('mongoose');

const MongoDBService = require('../../../../src/services/db/mongo-db-service');

const DBServiceFactory = require('../../../../src/services/db/db-service-factory');

const expect = chai.expect;

describe('DBServiceFactory class', () => {
  afterEach(() => sinon.restore());

  it('should return a mongo instance for type mongo', () => {
    sinon.replace(mongoose, 'connect', sinon.stub().resolves(''));

    const dbService = DBServiceFactory.createDBService('mongo', {
      info: () => {},
      error: () => {}
    });

    expect(dbService instanceof MongoDBService).to.eq(true);
  });

  it('should log and throw for unknown type', () => {
    const spy = sinon.spy();
    const logger = {
      error: spy
    };

    expect(() => DBServiceFactory.createDBService('', logger)).to.throw();
    expect(spy.callCount).to.eq(1);
  });
});
