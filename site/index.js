import fetchAndShowTweets from "./fetchAndShowTweets.js";
import setStatus from "./setStatus.js";

setStatus("fauna GET");
const faunaResp = await fetch(`/.netlify/functions/fauna`);
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
