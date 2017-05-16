import trainflow from 'trainflow'

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
const REDIRECT_URI = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_PRODUCTION_REDIRECT_URL 
  : process.env.REACT_APP_REDIRECT_URL
const API_KEY = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_PRODUCTION_API_KEY 
  : process.env.REACT_APP_GOOGLE_API_KEY
const RESPONSE_TYPE = "token"
const SCOPES = "https://www.googleapis.com/auth/youtube"
const AUTH_BASE_URL = "https://accounts.google.com/o/oauth2/auth"
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3/"
const GOOGLE_VALIDATE_TOKEN_URL = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token="

console.log(process.env.NODE_ENV)

function getHeaders() {
  return {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
}

function getHeadersWithAuth(token) {
  return Object.assign({}, getHeaders(), {
    "Authorization": "Bearer "+ token
  })
}

export function goToGoogleOAuthWindow() {
  const url = `${AUTH_BASE_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}`
  window.location.assign(url)
}

export function validateToken(token) {
  return fetch(GOOGLE_VALIDATE_TOKEN_URL + token)
    .then(res => res.json())
}

export function createPlaylist (name, songlist = [], access_token) {
  const endpoint = "playlists"
  const part = "part=snippet"
  const url = `${YOUTUBE_API_BASE_URL}${endpoint}?${part}&key=${API_KEY}`
  const method = "POST"
  const headers = getHeadersWithAuth(access_token)
  const body = '{"snippet":{"title":"'+name + ' ' + Date.now() +'"}}'
  let playlistId

  return fetch(url, {method, headers, body})
    .then(res => {
      if (res.status !== 200) 
        throw new Error("A problem occured with Youtube. Please try again later")
      return res
    })
    .then(res => res.json())
    .then(({id: playlist_id}) => {
      playlistId = playlist_id
      const promiseFns = songlist.map(({id}) => () => insertPlaylistItem(id, playlistId, access_token))
      return trainflow({promiseFns})
        .then(val => playlistId) // return playlistid to make a link to it
    })
}

function insertPlaylistItem(video_id, playlist_id, access_token) {
  const endPoint = "playlistItems"
  const part = "part=snippet"
  const url = `${YOUTUBE_API_BASE_URL}${endPoint}?${part}&key=${API_KEY}`
  const method = "POST"
  const headers = getHeadersWithAuth(access_token)
  const body = '{"snippet":{"playlistId":"' + playlist_id + '","resourceId":{"videoId": "'+video_id+'","kind":"youtube#video"}}}'

  return fetch(url, {method, headers, body})
    .then(res => {
      // The video could not be found, probably taken down or a private video. 
      // Continue anyway since We still want to complete the playlist
      if (res.status === 404) return 
      else if (res.status !== 200) 
        throw new Error("A problem occured with Youtube. Please try again later")
      return res
    })
}