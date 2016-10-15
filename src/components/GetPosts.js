import React, { PropTypes } from "react"
import { Button, FormGroup, ControlLabel, FormControl, Row, Col } from "react-bootstrap"

const GetPosts = ({ onSubmit, onChange, subredditValue, nameValue, isAuthenticated, getValidationState }) => {
  if (isAuthenticated) {
    return (
      <div className="get-posts">
        <form onSubmit={onSubmit}>
          <Row>
            <Col xs={2} />
            <Col xs={8}>
            <FormGroup
              controlId="subredditText"
              validationState={getValidationState()}
              role="form"
            >
              <ControlLabel>Enter a subreddit to create a playlist</ControlLabel>
              <FormControl
                type="text"
                value={subredditValue}
                placeholder="Enter subreddit name"
                onChange={onChange("subreddit")}
              />
              <FormControl
                type="text"
                value={nameValue}
                placeholder="Enter a name for the playlist"
                onChange={onChange("playlistName")}
              />
            </FormGroup>
            </Col>
            <Col xs={2} />
            </Row>
          <FormGroup>
            <Button 
              bsStyle="primary" 
              bsSize="large" 
              disabled={subredditValue.length > 0 ? false : true}
              type="submit"
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
  subredditValue: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
}

export default GetPosts