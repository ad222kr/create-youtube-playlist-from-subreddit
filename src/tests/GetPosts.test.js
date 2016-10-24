import React from 'react';
import { shallow } from 'enzyme'
import GetPosts from "../components/GetPosts"

it('renders without crashing', () => {
  const getposts = shallow(<GetPosts />)
  const notLoggedInMessage = 'Create a playlist from a subreddits youtube posts! Sign in with google to start now'
  expect(getposts.props().children).toEqual(notLoggedInMessage) 
});

fit('renders a form when logged in', () => {
  const getposts = shallow(<GetPosts 
    isAuthenticated={true}
    onChange={() => {}}
    onSubmit={() => {}}
    err=""
    subredditValue=""
    nameValue=""
    playlistLink=""/>)

  console.log(getposts.props().children)
})