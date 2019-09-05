import { ContentService } from './content.service';
import { Observable, of } from 'rxjs';

describe('ContentService', () => {
  let httpClient;
  let authService;
  let service: ContentService;

  describe('success', () => {
    beforeEach(() => {
      httpClient = jasmine.createSpyObj('HttpClient', ['get']);
      httpClient.get.and.returnValue(of({
        title: 'title',
        body: 'body'
      }));
      authService = jasmine.createSpyObj('AuthService', ['getToken']);
      authService.getToken.and.returnValue('token');

      service = new ContentService(authService, httpClient);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should make a get request to the getsomething api', () => {
      service.getContent().subscribe(() => expect(httpClient.get).toHaveBeenCalled());
    });

    it('should call authService getToken', () => {
      service.getContent().subscribe(() => {
        expect(authService.getToken).toHaveBeenCalled();
      });
    });

    it('should return response on success', () => {
      service.getContent().subscribe(response => {
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

      service = new ContentService(authService, httpClient);
    });

    it('should invoke error on failure', () => {
      service.getContent().subscribe(success => {
        expect(true).toBeFalsy();
      }, () => {
        expect(true).toBeTruthy();
      });
    });
  });
});
