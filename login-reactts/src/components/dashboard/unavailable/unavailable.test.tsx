import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

import {Unavailable} from './unavailable';

enzyme.configure({ adapter: new Adapter() });

afterEach(() => jest.restoreAllMocks());

describe('Unavail', () => {
  it('should render unavailable for no value', () => {
    let wrapper: enzyme.ShallowWrapper<{}, {}> = enzyme.shallow(<Unavailable/>);

    expect(wrapper.text()).toEqual('Unavailable');
  });

  it('should render value for a value', () => {
    let wrapper: enzyme.ShallowWrapper<{}, {}> = enzyme.shallow(<Unavailable value="value"/>);

    expect(wrapper.text()).toEqual('value');
  });
});
