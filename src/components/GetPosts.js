import React, { PropTypes } from "react"
import { Button, Textfield } from "react-mdl"

const GetPosts = (props) => {
  const { 
    onSubmit, 
    onChange, 
    subredditValue, 
    nameValue, 
    isAuthenticated,
    playlistLink,
    err
  } = props
  
  if (isAuthenticated) {
    return (
      <div className="get-posts">
        {err ? err : ""}
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
            {playlistLink ? 
            <h4><a href={playlistLink}>Check out the playlist</a></h4>
            : ""}
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