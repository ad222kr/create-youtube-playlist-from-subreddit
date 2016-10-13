import React, { Component } from 'react';
import logo from '../images/logo.svg';
import '../styles/App.css';
import { loadGapi } from "../utils/auth"
import { fetchPosts } from "../utils/reddit"
import { getYoutubeCredentials, validateToken, createPlaylist } from "../utils/youtube"
import { getQueryParam } from "../utils/helpers"
import Spinner from "react-spinkit"
import ReactPlayer from "react-player"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subReddit: "",
      posts: [],
      access_token: {},
      isAuthenticated: false,
      playlistLink: undefined,
      isCreatingPlaylist: false,
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

  }


  componentDidMount() {
    const hash = location.hash.substring(1)
    if (hash) {
      const tokenInfo = {}
      hash.replace(/(\b[^=]+)=([^&]+)&?/g, function ($0, param, value) {

        tokenInfo[param] = value;
      });
      validateToken(tokenInfo.access_token)
        .then(res => {
          this.setState({
            access_token: {
              token: tokenInfo.access_token,
              expires_in: res.expires_in,
            },
            isAuthenticated: true
          })
        })
        .then(() => {

        })
        .catch(err => console.error(err))   
    }
    
  }

  onChange(e) {
    this.setState({
      subReddit: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault()
    const { subReddit } = this.state

    this.setState({
      isCreatingPlaylist: true,
    })
    fetchPosts(subReddit)
      .then(this.processPosts.bind(this))
      .then(() => {
        const { subReddit, posts , access_token } = this.state
        return createPlaylist(subReddit, posts, access_token.token)
      })
      .then(res => {
        console.log(res)
        const youtubePlaylistBaseUrl = "https://www.youtube.com/playlist?list="

        this.setState({
          playlistLink: youtubePlaylistBaseUrl + res,
          isCreatingPlaylist: false
        })
      })
  }

  processPosts(posts) {

    const onlyYoutubePosts = this.filterPosts(posts)
    this.setState({
      posts: onlyYoutubePosts.map(post => {
        return {
          name: post.data.title,
          url: post.data.url,
          id: this.getVideoId(post.data.url)
        }
      })
    })
    return onlyYoutubePosts
  }

  initGoogleApis(posts) {

    loadGapi(this.state.posts, this.state.subReddit)
  }

  getVideoId(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  }

  filterPosts(posts) {
    return posts.filter(post => {
      return this.isYoutubeUrl(post.data.url)
    })
  }

  /**
 * JavaScript function to match (and return) the video Id 
 * of any valid Youtube Url, given as input string.
 * @author: Stephan Schmitz <eyecatchup@gmail.com>
 * @url: http://stackoverflow.com/a/10315969/624466
 */
  isYoutubeUrl (url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
  }

  renderGoogleAuthButton() {
    if (this.state.isAuthenticated) {
      return (
        <p>You are authenticated with google!</p>
      )
    } else {
      return (
        <button onClick={getYoutubeCredentials}>
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
    } else {

    }
  }

  renderSpinner() {
    if (this.state.isCreatingPlaylist) {
      return <Spinner spinnerName="double-bounce" />
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          Enter a subreddit
        </p>
        <form onSubmit={this.onSubmit}>
          <input type="text" onChange={this.onChange} value={this.state.subReddit} />
          <button type="submit" disabled={!this.state.isAuthenticated}>Get posts!</button>
        </form>
        {this.renderSpinner()}
        {this.renderPlaylistLink()}
        {this.renderGoogleAuthButton()}
        
      </div>
    );
  }
}

export default App;
