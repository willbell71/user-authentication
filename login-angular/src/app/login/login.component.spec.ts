import { LoginComponent } from './login.component';
import { Observable, of } from 'rxjs';

describe('LoginComponent', () => {
  let router;
  let loginService;
  let component: LoginComponent;
  let event;

  describe('login', () => {
    describe('success', () => {
      beforeEach(() => {
        router = jasmine.createSpyObj('Router', ['navigate']);
        loginService = jasmine.createSpyObj('LoginService', ['login']);
        loginService.login.and.returnValue(of(true));

        component = new LoginComponent(loginService, router);

        event = jasmine.createSpyObj('Event', ['preventDefault']);
      });

      it('should be created', () => {
        expect(component).toBeTruthy();
      });

      describe('login', () => {
        it('should prevent default on event', () => {
          component.login(event);

          expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should set email error message', () => {
          component.errors.email = '';
          component.formValues.email = '';

          component.login(event);

          expect(component.errors.email).toEqual(jasmine.any(String));
          expect(component.errors.email.length).toBeGreaterThan(0);
        });

        it('should set password error message', () => {
          component.errors.email = '';
          component.errors.password = '';
          component.formValues.email = 'a@a.com';
          component.formValues.password = '';

          component.login(event);

          expect(component.errors.password).toEqual(jasmine.any(String));
          expect(component.errors.password.length).toBeGreaterThan(0);
        });

        it('should call login with form values', () => {
          component.formValues.email = 'a@a.com';
          component.formValues.password = '123';

          component.login(event);

          expect(loginService.login).toHaveBeenCalledWith('a@a.com', '123');
        });

        it('should navigate on success', () => {
          component.formValues.email = 'a@a.com';
          component.formValues.password = '123';

          component.login(event);

          expect(router.navigate).toHaveBeenCalled();
        });
      });

      describe('failure', () => {
        beforeEach(() => {
          router = jasmine.createSpyObj('Router', ['navigate']);
          loginService = jasmine.createSpyObj('LoginService', ['login']);
          loginService.login.and.returnValue(of(false));

          component = new LoginComponent(loginService, router);

          event = jasmine.createSpyObj('Event', ['preventDefault']);
        });

        it('should set login error on failure', () => {
          component.formValues.email = 'a@a.com';
          component.formValues.password = '123';

          component.errors.login = '';

          component.login(event);

          expect(component.errors.login).toEqual(jasmine.any(String));
          expect(component.errors.login.length).toBeGreaterThan(0);
        });
      });

      describe('failure', () => {
        beforeEach(() => {
          router = jasmine.createSpyObj('Router', ['navigate']);
          loginService = jasmine.createSpyObj('LoginService', ['login']);
          loginService.login.and.returnValue(new Observable(observer => {
            observer.error();
          }));

          component = new LoginComponent(loginService, router);

          event = jasmine.createSpyObj('Event', ['preventDefault']);
        });

        it('should set login error on endpoint error', () => {
          component.formValues.email = 'a@a.com';
          component.formValues.password = '123';

          component.errors.login = '';

          component.login(event);

          expect(component.errors.login).toEqual(jasmine.any(String));
          expect(component.errors.login.length).toBeGreaterThan(0);
        });
      });
    });
  });
});
