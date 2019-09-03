const chai = require('chai');
const sinon = require('sinon');

const DBService = require('../../../../src/services/db/db-service');

const expect = chai.expect;

describe('DBService class', () => {
  afterEach(() => sinon.restore());

  it('should store logger', () => {
    const service = new DBService(1, 2);

    expect(service.logger).to.eq(1);
  });

  it('should store mappings', () => {
    const service = new DBService(1, 2);

    expect(service.mappings).to.eq(2);
  });

  describe('create', () => {
    it('should throw an exception', done => {
      const service = new DBService();

      service
        .create()
        .then(() => done('Called then on error'))
        .catch(() => done());
    });
  });

  describe('getProp', () => {
    it('should return false', () => {
      const service = new DBService();

      expect(service.getProp()).to.eq(false);
    });
  });

  describe('save', () => {
    it('should throw an exception', done => {
      const service = new DBService();

      service
        .save()
        .then(() => done('Called then on error'))
        .catch(() => done());
    });
  });

  describe('fetch', () => {
    it('should throw an exception', done => {
      const service = new DBService();

      service
        .fetch()
        .then(() => done('Called then on error'))
        .catch(() => done());
    });
  });
});
