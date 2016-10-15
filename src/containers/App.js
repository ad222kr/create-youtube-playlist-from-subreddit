import React, { Component } from 'react';
import GetPostsContainer from "../containers/GetPostsContainer"
import { goToGoogleOAuthWindow, validateToken } from "../utils/youtube"
import { Button, Jumbotron, Grid, Row, Navbar } from "react-bootstrap"

import logo from '../images/logo.svg';
import '../styles/App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: false,
      tokenInfo: {}
    }
  }

  componentDidMount() {
    if (location.hash) {
      const hash = location.hash.substring(1)
      const tokenInfo = {}
      hash.replace(/(\b[^=]+)=([^&]+)&?/g, function ($0, param, value) {
        tokenInfo[param] = value;
      });
      validateToken(tokenInfo.access_token)
        .then(this.setToken(tokenInfo))
        .then(() => {
          location.hash = ""
        })
        .catch(err => console.error(err))
    }
  }

  setToken = tokenInfo => {
    this.setState({
      tokenInfo,
      isAuthenticated: true
    })
  }

  renderGoogleAuthButton() {
    if (this.state.isAuthenticated) {
      return (
        <p>You are authenticated with google!</p>
      )
    } else {
      return (
        <Button bsStyle="primary" bsSize="large" onClick={goToGoogleOAuthWindow}>
          Authenticate!
        </Button>

      )
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Create-Youtube-Playlist</a>
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <Grid>  
        
        <Row>
        <Jumbotron>
        <GetPostsContainer 
          isAuthenticated={this.state.isAuthenticated}
          tokenInfo={this.state.tokenInfo}
        />
        {this.renderGoogleAuthButton()}
        </Jumbotron>
        </Row>
        </Grid>
      </div>
    );
  }
}

export default App;