function renderTweet(tweet) {
  let getImages = function (d) {
    let isPhoto = function (img) {
      if (img.type === "photo" || img.type === "video") {
        return true;
      } else {
        return img.type === "animated_gif";
      }
    };
    let maxBitrate = function (prev, cur) {
      if (cur.bitrate > prev.bitrate) {
        return cur;
      } else {
        return prev;
      }
    };
    let getVideoLink = function (info) {
      let variants = info !== undefined ? info.variants : [];
      if (variants.length === 0) {
        return "";
      }
      let best = variants.reduce(maxBitrate, {
        bitrate: -0.1,
        url: ""
      });
      let millis;
      if (info !== undefined) {
        let duration_millis = info.duration_millis;
        millis = duration_millis !== undefined ? duration_millis : 0;
      } else {
        millis = 0;
      }
      let duration = `${millis} ms`;
      return `<a href="${best.url}">${duration}</a>`;
    };
    let getImage = function (image) {
      let size = image.sizes.small;
      let width = size.w / 2;
      let height = size.h / 2;
      let small = `${image.media_url}:small`;
      let large = `${image.media_url}:large`;
      let img = `<img src="${small}" width="${width}" height="${height}" />`;
      let duration = getVideoLink(image.video_info);
      return `<a href="${large}">${img}</a>${duration}`;
    };
    let match = d.extended_entities;
    if (match !== undefined) {
      return match.media.filter(isPhoto).map(getImage).join("");
    } else {
      return "";
    }
  };
  let getUser = function (retweet, d) {
    if (retweet !== undefined) {
      return retweet.user.screen_name;
    } else {
      return d.user.screen_name;
    }
  };
  let getRetweeter = function (retweet, d) {
    if (retweet !== undefined) {
      return ` <i>${d.user.screen_name}</i> `;
    } else {
      return " ";
    }
  };
  let fullText = function (data) {
    return data.full_text.replace(/\n/g, "<br>");
  };
  let getText = function (retweetStatus, tweetStatus) {
    let replaceUrlWithLink = function (text, url) {
      return text.replace(
        url.url,
        `<a href="${url.url}" target="_blank">${url.display_url}</a>`
      );
    };
    let data = retweetStatus !== undefined ? retweetStatus : tweetStatus;
    return data.entities.urls.reduce(replaceUrlWithLink, fullText(data));
  };
  let getQuote = function (d) {
    let quotedStatus = d.quoted_status;
    if (quotedStatus !== undefined) {
      return `<div class="quoted">${fullText(quotedStatus)}</div>`;
    } else {
      return "";
    }
  };
  let retweet = tweet.retweeted_status;
  let time = tweet.created_at.substr(8, 8);
  let user = getUser(retweet, tweet);
  let t = retweet !== undefined ? retweet : tweet;
  let image = getImages(t);
  let a = `<a href="https://twitter.com/${user}/status/${tweet.id_str}""" target="_blank">${time}</a>`;
  let i = getRetweeter(retweet, tweet);
  let b = `<b>${user}</b>`;
  let text = getText(retweet, tweet);
  let images = `<div>${image}</div>`;
  let quote = getQuote(t);
  return `<li>${a}${i}${b} ${text} ${quote} ${images}</li>`;
}

export { renderTweet };
