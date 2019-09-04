import { RegisterService } from './register.service';
import { Observable, of } from 'rxjs';

describe('RegisterService', () => {
  let httpClient;
  let authService;
  let service: RegisterService;

  describe('success', () => {
    beforeEach(() => {
      httpClient = jasmine.createSpyObj('HttpClient', ['post']);
      httpClient.post.and.returnValue(of({
        token: 'token'
      }));
      authService = jasmine.createSpyObj('AuthService', ['setToken']);

      service = new RegisterService(httpClient, authService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should make a post request to the register api', () => {
      service.register('', '', '', '').subscribe(() => expect(httpClient.post).toHaveBeenCalled());
    });

    it('should send first name, last name, email and password to api', () => {
      service.register('first', 'last', 'email', '123456').subscribe(() => {
        expect(httpClient.post).toHaveBeenCalledWith(jasmine.any(String), {
          firstName: 'first',
          lastName: 'last',
          email: 'email',
          password: '123456'
        });
      });
    });

    it('should call authService setToken with token', () => {
      service.register('first', 'last', 'email', '123456').subscribe(() => {
        expect(authService.setToken).toHaveBeenCalledWith('token');
      });
    });

    it('should return true on success', () => {
      service.register('first', 'last', 'email', '123456').subscribe(success => {
        expect(success).toBeTruthy();
      });
    });
  });

  describe('failure', () => {
    beforeEach(() => {
      httpClient = jasmine.createSpyObj('HttpClient', ['post']);
      httpClient.post.and.returnValue(new Observable(observer => {
        observer.error();
      }));
      authService = jasmine.createSpyObj('AuthService', ['setToken']);

      service = new RegisterService(httpClient, authService);
    });

    it('should return false on failure', () => {
      service.register('first', 'last', 'email', '123456').subscribe(success => {
        expect(success).toBeFalsy();
      });
    });
  });
});
