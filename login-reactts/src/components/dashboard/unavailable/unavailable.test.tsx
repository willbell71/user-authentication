import React from 'react';
import { act, create, ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';

import { Unavailable } from './unavailable';

let renderer: ReactTestRenderer;
let instance: ReactTestInstance;
beforeEach(async () => {
  await act(async () => {
    renderer = create(
      <Unavailable value={null} />
    );
  });

  instance = renderer.root;
});

afterEach(() => jest.clearAllMocks());

describe('Unavail', () => {
  it('should render unavailable for no value', () => {
    expect(instance).toBeTruthy();
  });

  it('should render value for a value', async () => {
    const value: string = 'test';

    await act(async () => renderer.update(
      <Unavailable value={value} />
    ));
  
    expect(instance.children).toEqual([value]);
  });
});
