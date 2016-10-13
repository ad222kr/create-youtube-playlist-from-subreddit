export const getQueryParam = field => {
  // How to get the value of a query string with native JavaScript
  // https://gomakethings.com/how-to-get-the-value-of-a-querystring-with-native-javascript/
  const url = window.location.href
  const reg = new RegExp(`[#?&]${field}=([^&#]*)`, "i") // google redirect uri has a # instead of ?
  const string = reg.exec(url)
  return string ? string[1] : null
}