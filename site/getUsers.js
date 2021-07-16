export default (tweets) => {
  const users = {};
  const screenNames = tweets.map((tweet) => tweet.user.screen_name);
  screenNames.forEach((screenName) => {
    users[screenName] = 0;
  });
  screenNames.forEach((screenName) => {
    const count = users[screenName];
    users[screenName] = (count + 1) | 0;
  });
  return users;
};
