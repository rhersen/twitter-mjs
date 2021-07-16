import fetchAndShowTweets from "./fetchAndShowTweets.js";
import setStatus from "./setStatus.js";
import mark from "./mark.js";

setStatus("fauna GET");
const faunaResp = await fetch(`/.netlify/functions/fauna`);
if (!faunaResp.ok) {
  const text = await faunaResp.text();
  setStatus(`fauna GET error: ${text}`);
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

window.mark = mark;
