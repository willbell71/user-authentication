import { GetSomethingService } from './get-something.service';
import { Observable, of } from 'rxjs';

describe('GetSomethingService', () => {
  let httpClient;
  let authService;
  let service: GetSomethingService;

  describe('success', () => {
    beforeEach(() => {
      httpClient = jasmine.createSpyObj('HttpClient', ['get']);
      httpClient.get.and.returnValue(of({
        title: 'title',
        body: 'body'
      }));
      authService = jasmine.createSpyObj('AuthService', ['getToken']);
      authService.getToken.and.returnValue('token');

      service = new GetSomethingService(httpClient, authService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should make a get request to the getsomething api', () => {
      service.getSomething().subscribe(() => expect(httpClient.get).toHaveBeenCalled());
    });

    it('should call authService getToken', () => {
      service.getSomething().subscribe(() => {
        expect(authService.getToken).toHaveBeenCalled();
      });
    });

    it('should return response on success', () => {
      service.getSomething().subscribe(response => {
        expect(response).toEqual({
          title: 'title',
          body: 'body'
        });
      });
    });
  });

  describe('failure', () => {
    beforeEach(() => {
      httpClient = jasmine.createSpyObj('HttpClient', ['get']);
      httpClient.get.and.returnValue(new Observable(observer => {
        observer.error();
      }));
      authService = jasmine.createSpyObj('AuthService', ['getToken']);
      authService.getToken.and.returnValue('token');

      service = new GetSomethingService(httpClient, authService);
    });

    it('should invoke error on failure', () => {
      service.getSomething().subscribe(success => {
        expect(true).toBeFalsy();
      }, () => {
        expect(true).toBeTruthy();
      });
    });
  });
});
