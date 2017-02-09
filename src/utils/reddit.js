const getPosts = (subreddit, result, after) => {
  return fetch(`https://www.reddit.com/r/${subreddit}.json?${after ? `after=${after}`: ''}`)
    .then(res => {
      if (res.status !== 200) 
        throw new Error("Something went wrong, are you sure you did not mistype the subreddit name?")
      return res
    })
    .then(res => res.json())
    .then(res => {
      return {posts: [...result, ...res.data.children], after: res.data.after}
    })
}

export const fetchPosts = async (subreddit, howDeep = 0, result = [],  after = '') => {
  try {
    const {posts, after: nextToken} = await getPosts(subreddit, result, after)
    if (howDeep > 1) {
      return fetchPosts(subreddit,  howDeep - 1, posts, nextToken)
    }
    return posts
  } catch (err) {
    throw err
  }
} 