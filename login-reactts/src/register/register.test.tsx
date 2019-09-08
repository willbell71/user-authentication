import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

import {Register} from './register';

enzyme.configure({ adapter: new Adapter() });

afterEach(() => jest.restoreAllMocks());

describe('Register', () => {
  it('should render', () => {
    const wrapper: enzyme.ShallowWrapper<{}> = enzyme.shallow(<Register/>);
    expect(wrapper.find('Header').length).toEqual(1);
    expect(wrapper.find('Header').prop('title')).toEqual('Register');
  });
});
