import { LoginComponent } from './login.component';
import { Observable, of } from 'rxjs';

describe('LoginComponent', () => {
  let formValidationService;
  let loginService;
  let router;
  let component: LoginComponent;
  let event;

  describe('login', () => {
    describe('success', () => {
      beforeEach(() => {
        formValidationService = jasmine.createSpyObj('FormValidationService', ['validator']);
        formValidationService.validator.and.returnValue(true);
        loginService = jasmine.createSpyObj('LoginService', ['login']);
        loginService.login.and.returnValue(of(true));
        router = jasmine.createSpyObj('Router', ['navigate']);

        component = new LoginComponent(formValidationService, loginService, router);

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

        it('should run validation', () => {
          component.login(event);

          expect(formValidationService.validator).toHaveBeenCalled();
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
          formValidationService = jasmine.createSpyObj('FormValidationService', ['validator']);
          formValidationService.validator.and.returnValue(true);
          loginService = jasmine.createSpyObj('LoginService', ['login']);
          loginService.login.and.returnValue(of(false));
          router = jasmine.createSpyObj('Router', ['navigate']);

          component = new LoginComponent(formValidationService, loginService, router);

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
          formValidationService = jasmine.createSpyObj('FormValidationService', ['validator']);
          formValidationService.validator.and.returnValue(true);
          loginService = jasmine.createSpyObj('LoginService', ['login']);
          loginService.login.and.returnValue(new Observable(observer => {
            observer.error();
          }));
          router = jasmine.createSpyObj('Router', ['navigate']);

          component = new LoginComponent(formValidationService, loginService, router);

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
