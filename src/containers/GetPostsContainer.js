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
      isCreatingPlaylist: false
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
      isCreatingPlaylist: true
    })

    const { subreddit } = this.state
    const { tokenInfo } = this.props

    fetchPosts(subreddit)
      .then(this.processPosts)
      .then(posts => createPlaylist(this.subreddit, posts, tokenInfo.access_token))
      .then(this.setPlaylistLink)
  }

  setPlaylistLink = id => {
    console.log("setPlaylistLink")
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
    if (this.state.isCreatingPlaylist) {
      return (
        <div className="spinner">
          <Spinner spinnerName="double-bounce" />
        </div>
      )
    } else {
      return (
        <div>
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