import { AuthService } from './auth.service';

describe('AuthService', () => {
  let router;
  let sessionStorageService;
  let service: AuthService;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['parseUrl']);
    sessionStorageService = jasmine.createSpyObj('SessionStorageService', ['setItem', 'getItem', 'removeItem']);
    sessionStorageService.getItem.and.returnValue(null);

    service = new AuthService(router, sessionStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be have called getItem', () => {
    expect(sessionStorageService.getItem).toHaveBeenCalledWith('token');
  });

  describe('isAuthenticated', () => {
    it('should report not authenticated before setting a token', () => {
      expect(service.isAuthenticated()).toBeFalsy();
    });
  });

  describe('setToken', () => {
    it('should set a token', () => {
      service.setToken('token');

      expect(service.isAuthenticated()).toBeTruthy();
    });

    it('should store token on set', () => {
      service.setToken('token');

      expect(sessionStorageService.setItem).toHaveBeenCalledWith('token', 'token');
    });

    it('should remove token on clear', () => {
      service.setToken();

      expect(sessionStorageService.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('getToken', () => {
    it('should get a token', () => {
      service.setToken('token');

      expect(service.getToken()).toEqual('token');
    });
  });

  describe('canActivate', () => {
    it('should return true if authenticated', () => {
      service.setToken('token');

      service.canActivate(null, null)
        .subscribe(allowed => expect(allowed).toEqual(true), () => expect(true).toBeFalsy());
    });

    it('should navigate if not authenticated', () => {
      service.setToken(null);

      service.canActivate(null, null)
        .subscribe(() => expect(router.parseUrl).toHaveBeenCalledWith('/login'), () => expect(true).toBeFalsy());
    });
  });
});
