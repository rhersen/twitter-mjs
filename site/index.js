import fetchAndShowTweets from "./fetchAndShowTweets.js";
import setStatus from "./setStatus.js";
import mark from "./mark.js";

setStatus("fauna GET");
fetch(`/.netlify/functions/fauna`).then(async (faunaResp) => {
  if (!faunaResp.ok) {
    setStatus(`fauna GET error: ${await faunaResp.text()}`);
  } else {
    const { id_str } = await faunaResp.json();
    setStatus("twitter GET");
    try {
      await fetchAndShowTweets(id_str, document.getElementById("tweets"));
      console.log("done");
    } catch (e) {
      console.log("fail");
    }
  }
});

window.mark = mark;
