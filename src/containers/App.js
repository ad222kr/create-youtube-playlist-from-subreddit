import React, { Component } from 'react';
import logo from '../images/logo.svg';
import '../styles/App.css';
import { fetchPosts } from "../utils/reddit"
import { goToGoogleOAuthWindow, validateToken, createPlaylist } from "../utils/youtube"
import Spinner from "react-spinkit"
import GetPosts from "../components/GetPosts"
import { isYoutubeUrl } from "../utils/helpers"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subReddit: "",
      posts: [],
      accessToken: {},
      isAuthenticated: false,
      playlistLink: undefined,
      isCreatingPlaylist: false,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit= this.handleSubmit.bind(this)
    this.processPosts = this.processPosts.bind(this)
  }

  componentDidMount() {
    const hash = location.hash.substring(1)
    if (hash) {
      const tokenInfo = {}
      hash.replace(/(\b[^=]+)=([^&]+)&?/g, function ($0, param, value) {
        tokenInfo[param] = value;
      });
      validateToken(tokenInfo.access_token)
        .then(res => this.setToken(tokenInfo.access_token, res.expires_in, true))
        .catch(err => console.error(err))   
    }
  }

  setToken(token, expiredsIn, isAuthenticated) {
    this.setState({
      accessToken: {
        token,
        expiredsIn
      },
      isAuthenticated
    })
  }

  handleChange(e) {
    this.setState({
      subReddit: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.setState({
      isCreatingPlaylist: true,
    })

    const { subReddit , accessToken } = this.state
    console.log(accessToken.token)

    fetchPosts(subReddit)
      .then(this.processPosts)
      .then(posts => createPlaylist(subReddit, posts, accessToken.token))
      .then(this.onPlaylistCreated.bind(this))
      .catch(err => console.log(err))
  }

  onPlaylistCreated(playlistId) {
    const playlistLink = "https://www.youtube.com/playlist?list=" + playlistId
    this.setState({
      playlistLink,
      isCreatingPlaylist: false
    })
  }
  processPosts(posts) {
    const youtubePosts = posts
      .filter(post => isYoutubeUrl(post.data.url))
      .map(post => this.getSimplifiedPostObject(post))

    this.setState({
      posts: youtubePosts
    })
    return youtubePosts
  }

  getSimplifiedPostObject(post) {
    return {
      name: post.data.title,
      url: post.data.url,
      id: this.getVideoId(post.data.url)
    }
  }

  getVideoId(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  }

  filterPosts(posts) {
    return posts.filter(post => {
      return isYoutubeUrl(post.data.url)
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
          Authenticate with your google account!
        </button>
      )
    }
  }

  renderPlaylistLink() {
    if (this.state.playlistLink !== undefined) {
      return (
        <div>
          <a href={this.state.playlistLink}>Check out the playlist</a>
        </div>
      )
    }
  }

  renderGetPosts() {
    if (this.state.isCreatingPlaylist) {
      return (
        <div className="spinner">
          <Spinner spinnerName="double-bounce" />
        </div>
      )
    } else {
      return (
        <GetPosts
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          value={this.state.subReddit}
          isAuthenticated={this.state.isAuthenticated}
        />
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
        <p>
          Enter a name of a subreddit to search it for youtube-videos 
          and gather them into a playlist.
        </p>      
        {this.renderGetPosts()}
        {this.renderPlaylistLink()}
        {this.renderGoogleAuthButton()}      
      </div>
    );
  }
}

export default App;