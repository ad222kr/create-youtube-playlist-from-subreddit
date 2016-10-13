
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URL
const RESPONSE_TYPE = "token"
const SCOPES = "https://www.googleapis.com/auth/youtube"
const ACCESS_TYPE = "offline"
const BASE_URL = "https://accounts.google.com/o/oauth2/auth"

export const getYoutubeCredentials = () => {
  const url = `${BASE_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}` 
  window.location.assign(url)
}

export const validateToken = (token) => {
  return fetch("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + token)
    .then(response => response.json())
}

