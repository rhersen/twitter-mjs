import setStatus from "./setStatus.js";
import fetchAndShowTweets from "./fetchAndShowTweets.js";

const put = (id_str) =>
  fetch("/.netlify/functions/fauna", { method: "PUT", body: id_str });

export default async function mark(id_str) {
  console.log(`mark${id_str}`);
  setStatus("twitter GET");
  const tweets = document.getElementById("tweets");
  tweets.innerHTML = "";
  await fetchAndShowTweets(id_str, tweets);
  setStatus("fauna PUT");
  const faunaResp = await put(id_str);
  const text = await faunaResp.text();
  setStatus(faunaResp.ok ? "fauna PUT OK" : `fauna PUT error: ${text}`);
}
