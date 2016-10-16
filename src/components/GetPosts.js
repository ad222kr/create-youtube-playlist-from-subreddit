import React, { PropTypes } from "react"
import { Button, Textfield } from "react-mdl"

const GetPosts = ({ onSubmit, onChange, subredditValue, nameValue, isAuthenticated, getValidationState }) => {
  if (isAuthenticated) {
    return (
      <div className="get-posts">
        <form onSubmit={onSubmit}>

              <Textfield
                label="Subreddit"
                value={subredditValue}
                floatingLabel
                onChange={onChange("subreddit")}
              />
              <Textfield
                label="Playlist name(can be left blank)"
                value={nameValue}
                floatingLabel
                onChange={onChange("playlistName")}
              />
            <div>
              <Button primary raised ripple
                disabled={subredditValue.length > 0 ? false : true}
                type="submit"
              >
                Create playlist
              </Button>
            </div>
        </form>
      </div>
    )
  } else {
    return (
      <h5>
        Create a playlist from a subreddits youtube posts! 
        Sign in with google to start now
      </h5>
    )
  }
}

GetPosts.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  subredditValue: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
}

export default GetPosts