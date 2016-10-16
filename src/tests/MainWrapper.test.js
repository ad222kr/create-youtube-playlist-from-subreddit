import React from 'react';
import { shallow } from 'enzyme'
import MainWrapper from '../containers/MainWrapper';

it('renders without crashing', () => {
  shallow(<MainWrapper />)
});