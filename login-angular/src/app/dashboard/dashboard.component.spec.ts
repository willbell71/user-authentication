import { DashboardComponent } from './dashboard.component';
import { Observable, of } from 'rxjs';

describe('DashboardComponent', () => {
  let contentService;
  let logoutService;
  let router;
  let component: DashboardComponent;
  let event;

  beforeEach(() => {
    contentService = jasmine.createSpyObj('ContentService', ['getContent']);
    contentService.getContent.and.returnValue(of({
      title: 'title',
      body: 'body'
    }));
    logoutService = jasmine.createSpyObj('LogoutService', ['logout']);
    logoutService.logout.and.returnValue(of(true));
    router = jasmine.createSpyObj('Router', ['navigate']);

    component = new DashboardComponent(contentService, logoutService, router);

    event = jasmine.createSpyObj('Event', ['preventDefault']);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('getSomething', () => {
    it('should call getContent', () => {
      component.getSomething();

      expect(contentService.getContent).toHaveBeenCalled();
    });

    it('should set title', () => {
      component.getSomething();

      expect(component.title).toEqual('title');
    });

    it('should set body', () => {
      component.getSomething();

      expect(component.body).toEqual('body');
    });
  });

  describe('logout', () => {
    it('should call logout', () => {
      component.logout();

      expect(logoutService.logout).toHaveBeenCalled();
    });

    it('should navigate to login', () => {
      component.logout();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
