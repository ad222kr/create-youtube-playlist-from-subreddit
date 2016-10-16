import React from 'react';
import { shallow } from 'enzyme'
import GetPosts from "../components/GetPosts"

it('renders without crashing', () => {
  shallow(<GetPosts />)
});