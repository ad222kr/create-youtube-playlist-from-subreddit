import React, { Component } from 'react';
import GetPostsContainer from "../containers/GetPostsContainer"
import { goToGoogleOAuthWindow, validateToken } from "../utils/youtube"
import { Layout, Header, Footer, FooterSection, FooterLinkList, Button, Grid, Cell, Card, CardTitle, CardText, CardActions, CardMenu, IconButton } from "react-mdl"
import music from "../images/if_youtube_then_reddit.png"

import bg from "../images/bg.jpg"
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
        <Button raised ripple primary onClick={goToGoogleOAuthWindow}>
          Authenticate!
        </Button>

      )
    }
  }
  

  render() {
    return (
      <div className="app" style={{background: `url(${bg}) center / cover`}}>
        <Layout >
          <Header title="create-youtube-playlist">
          </Header>
          <Grid>
            <Card 
              shadow={0} 
              style={{width: '512px', margin: 'auto'}}
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
                {this.renderGoogleAuthButton()}
              </CardActions>
            </Card>
          </Grid>  

        </Layout>        
      </div>
    );
  }
}

export default App;