import React, { Component } from "react"
import Spinner from "react-spinkit"
import GetPosts from "../components/GetPosts"

import { fetchPosts } from "../utils/reddit"
import { createPlaylist } from "../utils/youtube"
import { isYoutubeUrl, getVideoId } from "../utils/helpers"

class GetPostsContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subreddit: "",
      posts: [],
      playlistLink: undefined,
      isCreatingPlaylist: false,
      err: undefined
    }
  }

  processPosts = posts => {
    return posts
      .filter(post => isYoutubeUrl(post.data.url))
      .map(post => this.getSimplePost(post))
  }

  handleChange = e => {
    this.setState({
      subreddit: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.setState({
      isCreatingPlaylist: true,
      err: undefined
    })

    const { subreddit } = this.state
    const { tokenInfo } = this.props

    fetchPosts(subreddit)
      .then(this.processPosts)
      .then(posts => createPlaylist(this.subreddit, posts, tokenInfo.access_token))
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
      subreddit: ""
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
          <a href={this.state.playlistLink}>Check out the playlist</a>
        </div>
      )
    }
  }

  render() {  
    console.log(this.state.err)
    if (this.state.isCreatingPlaylist) {
      return (
        <div className="spinner">
          <Spinner spinnerName="double-bounce" />
        </div>
      )
    } else {
      return (
        <div>
          {this.state.err ? this.state.err : ""}
          <GetPosts
            onSubmit={this.handleSubmit}
            onChange={this.handleChange}
            value={this.state.subreddit}
            isAuthenticated={this.props.isAuthenticated}
          />
          {this.renderPlaylistLink()}
        </div>
      )
    }
  }
}

export default GetPostsContainer