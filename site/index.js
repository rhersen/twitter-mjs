import fetchAndShowTweets from "./fetchAndShowTweets.js";
import setStatus from "./setStatus.js";
import { mark } from "./Mark.bs.js";

setStatus("fauna GET");
fetch(`/.netlify/functions/fauna`).then((faunaResp) => {
  if (!faunaResp.ok) {
    faunaResp.text().then((text) => {
      setStatus(`fauna GET error: ${text}`);
    });
  } else
    faunaResp.json().then(({ id_str }) => {
      setStatus("twitter GET");
      fetchAndShowTweets(id_str, document.getElementById("tweets")).then(
        () => {
          console.log("done");
        },
        () => {
          console.log("fail");
        }
      );
    });
});

window.mark = mark;
