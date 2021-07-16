import * as Tweet from "./Tweet.bs.js";
import * as Users from "./Users.bs.js";
import * as Status from "./Status.bs.js";

function fetchAndShowTweets(id_str, tweets) {
  const since = (s) => fetch(`/.netlify/functions/twitter?since_id=${s}`);
  const handleJson = function (tweetJson) {
    const users = Users.getUsers(tweetJson);
    const renderTweets = function (tweet, i) {
      tweets.insertAdjacentHTML("afterbegin", Tweet.renderTweet(tweet));
      return tweets.insertAdjacentHTML(
        "afterbegin",
        `<div class="stats"><span class="countdown" onclick='mark("${tweet.id_str}")'>${i}</span><hr /></div>`
      );
    };
    tweetJson.forEach(renderTweets);
    tweets.insertAdjacentHTML(
      "afterbegin",
      `<table>${Object.keys(users)
        .map((param) => {
          const tweetCount = users[param];
          if (tweetCount > 4) {
            return `<tr><td>${param}</td><td>${tweetCount}</td></tr>`;
          } else {
            return "";
          }
        })
        .join("")}</table>`
    );
    return Promise.resolve(Status.set("twitter GET OK"));
  };
  const handleFetch = function (tweetResp) {
    if (tweetResp.ok) {
      Status.set("insertAdjacentHTML");
      const __x = tweetResp.json();
      return __x.then(handleJson);
    }
    const __x$1 = tweetResp.text();
    return __x$1.then((s) =>
      Promise.resolve(Status.set(`twitter GET error: ${s}`))
    );
  };
  const __x = since(id_str);
  return __x.then(handleFetch);
}

export { fetchAndShowTweets };
