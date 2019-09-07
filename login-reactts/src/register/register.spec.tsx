import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

import {Register} from './register';

enzyme.configure({ adapter: new Adapter() });

describe('Register', () => {
  it('should render', () => {
    const wrapper = enzyme.shallow(<Register/>);
    expect(wrapper.find('h1').length).toEqual(1);
  })
});
