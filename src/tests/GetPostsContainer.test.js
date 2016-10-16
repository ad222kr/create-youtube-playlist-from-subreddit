import React from 'react';
import { shallow } from 'enzyme'
import GetPostsContainer from '../containers/GetPostsContainer';

it('renders without crashing', () => {
  shallow(<GetPostsContainer />)
});