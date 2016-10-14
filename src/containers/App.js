import React, { Component } from 'react';
import GetPostsContainer from "../containers/GetPostsContainer"
import { goToGoogleOAuthWindow, validateToken } from "../utils/youtube"

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
        <button onClick={goToGoogleOAuthWindow}>
          Go to authentication
        </button>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>create-youtube-playlist</h2>
        </div>    
        <GetPostsContainer 
          isAuthenticated={this.state.isAuthenticated}
          tokenInfo={this.state.tokenInfo}
        />
        {this.renderGoogleAuthButton()}
      </div>
    );
  }
}

export default App;