import { LogoutService } from './logout.service';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

describe('LogoutService', () => {
  let httpClient;
  let authService;
  let service: LogoutService;

  describe('success', () => {
    beforeEach(() => {
      httpClient = jasmine.createSpyObj('HttpClient', ['get']);
      httpClient.get.and.returnValue(of({}));
      authService = jasmine.createSpyObj('AuthService', ['setToken']);

      service = new LogoutService(httpClient, authService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should make a get request to the logout api', () => {
      service.logout('').subscribe(() => expect(httpClient.get).toHaveBeenCalled());
    });

    it('should send token to api', () => {
      service.logout('token').subscribe(() => {
        expect(httpClient.get).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Object));
      });
    });

    it('should call authService setToken with undefined', () => {
      service.logout('').subscribe(() => {
        expect(authService.setToken).toHaveBeenCalledWith();
      });
    });

    it('should return true on success', () => {
      service.logout('').subscribe(success => {
        expect(success).toBeTruthy();
      });
    });
  });

  describe('failure', () => {
    beforeEach(() => {
      httpClient = jasmine.createSpyObj('HttpClient', ['get']);
      httpClient.get.and.returnValue(new Observable(observer => {
        observer.error();
      }));
      authService = jasmine.createSpyObj('AuthService', ['setToken']);

      service = new LogoutService(httpClient, authService);
    });

    it('should return false on failure', () => {
      service.logout('').subscribe(success => {
        expect(success).toBeFalsy();
      });
    });
  });
});
