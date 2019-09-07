import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

import {Dashboard} from './dashboard';

enzyme.configure({ adapter: new Adapter() });

describe('Dashboard', () => {
  it('should render', () => {
    const wrapper = enzyme.shallow(<Dashboard/>);
    expect(wrapper.find('Header').length).toEqual(1);
  });
});
