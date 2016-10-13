export const fetchPosts = (subreddit) => {
  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(res => res.json())
    .then(res => res.data.children)
}