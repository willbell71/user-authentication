import React from 'react';
import { act, create, ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';

import { Header, TProps } from './header';

let props: TProps;
let renderer: ReactTestRenderer;
let instance: ReactTestInstance;
beforeEach(async () => {
  props = {
    title: 'title'
  };

  await act(async () => {
    renderer = create(
      <Header {...props} />
    );
  });

  instance = renderer.root;
});

afterEach(() => jest.clearAllMocks());

describe('Header', () => {
  it('should render', () => {
    expect(instance).toBeTruthy();
  });

  it('should set the title text', () => {
    const title: ReactTestInstance = instance.findByProps({ 'data-testid': 'title' });

    expect(title).toBeTruthy();
    expect(title.props.children).toEqual(props.title);
  });
});
