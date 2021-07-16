function getUsers(tweets) {
  let users = {};
  let screenNames = tweets.map(function (tweet) {
    return tweet.user.screen_name;
  });
  screenNames.forEach(function (screenName) {
    users[screenName] = 0;
  });
  screenNames.forEach(function (screenName) {
    let count = users[screenName];
    users[screenName] = (count + 1) | 0;
  });
  return users;
}

export { getUsers };
