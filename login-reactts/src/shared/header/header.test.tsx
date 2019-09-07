import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

import {Header} from './header';

enzyme.configure({ adapter: new Adapter() });

describe('Header', () => {
  it('should render', () => {
    const wrapper = enzyme.shallow(<Header title="title"/>);
    expect(wrapper.find('h1').length).toEqual(1);
  });

  it('should set the title text', () => {
    const wrapper = enzyme.shallow(<Header title="title"/>);
    expect(wrapper.find('h1').text()).toEqual("title");
  });
});
