import { LoginService } from './login.service';
import { Observable, of } from 'rxjs';

describe('LoginService', () => {
  let httpClient;
  let authService;
  let service: LoginService;

  describe('success', () => {
    beforeEach(() => {
      httpClient = jasmine.createSpyObj('HttpClient', ['post']);
      httpClient.post.and.returnValue(of({
        token: 'token'
      }));
      authService = jasmine.createSpyObj('AuthService', ['setToken']);

      service = new LoginService(httpClient, authService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should make a post request to the login api', () => {
      service.login('', '').subscribe(() => expect(httpClient.post).toHaveBeenCalled());
    });

    it('should send email and password to api', () => {
      service.login('email', '123456').subscribe(() => {
        expect(httpClient.post).toHaveBeenCalledWith(jasmine.any(String), {
          email: 'email',
          password: '123456'
        });
      });
    });

    it('should call authService setToken with token', () => {
      service.login('email', '123456').subscribe(() => {
        expect(authService.setToken).toHaveBeenCalledWith('token');
      });
    });

    it('should return true on success', () => {
      service.login('email', '123456').subscribe(success => {
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

      service = new LoginService(httpClient, authService);
    });

    it('should return false on failure', () => {
      service.login('email', '123456').subscribe(success => {
        expect(success).toBeFalsy();
      });
    });
  });
});
