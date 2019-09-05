import { LogoutService } from './logout.service';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

describe('LogoutService', () => {
  let httpClient;
  let authService;
  let service: LogoutService;

  describe('success', () => {
    beforeEach(() => {
      httpClient = jasmine.createSpyObj('HttpClient', ['post']);
      httpClient.post.and.returnValue(of({}));
      authService = jasmine.createSpyObj('AuthService', ['getToken', 'setToken']);
      authService.getToken.and.returnValue('token');

      service = new LogoutService(authService, httpClient);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should make a post request to the logout api', () => {
      service.logout().subscribe(() => expect(httpClient.post).toHaveBeenCalled());
    });

    it('should send token to api', () => {
      service.logout().subscribe(() => {
        expect(httpClient.post).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Object), jasmine.any(Object));
      });
    });

    it('should call authService setToken with undefined', () => {
      service.logout().subscribe(() => {
        expect(authService.setToken).toHaveBeenCalledWith();
      });
    });

    it('should return true on success', () => {
      service.logout().subscribe(success => {
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
      authService = jasmine.createSpyObj('AuthService', ['getToken', 'setToken']);
      authService.getToken.and.returnValue('token');

      service = new LogoutService(authService, httpClient);
    });

    it('should return false on failure', () => {
      service.logout().subscribe(success => {
        expect(success).toBeFalsy();
      });
    });
  });
});
