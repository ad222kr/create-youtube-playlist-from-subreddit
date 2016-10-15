import React, { PropTypes } from "react"
import { Button, FormGroup, ControlLabel, FormControl } from "react-bootstrap"

const GetPosts = ({ onSubmit, onChange, value, isAuthenticated, getValidationState }) => {
  if (isAuthenticated) {
    return (
      <div className="get-posts">
        <form onSubmit={onSubmit}>
          <FormGroup
            controlId="subredditText"
            validationState={getValidationState()}
          >
            <ControlLabel>Enter a subreddit to create a playlist</ControlLabel>
            <FormControl
              type="text"
              value={value}
              placeholder="Enter subreddit name"
              onChange={onChange}
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup>
            <Button 
              bsStyle="primary" 
              bsSize="large" 
              disabled={value.length > 0 ? false : true}
              onClick={onSubmit}
            >
              Create playlist
            </Button>
          </FormGroup>
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