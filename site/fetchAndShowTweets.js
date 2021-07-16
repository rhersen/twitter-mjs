import renderTweet from "./renderTweet.js";
import getUsers from "./getUsers.js";
import setStatus from "./setStatus.js";
import mark from "./mark.js";

export default async (id_str, tweets) => {
  return handleFetch(await since(id_str));

  function since(s) {
    return fetch(`/.netlify/functions/twitter?since_id=${s}`);
  }

  function handleJson(tweetJson) {
    const users = getUsers(tweetJson);

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
    return setStatus("twitter GET OK");

    function renderTweets(tweet, i) {
      tweets.insertAdjacentHTML("afterbegin", renderTweet(tweet));
      tweets.insertAdjacentHTML(
        "afterbegin",
        `<div class="stats"><span class="countdown" onclick='mark("${tweet.id_str}")'>${i}</span><hr /></div>`
      );
      tweets
        .querySelectorAll(":first-child .countdown")
        .forEach((countdown) => {
          countdown.onclick = mark(tweet.id_str);
        });
    }
  }

  async function handleFetch(tweetResp) {
    if (tweetResp.ok) {
      setStatus("insertAdjacentHTML");
      return handleJson(await tweetResp.json());
    }
    setStatus(`twitter GET error: ${await tweetResp.text()}`);
  }
};
