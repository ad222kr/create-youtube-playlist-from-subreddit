import React, { Component } from 'react';
import logo from '../images/logo.svg';
import '../styles/App.css';
import { loadGapi } from "../utils/auth"
import { fetchPosts } from "../utils/reddit"
import { getYoutubeCredentials, validateToken } from "../utils/youtube"
import { getQueryParam } from "../utils/helpers"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subReddit: "",
      posts: [],
      access_token: {},
      isAuthenticated: false
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

  }


  componentDidMount() {
    const hash = location.hash.substring(1)
    if (hash) {
      const tokenInfo = {}
      hash.replace(/(\b[^=]+)=([^&]+)&?/g, function ($0, param, value) {
        console.log($0)
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
          console.log(this.state)
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
    console.log(this.state)

    fetchPosts(subReddit)
      .then(this.processPosts.bind(this))
      .catch(err => console.error(err))
  }

  processPosts(posts) {
    console.log(this)
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
    console.log(this.state)
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
        {this.state.posts.map((post, index) => {
          return (
            <p key={index}>
              <a href={post.url}>
                {post.name}
              </a>
            </p>
          )
        })}
        {this.renderGoogleAuthButton()}
        
      </div>
    );
  }
}

export default App;
