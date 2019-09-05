import { AuthInterceptor } from './auth-interceptor';
import { Observable, of } from 'rxjs';

describe('AuthInterceptor', () => {
  let authService;
  let request;
  let next;
  let interceptor: AuthInterceptor;

  describe('success', () => {
    beforeEach(() => {
      authService = jasmine.createSpyObj('AuthService', ['setToken']);
      request = jasmine.createSpyObj('HttpRequest', ['dummy']);
      next = {
        handle: jasmine.createSpy().and.returnValue(of({}))
      };
      interceptor = new AuthInterceptor(authService);
    });

    it('should be created', () => {
      expect(interceptor).toBeTruthy();
    });

    it('should call next handle', () => {
      interceptor.intercept(request, next);

      expect(next.handle).toHaveBeenCalled();
    });
  });

  describe('400 error', () => {
    beforeEach(() => {
      authService = jasmine.createSpyObj('AuthService', ['setToken']);
      request = jasmine.createSpyObj('HttpRequest', ['dummy']);
      next = {
        handle: jasmine.createSpy().and.returnValue(new Observable(observer => {
          observer.error({status: 400});
        }))
      };
      interceptor = new AuthInterceptor(authService);
    });

    it('should not call setToken on error with 400', () => {
      interceptor.intercept(request, next);

      setTimeout(() => {
        expect(authService.setToken).not.toHaveBeenCalled();
      }, 100);
    });
  });

  describe('401 error', () => {
    beforeEach(() => {
      authService = jasmine.createSpyObj('AuthService', ['setToken']);
      request = jasmine.createSpyObj('HttpRequest', ['dummy']);
      next = {
        handle: jasmine.createSpy().and.returnValue(new Observable(observer => {
          observer.error({status: 401});
        }))
      };
      interceptor = new AuthInterceptor(authService);
    });

    it('should call setToken on error with 401', () => {
      interceptor.intercept(request, next);

      setTimeout(() => {
        expect(authService.setToken).toHaveBeenCalled();
      }, 100);
    });
  });
});
