import React, { PropTypes } from "react"

const GetPosts = ({ onSubmit, onChange, value, isAuthenticated }) => {
  if (isAuthenticated) {
    return (
      <div className="get-posts">
        <h3>Enter a subreddit to create a playlist</h3>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input type="text" onChange={onChange} value={value}/>
          </div>
          <div className="form-group">
            <button type="submit">
              Create playlist
            </button>
          </div>
        </form>
      </div>
    )
  } else {
    return (
      <h3>Please authenticate with your google account to create a playlist</h3>
    )
  }
}

GetPosts.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
}

export default GetPosts