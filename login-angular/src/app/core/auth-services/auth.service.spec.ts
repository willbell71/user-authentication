import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should report not authenticated before setting a token', () => {
    expect(service.isAuthenticated()).toBeFalsy();
  });

  it('should set a token', () => {
    service.setToken('token');
    expect(service.isAuthenticated()).toBeTruthy();
  });

  it('should get a token', () => {
    service.setToken('token');

    expect(service.getToken()).toEqual('token');
  });
});
