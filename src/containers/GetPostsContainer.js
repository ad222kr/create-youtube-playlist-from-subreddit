import React, { Component } from "react"
import { Spinner, ProgressBar, Snackbar } from "react-mdl"
import GetPosts from "../components/GetPosts"

import { fetchPosts } from "../utils/reddit"
import { createPlaylist } from "../utils/youtube"
import { isYoutubeUrl, getVideoId } from "../utils/helpers"

class GetPostsContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subreddit: "",
      playlistName: "",
      posts: [],
      playlistLink: undefined,
      isCreatingPlaylist: false,
      err: undefined,
    }
  }

  processPosts = posts => {
    return posts
      .filter(post => isYoutubeUrl(post.data.url))
      .map(post => this.getSimplePost(post))
  }

  handleChange = key => {
    return function(e) {
      const state = {}
      state[key] = e.target.value
      this.setState(state)
    }.bind(this)
  }

  handleSubmit = e => {
    console.log("submit")
    e.preventDefault()
    this.setState({
      isCreatingPlaylist: true,
      err: undefined
    })

    const { subreddit } = this.state
    const { tokenInfo } = this.props
    const playlistName = this.state.playlistName.length > 0 
      ? this.state.playlistName 
      : this.state.subreddit

    fetchPosts(subreddit)
      .then(this.processPosts)
      .then(posts => createPlaylist(playlistName, posts, tokenInfo.access_token))
      .then(this.setPlaylistLink)
      .catch(this.setError)
  }

  setError = err => {
    this.setState({
      err: err.toString(),
      isCreatingPlaylist: false
    })
  }

  setPlaylistLink = id => {
    const playlistLink = `https://www.youtube.com/playlist?list=${id}`
    this.setState({
      playlistLink,
      isCreatingPlaylist: false,
      subreddit: "",
    })
  }

  getSimplePost(post) {
    return {
      name: post.data.title,
      url: post.data.url,
      id: getVideoId(post.data.url)
    }
  }

  renderPlaylistLink() {

    if (this.state.playlistLink !== undefined) {

      return (
        <div>
          <h2><a href={this.state.playlistLink}>Check out the playlist</a></h2>
        </div>
      )
    }
  }
  
  handleValidationState = key => {
    const length = this.state.subreddit.length;
    if (length > 0) return "success"
  }

  render() {  
    if (this.state.isCreatingPlaylist) {
      return (
        <div className="spinner">
          <ProgressBar indeterminate />
        </div>
      )
    } else {
      return (
        <div>
          {this.state.err ? this.state.err : ""}
          <GetPosts
            onSubmit={this.handleSubmit}
            onChange={this.handleChange}
            subredditValue={this.state.subreddit}
            nameValue={this.state.playlistName}
            isAuthenticated={this.props.isAuthenticated}
            getValidationState={this.handleValidationState}
          />
          {this.renderPlaylistLink()}
        </div>
      )
    }
  }
}

export default GetPostsContainer