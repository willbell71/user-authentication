import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

import {Login} from './login';

enzyme.configure({ adapter: new Adapter() });

afterEach(() => jest.restoreAllMocks());

describe('Login', () => {
  it('should render', () => {
    const wrapper: enzyme.ShallowWrapper<{}> = enzyme.shallow(<Login/>);
    expect(wrapper.find('Header').length).toEqual(1);
    expect(wrapper.find('Header').prop('title')).toEqual('Login');
  });
});
