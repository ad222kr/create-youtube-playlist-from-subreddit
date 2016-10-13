import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import gapi, { loadGapi } from "./auth"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subReddit: "",
      posts: []
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

  }



  onChange(e) {
    this.setState({
      subReddit: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault()
    console.log(this.state.subReddit)
    const { subReddit } = this.state
    fetch(`http://www.reddit.com/r/${subReddit}.json`)
      .then(resp => resp.json())
      .then(resp => {
        const posts = this.filterPosts(resp.data.children)
        posts.forEach(post => {
          console.log(post.data)
        })
        this.setState({
          posts: posts.map(post => {
            return {
              name: post.data.title,
              url: post.data.url,
              id: this.getVideoId(post.data.url)
            }
          })
        })
      })
      .then(() => {
        loadGapi(this.state.posts, this.state.subReddit)
      })
      .catch(err => console.error)
  }

  getVideoId(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
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
          <button type="submit">Get posts!</button>
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
        
      </div>
    );
  }
}

export default App;
