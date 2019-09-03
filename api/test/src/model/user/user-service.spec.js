const chai = require('chai');
const sinon = require('sinon');

const UserService = require('../../../../src/model/user/user-service');

const expect = chai.expect;

describe('UserService class', () => {
  afterEach(() => sinon.restore());

  it('should store logger service', () => {
    const userService = new UserService(1, 2, 3, 4);

    expect(userService.loggerService).to.eq(1);
  });

  it('should store token service', () => {
    const userService = new UserService(1, 2, 3, 4);

    expect(userService.tokenService).to.eq(2);
  });

  it('should store db service', () => {
    const userService = new UserService(1, 2, 3, 4);

    expect(userService.dbService).to.eq(3);
  });

  it('should store password service', () => {
    const userService = new UserService(1, 2, 3, 4);

    expect(userService.passwordService).to.eq(4);
  });

  describe('register', () => {
    let loggerService;
    let tokenEncryptStub;
    let tokenService;
    let createStub;
    let getPropStub;
    let setPropSpy;
    let saveSpy;
    let dbService;
    let passwordEncryptStub;
    let passwordService;

    beforeEach(() => {
      loggerService = {};
      tokenEncryptStub = sinon.stub().resolves('token');
      tokenService = {
        encrypt: tokenEncryptStub
      };
      createStub = sinon.stub().resolves({id: 'id'});
      getPropStub = sinon.stub().returns('id');
      setPropSpy = sinon.spy();
      saveSpy = sinon.spy();
      dbService = {
        create: createStub,
        getProp: getPropStub,
        setProp: setPropSpy,
        save: saveSpy
      };
      passwordEncryptStub = sinon.stub().resolves('password');
      passwordService = {
        encrypt: passwordEncryptStub
      };
    });

    it('should create a new user', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .register('firstname', 'lastname', 'a@a.com', '123456')
        .then(() => {
          expect(createStub.callCount).to.eq(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should set first name', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .register('firstname', 'lastname', 'a@a.com', '123456')
        .then(() => {
          expect(setPropSpy.callCount).to.eq(6);
          expect(setPropSpy.args[0][1]).to.eq('firstName');
          expect(setPropSpy.args[0][2]).to.eq('firstname');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should set last name', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .register('firstname', 'lastname', 'a@a.com', '123456')
        .then(() => {
          expect(setPropSpy.callCount).to.eq(6);
          expect(setPropSpy.args[1][1]).to.eq('lastName');
          expect(setPropSpy.args[1][2]).to.eq('lastname');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should set email', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .register('firstname', 'lastname', 'a@a.com', '123456')
        .then(() => {
          expect(setPropSpy.callCount).to.eq(6);
          expect(setPropSpy.args[2][1]).to.eq('email');
          expect(setPropSpy.args[2][2]).to.eq('a@a.com');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should encrypt password', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .register('firstname', 'lastname', 'a@a.com', '123456')
        .then(() => {
          expect(passwordEncryptStub.callCount).to.eq(1);
          expect(passwordEncryptStub.args[0][0]).to.eq('123456');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should set encrypted password', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .register('firstname', 'lastname', 'a@a.com', '123456')
        .then(() => {
          expect(setPropSpy.callCount).to.eq(6);
          expect(setPropSpy.args[3][1]).to.eq('password');
          expect(setPropSpy.args[3][2]).to.eq('password');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should get id for newly created user', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .register('firstname', 'lastname', 'a@a.com', '123456')
        .then(() => {
          expect(getPropStub.callCount).to.eq(1);
          expect(getPropStub.args[0][1]).to.eq('id');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should encrypt token', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .register('firstname', 'lastname', 'a@a.com', '123456')
        .then(() => {
          expect(tokenEncryptStub.callCount).to.eq(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should set token', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .register('firstname', 'lastname', 'a@a.com', '123456')
        .then(() => {
          expect(setPropSpy.callCount).to.eq(6);
          expect(setPropSpy.args[4][1]).to.eq('token');
          expect(setPropSpy.args[4][2]).to.eq('token');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should set last login', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .register('firstname', 'lastname', 'a@a.com', '123456')
        .then(() => {
          expect(setPropSpy.callCount).to.eq(6);
          expect(setPropSpy.args[5][1]).to.eq('lastLogin');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should save', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .register('firstname', 'lastname', 'a@a.com', '123456')
        .then(() => {
          expect(saveSpy.callCount).to.eq(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should return token', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .register('firstname', 'lastname', 'a@a.com', '123456')
        .then(token => {
          expect(token).to.eq('token');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });
  });

  describe('login', () => {
    let loggerService;
    let tokenEncryptStub;
    let tokenService;
    let getPropStub;
    let setPropSpy;
    let saveSpy;
    let fetchStub;
    let dbService;
    let passwordEncryptStub;
    let compareStub;
    let passwordService;

    beforeEach(() => {
      loggerService = {};
      tokenEncryptStub = sinon.stub().resolves('token');
      tokenService = {
        encrypt: tokenEncryptStub
      };
      getPropStub = sinon.stub()
        .onFirstCall().returns('password')
        .onSecondCall().returns('id');
      setPropSpy = sinon.spy();
      saveSpy = sinon.spy();
      fetchStub = sinon.stub().resolves({});
      dbService = {
        getProp: getPropStub,
        setProp: setPropSpy,
        save: saveSpy,
        fetch: fetchStub
      };
      passwordEncryptStub = sinon.stub().resolves('password');
      compareStub = sinon.stub().resolves(true);
      passwordService = {
        encrypt: passwordEncryptStub,
        compare: compareStub
      };
    });

    it('should fetch user for email', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .login('a@a.com', '123456')
        .then(() => {
          expect(fetchStub.callCount).to.eq(1);
          expect(fetchStub.args[0][1]).to.eq('email');
          expect(fetchStub.args[0][2]).to.eq('a@a.com');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should get password from user', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .login('a@a.com', '123456')
        .then(() => {
          expect(getPropStub.callCount).to.eq(2);
          expect(getPropStub.args[0][1]).to.eq('password');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should compare passwords', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .login('a@a.com', '123456')
        .then(() => {
          expect(compareStub.callCount).to.eq(1);
          expect(compareStub.args[0][0]).to.eq('123456');
          expect(compareStub.args[0][1]).to.eq('password');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should get user id', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .login('a@a.com', '123456')
        .then(() => {
          expect(getPropStub.callCount).to.eq(2);
          expect(getPropStub.args[1][1]).to.eq('id');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should generate token for user id', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .login('a@a.com', '123456')
        .then(() => {
          expect(tokenEncryptStub.callCount).to.eq(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should set token', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .login('a@a.com', '123456')
        .then(() => {
          expect(setPropSpy.callCount).to.eq(2);
          expect(setPropSpy.args[0][1]).to.eq('token');
          expect(setPropSpy.args[0][2]).to.eq('token');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should set last login', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .login('a@a.com', '123456')
        .then(() => {
          expect(setPropSpy.callCount).to.eq(2);
          expect(setPropSpy.args[1][1]).to.eq('lastLogin');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should save', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .login('a@a.com', '123456')
        .then(() => {
          expect(saveSpy.callCount).to.eq(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should return token', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .login('a@a.com', '123456')
        .then(token => {
          expect(token).to.eq('token');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    describe('passwords dont match', () => {
      let loggerService;
      let tokenEncryptStub;
      let tokenService;
      let getPropStub;
      let setPropSpy;
      let saveSpy;
      let fetchStub;
      let dbService;
      let passwordEncryptStub;
      let compareStub;
      let passwordService;

      beforeEach(() => {
        loggerService = {};
        tokenEncryptStub = sinon.stub().resolves('token');
        tokenService = {
          encrypt: tokenEncryptStub
        };
        getPropStub = sinon.stub()
          .onFirstCall().returns('password')
          .onSecondCall().returns('id');
        setPropSpy = sinon.spy();
        saveSpy = sinon.spy();
        fetchStub = sinon.stub().resolves({});
        dbService = {
          getProp: getPropStub,
          setProp: setPropSpy,
          save: saveSpy,
          fetch: fetchStub
        };
        passwordEncryptStub = sinon.stub().resolves('password');
        compareStub = sinon.stub().resolves(false);
        passwordService = {
          encrypt: passwordEncryptStub,
          compare: compareStub
        };
      });

      it('should throw if passwords dont match', done => {
        const userService = new UserService(loggerService, tokenService, dbService, passwordService);

        userService
          .login('a@a.com', '123456')
          .then(() => done('Invoked then block'))
          .catch(() => done());
      });
    });

    describe('passwords dont match', () => {
      let loggerService;
      let tokenEncryptStub;
      let tokenService;
      let getPropStub;
      let setPropSpy;
      let saveSpy;
      let fetchStub;
      let dbService;
      let passwordEncryptStub;
      let compareStub;
      let passwordService;

      beforeEach(() => {
        loggerService = {};
        tokenEncryptStub = sinon.stub().resolves('token');
        tokenService = {
          encrypt: tokenEncryptStub
        };
        getPropStub = sinon.stub()
          .onFirstCall().returns('password')
          .onSecondCall().returns('id');
        setPropSpy = sinon.spy();
        saveSpy = sinon.spy();
        fetchStub = sinon.stub().resolves();
        dbService = {
          getProp: getPropStub,
          setProp: setPropSpy,
          save: saveSpy,
          fetch: fetchStub
        };
        passwordEncryptStub = sinon.stub().resolves('password');
        compareStub = sinon.stub().resolves(false);
        passwordService = {
          encrypt: passwordEncryptStub,
          compare: compareStub
        };
      });

      it('should throw if no user', done => {
        const userService = new UserService(loggerService, tokenService, dbService, passwordService);

        userService
          .login('a@a.com', '123456')
          .then(() => done('Invoked then block'))
          .catch(() => done());
      });
    });
  });

  describe('logout', () => {
    let loggerService;
    let tokenService;
    let setPropSpy;
    let dbService;
    let passwordService;

    beforeEach(() => {
      loggerService = {};
      tokenService = {};
      setPropSpy = sinon.spy();
      saveSpy = sinon.spy();
      dbService = {
        setProp: setPropSpy,
        save: saveSpy
      };
      passwordService = {};
    });

    it('should clear user token', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .logout('a@a.com', '123456')
        .then(() => {
          expect(setPropSpy.callCount).to.eq(1);
          expect(setPropSpy.args[0][1]).to.eq('token');
          expect(setPropSpy.args[0][2]).to.eq(undefined);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should save', done => {
      const userService = new UserService(loggerService, tokenService, dbService, passwordService);

      userService
        .logout('a@a.com', '123456')
        .then(() => {
          expect(saveSpy.callCount).to.eq(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });
  });
});
