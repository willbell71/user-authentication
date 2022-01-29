import React from 'react';
import { act, create, ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';

import { FormField, TProps } from './form-field';

let props: TProps;
let renderer: ReactTestRenderer;
let instance: ReactTestInstance;
beforeEach(async () => {
  props = {
    id: 'id',
    label: 'label',
    type: 'text',
    name: 'name',
    value: 'value',
    changeInput: jest.fn(),
    error: 'error',
    testid: 'input'
  };

  await act(async () => {
    renderer = create(
      <FormField {...props} />
    );
  });

  instance = renderer.root;
});

afterEach(() => jest.clearAllMocks());

describe('FormField', () => {
  it('should render', () => {
    expect(instance).toBeTruthy();
  });

  it('should render a label with caption', () => {
    const label: ReactTestInstance = instance.findByProps({ 'data-testid': 'label' });
    expect(label.props.children[0]).toEqual(props.label);
  });

  it('should render an input with id', () => {
    const input: ReactTestInstance = instance.findByProps({ 'data-testid': props.testid });
    expect(input.props.id).toEqual(props.id);
  });

  it('should render an input with type', () => {
    const input: ReactTestInstance = instance.findByProps({ 'data-testid': props.testid });
    expect(input.props.type).toEqual(props.type);
  });

  it('should render an input with name', () => {
    const input: ReactTestInstance = instance.findByProps({ 'data-testid': props.testid });
    expect(input.props.name).toEqual(props.name);
  });

  it('should render an input with value', () => {
    const input: ReactTestInstance = instance.findByProps({ 'data-testid': props.testid });
    expect(input.props.value).toEqual(props.value);
  });

  it('should render an input with onChange', () => {
    const input: ReactTestInstance = instance.findByProps({ 'data-testid': props.testid });
    expect(input.props.onChange).toEqual(props.changeInput);
  });

  it('should call onChange', async () => {
    const event: unknown = {
      target: {
        value: 'email'
      }
    };

    const input: ReactTestInstance = instance.findByProps({ 'data-testid': props.testid });
    await act(async () => input.props.onChange(event));

    expect(props.changeInput).toHaveBeenCalledTimes(1);
    expect(props.changeInput).toHaveBeenCalledWith(event);
  });

  it('should render a p with error', () => {
    const error: ReactTestInstance = instance.findByProps({ 'data-testid': 'error' });

    expect(error.props.children).toEqual('error');
  });
});
