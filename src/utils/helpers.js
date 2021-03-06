export const isYoutubeUrl = url => {
  const p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return (url.match(p)) ? RegExp.$1 : false;
}

export const getVideoId = url => {
  const regExp = /^.*((youtu.be\/)|(v=\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = url.match(regExp);
  console.log(match)
  return (match && match[7].length === 11) ? match[7] : false;
}