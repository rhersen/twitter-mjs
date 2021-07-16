function getUsers(tweets) {
  let users = {};
  let screenNames = tweets.map((tweet) => tweet.user.screen_name);
  screenNames.forEach((screenName) => {
    users[screenName] = 0;
  });
  screenNames.forEach((screenName) => {
    let count = users[screenName];
    users[screenName] = (count + 1) | 0;
  });
  return users;
}

export { getUsers };
