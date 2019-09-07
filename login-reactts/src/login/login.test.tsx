import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

import {Login} from './login';

enzyme.configure({ adapter: new Adapter() });

describe('Login', () => {
  it('should render', () => {
    const wrapper = enzyme.shallow(<Login/>);
    expect(wrapper.find('Header').length).toEqual(1);
  });
});
