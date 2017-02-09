import React, { Component, PropTypes } from "react"
import { ProgressBar } from "react-mdl"
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
      howDeep: 0,
      posts: [],
      playlistLink: undefined,
      isCreatingPlaylist: false,
      err: undefined,
    }
  }

  processPosts = posts => {
    return posts
      .filter(post => isYoutubeUrl(post.data.url))
      .map(post => {
        return { 
          name: post.data.title,
          url: post.data.url,
          id: getVideoId(post.data.url)
        }
      })
  }

  handleChange = key => {
    return function(e) {
      const state = {}
      state[key] = e.target.value
      this.setState(state)
    }.bind(this)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.setState({
      isCreatingPlaylist: true,
      err: undefined
    })
    const { subreddit, howDeep, playlistName } = this.state
    const { tokenInfo } = this.props
    const name = playlistName.length > 0 
      ? this.state.playlistName 
      : this.state.subreddit

    this.buildPlaylist(subreddit, tokenInfo, name, howDeep)
    
  }

  buildPlaylist(subreddit, tokenInfo, playlistName, howDeep) {
    fetchPosts(subreddit, howDeep)
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
      playlistName: ""
    })
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
            playlistLink={this.state.playlistLink}
            error={this.state.err}
          /> 
        </div>
      )
    }
  }
}

GetPostsContainer.propTypes = {
  tokenInfo: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
}

export default GetPostsContainer