import React from 'react';

import {expect} from 'chai';
import Enzyme from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';

import '../global.js';

import {Login} from '../../src/login/login.jsx';

Enzyme.configure({adapter: new Adapter()});

afterEach(() => sinon.restore());

describe('Login', () => {
  it('should render', () => {
    const wrapper = Enzyme.shallow(<Login/>);
    expect(wrapper.find('h1')).to.have.lengthOf(1);
  })
});
