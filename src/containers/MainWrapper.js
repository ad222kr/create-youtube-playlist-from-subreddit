import React, { Component } from "react";
import { Grid, Button, Card, CardTitle, CardText, CardActions } from "react-mdl"

import GetPostsContainer from "../containers/GetPostsContainer"
import { goToGoogleOAuthWindow, validateToken } from "../utils/youtube"

import music from "../images/music.jpg"

class MainWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: false,
      tokenInfo: {},
      err: undefined
    }
  }

  componentDidMount() {
    if (location.hash) {
      const tokenInfo = this.getParsedHash()

      validateToken(tokenInfo.access_token)
        .then(this.setToken(tokenInfo))
        .catch(err => console.error(err))
    }
  }

  getParsedHash() {
    const hashRegex = /(\b[^=]+)=([^&]+)&?/g
    const hash = location.hash.substring(1)
    const tokenInfo = {}

    hash.replace(hashRegex, function ($0, param, value) {
      tokenInfo[param] = value;
    });

    return tokenInfo
  }

  setToken = tokenInfo => {
    this.setState({
      tokenInfo,
      isAuthenticated: true
    })
    location.hash = ""
  }

  render() {
    return (
      <Grid>
        <Card 
          shadow={0} 
          className="app-card"
        >
          <CardTitle 
            style={{color: '#fff', height: '176px', background: `url(${music}) center / cover`}} 
            className="app-card-title"
          />
          <CardText>
            <GetPostsContainer 
              isAuthenticated={this.state.isAuthenticated}
              tokenInfo={this.state.tokenInfo}
            />
    
          </CardText>
          <CardActions border>
            {this.state.isAuthenticated ? 
              <p>Authenticated</p> : 
              <Button 
                raised 
                ripple 
                primary 
                onClick={goToGoogleOAuthWindow}
              >
                Authenticate!
              </Button>  }
          </CardActions>
        </Card>
      </Grid>  
    )
  }
}

export default MainWrapper