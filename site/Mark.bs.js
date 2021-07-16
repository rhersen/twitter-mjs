import setStatus from "./setStatus.js";
import * as Tweets from "./Tweets.bs.js";

const put = (id_str) =>
  fetch("/.netlify/functions/fauna", { method: "PUT", body: id_str });

function mark(id_str) {
  console.log(`mark${id_str}`);
  setStatus("twitter GET");
  const tweets = document.getElementById("tweets");
  tweets.innerHTML = "";
  return Tweets.fetchAndShowTweets(id_str, tweets).then(() => {
    setStatus("fauna PUT");
    return put(id_str).then((faunaResp) =>
      faunaResp
        .text()
        .then((text) =>
          Promise.resolve(
            setStatus(
              faunaResp.ok ? "fauna PUT OK" : `fauna PUT error: ${text}`
            )
          )
        )
    );
  });
}

export { put, mark };
