import React, { PropTypes } from "react"

const GetPosts = ({ onSubmit, onChange, value, isAuthenticated }) => {
  return (
    <div className="get-posts">
      <h3>Enter a subreddit</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input type="text" onChange={onChange} value={value} />
        </div>
        <div className="form-group">
          <button type="submit" disabled={!isAuthenticated}>
            Create playlist
          </button>
        </div>
      </form>
    </div>
  )
}

GetPosts.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
}

export default GetPosts