import { FormValidationService } from './form-validation.service';
import { FormValidationRule } from './form-validation-rule';

describe('FormValidationService', () => {
  let service: FormValidationService;

  beforeEach(() => {
    service = new FormValidationService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call each validator', () => {
    const passingValidatorA = jasmine.createSpy('validatorA').and.returnValue(true);
    const passingValidatorB = jasmine.createSpy('validatorB').and.returnValue(true);

    const rules: FormValidationRule[] = [{
      prop: 'testA',
      error: 'testA',
     validator: passingValidatorA
    }, {
      prop: 'testB',
      error: 'testB',
      validator: passingValidatorB
    }];

    const values: any = {
      testA: true,
      testB: ''
    };

    const errors: any = {};

    service.validator(rules, values, errors);

    expect(passingValidatorA).toHaveBeenCalledWith(true);
    expect(passingValidatorB).toHaveBeenCalledWith('');
  });

  it('should set an error message for each validator that fails', () => {
    const failingValidatorA = jasmine.createSpy('validatorA').and.returnValue(false);
    const failingValidatorB = jasmine.createSpy('validatorB').and.returnValue(false);

    const rules: FormValidationRule[] = [{
      prop: 'testA',
      error: 'testA',
     validator: failingValidatorA
    }, {
      prop: 'testB',
      error: 'testB',
      validator: failingValidatorB
    }];

    const values: any = {
      testA: true,
      testB: ''
    };

    const errors: any = {};

    service.validator(rules, values, errors);

    expect(errors.testA).toEqual('testA');
    expect(errors.testB).toEqual('testB');
  });

  it('should return false if any validator fails', () => {
    const failingValidator = jasmine.createSpy('validatorA').and.returnValue(false);
    const passingValidator = jasmine.createSpy('validatorA').and.returnValue(true);

    const rules: FormValidationRule[] = [{
      prop: 'testA',
      error: 'testA',
     validator: failingValidator
    }, {
      prop: 'testB',
      error: 'testB',
      validator: passingValidator
    }];

    const values: any = {
      testA: true,
      testB: ''
    };

    const errors: any = {};

    const pass = service.validator(rules, values, errors);

    expect(pass).toBeFalsy();
  });

  it('should return true if all validators pass', () => {
    const passingValidatorA = jasmine.createSpy('validatorA').and.returnValue(true);
    const passingValidatorB = jasmine.createSpy('validatorB').and.returnValue(true);

    const rules: FormValidationRule[] = [{
      prop: 'testA',
      error: 'testA',
     validator: passingValidatorA
    }, {
      prop: 'testB',
      error: 'testB',
      validator: passingValidatorB
    }];

    const values: any = {
      testA: true,
      testB: ''
    };

    const errors: any = {};

    const pass = service.validator(rules, values, errors);

    expect(pass).toBeTruthy();
  });
});
