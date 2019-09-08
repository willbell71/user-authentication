import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

import {FormField} from './form-field';

enzyme.configure({ adapter: new Adapter() });

let changeInput: jest.Mock;
let wrapper: enzyme.ShallowWrapper<{}>;
beforeEach(() => {
  changeInput = jest.fn();
  wrapper = enzyme.shallow(<FormField id="id" label="label" type="text" name="name" value="value" changeInput={ changeInput } error="error"/>);
});
afterEach(() => jest.restoreAllMocks());

describe('Register', () => {
  it('should render', () => {
    expect(wrapper.find('label').length).toEqual(1);
  });

  it('should render a label with caption', () => {
    expect(wrapper.find('label').text()).toMatch(/label/);
  });

  it('should render an input with id', () => {
    expect(wrapper.find('input').prop('id')).toEqual('id');
  });

  it('should render an input with type', () => {
    expect(wrapper.find('input').prop('type')).toEqual('text');
  });

  it('should render an input with name', () => {
    expect(wrapper.find('input').prop('name')).toEqual('name');
  });

  it('should render an input with value', () => {
    expect(wrapper.find('input').prop('value')).toEqual('value');
  });

  it('should render an input with onChange', () => {
    expect(wrapper.find('input').prop('onChange')).toEqual(changeInput);
  });

  it('should call onChange', () => {
    wrapper.find('input').simulate('change', {target: {value: 'email'}});

    expect(changeInput).toHaveBeenCalledTimes(1);
  });

  it('should render a p with error', () => {
    expect(wrapper.find('p').text()).toEqual('error');
  });
});
