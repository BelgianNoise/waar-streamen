import { randomMeme } from "../../routes/random-meme-store";

export const doGetRandomMeme = async (): Promise<void> => {
  try {
    randomMeme.update(() => undefined);
    const res = await fetch('https://meme-api.com/gimme');
  
    const json = await res.json();
    // prolly shouldn't show NSFW memes
    if (json.nsfw) return doGetRandomMeme();
    const meme = {
      subreddit: json.subreddit,
      title: json.title,
      url: json.preview.pop(),
      author: json.author,
      post: json.postLink,
    };
    randomMeme.update(() => meme);
  } catch {
    console.log('Error getting a random meme, no funny for you!')
  }
};
