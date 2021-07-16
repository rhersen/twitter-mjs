import * as Tweet from "./Tweet.bs.js";
import * as Users from "./Users.bs.js";
import * as Status from "./Status.bs.js";

function fetchAndShowTweets(id_str, tweets) {
  let since = (s) => fetch(`/.netlify/functions/twitter?since_id=${s}`);
  let handleJson = function (tweetJson) {
    let users = Users.getUsers(tweetJson);
    let renderTweets = function (tweet, i) {
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
        .map(function (param) {
          let tweetCount = users[param];
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
  let handleFetch = function (tweetResp) {
    if (tweetResp.ok) {
      Status.set("insertAdjacentHTML");
      let __x = tweetResp.json();
      return __x.then(handleJson);
    }
    let __x$1 = tweetResp.text();
    return __x$1.then(function (s) {
      return Promise.resolve(Status.set(`twitter GET error: ${s}`));
    });
  };
  let __x = since(id_str);
  return __x.then(handleFetch);
}

export { fetchAndShowTweets };
