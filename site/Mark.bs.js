import * as Status from "./Status.bs.js";
import * as Tweets from "./Tweets.bs.js";

const put = (id_str) =>
  fetch("/.netlify/functions/fauna", { method: "PUT", body: id_str });

function mark(id_str) {
  console.log(`mark${id_str}`);
  Status.set("twitter GET");
  const tweets = document.getElementById("tweets");
  tweets.innerHTML = "";
  const __x = Tweets.fetchAndShowTweets(id_str, tweets);
  return __x.then(() => {
    Status.set("fauna PUT");
    const __x = put(id_str);
    return __x.then((faunaResp) => {
      const __x = faunaResp.text();
      return __x.then((text) =>
        Promise.resolve(
          Status.set(faunaResp.ok ? "fauna PUT OK" : `fauna PUT error: ${text}`)
        )
      );
    });
  });
}

export { put, mark };
