function renderTweet(tweet) {
  const getImages = function (d) {
    const isPhoto = function (img) {
      if (img.type === "photo" || img.type === "video") {
        return true;
      } else {
        return img.type === "animated_gif";
      }
    };
    const maxBitrate = function (prev, cur) {
      if (cur.bitrate > prev.bitrate) {
        return cur;
      } else {
        return prev;
      }
    };
    const getVideoLink = function (info) {
      const variants = info !== undefined ? info.variants : [];
      if (variants.length === 0) {
        return "";
      }
      const best = variants.reduce(maxBitrate, {
        bitrate: -0.1,
        url: ""
      });
      let millis;
      if (info !== undefined) {
        const duration_millis = info.duration_millis;
        millis = duration_millis !== undefined ? duration_millis : 0;
      } else {
        millis = 0;
      }
      const duration = `${millis} ms`;
      return `<a href="${best.url}">${duration}</a>`;
    };
    const getImage = function (image) {
      const size = image.sizes.small;
      const width = size.w / 2;
      const height = size.h / 2;
      const small = `${image.media_url}:small`;
      const large = `${image.media_url}:large`;
      const img = `<img src="${small}" width="${width}" height="${height}" />`;
      const duration = getVideoLink(image.video_info);
      return `<a href="${large}">${img}</a>${duration}`;
    };
    const match = d.extended_entities;
    if (match !== undefined) {
      return match.media.filter(isPhoto).map(getImage).join("");
    } else {
      return "";
    }
  };
  const getUser = function (retweet, d) {
    if (retweet !== undefined) {
      return retweet.user.screen_name;
    } else {
      return d.user.screen_name;
    }
  };
  const getRetweeter = function (retweet, d) {
    if (retweet !== undefined) {
      return ` <i>${d.user.screen_name}</i> `;
    } else {
      return " ";
    }
  };
  const fullText = function (data) {
    return data.full_text.replace(/\n/g, "<br>");
  };
  const getText = function (retweetStatus, tweetStatus) {
    const replaceUrlWithLink = function (text, url) {
      return text.replace(
        url.url,
        `<a href="${url.url}" target="_blank">${url.display_url}</a>`
      );
    };
    const data = retweetStatus !== undefined ? retweetStatus : tweetStatus;
    return data.entities.urls.reduce(replaceUrlWithLink, fullText(data));
  };
  const getQuote = function (d) {
    const quotedStatus = d.quoted_status;
    if (quotedStatus !== undefined) {
      return `<div class="quoted">${fullText(quotedStatus)}</div>`;
    } else {
      return "";
    }
  };
  const retweet = tweet.retweeted_status;
  const time = tweet.created_at.substr(8, 8);
  const user = getUser(retweet, tweet);
  const t = retweet !== undefined ? retweet : tweet;
  const image = getImages(t);
  const a = `<a href="https://twitter.com/${user}/status/${tweet.id_str}""" target="_blank">${time}</a>`;
  const i = getRetweeter(retweet, tweet);
  const b = `<b>${user}</b>`;
  const text = getText(retweet, tweet);
  const images = `<div>${image}</div>`;
  const quote = getQuote(t);
  return `<li>${a}${i}${b} ${text} ${quote} ${images}</li>`;
}

export { renderTweet };
