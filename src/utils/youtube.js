
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URL
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY
const RESPONSE_TYPE = "token"
const SCOPES = "https://www.googleapis.com/auth/youtube"
const ACCESS_TYPE = "offline"
const AUTH_BASE_URL = "https://accounts.google.com/o/oauth2/auth"
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3/"

export const getYoutubeCredentials = () => {
  const url = `${AUTH_BASE_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}` 
  window.location.assign(url)
}

export const validateToken = (token) => {
  return fetch("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + token)
    .then(response => response.json())
}

export const createPlaylist = (name, songlist = [], access_token) => {

  const endpoint = "playlists"
  const part = "part=snippet"
  const url = `${YOUTUBE_API_BASE_URL}${endpoint}?${part}&key=${API_KEY}`

  const body = {
    "snippet": {
      "title": "hahaha"
    }
  }


  return fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + access_token,
      "Content-Type": "application/json",
      "Accept": "application/json"
      
    },
    body: '{"snippet":{"title":"'+name + ' ' + Date.now() +'"}}'
    
    })
    .then(res => res.json())
    .then(res => {
      console.log(res.player)
      return sequentialLoopPromise(songlist, songlist.length, res.id, access_token)
    })
}

function sequentialLoopPromise(songlist, times, playlist_id, access_token) {
  console.log("/////sequentialLoopPromise")
  console.log(songlist)
  console.log(times)
  console.log(times === 0)
  return new Promise((resolve, reject) => {
    if (times === 0) {
      console.log("should resolve this shit")
      return resolve(playlist_id)
    } else {
      console.log("But i am a little shithead and go in here instead")
      console.log(songlist[times - 1].id)
      insertPlaylistItem(songlist[times - 1].id, playlist_id, access_token)
        .then(() => {
          return resolve(sequentialLoopPromise(songlist, times - 1, playlist_id, access_token))
        })
    }
  })
}

function insertPlaylistItem(video_id, playlist_id, access_token) {
  console.log(video_id)
  const endPoint = "playlistItems"
  const part = "part=snippet"
  const url = `${YOUTUBE_API_BASE_URL}${endPoint}?${part}&key=${API_KEY}`

  const body = {
    "snippet": {
      "playlistId": playlist_id,
      "resourceId": {
        "videoId": video_id,
        "kind": "youtube#video"
      }
    }
  }

  const jsonBody = JSON.stringify(body)


  return fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + access_token,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: '{"snippet":{"playlistId":"' + playlist_id + '","resourceId":{"videoId": "'+video_id+'","kind":"youtube#video"}}}'
  })
}

