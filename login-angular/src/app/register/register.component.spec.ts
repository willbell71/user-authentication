import { RegisterComponent } from './register.component';
import { Observable, of } from 'rxjs';

describe('RegisterComponent', () => {
  let formValidationService;
  let registerService;
  let router;
  let component: RegisterComponent;
  let event;

  describe('register', () => {
    describe('success', () => {
      beforeEach(() => {
        formValidationService = jasmine.createSpyObj('FormValidationService', ['validator']);
        formValidationService.validator.and.returnValue(true);
        registerService = jasmine.createSpyObj('RegisterService', ['register']);
        registerService.register.and.returnValue(of(true));
        router = jasmine.createSpyObj('Router', ['navigate']);

        component = new RegisterComponent(formValidationService, registerService, router);

        event = jasmine.createSpyObj('Event', ['preventDefault']);
      });

      it('should be created', () => {
        expect(component).toBeTruthy();
      });

      describe('register', () => {
        it('should prevent default on event', () => {
          component.register(event);

          expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should run validation', () => {
          component.register(event);

          expect(formValidationService.validator).toHaveBeenCalled();
        });

        it('should call register with form values', () => {
          component.formValues.firstName = 'a';
          component.formValues.lastName = 'b';
          component.formValues.email = 'a@a.com';
          component.formValues.password = '123';

          component.register(event);

          expect(registerService.register).toHaveBeenCalledWith('a', 'b', 'a@a.com', '123');
        });

        it('should navigate on success', () => {
          component.formValues.firstName = 'a';
          component.formValues.lastName = 'b';
          component.formValues.email = 'a@a.com';
          component.formValues.password = '123';

          component.register(event);

          expect(router.navigate).toHaveBeenCalled();
        });
      });

      describe('failure', () => {
        beforeEach(() => {
          formValidationService = jasmine.createSpyObj('FormValidationService', ['validator']);
          formValidationService.validator.and.returnValue(true);
          registerService = jasmine.createSpyObj('RegisterService', ['register']);
          registerService.register.and.returnValue(of(false));
          router = jasmine.createSpyObj('Router', ['navigate']);

          component = new RegisterComponent(formValidationService, registerService, router);

          event = jasmine.createSpyObj('Event', ['preventDefault']);
        });

        it('should set register error on failure', () => {
          component.formValues.firstName = 'a';
          component.formValues.lastName = 'b';
          component.formValues.email = 'a@a.com';
          component.formValues.password = '123';

          component.errors.register = '';

          component.register(event);

          expect(component.errors.register).toEqual(jasmine.any(String));
          expect(component.errors.register.length).toBeGreaterThan(0);
        });
      });

      describe('failure', () => {
        beforeEach(() => {
          formValidationService = jasmine.createSpyObj('FormValidationService', ['validator']);
          formValidationService.validator.and.returnValue(true);
          registerService = jasmine.createSpyObj('RegisterService', ['register']);
          registerService.register.and.returnValue(new Observable(observer => {
            observer.error();
          }));
          router = jasmine.createSpyObj('Router', ['navigate']);

          component = new RegisterComponent(formValidationService, registerService, router);

          event = jasmine.createSpyObj('Event', ['preventDefault']);
        });

        it('should set login error on endpoint error', () => {
          component.formValues.email = 'a@a.com';
          component.formValues.password = '123';

          component.errors.register = '';

          component.register(event);

          expect(component.errors.register).toEqual(jasmine.any(String));
          expect(component.errors.register.length).toBeGreaterThan(0);
        });
      });
    });
  });
});
