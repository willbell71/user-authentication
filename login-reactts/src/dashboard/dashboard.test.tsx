import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

import {Dashboard} from './dashboard';

enzyme.configure({ adapter: new Adapter() });

let wrapper: enzyme.ShallowWrapper<{}, {}, Dashboard>;
beforeEach(() => wrapper = enzyme.shallow(<Dashboard/>));
afterEach(() => jest.restoreAllMocks());

describe('Dashboard', () => {
  it('should render', () => {
    expect(wrapper.find('Header').length).toEqual(1);
    expect(wrapper.find('Header').prop('title')).toEqual('Dashboard');
  });

  it('should have a button that calls getSomething', () => {
    expect(wrapper.find('button').first().prop('onClick')).toEqual(wrapper.instance().getSomething);
  });

  it('should have a Unavailable that renders state title', () => {
    wrapper.setState({
      title: 'title'
    });

    expect(wrapper.find('Unavailable').first().prop('value')).toEqual('title');
  });

  it('should have a Unavailable that renders state body', () => {
    wrapper.setState({
      body: 'body'
    });

    expect(wrapper.find('Unavailable').at(1).prop('value')).toEqual('body');
  });

  it('should have a button that calls logout', () => {
    expect(wrapper.find('button').at(1).prop('onClick')).toEqual(wrapper.instance().logout);
  });

  describe('getSomething', () => {
    it('should run', () => {
      wrapper.instance().getSomething();

      expect(true).toBeTruthy();
    });
  });

  describe('logout', () => {
    it('should run', () => {
      wrapper.instance().logout();

      expect(true).toBeTruthy();
    });
  });
});
