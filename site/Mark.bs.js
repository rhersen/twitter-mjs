import * as Status from "./Status.bs.js";
import * as Tweets from "./Tweets.bs.js";

let put = (id_str) =>
  fetch("/.netlify/functions/fauna", { method: "PUT", body: id_str });

function mark(id_str) {
  console.log("mark" + id_str);
  Status.set("twitter GET");
  let tweets = document.getElementById("tweets");
  tweets.innerHTML = "";
  let __x = Tweets.fetchAndShowTweets(id_str, tweets);
  return __x.then(function () {
    Status.set("fauna PUT");
    let __x = put(id_str);
    return __x.then(function (faunaResp) {
      let __x = faunaResp.text();
      return __x.then(function (text) {
        return Promise.resolve(
          Status.set(faunaResp.ok ? "fauna PUT OK" : "fauna PUT error: " + text)
        );
      });
    });
  });
}

export { put, mark };
