
const gapi = window.gapi
const SCOPES = [
  'https://www.googleapis.com/auth/youtube'
];
let songs = undefined
let name = undefined
let counter = 0;


function onGapiLoad (){

  gapi.auth.init(() => {
    checkAuth()
  })
}

function checkAuth() {
  gapi.auth.authorize({
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    scope: SCOPES,
    immediate: false,

  }, handleAuthResult)
}

export default gapi

function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    gapi.client.load("youtube", "v3").then(() => {
      console.log("loaded youtube api")
      createPlaylist()
      
    })
  }
}

function createPlaylist() {
  let playListId = undefined
  counter = 0;

  const request = gapi.client.youtube.playlists.insert({
    part: "snippet, status",
    resource: {
      snippet: {
        title: name + " " + Date.now(),
        description: "Testing google js api"
      },
      status: {
        privacyStatus: "public"
      }
    }
  })
  request.execute(resp => {
    const { result } = resp
    if (result) {
      console.log("created playlist")
      playListId = result.id
      addVideosToPlaylist(playListId)
    } else {
      console.err("could not create a playlist")
    }
  }) 
}

/**
 * http://stackoverflow.com/a/28708430/6601566
 * 
 * 2 functions below, youtube insert playlistitem is async
 * and overwrites videos...
 */
function addVideosToPlaylist(playlistId) {
  addVideoRecursiveWithTimeoutCusYoutubeSucks(playlistId, songs[0].id)
}

function addVideoRecursiveWithTimeoutCusYoutubeSucks(playlistId, video_id) {
  insertPlaylistItem(playlistId, video_id)
  setTimeout(() => {
    counter++;
    if (counter < songs.length) {
      addVideoRecursiveWithTimeoutCusYoutubeSucks(playlistId, songs[counter].id)
    } else if (counter === songs.length) {
      console.log("done")
    }
  }, 3000)
}

function insertPlaylistItem(playlistId, videoId) {

  const details = {
    videoId,
    kind: "youtube#video"
  }

  const request = gapi.client.youtube.playlistItems.insert({
    part: "snippet",
    resource: {
      snippet: {
        playlistId: playlistId,
        resourceId: details,
      }
    }
  })

  request.execute(response => {
    console.log(response)
    const { result } = response
    console.log(result)
    if (result) {
      console.log("Inserted playlist item")
    } else {
      console.log("something went wrong")
    }
  })
}
export const loadGapi = (songList, subreddit) => {
  songs = songList
  name = subreddit
  
  gapi.load("client", onGapiLoad)
}







