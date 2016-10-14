export const fetchPosts = (subreddit) => {
  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(res => {
      console.log(res.status)
      if (res.status !== 200) 
        throw new Error("Something went wrong, are you sure you did not mistype the subreddit name?")
      return res
    })
    .then(res => res.json())
    .then(res => res.data.children)
}